Margin Viewer for Annotator
==================
## Small modifications on view_annotator.js to support tags and tagsfilter.js
---
**The original repo of view_annotator.js**:
https://github.com/albertjuhe/annotator_view

**Requirements**: 
+ jQuery
+ jQuery date format
+ jQuery slim scroll
+ AnnotatorJS
+ Select2

**Changes I've done**:
+ Added tags in the list elements
+ Added a function that clears the list.
+ Set a function to be triggered on event "onTagsFilterCheck" that clears the list and populates it again with the resulting annotations after the filter. 
+ Changed the #annotations-panel a little bit to show counter of annotations and active tag filters

**Notes**:
+ I do not support the categories plugin currently.
+ I've commented out the checkboxes "My annotations" and "Shared" because I have not checked yet how this works. It needs probably modification for it to work with the tags filter which is in the ToDo list. 

**Examples**:

[Example 1](https://marios-r.github.io/annotator_view/example1)
<pre>
                jQuery(function ($) {
					// Customise the default plugin options with the third argument.
                    var annotator = $('body').annotator().annotator().data('annotator');
                    var propietary = 'demoUser';
                    annotator.addPlugin('Permissions', {
                        user: propietary,
                        permissions: {
                            'read': [propietary],
                            'update': [propietary],
                            'delete': [propietary],
                            'admin': [propietary]
                        },
                        showViewPermissionsCheckbox: true,
                        showEditPermissionsCheckbox: false
                    });
					$('body').annotator().annotator('addPlugin', 'Tags');
					$('body').annotator().annotator('addPlugin', 'AnnotatorViewer');
					$('body').annotator().annotator('addPlugin', 'TagsFilter',{element:'.container-anotacions',width:'180px'});
                  
					$('body').annotator().annotator("addPlugin", "Touch");
                
					//Annotation scroll
					$('#anotacions-uoc-panel').slimscroll({height: '100%'});
				});
</pre>

[Example 2](https://marios-r.github.io/annotator_view/example2)
<pre>
                jQuery(function ($) {
					// Customise the default plugin options with the third argument.
                    var annotator = $('body').annotator().annotator().data('annotator');
                    var propietary = 'demoUser';
                    annotator.addPlugin('Permissions', {
                        user: propietary,
                        permissions: {
                            'read': [propietary],
                            'update': [propietary],
                            'delete': [propietary],
                            'admin': [propietary]
                        },
                        showViewPermissionsCheckbox: true,
                        showEditPermissionsCheckbox: false
                    });
					$('body').annotator().annotator('addPlugin', 'RichEditor');
					$('body').annotator().annotator('addPlugin', 'Tags');
					$('body').annotator().annotator('addPlugin', 'AnnotatorViewer');
					$('body').annotator().annotator('addPlugin', 'TagsFilter',{element:'.container-anotacions',width:'180px'});
                  
					$('body').annotator().annotator("addPlugin", "Touch");
                
					//Annotation scroll
					$('#anotacions-uoc-panel').slimscroll({height: '100%'});
				});
</pre>