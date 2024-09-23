$(document).ready(function () {
  const $headerInner = $("#header-inner");
  const $headerMenu = $("#header-menu");
  const $menuBtn = $("#menu-btn");
  let allMenuFlag = false;

  $headerInner
    .find(".menu-item")
    .off()
    .on("mouseenter mouseleave", function (e) {
      let type = e.type;
      switch (type) {
        case "mouseenter":
          $headerInner.addClass("on");

          break;
        case "mouseleave":
          $headerInner.removeClass("on");
          break;
        default:
          break;
      }
    });

  $menuBtn.off().on("click", function () {
    $menuBtn.toggleClass("on");
    $headerInner.toggleClass("menuOn");
    $headerMenu.toggleClass("on");
    allMenuFlag = !allMenuFlag;
    $("body").toggleClass("hidden");
    if (allMenuFlag) {
    } else {
    }
  });

  $headerMenu.find(".depth1 > li > a").on("click", function (e) {
    let depth2 = $(this).siblings(".depth2");
    if (depth2.length) {
      e.preventDefault();
      $(this).parent().siblings().removeClass("on");
      $headerMenu.find(".depth2").stop().slideUp();
      $(this).parent().toggleClass("on");
      depth2.stop().slideToggle();
    }
  });

  $(window)
    .on("scroll", function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop > 50) $headerInner.addClass("fix");
      else $headerInner.removeClass("fix");
    });
});
