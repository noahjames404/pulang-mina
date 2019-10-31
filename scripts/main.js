chrome.browserAction.onClicked.addListener(function (tab) {
    // for the current tab, inject the "inject.js" file & execute it
    chrome.tabs.executeScript(tab.ib, {
        file: 'documentor.js'
    });
});

chrome.runtime.onInstalled.addListener(function() {    
  

    

    // add an action here
    var element = document.getElementsByTagName("html")[0];
    element.addEventListener('click',function(){
       console.log("wow");
    });

    createScript("documentor");

    function createScript(name){
        var s = document.createElement(name);
        // TODO: add "script.js" to web_accessible_resources in manifest.json
        s.src = chrome.runtime.getURL(name+'.js');
        s.onload = function() {
         this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    }

  
});