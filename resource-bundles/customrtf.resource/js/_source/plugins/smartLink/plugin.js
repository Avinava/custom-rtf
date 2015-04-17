/*
 * The label retrieval functions can be found in knowledgeCKEditor.js
 */

(function() {
	var pluginName = 'smartLink';
	var dialogName = pluginName + 'Dialog';
	var commandName = 'insert' + pluginName;
	var menuGroupName = pluginName + 'MenuGroup';
	var menuItemName = pluginName + 'MenuItem';
	
CKEDITOR.plugins.add(pluginName, {
				init: function (editor) {
					
					// KnowledgeCKEditor won't be defined if not in knowledge, but they won't need this plugin if they're not in knowledge so just declare and initialize
					if (typeof KnowledgeCKEditor === "undefined" || typeof KnowledgeCKEditor.getLabelSmartLinkButtonTooltip === "undefined" ) {
						KnowledgeCKEditor = {
								languageSelectItems : '',
								publishStatusSelectItems : '',
								masterLanguageCode : '',
								getLabelSmartLinkButtonTooltip : function() {
									return '';
								},
								getLabelSmartLinkContextMenuEdit: function() {
									return '';
								},
								getLabelSmartLinkDialogTitle : function() {
									return '';
									},
								getLabelSmartLinkSearchArticle : function() {
									return '';
									},
								getLabelSmartLinkSelectedArticle : function() {
									return '';
									},
								getLabelSmartLinkNoArticleSelected : function() {
									return '';
									},
								getLabelSmartLinkSearchResultsDefault : function() {
									return '';
									},
								getLabelGoToArticle : function() {
									return '';
								},
								getLabelNoResults : function() {
									return '';
								},
								getLabelSmartLinkKeywordTooShort : function() {
									return '';
								}
						};
					}
					
					var targetChanged = function () {
						   var dialog = this.getDialog();
						   var targetVal = dialog.getContentElement( 'targetTab', 'targetLinkRef' ).getValue();
						   var customTargetFrame = dialog.getContentElement('targetTab', 'targetFrame').getElement();
						   if (targetVal == 'customTarget') {
							   customTargetFrame.show();
						   }
						   else {
							   customTargetFrame.hide();
						   }
					}
					
					// We need to add <option>s to the <select> menus this way b/c setting innerHtml on <select>s doesn't work in IE7
					var insertSelectOptions = function(selectElement, optionsArray) {
						if (selectElement.children.length > 0) {
							return;
						}
						for (var i in optionsArray) {
							var newOption = document.createElement("OPTION");
							newOption.text = i;
							newOption.value = optionsArray[i];
							selectElement.add(newOption);
						}
					}
					var loadLanguages = function() {
						var languageSelectItems = KnowledgeCKEditor.languageSelectItems;
						var dialog = this.getDialog();
						var langSelectElement = dialog.getContentElement( 'articleTab', 'languageFilterLinkRef' ).getInputElement().$;
						
						if (!languageSelectItems) {
							findParentTd(langSelectElement).style.display = 'none';
						}
						else {
							insertSelectOptions(langSelectElement, languageSelectItems);
							langSelectElement.value = KnowledgeCKEditor.masterLanguageCode;
						}
					}
					var loadPublishStatuses = function() {
						var publishStatusSelectItems = KnowledgeCKEditor.publishStatusSelectItems;
						var dialog = this.getDialog();
						var pubStatusSelectElement = dialog.getContentElement( 'articleTab', 'publishStatusFilterLinkRef' ).getInputElement().$;
						insertSelectOptions(pubStatusSelectElement , publishStatusSelectItems);
						pubStatusSelectElement.value = "0";
					}

					/*
					 * Gets the containing <td> tag for this element. CKEditor dialogs are styled as tables, so each element is boxed in a <td>
					 */
					var findParentTd = function(child) {
						var parent = child.parentNode;
						while (parent !== null && parent.tagName.toLowerCase() != 'td') {
							parent = parent.parentNode;
						}
						return parent;
					}
					
					var clearSearchResults = function() {
						var elementsInResultsBox = Sfdc.select(".resultsLinkRef span, .resultsLinkRef li");
						for (var i = 0; i < elementsInResultsBox.length; i++) {
							Sfdc.Dom.removeChild(elementsInResultsBox[i]);
						}
					}
					
					var selectArticle = function(title, url) {
						// the owner of this function is Window (not the CKEditor UIElement like the other functions), so "this" refers to Window
						var dialog = this.CKEDITOR.dialog.getCurrent();
						var pathLinkRefInput = dialog.getContentElement( 'articleTab', 'pathLinkRef' ).getInputElement().$;
						pathLinkRefInput.value = url;
						pathLinkRefInput.setAttribute("data-url-title", title);
					}
					
					var createArticleElement = function(article) {
						var articleElement = document.createElement("LI");
						var articleElementLink = document.createElement("A");
						var articleTitleEscaped = Sfdc.String.escapeToHtml(article.title);
						var articleTypeEscaped = Sfdc.String.escapeToHtml(article.articleType);
						articleElementLink.onclick = function() {selectArticle(article.title, article.url);}
						Sfdc.Dom.updateHTML(articleElementLink, articleTitleEscaped + " (" + article.articleNumber + ") - " + articleTypeEscaped)
						// data-url displays the article url for testing purposes
						articleElementLink.setAttribute("data-url", article.url);
						articleElement.appendChild(articleElementLink);
						
						var list = Sfdc.get("#" + uniqueDialogName + " .resultsLinkRefList");
						list.appendChild(articleElement);
					}
					
					var handleSearchSuccess = function(response, json) {
	                    if (reqCount == json.reqCount) {
							if (Sfdc.isDefAndNotNull(json.articles) && json.articles.length > 0) {
								for (var i = 0; i < json.articles.length; i++) {
									createArticleElement(json.articles[i]);
								}
							}
							else {
								Sfdc.Dom.updateHTML('#' + uniqueDialogName + ' .resultsLinkRefList', '<span>' + KnowledgeCKEditor.getLabelNoResults() + '</span>');
							}
		                    loadingScreen.hide();
	                    }
					}
					
					var handleSearchFailure = function(response, json) {
						if (reqCount == json.reqCount) {
	                    	Sfdc.Dom.updateHTML('#' + uniqueDialogName + ' .resultsLinkRefList', '<span>' + json.errorMessage + '</span>');
	                    	loadingScreen.hide();
		                }
					}
					
					var searchArticle = function() {
						clearSearchResults();
						var enteredKeywords = Sfdc.get("#" + uniqueDialogName + " .searchFieldLinkRef").value;
						
						if (enteredKeywords.length == 1) {
							handleSearchFailure('',{'reqCount':reqCount, 'errorMessage':KnowledgeCKEditor.getLabelSmartLinkKeywordTooShort()});
							return;
						}
						else if (enteredKeywords.length > 200) {
							enteredKeywords = enteredKeywords.substring(0, 199);
						}
						
						// escape backslash (\) and quotes (") so as not to break the javascript string below.
						var escapedKeywords = enteredKeywords.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
						var keywords = enteredKeywords !== '' ? escapedKeywords : '';

						var selectedPublishStatus = Sfdc.get(".smartLinkFilterPublishStatus select").value;
						var publishStatus = selectedPublishStatus !== "" ? selectedPublishStatus : 0;
						var selectedLanguage = Sfdc.get(".smartLinkFilterLanguage select").value;
						var language = selectedLanguage !== "" ? selectedLanguage : '""';
						var configJSON = '{"format":"json","articleTypes":[],"searchStr":"' + keywords + '","numArticles":20,"publishStatus": ' + publishStatus + ',"language": ' + language + '}'
						reqCount++;
						var id = 'articleList';
						var articleListEl = 'div#resultsLinkRef';
						var options = {
				                url: "/knowledgehome2/articleslist",
				                params: { "config" : configJSON, "reqCount" : reqCount },
				                success: handleSearchSuccess,
				                failure: handleSearchFailure
				            };
						loadingScreen.show();
						chatter.getToolbox().post(options);
					}
					
					//resultsDiv and loadingScreen are created at onLoad below
					var resultsDiv;
					var loadingScreen;
					
					var reqCount = 0;
					var defaultLinkResultsDivHtml = '<span>' + KnowledgeCKEditor.getLabelSmartLinkSearchResultsDefault() + '</span><ul class="resultsLinkRefList"></ul>';
					
					var commonLang = editor.lang.common;
					var linkLang = editor.lang.link;

					var uniqueDialogName = editor.id + '_' + dialogName;
					editor.addCommand( commandName, new CKEDITOR.dialogCommand(uniqueDialogName));
						if (editor.addMenuItem) {
							editor.addMenuGroup(menuGroupName);
							editor.addMenuItem(menuItemName, {
								label: KnowledgeCKEditor.getLabelSmartLinkContextMenuEdit(),
								command: commandName,
								group: menuGroupName,
								icon: this.path + 'images/icon.png'
							})
						}
						
						if (editor.contextMenu) {
						editor.contextMenu.addListener( function(element, selection) {
							if (!element || element.isReadOnly() ) {
								return null;
							}
							
							var anchor = CKEDITOR.plugins.link.tryRestoreFakeAnchor( editor, element );
							if ( !anchor && !( anchor = CKEDITOR.plugins.link.getSelectedLink( editor ) ) )
								return null;
							
							var menu = {};
							
							if ( anchor.getAttribute( 'data-cke-saved-href' ) && anchor.getAttribute('data-cke-saved-href').indexOf('/articles') == 0 && anchor.getChildCount() ) {
								editor.contextMenu.removeAll();
								menu[menuItemName] = CKEDITOR.TRISTATE_ON;
							}
							return menu;
						})
					}
					editor.on( 'doubleclick', function( evt )
							{
								var element = evt.data.element;
								if (element != null && element.is('a')) {
									var smartLinkPrefix = "/articles/";
									if (element.$.getAttribute("data-cke-saved-href").indexOf(smartLinkPrefix) == 0) {
										evt.data.dialog = uniqueDialogName;
									}
								}
							}, null, null, 100);
					
					editor.ui.addButton( pluginName, {
								label: KnowledgeCKEditor.getLabelSmartLinkButtonTooltip(),
								command: commandName,
								icon: this.path + 'images/icon.png'
							});
					CKEDITOR.dialog.add(uniqueDialogName, function (editor) {
						return {
							title: KnowledgeCKEditor.getLabelSmartLinkDialogTitle(),
							minWidth: 400,
							minHeight: 255,
							buttons : [
							           CKEDITOR.dialog.okButton( editor, {
							        	   className: 'smartLinkDoneButton'
							           }),
							           CKEDITOR.dialog.cancelButton( editor, {
							        	   className: 'smartLinkCancelButton'
							           })
							           ],
							contents : [
							            {
							            	id: 'articleTab',
							            	label: KnowledgeCKEditor.getLabelSmartLinkDialogTitle(),
							            	elements: [
							            	           {
							            	        	   type: 'hbox',
							            	        	   widths: ['33%'],
							            	        	   children: [
																{
																	   type: 'select',
																	   className: 'smartLinkFilter smartLinkFilterLanguage',
																	   id: 'languageFilterLinkRef',
																	   title: 'Language',
																	   items: [],
																	   onLoad: function() {
																		   findParentTd(this.getElement().$).style.float = "left";
																	   },
																	   setup: loadLanguages
																},
																{
																	   type: 'select',
																	   className: 'smartLinkFilter smartLinkFilterPublishStatus',
																	   id: 'publishStatusFilterLinkRef',
																	   title: 'Publish Status',
																	   items: [],
																	   onLoad: function() {
																		   findParentTd(this.getElement().$).style.float = "left";
																	   },
																	   setup: loadPublishStatuses
																}
							            	        	   ]
							            	           },
							            	           {
															   type: 'html',
															   html: '<span class="searchFormLinkRef"><input type="text" class="searchFieldLinkRef cke_dialog_ui_input_text smartLinkInput" placeholder="' +
															   			KnowledgeCKEditor.getLabelSmartLinkSearchArticle() + '" maxlength="200" onkeypress="if (event && event.keyCode == 13) { Sfdc.get(\'#' + uniqueDialogName + ' .hiddenSearchButton input\').click(); return false;} return true;"/><a href="javascript:Sfdc.get(\'#' + uniqueDialogName + ' .hiddenSearchButton input\').click(); void(0)" class="searchButtonLinkRef">&nbsp</a></span>'
							            	           },
							            	           {
							            	        	   type: 'text',
							            	        	   id: 'hiddenSearchButton',
							            	        	   className: 'hiddenSearchButton',
							            	        	   label: 'searchArticle',
							            	        	   onClick: searchArticle,
							            	        	   onLoad: function () {
							            	        		   findParentTd(this.getElement().$).style.display = "none";
							            	        	   }
							            	           },
							            	           {
							            	        	   type: 'html',
							            	        	   html: '<div class="resultsLinkRef"></div>'
							            	           },
							            	           {
							            	        	   type: 'hbox',
							            	        	   widths: ['70%'],
							            	        	   children: [
									            	           {
									            	        	   type: 'text',
									            	        	   id: 'pathLinkRef',
									            	        	   className: 'smartLinkPathInput',
									            	        	   label: KnowledgeCKEditor.getLabelSmartLinkSelectedArticle(),
									            	        	   validate: CKEDITOR.dialog.validate.notEmpty(KnowledgeCKEditor.getLabelSmartLinkNoArticleSelected()),
									            	        	   setup: function(data) {
									            	        		   if ( data.url ) {
																			this.setValue( data.url );
									            	        		   }
									            	        		   if (data.title) {
									            	        			   this.getInputElement().$.setAttribute("data-url-title", data.title);
									            	        		   }
									            	        	   },
									            	        	   required: true,
									            	        	   onLoad: function() {
									            	        		   this.disable();
									            	        	   },
									            	        	   commit: function(data) {
									            	        		   data.url = this.getValue();
									            	        		   data.urlTitle = this.getInputElement().$.getAttribute("data-url-title");
									            	        	   }
									            	           },
									            	           {
									            	        	   type: 'html',
									            	        	   html: '<span class="goToArticleButton"><a class="cke_dialog_ui_button" onclick="linkPath = Sfdc.get(\'.smartLinkPathInput input\').value; window.open(linkPath);">' + KnowledgeCKEditor.getLabelGoToArticle() + '</a></input>'
									            	           }
									            	       ]
							            	           }
							            	]
							            },
							            {
							            	id: 'targetTab',
							            	label: commonLang.target,
							            	elements: [
							            	           {
							            	        	   type: 'select',
							            	        	   id: 'targetLinkRef',
							            	        	   label: commonLang.target,
							            	        	   items: [
							            	        	           [commonLang.notSet, ''],
							            	        	           [linkLang.targetFrame, 'customTarget'],
							            	        	           [commonLang.targetNew, '_blank'],
							            	        	           [commonLang.targetTop, '_top'],
							            	        	           [commonLang.targetSelf, '_self'],
							            	        	           [commonLang.targetParent, '_parent']
							            	        	   ],
							            	        	   onChange : targetChanged,
							            	        	   setup: function(data) {
							            	        		   if ( data.target )
																	this.setValue( data.target.type);
							            	        		   targetChanged.call(this);
							            	        	   },
							            	        	   commit: function(data) {
							            	        		   data.target = this.getValue();
							            	        	   }
							            	           },
							            	           {
							            	        	   type: 'text',
							            	        	   id: 'targetFrame',
							            	        	   label: linkLang.targetFrameName,
							            	        	   setup: function(data) {
							            	        		   if ( data.target )
							            	        			   this.setValue( data.target.name);
							            	        	   },
							            	        	   commit: function(data) {
											            		data.targetFrame = this.getValue();
							            	        	   }
											            }
							            	]
							            }
							],
							onLoad: function() {
								var dialog = this;
								var dialogDomElement = dialog.parts.dialog.$;
								dialogDomElement.className += ' ' + dialogName;
								dialogDomElement.id = uniqueDialogName;
								resultsDiv = Sfdc.get("#" + uniqueDialogName + " .resultsLinkRef");
								loadingScreen = new LoadingScreen(resultsDiv, '&nbsp;&nbsp;','smartLinkLoadDiv');
							},
							onShow: function() {
								var editor = this.getParentEditor(),
								selection = editor.getSelection(),
								element = null;
								uniqueDialogName = editor.id + '_' + dialogName;
								
								var parseLink = function( editor, element ) {
									var selectableTargets = /^(_(?:self|top|parent|blank))$/;
									var href = ( element  && ( element.data( 'cke-saved-href' ) || element.getAttribute( 'href' ) ) ) || '';
									var title = ( element && (element.$.text)) || '';
									var retval = {};
									
									// Load href from link
									if (href && href.length > 0)
									{
										retval.url = href;
									}
									
									// Load title from link
									if (title && title.length > 0) {
										retval.title = title;
									}
									// Load target
									if ( element )
									{
										var target = element.getAttribute( 'target' );
										retval.target = {};

										if (target) {
											var targetMatch = target.match( selectableTargets );
											if ( targetMatch ) {
												retval.target.type = target;
												retval.target.name = '';
											}
											else
											{
												retval.target.type = 'customTarget';
												retval.target.name = target;
											}
										}
										else {
											retval.target.type = '';
											retval.target.name = '';
										}
									}
									
									// Record down the selected element in the dialog.
									this._.selectedElement = element;
									return retval;
								}

								// Fill in all the relevant fields if there's already one link selected.
								if ( ( element = CKEDITOR.plugins.link.getSelectedLink( editor ) ) && element.hasAttribute( 'href' ) )
									selection.selectElement( element );
								else
									element = null;
								this.setupContent( parseLink.apply( this, [ editor, element ] ) );
								clearSearchResults();
								Sfdc.get('#' + uniqueDialogName + ' .resultsLinkRef').innerHTML = defaultLinkResultsDivHtml;
								Sfdc.get('#' + uniqueDialogName + ' .searchFieldLinkRef').value = '';
							},
							onOk: function() {
								var dialog = this,
									data = {},
									link = editor.document.createElement('a');
								this.commitContent(data);
								link.setAttribute('href', data.url);
								link.setAttribute('data-cke-saved-href', data.url);
								if (data.target == 'customTarget' && data.targetFrame.length > 0) {
									link.setAttribute('target', data.targetFrame);
								}
								else if (data.target.length > 0 && data.target != 'customTarget') {
									link.setAttribute('target', data.target);
								}
								/* 
								 * data.urlTitle SHOULD already be escaped once (the article titles retrieved from refreshArticleListCommand are escaped). However,
								 * it is possible to manipulate the 'data-url-title' attribute via Chrome Inspector, so we need to escape again just in case
								 */
								var doubleEscapedTitle = Sfdc.String.escapeToHtml(data.urlTitle);
								// in the case that we are indeed double-escaped, then we will have only escaped the ampersands - so restore the ampersand character!
								var singleUnescapedTitle = doubleEscapedTitle.replace(/&amp;/g, '&');
								link.setHtml(singleUnescapedTitle);
								
								// delete previous element, if we had one
								if (this._.selectedElement) {
									var selection = editor.getSelection();
									if (selection.getType() == CKEDITOR.SELECTION_TEXT) {
										var selectedText;
									    if (CKEDITOR.env.ie) {
									        selection.unlock(true);
									        selectedText = selection.getNative().createRange().htmlText;
									    } else {
									        selectedText = selection.getNative();
									    }
									    selectedText.deleteFromDocument();
									}									
								}
								editor.insertElement(link);
								
								
							}
						};

					});
				}
		});
})();