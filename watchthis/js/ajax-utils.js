(function (global) {
var ajaxUtils = {};

function getRequestObject() {
	if (window.XMLHttpRequest) {
		return (new XMLHttpRequest());
	}
	else if (window.ActiveXObject) {
		return (new ActiveXObject("MICROSOFT.XMLHTTP"));
	}
	else {
		window.alert("AJAX not supported.");
		return (null);
	}
}

ajaxUtils.sendGetRequest =
function(requestUrl, responseHandler, isJsonResponse) {
	var request = getRequestObject();
	request.onreadystatechange =
	function () {
		handleResponse(request, responseHandler, isJsonResponse);
	};
	request.open("GET", requestUrl, true);
	request.send(null);
};

function handleResponse(request, responseHandler, isJsonResponse) {
		if ((request.readyState == 4) &&
     (request.status == 200)) {

    // Default to isJsonResponse = true
    if (isJsonResponse == undefined) {
      isJsonResponse = true;
    }

    if (isJsonResponse) {
      responseHandler(JSON.parse(request.responseText));
    }
    else {
      responseHandler(request.responseText);
    }
	}
}

global.$ajaxUtils = ajaxUtils;
	
})(window);