import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../contact/contact.html', import.meta.url), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
function setup(send, { missingSDK = false, confirmed = true } = {}) {
  const values = { company: '테스트 회사', name: '홍길동', contact: '01012341234', solution: 'BotfenderAI', email: 'test@example.com', contents: '문의 내용', check: true };
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, {
      value: values[id] ?? '', textContent: '', disabled: false, hidden: true,
      checked: values[id] === true, dataset: {}, open: false,
      setAttribute() {}, focus() {},
      addEventListener(type, handler) { this['on' + type] = handler; },
      showModal() { this.open = true; alerts.push(get('contact-dialog-message').textContent); },
      close(value = "") { this.returnValue = value; this.open = false; this.onclose?.(); },
    });
    return elements.get(id);
  };
  let click;
  let timer;
  const alerts = [];
  const context = { document: { getElementById: get }, alert: text => alerts.push(text), confirm: () => confirmed, console: { log() {}, error() {} }, setTimeout: fn => { timer = fn; return 1; }, clearTimeout: () => { timer = undefined; }, $: selector => {
    const el = get(selector.slice(1));
    const api = { val: () => el.value, is: () => el.checked, off: () => api, on: (_, fn) => { click = fn; return api; }, prop: (key, value) => { el[key] = value; return api; }, text: value => { el.textContent = value; return api; } };
    return api;
  } };
  if (!missingSDK) context.emailjs = { init() {}, send };
  context.window = context;
  vm.runInNewContext(script, context);
  return { get, alerts, click: () => {
    const result = click();
    if (get('contact-dialog').open && get('contact-dialog').dataset.kind === 'confirm' && confirmed !== null) {
      get(confirmed ? 'contact-dialog-ok' : 'contact-dialog-cancel').onclick();
    }
    return result;
  }, timeout: () => timer?.() };
}
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

for (const [name, send] of [
  ['SMTP 인증 실패', () => Promise.reject({ status: 412, text: 'SMTP: Invalid login: Auth Fail' })],
  ['네트워크 오류', () => Promise.reject(new TypeError('Failed to fetch'))],
  ['동기 예외', () => { throw new Error('SDK error'); }],
]) {
  test(`${name}: 실패 안내와 입력 보존, 재시도 가능`, async () => {
    const ui = setup(send);
    ui.click(); await flush();
    assert.match(ui.alerts.at(-1) ?? '', /실패/);
    assert.match(ui.alerts.at(-1), /02-6953-4490으로 유선 문의해 주세요/);
    assert.equal(ui.get('contact-dialog').open, true);
    assert.equal(ui.get('contact-dialog').dataset.kind, 'error');
    assert.equal(ui.get('contact-dialog-phone').hidden, false);
    ui.get('contact-dialog-ok').onclick();
    assert.equal(ui.get('contact-dialog').open, false);
    assert.equal(ui.get('contents').value, '문의 내용');
    assert.equal(ui.get('send-btn').disabled, false);
  });
}
test('SDK 로드 실패도 사용자에게 안내', async () => {
  const ui = setup(undefined, { missingSDK: true });
  ui.click(); await flush();
  assert.match(ui.alerts.at(-1) ?? '', /실패/);
});
test('전송 중 중복 요청 방지 및 성공 안내', async () => {
  let resolve;
  let calls = 0;
  const ui = setup(() => { calls++; return new Promise(r => { resolve = r; }); });
  ui.click(); ui.click(); await flush();
  assert.equal(calls, 1);
  assert.equal(ui.get('send-btn').disabled, true);
  assert.equal(ui.alerts.length, 1);
  resolve({ status: 200, text: 'OK' }); await flush();
  assert.match(ui.alerts.at(-1), /전송되었습니다/);
  assert.equal(ui.get('contact-dialog').open, true);
  assert.equal(ui.get('contact-dialog').dataset.kind, 'success');
  assert.equal(ui.get('contact-dialog-phone').hidden, true);
  assert.equal(ui.get('send-btn').disabled, false);
});
test('응답 지연은 결과 미확인으로 안내하고 늦은 성공으로 덮어쓰지 않음', async () => {
  let resolve;
  const ui = setup(() => new Promise(r => { resolve = r; }));
  ui.click(); await flush(); ui.timeout(); await flush();
  assert.match(ui.alerts.at(-1) ?? '', /확인하지 못했습니다/);
  assert.equal(ui.get('send-btn').disabled, false);
  resolve({ status: 200, text: 'OK' }); await flush();
  assert.equal(ui.alerts.length, 2);
});
test('확인 취소 시 전송하지 않음', async () => {
  const ui = setup(() => { assert.fail('취소한 문의를 전송함'); }, { confirmed: false });
  ui.click(); await flush();
  assert.equal(ui.get('contact-dialog').open, false);
  assert.equal(ui.alerts.length, 1);
});
test('필수 입력 누락은 안내 팝업을 표시하고 전송하지 않음', async () => {
  const ui = setup(() => { assert.fail('필수 입력 없이 전송함'); });
  ui.get('company').value = '';
  ui.click(); await flush();
  assert.equal(ui.get('contact-dialog').open, true);
  assert.equal(ui.get('contact-dialog').dataset.kind, 'warning');
  assert.equal(ui.get('contact-dialog-phone').hidden, true);
  assert.equal(ui.alerts.at(-1), '기업/기관명을 입력해주세요.');
});
test('dialog 미지원 환경에서도 실패 안내를 기본 alert으로 표시', async () => {
  const ui = setup(() => Promise.reject({ status: 412, text: 'SMTP: Invalid login: Auth Fail' }));
  ui.get('contact-dialog').showModal = undefined;
  ui.click(); await flush();
  assert.match(ui.alerts.at(-1), /02-6953-4490으로 유선 문의해 주세요/);
  assert.equal(ui.get('send-btn').disabled, false);
});

test('전송 확인 레이어는 전송하기를 누르기 전까지 요청하지 않음', async () => {
  let calls = 0;
  const ui = setup(() => { calls++; return Promise.resolve({status: 200, text: 'OK'}); }, {confirmed: null});
  ui.click(); ui.click(); await flush();
  assert.equal(calls, 0);
  assert.equal(ui.get('contact-dialog').dataset.kind, 'confirm');
  assert.equal(ui.get('contact-dialog-ok').textContent, '전송하기');
  assert.equal(ui.get('contact-dialog-cancel').hidden, false);
  ui.get('contact-dialog-ok').onclick(); await flush();
  assert.equal(calls, 1);
  assert.equal(ui.get('contact-dialog').dataset.kind, 'success');
  assert.equal(ui.get('contact-dialog-cancel').hidden, true);
});
test('확인 레이어 ESC 닫기는 취소이며 다시 전송 확인 가능', async () => {
  const ui = setup(() => { assert.fail('ESC 취소 후 전송됨'); }, {confirmed: null});
  ui.click(); await flush();
  ui.get('contact-dialog').close(); await flush();
  ui.click(); await flush();
  assert.equal(ui.get('contact-dialog').open, true);
  assert.equal(ui.get('contact-dialog').dataset.kind, 'confirm');
});
