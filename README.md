# pulang-mina
Specializes on creating release notes with ease (pinasaya version).

## Documentation

**format.json** - contains the text template of release note.
  setting up the format.json
  
  Object | Value
  -------|-------
  logo_path  | image uri
  target_form_id | an array of target id's to modify
  text_format | a multidimensional array of text, the default template of release notes
  
  when creating a release note template use a colon **":"** keyword to separate the field name & content.

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
 
  
  
  
