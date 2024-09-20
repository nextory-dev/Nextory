$(document).ready(function () {
  const $footerNavigation = $("#footer-navigation");
  $footerNavigation.off().on("click", function () {
    $("html,body").stop().animate(
      {
        scrollTop: 0,
      },
      800
    );
  });

  const $downloadLink = $("#download-link");
  $downloadLink.off().on("click", function (e) {
    e.preventDefault();
    alert("준비중입니다.");
  });
});
