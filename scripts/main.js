chrome.runtime.onInstalled.addListener(function () {
    var cookie_url = "http://developer.chrome.com/extensions/cookies.html";
    var username = "";

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

            switch (request.request) {
                case "username":
                    sendResponse({
                        username: username
                    });
                    break;
                case "update_username":
                    username = request.value;
                    chrome.cookies.set({
                        "name": "username",
                        "url": cookie_url,
                        "value": username,
                        "expirationDate": 9999999999
                    }, function (cookie) {
                        var data = JSON.stringify(cookie);
                    });

            }
        });


    function updateUsername() {
        chrome.cookies.get({
            "url": cookie_url,
            "name": "username"
        }, function (cookie) {
            var data = JSON.stringify(cookie);
            if (cookie != null) {
                username = cookie.value;
            }

        });
    }

    updateUsername();


});
