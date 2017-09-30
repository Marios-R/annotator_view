/*
Annotator view panel Plugin v1.0 (https://https://github.com/albertjuhe/annotator_view/)
Copyright (C) 2014 Albert Juhé Brugué
License: https://github.com/albertjuhe/annotator_view/License.rst

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  //constants
  var IMAGE_DELETE =  '../src/img/icono_eliminar.png',
  IMAGE_DELETE_OVER = '../src/img/papelera_over.png',
  SHARED_ICON = '../src/img/shared-icon.png';
  FILTER_ICON = '../src/img/filter.svg';
  ANNOTATIONS_ICON = '../src/img/annotator.svg';

  Annotator.Plugin.AnnotatorViewer = (function(_super) {
    __extends(AnnotatorViewer, _super);

    AnnotatorViewer.prototype.events = {
      'annotationsLoaded': 'onAnnotationsLoaded',
      'annotationCreated': 'onAnnotationCreated',
      'annotationDeleted': 'onAnnotationDeleted',
      'annotationUpdated': 'onAnnotationUpdated',
      ".annotator-viewer-delete click": "onDeleteClick",
      ".annotator-viewer-edit click": "onEditClick",
      ".annotator-viewer-delete mouseover": "onDeleteMouseover",
      ".annotator-viewer-delete mouseout": "onDeleteMouseout",
    };


    AnnotatorViewer.prototype.field = null;

    AnnotatorViewer.prototype.input = null;

    AnnotatorViewer.prototype.options = {
      AnnotatorViewer: {}
    };


    function AnnotatorViewer(element, options) {
      this.onAnnotationCreated = __bind(this.onAnnotationCreated, this);
      this.onAnnotationUpdated = __bind(this.onAnnotationUpdated, this);
      this.onDeleteClick = __bind(this.onDeleteClick, this);
      this.onEditClick = __bind(this.onEditClick, this);
      this.onDeleteMouseover = __bind(this.onDeleteMouseover, this);
      this.onDeleteMouseout = __bind(this.onDeleteMouseout, this);
      this.onCancelPanel = __bind(this.onCancelPanel,this);
      this.onSavePanel = __bind(this.onSavePanel,this);
	  this.updateList = __bind(this.updateList,this);
	  //this.onCreate = __bind(this.onCreate,this);
	  
      AnnotatorViewer.__super__.constructor.apply(this, arguments);

      $( "body" ).append( this.createAnnotationPanel() );

      $(".container-anotacions").toggle();
      $("#annotations-panel").click(function(event) {
        $(".container-anotacions").toggle("slide");       
      });
     

    };

    AnnotatorViewer.prototype.pluginInit = function() {
      if (!Annotator.supported()) {
        return;
      }
      
      $('#type_share').click(this.onFilter);
      $('#type_own').click(this.onFilter);
	  var plugin = this;
     this.annotator
			.subscribe("onTagsFilterCheck", function(filteredoutAnn,resultingAnn,tagFilters) {
				plugin.updateList(resultingAnn,tagFilters);
			});
			/*$('<br><div id="generic-tools" style="display:inline-block;"><div>').prependTo('.container-anotacions');
			$('<a href="#all" class="annotator-panel-all" style="margin:5px 0px 5px 0px;">All Annotations</a>').prependTo('#generic-tools');
			$('<a href="#create" class="annotator-panel-create" style="margin:5px 5px 5px 0px;">Create</a>').prependTo('#generic-tools').bind("click", this.onCreate);
			
		$(document).unbind({
                mouseup: this.annotator.checkForEndSelection,
                mousedown: this.annotator.checkForStartSelection
        });*/
    };
	
	/*AnnotatorViewer.prototype.onCreate = function(){
		$(document).bind({
                mouseup: this.annotator.checkForEndSelection,
                mousedown: this.annotator.checkForStartSelection
        });
	}*/
	
	AnnotatorViewer.prototype.updateList = function(annotations,tagFilters){
		this.emptyList();
		this.onAnnotationsLoaded(annotations);
		$('#count-anotations').text($(".container-anotacions").find('.annotator-marginviewer-element').length );
		$('#count-tag-filters').text(tagFilters.length);
	};

    /*
    Check the checkboxes filter to search the annotations to show.
    Shared annotations have the class shared
    My annotations have the me class
    */
    AnnotatorViewer.prototype.onFilter = function(event) {
      var annotations_panel = $(".container-anotacions").find('.annotator-marginviewer-element');
      $(annotations_panel).hide();  

      var class_view = "";
     
      var checkbox_selected = $('li.filter-panel').find('input:checked'); 
      if (checkbox_selected.length > 0) {
          $('li.filter-panel').find('input:checked').each(function () {
            class_view += $(this).attr('rel') + '.';
          });     
          $('.container-anotacions > li.' + class_view.substring(0,class_view.length-1)).show();
      } else {
        $(annotations_panel).show();   
      }
      

    };

    AnnotatorViewer.prototype.onDeleteClick = function(event) {
      event.stopPropagation();
      if(confirm("Do you want to delete this annotation?")) {
        this.click;
        return this.onButtonClick(event, 'delete');
      }
      return false;
    };

     AnnotatorViewer.prototype.onEditClick = function(event) {
      event.stopPropagation();
      return this.onButtonClick(event, 'edit');     
    };

    AnnotatorViewer.prototype.onButtonClick = function(event, type) {
      var item;
      //item contains all the annotation information, this information is stored in an attribute called data-annotation.
      item = $(event.target).parents('.annotator-marginviewer-element');
      if (type=='delete') return this.annotator.deleteAnnotation(item.data('annotation'));
      if (type=='edit') { //We want to transform de div to a textarea
        this.areaEditor(item);
      }
    };

    //Textarea editor controller
    AnnotatorViewer.prototype.areaEditor = function(item) {
		var annotator_textArea = item.find('div.anotador_text');
		
		var annotator_tagsArea = item.find('div.anotador_tags');
        //First we have to get the text, if no, we will have an empty text area after replace the div 
        if ($('li#annotation-'+item.data('annotation').id).find('textarea.panelTextArea').length==0) {
          var content = item.data('annotation').text;
		  var tags = item.data('annotation').tags;
          var editableTextArea = $("<textarea id='textarea-"+item.data('annotation').id+"'' class='panelTextArea'>"+content+"</textarea>");
		  var editableTagsArea = $("<input id='tagsarea-"+item.data('annotation').id+"'' class='panelTagsArea' value='"+tags.toString().replace(/,/g,' ')+"'/>");
          var annotationCSSReference = 'li#annotation-'+item.data('annotation').id;

          annotator_textArea.replaceWith(editableTextArea);
		  annotator_tagsArea.replaceWith(editableTagsArea);
          editableTextArea.css('height',editableTextArea[0].scrollHeight + 'px');
		  editableTagsArea.css('height',editableTextArea[0].scrollHeight + 'px');
          editableTextArea.blur(); //Textarea blur
		  editableTagsArea.blur();
          if (typeof(this.annotator.plugins.RichEditor)!= 'undefined') {
            this.tinymceActivation(annotationCSSReference +'  textarea#textarea-'+item.data('annotation').id );
          }
          $('<div class="annotator-textarea-controls annotator-editor"></div>').insertAfter(editableTagsArea); 
          var control_buttons = $( annotationCSSReference + ' .annotator-textarea-controls');
          $('<a href="javascript:void(0);" class="annotator-panel-save">Save</a>').appendTo(control_buttons).bind("click",{annotation:item.data('annotation')},this.onSavePanel);
          $('<a href="javascript:void(0);" class="annotator-panel-cancel">Cancel</a>').appendTo(control_buttons).bind("click", {annotation:item.data('annotation')},this.onCancelPanel);
        }
    };

      AnnotatorViewer.prototype.tinymceActivation = function(selector) {
            tinymce.init({
              selector: selector,
              plugins: "media image insertdatetime link paste",
              menubar: false,
              statusbar: false,             
              toolbar_items_size: 'small',
              extended_valid_elements : "",
              toolbar: "undo redo bold italic alignleft aligncenter alignright alignjustify | link image media"
            });
    }

    //Event triggered when save the content of the annotation
    AnnotatorViewer.prototype.onSavePanel = function(event) {
  
      var current_annotation = event.data.annotation;
      var textarea = $('li#annotation-'+current_annotation.id).find("#textarea-"+current_annotation.id+".panelTextArea");
	  var tagsarea = $('li#annotation-'+current_annotation.id).find("#tagsarea-"+current_annotation.id+".panelTagsArea");
      if (typeof(this.annotator.plugins.RichEditor)!='undefined') {
        current_annotation.text = tinymce.activeEditor.getContent();
        tinymce.remove("#textarea-"+current_annotation.id);
        tinymce.activeEditor.setContent(current_annotation.text);
      } else {
        current_annotation.text = textarea.val();  

        
     }
	 string = $.trim(tagsarea.val());
        current_annotation.tags = [];
        if (string) {
            current_annotation.tags = string.split(/\s+/)
        }
      var anotation_reference = "annotation-"+current_annotation.id;
      $('#'+anotation_reference).data('annotation', current_annotation);     
    
      this.annotator.updateAnnotation(current_annotation);      
    };

     //Event triggered when save the content of the annotation
    AnnotatorViewer.prototype.onCancelPanel = function(event) {
      var current_annotation = event.data.annotation;
      var styleHeight = 'style="height:12px"';
      if (current_annotation.text.length>0) styleHeight = '';

      if (typeof(this.annotator.plugins.RichEditor)!='undefined') {
        tinymce.remove("#textarea-"+current_annotation.id);
     
        var textAnnotation = '<div class="anotador_text" '+styleHeight+'>' + current_annotation.text + '</div>';
        var anotacio_capa =  '<div class="annotator-marginviewer-text">'+ textAnnotation  + '</div>';
        var textAreaEditor = $('li#annotation-'+current_annotation.id + ' > .annotator-marginviewer-text');
       
        textAreaEditor.replaceWith(anotacio_capa);
		var tagsarea = $('li#annotation-'+current_annotation.id).find("input.panelTagsArea");
        this.normalEditor(current_annotation,tagsarea);
      } else {
        var textarea = $('li#annotation-'+current_annotation.id).find('textarea.panelTextArea');
		var tagsarea = $('li#annotation-'+current_annotation.id).find("input.panelTagsArea");
        this.normalEditor(current_annotation,textarea,tagsarea);
      }

    };

       //Annotator in a non editable state
    AnnotatorViewer.prototype.normalEditor = function(annotation) {
		for (i = 1; i < arguments.length; i++) {
			if(arguments[i].hasClass('panelTagsArea')){
				var tagsAnnotation = annotation.tags;
				var tagspans = '';
				$.each(tagsAnnotation,function(){tagspans+='<span class="annotator-tag">'+this+'</span>'});
				arguments[i].replaceWith('<div class="anotador_tags annotator-tags" style="margin-bottom: 0px;">'+tagspans+'</div>');
			}
			else if(arguments[i].hasClass('panelTextArea')){
				var textAnnotation = this.removeTags('iframe',annotation.text);
				arguments[i].replaceWith('<div class="anotador_text">'+textAnnotation+'</div>');
			}
		}
		var buttons = $('li#annotation-'+annotation.id).find('div.annotator-textarea-controls');
		buttons.remove();
    };

   

     AnnotatorViewer.prototype.onDeleteMouseover = function(event) {
       $(event.target).attr('src',IMAGE_DELETE_OVER);
    };

     AnnotatorViewer.prototype.onDeleteMouseout = function(event) {
      $(event.target).attr('src', IMAGE_DELETE);      
    };

    AnnotatorViewer.prototype.onAnnotationCreated = function(annotation) { 
      this.createReferenceAnnotation(annotation);
      $('#count-anotations').text($(".container-anotacions").find('.annotator-marginviewer-element').length );
	  /*$(document).unbind({
                mouseup: this.annotator.checkForEndSelection,
                mousedown: this.annotator.checkForStartSelection
        });*/

    };

    AnnotatorViewer.prototype.onAnnotationUpdated = function(annotation) {

      $( "#annotation-"+annotation.id ).html( this.mascaraAnnotation(annotation) );     
 
    };

    AnnotatorViewer.prototype.onAnnotationsLoaded = function(annotations) {
      var annotation;
      $('#count-anotations').text( $(".container-anotacions").find('.annotator-marginviewer-element').length );
      if (annotations.length > 0) {
        for(i=0, len = annotations.length; i < len; i++) {
          annotation = annotations[i];
          this.createReferenceAnnotation(annotation);   
        }
        
      }
      
    };

    
    AnnotatorViewer.prototype.onAnnotationDeleted = function(annotation) {
      
      $( "li" ).remove( "#annotation-"+annotation.id );      
      $('#count-anotations').text( $(".container-anotacions").find('.annotator-marginviewer-element').length );
      
    };

    AnnotatorViewer.prototype.mascaraAnnotation = function(annotation) {  
  
      if (!annotation.data_creacio) annotation.data_creacio = $.now();
	  
	  var anntags = '<div class="anotador_tags annotator-tags" style="margin-bottom: 0px;">'
	  $.each(annotation.tags,function(){
		  anntags+='<span class="annotator-tag">'+this+'</span>';
	  });
	  anntags+='</div>';
      var shared_annotation = "";      
      var class_label = "label";
      var delete_icon = "<img ../src=\""+IMAGE_DELETE+"\" class=\"annotator-viewer-delete\" title=\""+ "Delete" +"\" style=\" float:right;margin-top:3px;;margin-left:3px\"/><img ../src=\"../src/img/edit-icon.png\"   class=\"annotator-viewer-edit\" title=\"Edit\" style=\"float:right;margin-top:3px\"/>";
      
      if (annotation.estat==1 || annotation.permissions.read.length===0 ) {
        shared_annotation = "<img ../src=\""+SHARED_ICON+"\" title=\""+ "Shared" +"\" style=\"margin-left:5px\"/>"
      }

      if (annotation.propietary==0) {
        class_label = "label-compartit";
        delete_icon="";
        }


      var textAnnotation = annotation.text;
      var annotation_layer =  '<div class="annotator-marginviewer-text">';
      annotation_layer += '<div class="anotador_text">'+  textAnnotation  + '</div></div><div class="annotator-marginviewer-tags">'+anntags+'</div><div class="annotator-marginviewer-date">'+ $.format.date(annotation.data_creacio, "dd/MM/yyyy HH:mm:ss") + '</div><div class="annotator-marginviewer-quote">'+ annotation.quote + '</div><div class="annotator-marginviewer-footer"><span class="'+class_label+'">' + annotation.user + '</span>'+shared_annotation+delete_icon+'</div>';
      


      return annotation_layer;
    };

    AnnotatorViewer.prototype.createAnnotationPanel = function(annotation) {     
      var checboxes = '<label class="checkbox-inline"><input type="checkbox" id="type_own" rel="me"/>My annotations</label><label class="checkbox-inline">  <input type="checkbox" id="type_share" rel="shared"/>Shared</label>';
	  var filterTagsTab = '<span  style="padding:5px;background-color:#ddd;position: absolute; top:10em;left: -25px; width: 150px; height: 45px;cursor:pointer" title="'+ "Active tag filters" +'" ><img src="'+FILTER_ICON+'" width="20px"><br><span class="label-counter" style="display: block;width:20px;text-align:center;" id="count-tag-filters">0</span></span>'
      var viewAnnotations= '<span  style="padding:5px;background-color:#ddd;position: absolute; top:10em;left: -50px; width: 150px; height: 45px;cursor:pointer" title="'+ "View annotations" +'" ><img src="'+ANNOTATIONS_ICON+'" width="20px"><br><span class="label-counter" style="display: block;width:20px; text-align:center;" id="count-anotations">0</span></span>'
	  var annotation_layer =  '<div  class="annotations-list-uoc" style="background-color:#ddd;"><div id="annotations-panel">'+viewAnnotations+filterTagsTab+'</div><div id="anotacions-uoc-panel" style="height:80%"><ul class="container-anotacions"><li class="filter-panel"><!--'+checboxes+'--></li></ul></div></div>';

      return annotation_layer;
    };

   
    AnnotatorViewer.prototype.createReferenceAnnotation = function(annotation) {     
     var anotation_reference = null;
     var data_owner = "me";
     var data_type = "";
     var myAnnotation=false;

      if (annotation.id != null) {
        anotation_reference = "annotation-"+annotation.id;
      } else {
        annotation.id = this.uniqId();
        //We need to add this id to the text anotation
        $element = $('span.annotator-hl:not([id])');
        if ($element) {
          $element.prop('id',annotation.id);
        }
        anotation_reference = "annotation-"+annotation.id;
      }

      if (annotation.estat==1 || annotation.permissions.read.length===0 ) {
        data_type = "shared";
       
      }
      if (annotation.propietary==0) {
        data_owner = "";
      } else {
         myAnnotation=true;
      }

      var annotation_layer =  '<li class="annotator-marginviewer-element '+data_type+' '+data_owner+'" id="'+anotation_reference +'">'+this.mascaraAnnotation(annotation)+'</li>';
      //var malert = i18n_dict.anotacio_lost

      anotacioObject = $(annotation_layer).appendTo('.container-anotacions').click(function(event) {
          var viewPanelHeight = jQuery(window).height();
          var annotation_reference = annotation.id;

          $element= jQuery("#"+annotation.id); 
          if (!$element.length) {
            $element= jQuery("#"+annotation.order);   
            annotation_reference = annotation.order; //If exists a sorted annotations we put it in the right order, using order attribute
          }

          if ($element.length) {
            elOffset = $element.offset();
            $(this).children(".annotator-marginviewer-quote").toggle();
            $('html, body').animate({
              scrollTop: $("#"+annotation_reference).offset().top - (viewPanelHeight/2)
            }, 2000);
          } 
      })
      .mouseover(function() {
        $element = jQuery("span[id="+annotation.id+"]");
        if ($element.length) {
			$element.addClass('annotator-hl-temporary');
        }
      })
      .mouseout(function() {
        $element = jQuery("span[id="+annotation.id+"]");
        if ($element.length) {
			$element.removeClass('annotator-hl-temporary');
        }
      });


      
      //Adding annotation to data element for delete and link
      $('#'+anotation_reference).data('annotation', annotation);
      $(anotacioObject).fadeIn('fast');
    };

    AnnotatorViewer.prototype.uniqId = function() {
      return Math.round(new Date().getTime() + (Math.random() * 100));
    } 

     //Strip content tags
    AnnotatorViewer.prototype.removeTags = function(striptags, html) { 
      striptags = (((striptags || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); 
      var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
      
      return html.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
        return html.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
      });
    };  
	
	
	//Emty annotations
	AnnotatorViewer.prototype.emptyList = function() {
      
      $( "li" ).remove('.annotator-marginviewer-element');      
	  $('#count-anotations').text( 0 );
      
    };
  

    return AnnotatorViewer;

  })(Annotator.Plugin);

}).call(this);
