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
    var allCategoriesUrl = 
    "http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl = 
    "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";




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
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string
        .replace(new RegExp(propToReplace, "g"),propValue);
        return string;
    }
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
    //load the menu categories view
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML
        );
    };


    //Load the menu items view
    //'categoryShort' is a short_name for a category 
    dc.loadMenuItems = function (categoryShort) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort,
            BuildAndShowMenuItemsHTML
        );
    };


    //builds HTML for the categories page based on the data
    //from the server
    function buildAndShowCategoriesHTML (categories) {
        //load title snippet of categories page
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                //retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function (categoryHtml) {
                        var categoriesViewHtml = 
                        buildCategoriesViewHtml (categories,
                            categoriesTitleHtml,
                            categoryHtml);
                            insertHtml("#main-content",categoriesViewHtml);
                    },
                false);
            },
        false);
    }
    //using categories data and snippets html
    //build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories,
        categoriesTitleHtml,
        categoryHtml) {
            var finalHtml = categoriesTitleHtml;
            finalHtml+= "<section class='row'>";
            //loop over categories
            for(var i = 0; i< categories.length; i++) {
                //insert category values
                var html = categoryHtml;
                var name = "" + categories[i].name;
                var short_name = categories[i].short_name;
                html=
                insertProperty(html, "name", name);
                html=
                insertProperty(html,"short_name", short_name);
                finalHtml += html;
            }
            finalHtml += "</section>";
            return finalHtml;
        }


        //Builds Html for the single category page based on the data 
        //from the server
        function BuildAndShowMenuItemsHTML (categoryMenuItems) {
            //load title snippet of menu items page
            $ajaxUtils.sendGetRequest(
                menuItemsTitleHtml,
                function (menuItemsTitleHtml) {
                    //retrieve single menu item snippet
                    $ajaxUtils.sendGetRequest(
                        menuItemHtml,
                        function (menuItemHtml) {
                            var menuItemsViewHtml = 
                            buildMenuItemsViewHtml (categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml);
                            insertHtml("#main-content", menuItemsViewHtml);
                        },
                    false);
                },
            false);
        }

        //using category and menu items data and snippets html
        //build menu items view HTML to be inserted into page
        function buildMenuItemsViewHtml (categoryMenuItems,
            menuItemsTitleHtml,
            menuItemHtml) {
        menuItemsTitleHtml = 
        insertProperty(menuItemsTitleHtml,
            "name",
            categoryMenuItems.category.name);
            menuItemsTitleHtml = 
            insertProperty(menuItemsTitleHtml,
                "special_instructions",
                categoryMenuItems.category.special_instructions);
            var finalHtml = menuItemsTitleHtml;
            finalHtml += "<section class='row'>";
            
            //loop over menu items
            var menuItems = categoryMenuItems.menu_items;
            var catShortName = categoryMenuItems.category.short_name;
            for(var i = 0; i<menuItems.length; i++) {
                //insert menu items value
                var html = menuItemHtml;
                html = 
                insertProperty(html, "short_name", menuItems[i].short_name);
                html =
                insertProperty(html, "catShortName", catShortName);
                html= 
                insertItemPrice(html, "price_small", menuItems[i].price_small);
                html =
                insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
                html = 
                insertItemPrice(html, "price_large", menuItems[i].price_large);
                html =
                insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
                html =
                insertProperty(html, "name", menuItems[i].name);
                html =
                insertProperty(html, "description", menuItems[i].description);
                
                //add clearfix after every second menu item
                if(i%2 !=0) {
                    html +=
                    "<div class='clearfix .d-none .d-md-block .d-xl-none '></div>"//check this line
                }

                finalHtml += html;
                }
                finalHtml += "</section>";
                return finalHtml;
            }


            //appends price with $ if price exists
            function insertItemPrice (html,
                pricePropName,
                priceValue) {
                    //if not specified, replace with empty string
                    if(!priceValue) {
                        return insertProperty(html, pricePropName, "");
                    }
                    priceValue =  "$" + priceValue.toFixed(2);
                    html = insertProperty(html, pricePropName, priceValue);
                    return html;
                }

                //appends portion name in parents if it exists
                function insertItemPortionName(html,
                    portionPropName,
                    portionValue) {
                        //if not specified, return original string
                        if(!portionValue) {
                            return insertProperty(html, portionPropName, "");
                        }
                        //check code after this
                        return insertProperty(html, portionPropName, portionValue);
                    }



    global.$dc = dc;
})(window);



//image names
//NF PF FR CM FY SO DS SR



