$(document).ready(function() {
    AOS.init();
    setTimeout(()=>{
        if ($(".page-title")) $(".page-title .title").addClass("on");
    }, 600);
    let popupStatus = sessionStorage.getItem("popup-list");
    if (popupStatus) popupStatus = JSON.parse(popupStatus);
    else popupStatus = [];
    const popupList = $(".popup-list .popup-box");
    for (const popup of popupList){
        const index = $(popup).data("index");
        if (popupStatus.indexOf(index) !== -1) $(popup).hide();
        else $(popup).show();
    }
    $(".popup-list .popup-box .close-btn").off("click").on("click", function() {
        $(this).closest(".popup-box").hide();
    });
    $(".popup-list .popup-box .checkbox").off("click").on("click", function() {
        $(this).closest(".popup-box").hide();
        popupStatus.push($(this).closest(".popup-box").data("index"));
        sessionStorage.setItem("popup-list", JSON.stringify(popupStatus));
    });
});

//# sourceMappingURL=Nextory.141ecbf0.js.map
