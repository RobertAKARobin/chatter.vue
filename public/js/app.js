'use strict';

var fb = (function(){
	firebase.initializeApp({
		databaseURL: 'ws://127.0.1:5000'
	});
	return firebase.database();
})();

var List = Vue.extend({
	data: function(){
		return {
			isShown: false,
			blank: {
				content: ''
			}
		}
	},
	methods: {
		create: function(){
			var list = this;
			list.$firebaseRefs.all.push(list.blank);
			list.blank = {};
		},
		destroy: function(item){
			var list = this;
			list.$firebaseRefs.all.child(item['.key']).remove();
		}
	}
});

document.addEventListener('DOMContentLoaded', function(){
	var list = new List({
		el: '#items',
		firebase: {
			all: fb.ref('/items')
		}
	});

	var console = new Vue({
		el: '#console',
		firebase: {
			all: fb.ref('/')
		}
	});
});
