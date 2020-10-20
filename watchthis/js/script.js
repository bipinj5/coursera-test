$(function () {
	$("#navbarToggle").blur(function (event) {
		var screenWidth = window.innerWidth;
		if (screenWidth < 786 ) {
			$("#collapsable-nav").collapse('hide');
		}
	});
});

$(function () {
	var header = document.getElementById("nav-list");
	var btns = header.getElementsByClassName("btn");
	for (var i = 0; i < btns.length; i++) {
	  btns[i].addEventListener("click", function() {
	  var current = document.getElementsByClassName("active");
	  if (current.length > 0) { 
	    current[0].className = current[0].className.replace(" active", "");
	  }
	  this.className += " active";
	  });
	}
});

(function (global) {

var vc = {};

var homeHtml="maincontent.html";
var menuCategoryHtml="menu-categories.html";
var singleCategoryHtml="single-category.html";
var allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";

var insertHtml = function (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
};

var showLoading = function (selector) {
	var html = "<div class='text-center'>";
	html += "<img src='ajax-loader.gif' alt='loading gif'/></div>";
	insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
	var propToReplace = "{{" + propName + "}}";
	string = string.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
}


document.addEventListener("DOMContentLoaded", function (event) {
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
	homeHtml,
	function (responseText) {
		document.querySelector("#main-content")
		.innerHTML = responseText;
	},
	false);
});

vc.loadMenuCategories = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		allCategoriesUrl,
		buildShowMenuCategory);

};

vc.loadSingleMenuCategories = function (categoryShort) {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		menuItemsUrl + categoryShort,
		buildMenuItems);	
};

function buildShowMenuCategory (categories) {
	$ajaxUtils.sendGetRequest(
		menuCategoryHtml,
		function (menuCategoryHtml) {
			 var showMenu = showLoadedMenu(categories, menuCategoryHtml);
			 insertHtml("#main-content", showMenu);
		},
		false);
}

function showLoadedMenu(categories, menuCategoryHtml) {
	finalHtml = "<section class='row'>";
	for (var i = 0; i < categories.length; i++) {
		var html = menuCategoryHtml;
		var name = "" + categories[i].name;
		var short_name = "" + categories[i].short_name;
		html = insertProperty(html, "name", name);
		html = insertProperty(html, "short_name", short_name);
		finalHtml += html;
	}
	finalHtml += "</section>";
  	return finalHtml;
}

function buildMenuItems (categoryMenuItems) {
	$ajaxUtils.sendGetRequest(
		singleCategoryHtml,
		function (singleCategoryHtml) {
			var showCategory = showSingleCategory (categoryMenuItems, singleCategoryHtml);
			insertHtml("#main-content", showCategory);
		},
		false);
}

function showSingleCategory (categoryMenuItems, singleCategoryHtml) {
	var finalHtml = "<section class='row'>";
	var catShortName = categoryMenuItems.category.short_name;
	var menuItems = categoryMenuItems.menu_items;
	for (var i = 0; i < menuItems.length; i++) {
		var html =singleCategoryHtml;
		html = insertProperty(html, "short_name", menuItems[i].short_name);
		html = insertProperty(html, "catShortName", catShortName);
		html = insertProperty(html, "price_small", menuItems[i].price_small);
		html = insertProperty(html, "small_portion_name", menuItems[i].small_portion_name);
		html = insertProperty(html, "price_large", menuItems[i].price_large);
		html = insertProperty(html, "large_portion_name", menuItems[i].large_portion_name);
		html = insertProperty(html, "name", menuItems[i].name);
		html = insertProperty(html, "description", menuItems[i].description);
		finalHtml += html;
	}
	finalHtml += "</section>";
  	return finalHtml;
}

global.$vc =  vc;

})(window);