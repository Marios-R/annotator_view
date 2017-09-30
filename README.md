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

[Example 1](https://marios-r.github.io/annotator_view/docs/example1)
<pre>
</pre>

[Example 2](https://marios-r.github.io/annotator_view/docs/example2)
<pre>
</pre>