
    var cookie_url = "http://developer.chrome.com/extensions/cookies.html";
    function save(){
        var name = document.getElementById("name").value;
        // alert(name);
        chrome.cookies.set({"name":"username","url": cookie_url,"value":name},function(cookie){
            var data = JSON.stringify(cookie);
            updateUsername(cookie.value);
//            alert(data);
        });
        

      
    }

    function updateUsername(name){
          chrome.tabs.executeScript( {
            file: 'documentator.js'
        }, function() {
            chrome.tabs.sendMessage( {parameter:name});
        });
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = chrome.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
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
    btn_save.addEventListener("click",function(){
         save();
//         alert("wow");
    });


    chrome.cookies.get({"url":cookie_url, "name":"username"},function(cookie){
        var data = JSON.stringify(cookie);
        document.getElementById("name").value = cookie.value;
        updateUsername(cookie.value);
    });