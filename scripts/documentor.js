$(document).ready(function () {
    var cookie_url = "http://developer.chrome.com/extensions/cookies.html";
    var username;
    var logo_path = "";
    var target_form_id = [];
    var doc_filename = "";
    var doc_footer = "";
    var mailer = {};
    var user_recognition = {};

    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };


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
        var html = preHtml + generateDocumentContents(element) + postHtml;

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

    function getReferenceIssue() {
        //        var title = $("html").filter('title').text();
        var title = $(document).find("title").text();
        if (title.indexOf("#") == -1) {
            return "";
        }
        var partial_title = title.substr(title.indexOf("#"));
        var issue_id = partial_title.substr(0, partial_title.indexOf(" ") - 1);
        return "-" + issue_id;
    }

    function generateReleaseNote() {
        $.getJSON(chrome.extension.getURL("format.json"), function (json) {
            var description = "";
            doc_footer = json.document_footer;
            logo_path = json.logo_path;
            mailer = json.mailer;
            user_recognition = json.user_recognition;
            target_form_id = json.target_form_id;


            if (username == "") {
                username = identifyUser();
                if (username != "") {
                    chrome.runtime.sendMessage({
                        request: "update_username",
                        value: username
                    });
                }


            }
            for (var i = 0; i < json.text_format[0].length; i++) {

                description += stringFormat(json.text_format[0][i]) + "\n";

            }




            for (var i = 0; i < json.target_form_id.length; i++) {
                var input_form = $("#" + json.target_form_id[i]);
                if (input_form === undefined) {
                    continue;
                }
                if (input_form.text().length == 0) {
                    input_form.text(description);
                }

                if (username == "") {
                    $(input_form).notify(
                        "Please fill up the pulang-mina form, located at the top right corner", {
                            position: "top",
                            autoHideDelay: 10000
                        }
                    );
                }

                $("#" + json.target_form_id[i]).after("<button class='btn pm-btn-dark export-docs' data-id='" + "#" + json.target_form_id[i] + "' type='button'>Download Document</button>");
                $("#" + json.target_form_id[i]).after("<button class='btn pm-btn-primary export-mail' data-id='" + "#" + json.target_form_id[i] + "' type='button'>Send Email</button>");
                var target = json.target_form_id[i];
                setInterval(function () {
                    if ($(".export-docs").html() === undefined) {
                        $("#" + target).after("<button class='btn pm-btn-dark export-docs' data-id='" + "#" +target+ "' type='button'>Download Document</button>");
                        $("#" + target).after("<button class='btn pm-btn-primary export-mail' data-id='" + "#" + target + "' type='button'>Send Email</button>");
                    }
                }, 1000);

            }
        });
    }




    $(document).on("click", ".export-docs", function () {
        var value = $(this).attr("data-id");
        Export2Doc(value);
    });


    $(document).on("click", ".export-mail", function () {
        var id = $(this).attr("data-id");
        window.open('mailto:' + mailer.to + '?subject=' + generateMailSubject(id).replace(":", "") + getReferenceIssue() + generateMailCC(), "_parent");
    });


    chrome.runtime.sendMessage({
        request: "username"
    }, function (response) {
        console.log(response.username);
        username = response.username;
        generateReleaseNote();
        //        alert(response.username);
    });

    function generateMailSubject(id) {
        var subject = mailer.subject;
        if (mailer.subject == "") {
            if (mailer.subject_alt_tfi != -1) {
                subject = translateTextToArray(id)[mailer.subject_alt_tfi].data;
            }
        }

        return subject;
    }

    function generateMailCC() {
        var cc = "";
        for (var i = 0; i < mailer.cc.length; i++) {
            cc += (cc == "" ? "" : ";") + mailer.cc[i];
        }
        return cc == "" ? "" : "&cc=" + cc;
    }

    function translateTextToArray(id) {
        var raw_contents = $(id).val();
        var list_contents = raw_contents.split("\n");
        var text_arr_object = [];
        for (var i = 0; i < list_contents.length; i++) {
            var title = list_contents[i].substr(0, list_contents[i].indexOf(":"));
            var data = list_contents[i].replace(title, "");
            text_arr_object.push({
                title: title,
                data: data
            });
        }
        return text_arr_object;
    }

    function generateDocumentContents(id) {

        var html_contents = "";
        html_contents += "<table style='position:absolute; top:0px'>";
        var text_arr_object = translateTextToArray(id);

        for (var i = 0; i < text_arr_object.length; i++) {
            if (i == 0) {
                text_arr_object[i].data += getReferenceIssue();
                doc_filename = text_arr_object[i].data.replace(":", "");
            }
            if (text_arr_object[i].title.length == 0) {
                html_contents += "<tr >";
                if (text_arr_object[i].data.indexOf("______") >= 0) {
                    html_contents += "<td colspan='2'>" + text_arr_object[i].data + "</td>";
                } else {
                    html_contents += "<td></td>";
                    html_contents += "<td>" + text_arr_object[i].data + "</td>";
                }


                html_contents += "</tr>";
                continue;
            }

            html_contents += "<tr>";
            html_contents += "<td>" + text_arr_object[i].title + "</td>";
            html_contents += "<td>" + text_arr_object[i].data + "</td>";
            html_contents += "</tr>";
        }
        html_contents += "</table>";

        return `<div'>
        <img src='` + logo_path + `' />
        <h1>RELEASE NOTE</h1>
        ` + html_contents +
            generateDocumentFooter() + `
        </div>`;
    }

    function identifyUser() {
        if (!user_recognition.enable) {
            return "";
        }
        var select = $("#" + user_recognition.locate_on);
        if (select === undefined) {
            return "";
        }
        var options = select.find("option").toArray();
        console.log("options " + options[1].innerHTML.trim() + " " + (user_recognition.identify));
        var user_id = "";
        for (var i = 0; i < options.length; i++) {
            if (options[i].innerHTML.trim() == escapeHtml(user_recognition.identify)) {
                for (var x = 0; x < options.length; x++) {
                    if (options[x].value == options[i].value && options[x].innerHTML.trim() != escapeHtml(user_recognition.identify)) {
                        console.log("result-" + options[x].innerHTML)
                        return options[x].innerHTML;
                    }
                }
            }
        }

        return "";
    }


    function generateDocumentFooter() {
        var footer = "";
        for (var i = 0; i < doc_footer.length; i++) {
            footer += doc_footer[i][0] + "" + "<span style='color:#3498db'>" + doc_footer[i][1] + "</span><br>";
        }

        return `<p style='text-align:right;font-size:12px'>` + footer + `</p>`;
    }



    function escapeHtml(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }

});
