$(document).ready(function () {
    var cookie_url = "http://developer.chrome.com/extensions/cookies.html";
    var username;
    var logo_path = "";
    var target_form_id = [];
    var doc_filename = "";
    $("html").click(function () {
        // alert("tite");

    });


    function stringFormat(data) {
        var raw_data = data.substring(data.indexOf("[") + 1, data.lastIndexOf("]"));

        var modified_data = raw_data.replace("name", getInitials(username));
        modified_data = modified_data.replace("date_num", getDateToday("numeric"));
        modified_data = modified_data.replace("date_text", getDateToday("text"));

        data = data.replace(raw_data, modified_data);
        data = data.replace("[", "");
        data = data.replace("]", "");
        return data;

    }

    /**
    type - numerical,text
    */
    function getDateToday(type) {
        var date = new Date();
        switch (type) {
            case "numeric":
                var options = {
                    dateStyle: "short"
                };
                return date.toLocaleDateString("en-US", options).replace("/", "").replace("/", "");
            case "text":
                var options = {
                    dateStyle: "long"
                };
                return date.toLocaleDateString("en-US", options);

        }
    }

    function getInitials(data) {
        var raw_data = data.split(" ");
        var initials = "";
        for (var i = 0; i < raw_data.length; i++) {
            initials += raw_data[i].charAt(0);
        }
        return initials.toLocaleUpperCase();
    }

    function Export2Doc(element, filename = '') {
        var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/html401'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        var postHtml = "</body></html>";
        //        var html = preHtml + document.getElementById("wrapper3").innerHTML + postHtml;
        var html = preHtml + generateTemplateHTML(element) + postHtml;

        var blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });

        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

        // Specify file name
        filename = filename ? filename + '.doc' : doc_filename.trim() + '.doc';

        // Create download link element
        var downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = url;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
        document.body.removeChild(downloadLink);
    }

    function generateTemplate() {
        $.getJSON(chrome.extension.getURL("format.json"), function (json) {
            var description = "";
            for (var i = 0; i < json.text_format[0].length; i++) {

                description += stringFormat(json.text_format[0][i]) + "\n";

            }

            logo_path = json.logo_path;
            target_form_id = json.target_form_id;
            for (var i = 0; i < json.target_form_id.length; i++) {
                if ($("#" + json.target_form_id[i]).text().length == 0) {
                    $("#" + json.target_form_id[i]).text(description);
                }

                $("#" + json.target_form_id[i]).after("<button class='btn pm-btn-dark export-docs' data-id='" + "#" + json.target_form_id[i] + "' type='button'>Download Document</button>");
            }





        });

    }

    function Export2PDF(id) {
        var doc = new jsPDF()
        doc.setFontSize(12);
        generateTemplatePDF(id, doc, 10, 20);
        doc.save(doc_filename + '.pdf')
    }

    $(document).on("click", ".export-docs", function () {
        var value = $(this).attr("data-id");
        Export2Doc(value);
    });

    chrome.runtime.sendMessage({
        request: "username"
    }, function (response) {
        console.log(response.username);
        username = response.username;
        generateTemplate();
        //        alert(response.username);
    });

    function generateTemplateHTML(id) {
        var raw_contents = $(id).val();
        var list_contents = raw_contents.split("\n");
        var html_contents = "";
        html_contents += "<table style='position:absolute; top:0px'>";
        for (var i = 0; i < list_contents.length; i++) {
            var title = list_contents[i].substr(0, list_contents[i].indexOf(":"));
            var data = list_contents[i].replace(title, "");
            if (i == 0) {
                console.log("doc_filename: " + data);
                doc_filename = data.replace(":", "");
            }
            if (title.length == 0) {
                html_contents += "<tr >";
                if(data.indexOf("______") >= 0){
                    html_contents += "<td colspan='2'>" + data + "</td>";
                }else {
                     html_contents += "<td></td>";
                     html_contents += "<td>" + data + "</td>";
                }
               
                
                html_contents += "</tr>";
                continue;
            }
            
            html_contents += "<tr>";
            html_contents += "<td>" + title + "</td>";
            html_contents += "<td>" + data + "</td>";
            html_contents += "</tr>";
        }
        html_contents += "</table>";

        return `<div'>
        <img src='`+logo_path+`' />
        <h1>RELEASE NOTE</h1>
        ` + html_contents + `
        <p style='text-align:right;font-size:12px'>ADDRESS:<span style='color:#3498db'>TC PLAZA BLDG., PH FLR #40 CORDILLERA ST, QUEZON AVE., QUEZON CITY</span><br>
        TELEPHONE:<span style='color:#3498db'>(632)742-6619/742-6832/742-8556 | FAX: (632) 742-6634</span><br>
        WEBSITE:<span style='color:#3498db'>WWW.JIMAC-INC.COM</span></p>
        </div>`;
    }

    function generateTemplatePDF(id, doc, x, y) {
        var raw_contents = $(id).val();
        var list_contents = raw_contents.split("\n");
        var x_margin = 70,
            y_margin = 10;
        for (var i = 0; i < list_contents.length; i++) {
            var title = list_contents[i].substr(0, list_contents[i].indexOf(":"));
            var data = list_contents[i].replace(title, "");


            if (title.length == 0) {
                doc.text(data, x, y);
            } else {
                doc.text(title, x, y);
                var arr_data = chunkSubstr(data, 30);
                data = "";
                for (var i = 0; i < arr_data.length; i++) {
                    data += arr_data[i];
                }
                doc.text(data, x_margin + x, y);
            }



            y += y_margin;



        }

        return doc;
    }

    function chunkSubstr(str, size) {
        const numChunks = Math.ceil(str.length / size)
        const chunks = new Array(numChunks)

        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
            chunks[i] = str.substr(o, size) + "\n"
        }

        return chunks
    }






});
