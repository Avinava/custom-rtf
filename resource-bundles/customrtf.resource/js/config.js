/**
 * This settings is the result of the migration of the configuration file from the previous version of
 * FCK Editor so that the exposed features are the same (@see richtext.config.js).
 */
CKEDITOR.editorConfig = function( config )
{
    // Keep in sync with CKEditor3.java

     /*
      * DEFINITION OF THE TOOLBARS
      *
      * A new toolbar is defined this way: config.toolbar_<tbName> where <tbName> is the name of the toolbar that can
      * be referenced by config.toolbar.
      */

    config.toolbar_SalesforceBasic = [
        ['Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', 'Strike'],
        ['-', 'Link', 'SfdcImage'],
        ['-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'],
        ['-', 'BulletedList', 'NumberedList'],
        ['Indent', 'Outdent']
    ];

    config.toolbar_EmailMultiFormat = [
        ['SfdcSwitchToText'],
        ['RemoveFormat','TextColor', 'BGColor'],
        ['Bold','Italic','Underline', 'Strike'],
        ['SfdcImage'],
        ['Link', 'Unlink', 'Anchor'],
        ['JustifyLeft','JustifyCenter', 'JustifyRight'],
        ['BulletedList', 'NumberedList', 'Indent', 'Outdent'],
        ['Font', 'FontSize', 'Format']
    ];
    /*
     * For when the property use rich text is disabled, we do not
     * want the sfdc switch to text button, rest everything is same as the
     * above email multi format.
     */
    config.toolbar_Email = [
        ['RemoveFormat','TextColor', 'BGColor'],
        ['Bold','Italic','Underline', 'Strike'],
        ['SfdcImage'],
        ['Link', 'Unlink', 'Anchor'],
        ['JustifyLeft','JustifyCenter', 'JustifyRight'],
        ['BulletedList', 'NumberedList', 'Indent', 'Outdent'],
        ['Font', 'FontSize', 'Format']
    ];

    config.toolbar_SalesforceLight = [
        ['Bold', 'Italic'],
        ['Link'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight'],
        ['BulletedList'],
        ['FontSize']
    ];

    config.toolbar_Knowledge = [
        ['Source'],
        ['Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'],
        ['Table','codeblock'],
        ['smartLink', 'Link', 'Unlink', 'Anchor'],
        ['SfdcImage'],
        ['JustifyLeft','JustifyCenter', 'JustifyRight'],
        ['BulletedList', 'NumberedList', 'Indent', 'Outdent'],
        ['Format', 'Font', 'FontSize', 'TextColor', 'BGColor']
    ];

    config.toolbar_KnowledgeWithIframes = [
        ['Source'],
        ['Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'],
        ['Table','codeblock'],
        ['smartLink', 'Link', 'Unlink', 'Anchor'],
        ['SfdcImage', 'MediaEmbed'],
        ['JustifyLeft','JustifyCenter', 'JustifyRight'],
        ['BulletedList', 'NumberedList', 'Indent', 'Outdent'],
        ['Format', 'Font', 'FontSize', 'TextColor', 'BGColor']
    ];

    config.toolbar_Visualforce = [
        ['Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', 'Strike'],
        ['Link', 'SfdcImage'],
        ['JustifyLeft','JustifyCenter', 'JustifyRight'],
        ['BulletedList', 'NumberedList', 'Indent', 'Outdent'],
    ];

    config.toolbar_HomePageComponent = [
        ['Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', 'Strike'],
        ['Table'],
        ['Link', 'SfdcImage'],
        ['JustifyLeft','JustifyCenter', 'JustifyRight'],
        ['BulletedList', 'NumberedList', 'Indent', 'Outdent'],
        ['Font', 'FontSize', 'TextColor', 'BGColor']
    ];

    config.toolbar_ServiceCommunity = [
        ['Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', 'Strike'],
        ['Link', 'SfdcImage','codeblock'],
        ['JustifyLeft','JustifyCenter', 'JustifyRight'],
        ['BulletedList', 'NumberedList', 'Indent', 'Outdent'],
    ];

    config.toolbar_Full = [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
        { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
        '/',
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
        { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
        '/',
        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
        { name: 'others', items: [ '-' ] },
        { name: 'about', items: [ 'About' ] }
    ];

    config.toolbarCanCollapse = false;
    config.resize_enabled = false;

    /*
     * Deactivate:
     * - The Element path component (RTE's "status bar")
     * - Resizing ability (editing area maximization, resizing)
     * - Context menus
     * - Standard image dialog
     */
    config.removePlugins = 'elementspath,maximize,resize,image,contextmenu';

    /*
     *
     * We need to find a way to read this setting from java code.
     * Until then, Make sure the list here is in sync with the one mentioned in RichTextAreaEditorFactory.CKEditor.getRichTextEditorJavascript()
     */
    config.extraPlugins = 'sfdcImage,sfdcImagePaste,sfdcSwitchToText,iframedialog,MediaEmbed,smartLink,codeblock';


    /*
     * Hide some dialog tabs:
     * - Image dialog: advanced and link tabs.
     * - Link dialog: advanced and target tabs
     */
    config.removeDialogTabs = 'link:advanced;table:advanced;tableProperties:advanced'; //  FCKConfig.ImageDlgHideLink;FCKConfig.ImageDlgHideAdvanced

    config.skin = 'sfdc';

    config.enterMode = CKEDITOR.ENTER_BR;
    config.shiftEnterMode = CKEDITOR.ENTER_P;
    config.forcePasteAsPlainText = false;
    config.forceSimpleAmpersand = true;

    // Salesforce specific entries (non-cke)
    config.imageUploadAllowedExtensions  = ".(jpg|gif|jpeg|png|bmp|jfif|jpe|pjpeg)$" ;
    config.imageUploadDeniedExtensions   = "" ;

    // Preserve formatting when pasting from word W-1709296
    config.pasteFromWordRemoveFontStyles = false;
    config.pasteFromWordRemoveStyles = false;

    // Workaround for ckeditor dialog bug( they are using global var i which screw up the global chain, cause config.plugins to be undefined. we will have to define it here)
    config.plugins = CKEDITOR.config.plugins;
};