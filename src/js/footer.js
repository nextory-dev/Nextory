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
});
