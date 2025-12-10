$(document).ready(function() {
    const $footerNavigation = $("#footer-navigation");
    $footerNavigation.off().on("click", function() {
        dummyCreate();
        $("body").css({
            overflow: "hidden"
        });
        $("html,body").stop().animate({
            scrollTop: 0
        }, 0, function() {
            if ($(".dummy").length) setTimeout(()=>{
                dummyRemove();
                // if (pos > 0) {
                //   $("html,body").css({
                //     overflow: "visible",
                //   });
                // }
                scrollFlag = true;
            }, 400);
        });
    });
    function dummyCreate() {
        if (!$(".dummy").length) $("body").append("<div class='dummy'></div>");
        $(".dummy").on("DOMScroll mousewheel DOMMousewheel touchstart touchend", function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }
    function dummyRemove() {
        $(".dummy").remove();
    }
    const $downloadLink = $("#download-link");
    $downloadLink.off().on("click", function(e) {
        e.preventDefault();
        alert("\uC900\uBE44\uC911\uC785\uB2C8\uB2E4.");
    });
});

//# sourceMappingURL=nextory-homepage.50165830.js.map
