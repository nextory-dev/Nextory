$(document).ready((function(){const e=$("#header"),o=$("#header-menu"),n=$("#menu-btn");let s=!1;e.find(".menu-item").off().on("mouseenter mouseleave",(function(o){switch(o.type){case"mouseenter":e.addClass("on");break;case"mouseleave":e.removeClass("on")}})),n.off().on("click",(function(){n.toggleClass("on"),e.toggleClass("menuOn"),o.toggleClass("on"),s=!s,$("body").toggleClass("hidden")})),$(window).off().on("scroll",(function(){const o=window.scrollY||document.documentElement.scrollTop;console.error("scrollTop",o),o>50?e.addClass("fix"):e.removeClass("fix")}))}));
//# sourceMappingURL=index.186fd83e.js.map
