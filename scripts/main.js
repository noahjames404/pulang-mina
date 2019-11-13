chrome.runtime.onInstalled.addListener(function () {
    var cookie_url = "http://developer.chrome.com/extensions/cookies.html";
    var username = "";



    // add an action here
    var element = document.getElementsByTagName("html")[0];
    element.addEventListener('click', function () {
        console.log("wow");
    });

    createScript("documentor");

    function createScript(name) {
        var s = document.createElement(name);
        // TODO: add "script.js" to web_accessible_resources in manifest.json
        s.src = chrome.runtime.getURL(name + '.js');
        s.onload = function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    }

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
