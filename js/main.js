

$(document).ready(function(){
    window.App = {
	Models: {},
	Views: {},
	Collections: {}
    };
    window.template = function(id){ return _.template( $('#' + id).html() );}
    window.urlBuilder = function(params){
	var baseURL =  'http://cuny-first-papi.herokuapp.com/sections'
	
	if ( _.isEmpty(params) ) {
	    return baseURL+"?verbose=true";
	}
	
	var finalURL = baseURL+"?";

	_.forEach(params, function(value, key) {
	    if(!_.isEmpty(value)){
		finalURL = finalURL + key + "=" + value + "&"
	    }
	});
	
	return finalURL+"verbose=true";
    }
    
    App.Models.Section = Backbone.Model.extend();
    
    App.Collections.Sections = Backbone.Collection.extend({
    	model: App.Models.Section
    });


    App.Views.Section = Backbone.View.extend({
    	tagName: "li",
    	template: template('sectionTemplate'),

    	render: function(){
    	    this.$el.html(this.template(this.model.toJSON()));
	    return this;

    	}
    });

    App.Views.SectionList = Backbone.View.extend({
    	tagName: "ul",
    	render: function(){
    	    this.collection.each(function(model){
    		var view = new App.Views.Section({model: model});
    		view.render();
    		this.$el.append(view.el);
		return this;
		
    	    }, this);

    	}

    });

    var params = {};
    
    $("#department_id_select").on("change", function() {
	params["department_id"] = $( "#department_id_select option:selected" ).val();
    });

    $("#end_before_select").on("change", function() {
	var end_before_val = $( "#end_before_select option:selected" ).val();
	params["end_before"] = end_before_val;
    });
    
    $("#end_after_select").on("change", function() {
	var end_after_val = $( "#end_after_select option:selected" ).val();
	params["end_after"] = end_after_val;
    });

    $("#start_before_select").on("change", function() {
	var start_before_val = $( "#start_before_select option:selected" ).val();
	params["start_before"] = start_before_val;
    });
    
    $("#start_after_select").on("change", function() {
	var start_after_val = $( "#start_after_select option:selected" ).val();
	params["start_after"] = start_after_val;
    });



    $("#searchOptions").submit(function(event){
	var url = urlBuilder(params);
	console.log(url);

	sectionCollection = new App.Collections.Sections();
	sectionCollection.url = url;
	sectionCollection.fetch();
	sectionListView = new App.Views.SectionList({collection: sectionCollection});
	
	$.when( sectionCollection.fetch() ).done(function(){
	    console.log(sectionCollection.length);
	    sectionListView.render(); 
	    $("#app").append(sectionListView.$el);
	}).fail(function(){ alert("failed to load from API"); });

	event.preventDefault();
	
    });

});










