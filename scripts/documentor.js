$(document).ready(function(){
    var cookie_url = "http://developer.chrome.com/extensions/cookies.html";
    var username;
    $("html").click(function(){
        // alert("tite");

    });

    $.getJSON(chrome.extension.getURL("format.json"), function(json) {
        var description = "";
        for(var i=0; i< json.text_format[0].length; i++){

            description += stringFormat(json.text_format[0][i]) +"\n";
            
        }
        $("#"+json.target_form_id).text(description);
        
    });

    function stringFormat(data){
        var raw_data = data.substring(data.indexOf("[")+1,data.lastIndexOf("]"));
        
        var modified_data =raw_data.replace("name",getInitials(username)); 
        modified_data = modified_data.replace("date_num",getDateToday("numeric"));
        modified_data = modified_data.replace("date_text",getDateToday("text"));
        
        data = data.replace(raw_data,modified_data);
        data =data.replace("[","");
        data =data.replace("]","");
        return data;
    
    }
    
    /**
    type - numerical,text
    */
    function getDateToday(type){
        var date = new Date();
        switch(type){
            case "numeric":
                var options = {dateStyle:"short"};
                return date.toLocaleDateString("en-US",options).replace("/","").replace("/","");
            case "text":
                var options = {dateStyle:"long"};
                return date.toLocaleDateString("en-US",options);
                
        }
    }
    
    function getInitials(data){
        var raw_data= "noah james yanga".split(" ");
        var initials = "";
        for(var i=0; i< raw_data.length; i++){
            initials+= raw_data[i].charAt(0);
        }
        return initials.toLocaleUpperCase();
    }

    chrome.runtime.onMessage.addListener(function(message) {
        var receivedParameter = message.parameter;
        
        //use receivedParameter as you wish.

    });
//    
//    chrome.cookies.get({"name":"username","url":cookie_url},function(cookie){
//            console.log(cookie);
//        alert("wew");
//        });
})