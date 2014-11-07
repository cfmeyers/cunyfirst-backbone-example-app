

$(document).ready(function(){
    window.App = {
	Models: {},
	Views: {},
	Collections: {}
    };
    window.template = function(id){ return _.template( $('#' + id).html() );}
    window.urlBuilder = function(params){
	var baseURL = 'http://localhost:3000/sections'
	// var baseURL = 'http://cuny-first-papi.herokuapp.com/sections'
	
	if ( _.isEmpty(params) ) {
	    return baseURL+"?verbose=true";
	}
	
	var finalURL = baseURL+"?";

	_.forEach(params, function(value, key) {
	    if(!_.isEmpty(value)){
		finalURL = finalURL + key + "=" + value + "&";
	    }
	});
	
	return finalURL+"verbose=true";
    }
    
    App.Models.Section = Backbone.Model.extend();
    
//COLLECTION    
    App.Collections.Sections = Backbone.Collection.extend({
    	model: App.Models.Section,

	hideModel: function(model){
	    model.trigger('hide');
	}
    });

//ITEM VIEW: SEARCH RESULT
    App.Views.Section = Backbone.View.extend({
    	tagName: "tr",
    	template: template('sectionSearchResultTemplate'),
	
	initialize: function(){
	    _.bindAll(this, 'addToShoppingCart');
	    this.model.on('hide', this.remove, this);
	    this.$el.on('click','button', this.addToShoppingCart);
	},

	addToShoppingCart: function(){
	    sectionShoppingCartCollection.add(this.model);
	    $("#shoppingCart").removeClass("hidden");
	},

    	render: function(){
    	    this.$el.html(this.template(this.model.toJSON()));
	    return this;

    	}
    });

//COLLECTION VIEW: SEARCH RESULT
    App.Views.SectionList = Backbone.View.extend({
    	tagName: "tbody",
    	render: function(){
    	    this.collection.each(function(model){
    		var view = new App.Views.Section({model: model});
    		view.render();
    		this.$el.append(view.el);
		return this;
		
    	    }, this);

    	},
	wipe: function(){
	    this.collection.each(function(model){
		this.collection.hideModel(model);
	    },this);
	    this.collection.reset();

	}

    });
    
//ITEM VIEW: SHOPPING CART
    App.Views.SectionShoppingCartRow = Backbone.View.extend({
    	tagName: "tr",
    	template: template('sectionCartItemTemplate'),
	
	initialize: function(){
	    this.model.on('hide', this.remove, this);
	},

    	render: function(){
    	    this.$el.html(this.template(this.model.toJSON()));
	    return this;

    	}
    });

   
//COLLECTION VIEW: SHOPPING CART
    App.Views.SectionShoppingCartTable = Backbone.View.extend({
	
    	tagName: "tbody",
	initialize: function(){
	    this.collection.on("add", this.addOne, this);
	},
	
    	render: function(){
    	    this.collection.each(this.addOne, this);
    	},
	
	addOne: function(model){
    	    var view = new App.Views.SectionShoppingCartRow({model: model});
	    view.render();
	    this.$el.append(view.el);
	}
	
    });


    var sectionSRCollection = new App.Collections.Sections();
    var sectionSRTableView = new App.Views.SectionList({collection: sectionSRCollection});
    var sectionShoppingCartCollection = new App.Collections.Sections();
    var sectionShoppingCartTableView = new App.Views.SectionShoppingCartTable({collection: sectionShoppingCartCollection});
    var params = {};

//NEW SEARCH BUTTON    
    $("#new_search").on("click", function(){
	sectionSRTableView.wipe();
	$("#new_search").addClass("hidden");
	$("#searchResults").addClass("hidden");
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

	sectionSRCollection.url = url;
	sectionSRCollection.fetch();
	
	
	$("#searchOptions").hide();
	$("#wait").removeClass("hidden");
	$.when( sectionSRCollection.fetch() ).done(function(){
	    sectionSRTableView.render();
	    sectionShoppingCartTableView.render();
	    $("#wait").addClass("hidden");
	    $("#new_search").removeClass("hidden");
	    $("#searchResults").removeClass("hidden");
	    $("#searchResultsTable").append(sectionSRTableView.$el);
	    $("#shoppingCartTable").append(sectionShoppingCartTableView.$el);
	}).fail(function(){ alert("failed to load from API"); });

	event.preventDefault();
	
    });

});










