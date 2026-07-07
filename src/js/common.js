const LOADING_BLIND_MIN_DURATION = 2000;
const BOTFENDER_DEMO_SCRIPT_SRC = "https://api-demo.botfenderai.kr:3021/1dba6f43-e141-4072-9d29-3a531d8bf1dc";
const loadingBlindStartedAt = window.__nextoryLoadingBlind?.startedAt ?? performance.now();
let loadingBlindMinTimePassed = false;
let loadingBlindPageLoaded = document.readyState === "complete";

function loadBotfenderDemoScript() {
  if (document.querySelector(`script[src="${BOTFENDER_DEMO_SCRIPT_SRC}"]`)) return;

  const script = document.createElement("script");
  script.src = BOTFENDER_DEMO_SCRIPT_SRC;
  script.async = true;
  document.head.appendChild(script);
}

function loadBotfenderDemoScriptAfterPageLoad() {
  if (document.readyState === "complete") {
    loadBotfenderDemoScript();
    return;
  }

  window.addEventListener("load", loadBotfenderDemoScript, { once: true });
}

function hideLoadingBlind() {
  const root = document.documentElement;
  if (!root.classList.contains("loading-blind-active")) return;

  root.classList.add("loading-blind-exiting");
  root.setAttribute("aria-busy", "false");

  window.setTimeout(() => {
    document.querySelector(".loading-blind-text")?.remove();
    root.classList.remove("loading-blind-active", "loading-blind-exiting");
    root.removeAttribute("aria-busy");
    window.scrollTo(window.__nextoryLoadingBlind?.scrollX ?? 0, window.__nextoryLoadingBlind?.scrollY ?? 0);
    loadBotfenderDemoScript();
  }, 300);
}

if (!window.__nextoryLoadingBlind?.enabled) {
  loadBotfenderDemoScriptAfterPageLoad();
}

function tryHideLoadingBlind() {
  if (!loadingBlindMinTimePassed || !loadingBlindPageLoaded) return;
  hideLoadingBlind();
}

window.setTimeout(() => {
  loadingBlindMinTimePassed = true;
  tryHideLoadingBlind();
}, Math.max(0, LOADING_BLIND_MIN_DURATION - (performance.now() - loadingBlindStartedAt)));

if (loadingBlindPageLoaded) {
  tryHideLoadingBlind();
} else {
  window.addEventListener(
    "load",
    () => {
      loadingBlindPageLoaded = true;
      tryHideLoadingBlind();
    },
    { once: true },
  );
}

$(document).ready(function () {
  AOS.init();

  setTimeout(() => {
    if ($(".page-title")) {
      $(".page-title .title").addClass("on");
    }
  }, 600);

  let popupStatus = sessionStorage.getItem("popup-list");
  if (popupStatus) popupStatus = JSON.parse(popupStatus);
  else popupStatus = [];

  const popupList = $(".popup-list .popup-box");
  for (const popup of popupList) {
    const index = $(popup).data("index");
    
    if (popupStatus.indexOf(index) !== -1) $(popup).hide();
    else $(popup).show();
  }

  $(".popup-list .popup-box .close-btn").off("click").on("click", function () {
      $(this).closest(".popup-box").hide();
  });

  $(".popup-list .popup-box .checkbox").off("click").on("click", function () {
      $(this).closest(".popup-box").hide();
      popupStatus.push($(this).closest(".popup-box").data("index"));
      sessionStorage.setItem("popup-list", JSON.stringify(popupStatus));
  });
});
