chrome.runtime.onInstalled.addListener(function() {    
    // add an action here
    var element = document.getElementsByTagName("html")[0];
    element.addEventListener('click',function(){
       console.log("wow");
    });
});