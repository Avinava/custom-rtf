# custom-rtf
custom-rtf visualforce component lets you add richtext capability to a text area without losing the ability to rerender the page.

###Features
- converts plain textarea into rtf editor.
- allows rerendering of the page.

###Syntax
 ```
 <apex:page standardStylesheets="true" docType="html-5.0" sidebar="false">
    <apex:form >
        <c:customrtf targetclass="mytextarea" rendered="true"/>
        <apex:inputTextarea styleClass="mytextarea" richText="false"/>
    </apex:form>
</apex:page>
```
### TO DO
- Move js files to static resource
- add different layouts that salesforce allows

