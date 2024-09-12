$(document).ready(function () {
  const $header = $("#header");
  const $headerMenu = $("#header-menu");
  const $menuBtn = $("#menu-btn");
  let allMenuFlag = false;

  $header
    .find(".menu-item")
    .off()
    .on("mouseenter mouseleave", function (e) {
      let type = e.type;
      switch (type) {
        case "mouseenter":
          $header.addClass("on");

          break;
        case "mouseleave":
          $header.removeClass("on");
          break;
        default:
          break;
      }
    });

  $menuBtn.off().on("click", function () {
    $menuBtn.toggleClass("on");
    $header.toggleClass("menuOn");
    $headerMenu.toggleClass("on");
    allMenuFlag = !allMenuFlag;
    $("body").toggleClass("hidden");
    if (allMenuFlag) {
    } else {
    }
  });
});
