# Pulang Mina
Chrome extension specializes on creating release notes with ease (pinasaya version).

## Compatibility:
  - Works only on Google Chrome applications.

## Installation
1. Download & Extract the [zip file](https://github.com/noahjames404/pulang-mina/releases).
2. Open google chrome.
3. Type the following url in the search bar "chrome://extensions".
4. At the top right corner activate the developer mode.
5. A menu bar will show up under the developer mode.
6. click "Load Unpack", then navigate to the extracted zip file from step 1.
7. After selecting the folder disable the developer mode.
8. You've successfully added the extension to your chrome.

## How to use
1. Fill up the extension's popup form & click save. 
2. Goto redmine & create a new issue, if you're already in **new issue form** refresh the webpage again to apply changes.
3. A release note template will generate after loading the webpage.
4. Next to the field is a **Send Email** & **Download Document** button (located at the bottom).
5. clicking the **Download Document** button generates a docx file that can also be open in odt (libre office) versions. It is a formatted release note with issue number appended at the start of the release note.
6. You can send email directly to your receipient by clicking **Send Email** 

## Documentation

**format.json** - contains the text template of release note.
  setting up the format.json
  
  Example Format
  
  ```
   {
    "logo_path":"http://path/to/my/image",
    "target_form_id":["input_id"],
    "text_format": [
        [
            "FIELD NAME 1 : VALUE",
            "_________________________________",
            "FIELD NAME 2 : VALUE"
        ]
    ]
   },
   "document_footer" : [
   		["TITLE","DESCRIPTION"]
   ],
   "mailer": {
          "to":"emailme@gmail.com",
          "cc":["what@gmail.com"],
          "subject": "idk",
          "subject_alt_tfi":0
   },
   "user_recognition" : {
       "enable": true,
       "identify":"value",
       "locate_on":"dom_id"
   }   
  ```
  ### Properties
  
  Object | Description
  -------|-------
  logo_path  | image uri string
  target_form_id | an array of target id's to modify, this is base on the input field's id attribute
  text_format | a multidimensional array of text, the default template of release notes
  document_footer | is a multidimentional array of title & description, appears at the bottom of the downloaded document
  mailer | an object used for sending generated mails, this does not include attachments (due to security concerns)
  user_recognition | an object recognizes the username when extension's popup form is blank
  
  > If the target_form_id already has contents inside (including white spaces), the default template will not override the current contents. 
  
  ### Mailer Object
  Object | Description 
  -------|------------
  to | recipient's email
  cc | Carbon copy email of other recipients 
  subject | the subject of email
  subject_alt_tfi | stands for **subject alternative text format index** works only if email is blank (an empty string), the subject will be base on text_format's array content.  
  
  ### User Recognition 
  Object    | Description
  ----------|--------
  enable    | allow extension to identify the user.
  identify  | identifies the user by a proxy text e.g << me >>.
  locate_on | DOM id, specify where to located the username works only on select dom elements. 
  
  When creating a release note template use a colon **":"** keyword to separate the field name & content.
  
  Valid fields.
  - "CLIENT NAME :" a field with unassigned value.
  - "SYSTEM : Windows 7" a field with predefined value.
  
  > text fields with no colons will generate an empty field name.
  
  to add a horizontal divider add a 5 to n underscore "_", it will occupy two columns upon generating the template. 
   
 
  Special keywords - this keywords are formatted upon generating the template. To apply Special keywords enclose the keyword with open & close brackets **\[keyword\]**, you can add multiple keywords inside the brackets as long as they are separated clearly using white spaces/dash/under score characters e.g:**\[keyword1-keyword2\]**.
  
  Keyword | Output
  --------|--------
  name    | the initial name of user e.g Noah James Yanga = **NJY**
  date_text | the current date in text format e.g **November 22, 2019** (still having compability issues on ubuntu os)
  date_num | the current date in numerical format e.g **112219**
 
 
 
 ## Issues
 If you're experiencing technical difficulties with the extension such as:
 - download button is not showing on target_form_id.
 - new issues does not generate default templates.
 
 Possible Solutions
 - re-install the chrome extension.
