/*
 * @example An iframe-based dialog with custom button handling logics.
 */
(function() {
	CKEDITOR.plugins
	.add(
			'MediaEmbed',
			{
				requires : [ 'iframedialog' ],
				init : function(editor) {
					var me = this;					
					CKEDITOR.dialog
					.add(
							editor.id + '_MediaEmbedDialog',
							function() {
								return {
									title : editor.config.sfdcLabels.CkeMediaEmbed.title,
									minWidth : 450,
									minHeight : 300,
									contents : [ {
										id :  'iframeDialog',
										label : 'Embed Media',
										expand : true,										
										elements : [ 
										{
											type : 'html',
											id : editor.id + '_iframeMediaEmbed',
											label : 'Embed Media',
											style : 'width:100%; height:100%; margin:0; padding:0;',											
											html : '<iframe src="'
												+ me.path
												+ 'dialogs/mediaembed.html"  name="' + editor.id + '_iframeMediaEmbed" allowtransparency="true" frameborder=0></iframe>'
												+ '<div style="display: none" id="' + editor.id + '_hiddenDiv"></div>'
										},										
										{
											type : 'html',											
											html : '<div style="padding: 0 10px 0 10px;" class="cke_dialog_ui_input_desc">' + editor.config.sfdcLabels.CkeMediaEmbed.description + '<br/><br/>' +
											editor.config.sfdcLabels.CkeMediaEmbed.exampleTitle + '<br/>' +
											editor.config.sfdcLabels.CkeMediaEmbed.example + '</div>' 
										}]
									} ],
									onShow : function()
									{
										var i;
										for ( i = 0; i < window.frames.length; i++) {
											try {
												if (window.frames[i].name == editor.id + '_iframeMediaEmbed') {
													var content = window.frames[i].document
													.getElementById("embedCode").value;
													break;
												}        							    
											}
											// should continue looping; without this it stops processing if there is
											//an iframe that refers to a different domain
											catch(e) {}
										}
										if(window.frames[i]) {
											var errorMessage = window.frames[i].document.getElementById("iframeError");											
											errorMessage.className = "hidden"
											window.frames[i].document.getElementById("embedCode").value = '';
										}
										var selectedEl = this.getSelectedElement();
										if (selectedEl) {
											var iframeNode = editor.restoreRealElement( selectedEl );
											window.frames[i].document.getElementById("embedCode").value = iframeNode.$.outerHTML;
										}

									},
									onOk : function() {
										var i;
										for ( i = 0; i < window.frames.length; i++) {
											try {
												if (window.frames[i].name == editor.id + '_iframeMediaEmbed') {
													var content = window.frames[i].document
													.getElementById("embedCode").value.trim();
													break;
												}        							    
											}
											// should continue looping; without this it stops processing if there is
											//an iframe that refers to a different domain
											catch(e) {}
										}
										var errorMessage = window.frames[i].document.getElementById("iframeError");										
										if(content.length == 0 || !content.toLowerCase().match("<iframe")) {							    
											errorMessage.innerHTML = editor.config.sfdcLabels.CkeMediaEmbed.iframeMissing;
											errorMessage.className = "";
											return false;
										}
										else
											errorMessage.className = "hidden";
										
										// fix for W-1227791 - add wmode=opaque		
										var hidden = document.getElementById(editor.id + '_hiddenDiv');
										hidden.innerHTML = content;
										for (var i = 0; i < hidden.children.length; i++) {
											var htmlElement = hidden.children[i];
											if (htmlElement.tagName.toLowerCase() != 'iframe') {
												continue;
											}
											var url = htmlElement.attributes['src'].value;
											var qMarkIndex = url.indexOf('?');
											// if no question mark, we have no params. so, add wmode param
											if (qMarkIndex < 0) {
												url = url + '?wmode=opaque';
											}
											// if wmode is not already a param in url, add it
											else if (!url.match(/[\?&]wmode=/gi)) {
												url = url + '&wmode=opaque';
											}
											// else wmode is present, make sure value is set to opaque
											else {						
												var urlHalves = url.split('?');
												var params = urlHalves[1].split("&");
												for (var j = 0; j < params.length; j++) {
													if (params[j].match(/[\?&]wmode=/gi)) {
														params[j] = 'wmode=opaque';
														break;
													}
												}
												url = urlHalves[0] + '?' + params.join('&'); 
											}
											
											htmlElement.attributes['src'].value = url;
										}
										
										content = hidden.innerHTML;
																				
										final_html = 'MediaEmbedInsertData|---'
											+ escape('<div class="media_embed">' + content + '</div>')
											+ '---|MediaEmbedInsertData';
										editor.insertHtml(final_html);
										updated_editor_data = editor.getData();
										clean_editor_data = updated_editor_data.replace(final_html,content);
										editor.setData(clean_editor_data);
										hidden.innerHTML = '';
									}									
								};
							});

					editor.addCommand('MediaEmbed',
							new CKEDITOR.dialogCommand(
									editor.id + '_MediaEmbedDialog'));

					editor.ui.addButton('MediaEmbed', {
						label : editor.config.sfdcLabels.CkeMediaEmbed.title,
						command : 'MediaEmbed',
						className : 'cke_button_MediaEmbed'
					});
				}
			});
})();