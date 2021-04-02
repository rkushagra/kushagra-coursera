$(function () {
    $("#navbarToggle").blur(function(event) {
        var screenWidth = window.innerWidth;
        if(screenWidth < 768) {
            $("#Navbar").collapse('hide');
        }
    });
});
(function (global) {
    var dc = {};
    var homeHtml = "snippets/home-snippet.html";
    //convenience function for inserting innerHTML for select
    var insertHtml = function(selector,html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML= html;
    };
    //Show loading icon inside element identified by 'selector'
    var showLoading = function(selector) {
        var html = "<div class='text-center'>";
        html+= "<img src='images/ajax-loader.gif'></img></div>";
        insertHtml(selector,html);
    };
    //on page load before images or css
    document.addEventListener("DOMContentLoaded",function (event) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function(responseText) {
                document.querySelector('#main-content')
                .innerHTML= responseText;
            },
            false
        );
    });
    global.$dc = dc;
})(window);