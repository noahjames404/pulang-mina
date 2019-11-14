# Pulang Mina
Chrome extension specializes on creating release notes with ease (pinasaya version).

## Installation
1. Download & Extract the zip file.
2. Open google chrome.
3. Type the following url in the search bar "chrome://extensions".
4. At the top right corner activate the developer mode.
5. A menu bar will show up under the developer mode.
6. click "Load Unpack", then navigate to the extracted zip file from step 1.
7. After selecting the folder disable the developer mode.
8. You've successfully added the extension to your chrome.

## Workflow

1. Fill up the extension's popup form & click save. 
2. Goto redmine & create a new issue, if you're already in **new issue form** refresh the webpage again to apply changes.
3. A release note template will generate after loading the webpage.
4. Next to the field is a **download document** button (located at the bottom).
5. clicking the **download document** button generates a docx file that can also be open in odt (libre office) versions. It is a formatted release note with issue number appended at the start of the release note.

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
   }
  ```
  
  Object | Value
  -------|-------
  logo_path  | image uri
  target_form_id | an array of target id's to modify, this is base on the input field's id attribute
  text_format | a multidimensional array of text, the default template of release notes
  
  When creating a release note template use a colon **":"** keyword to separate the field name & content.
  
  Valid fields.
  - "CLIENT NAME :" a field with unassigned value.
  - "SYSTEM : Windows 7" a field with predefined value.
  
  > text fields with no colons will generate an empty field name.
  
  to add a horizontal divider add a 5 to n underscore "_", it will occupy two columns upon generating the template. 
   
 
  Special keywords - this keywords are formatted upon generating the template. To apply Special keywords enclose the keyword with open & close brackets **\[keyword\]**, you can add multiple keywords inside the brackets as long as they are separated clearly using white spaces/dash/under score characters e.g:**\[keyword1-keyword2\]**.
  
  Keyword | Output
  --------|--------
  name    | taken after filling up the name field in the extension's popup form
  date_text | the current date in text format e.g **Aug 3. 1997** (still having compability issues on ubuntu os)
  date_num | the current date in numerical format e.g **080397**
 
  

