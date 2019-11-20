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

 chrome.runtime.onConnect.addListener(function (port) {
     console.log(port.name);
     port.onMessage.addListener(function (msg) {
         console.log(msg);
         if (msg.request == "username")
             port.postMessage({
                 username: username
             });
     });
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
