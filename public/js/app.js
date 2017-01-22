'use strict';

var fb = (function(){
	firebase.initializeApp({
		databaseURL: 'ws://127.0.1:5000'
	});
	return firebase.database();
})();

var Item = (function(){
	var pub = {};
	var ref = {};
	var vue = new Vue({
		data: {
			all: [],
			blank: {}
		},
		methods: {
			create: function(){
				var vue = this;
				ref.push(vue.blank);
				vue.blank = {};
			},
			destroy: function(item){
				var vue = this;
				ref.child(item['.key']).remove();
			}
		}
	});

	pub.loadAndMountTo = function(selector){
		ref = fb.ref('/items');
		vue.$bindAsArray('all', ref);
		vue.$mount(selector);
	}
	return pub;
})();

document.addEventListener('DOMContentLoaded', function(){
	Item.loadAndMountTo('#items');
});
