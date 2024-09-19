$(document).ready(function () {
  AOS.init();

  setTimeout(() => {
    if ($(".page-title")) {
      $(".page-title .title").addClass("on");
    }
  }, 600);
});
