

$(document).ready(function(){
    window.App = {
	Models: {},
	Views: {},
	Collections: {}
    };
    window.template = function(id){ return _.template( $('#' + id).html() );}
    window.urlBuilder = function(params){
	// var baseURL = 'http://localhost:3000/sections'
	var baseURL = 'http://cuny-first-papi.herokuapp.com/sections'
	
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
    
//COLLECTION    
    App.Collections.Sections = Backbone.Collection.extend({
    	model: App.Models.Section,
	// initialize: function(){
	    // this.on('remove', this.hideModel);
	// },

	hideModel: function(model){
	    model.trigger('hide');
	    console.log("hiding");
	}
    });

//ITEM VIEW
    App.Views.Section = Backbone.View.extend({
    	tagName: "li",
    	template: template('sectionTemplate'),
	
	initialize: function(){
	    this.model.on('hide', function(){console.log(this.el);}, this);
	    this.model.on('hide', this.remove, this);

	},

    	render: function(){
    	    this.$el.html(this.template(this.model.toJSON()));
	    return this;

    	}
    });

//COLLECTION VIEW
    App.Views.SectionList = Backbone.View.extend({
    	tagName: "ul",
    	render: function(){
    	    this.collection.each(function(model){
    		var view = new App.Views.Section({model: model});
    		view.render();
    		this.$el.append(view.el);
		return this;
		
    	    }, this);

    	},
	wipe: function(){
	    console.log("The collection started with length "+this.collection.length)
	    this.collection.each(function(model){
		console.log("removing model "+ model.get("id"));
		// this.collection.remove(model);
		this.collection.hideModel(model);
	    },this);
	    this.collection.reset();
	    console.log("wiped");
	    console.log("The collection is now of length "+this.collection.length)

	}

    });

    var sectionCollection = new App.Collections.Sections();
    var sectionListView = new App.Views.SectionList({collection: sectionCollection});
    // window.sectionCollection = new App.Collections.Sections();
    // window.sectionListView = new App.Views.SectionList({collection: sectionCollection});

    var params = {};

//NEW SEARCH BUTTON    
    $("#new_search").on("click", function(){
	console.log("Begin wipe");
	sectionCollection.each(function(model){console.log(model.get("id"));})
	sectionListView.wipe();
	$("#new_search").addClass("hidden");
	$("#searchOptions").show();
    });


    
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

	sectionCollection.url = url;
	sectionCollection.fetch();
	
	
	$("#searchOptions").hide();
	$("#wait").removeClass("hidden");
	$.when( sectionCollection.fetch() ).done(function(){
	    console.log("sectionCollection is of length "+sectionCollection.length);
	    sectionListView.render(); 
	    $("#wait").addClass("hidden");
	    $("#new_search").removeClass("hidden");
	    $("#app").append(sectionListView.$el);
	}).fail(function(){ alert("failed to load from API"); });

	event.preventDefault();
	
    });

});










