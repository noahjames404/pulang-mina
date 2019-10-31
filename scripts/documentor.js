$(document).ready(function(){
    $("html").click(function(){
        // alert("tite");

    });

    $.getJSON(chrome.extension.getURL("format.json"), function(json) {
        var description = "";
        for(var i=0; i< json.text_format[0].length; i++){

            description += json.text_format[0][i] +"\n";
            stringFormat(json.text_format[0][i]);
        }
        $("#"+json.target_form_id).text(description);
        
    });

    function stringFormat(data){
        var raw_data = data.substring(data.indexOf("[")+1,data.lastIndexOf("]"));
        raw_data.replace("name","NJY")
    }
})