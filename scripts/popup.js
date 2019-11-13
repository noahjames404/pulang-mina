var cookie_url = "http://developer.chrome.com/extensions/cookies.html";
var p = "hello";

function save() {
    var name = document.getElementById("name").value;
    chrome.cookies.set({
        "name": "username",
        "url": cookie_url,
        "value": name,
        "expirationDate": 9999999999
    }, function (cookie) {
        var data = JSON.stringify(cookie);
    });

    chrome.runtime.sendMessage({
        request:"update_username",value: name
    }, function (response) {
        
    });


}


function getCookie(cname) {
    var name = cname + "=";
    var ca = chrome.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var btn_save = document.getElementById("btn_save");
btn_save.addEventListener("click", function () {
    save();
});


chrome.cookies.get({
    "url": cookie_url,
    "name": "username"
}, function (cookie) {
    var data = JSON.stringify(cookie);
    if (cookie.value != null) {
        document.getElementById("name").value = cookie.value;
    }

});
