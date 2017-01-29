'use strict';

var fb = (function(){
	firebase.initializeApp({
		databaseURL: 'ws://127.0.1:5000'
	});
	return firebase.database();
})();

var ConvoHeaderList = Vue.extend({
	data: function(){
		return {
			newConvoHeader: {}
		}
	},
	methods: {
		resetNew: function(){
			var convoHeaderList = this;
			convoHeaderList.newConvoHeader = ConvoHeader.options.data();
		},
		create: function(){
			var convoHeaderList = this;
			convoHeaderList.$firebaseRefs.all.push(convoHeaderList.newConvoHeader);
			convoHeaderList.resetNew();
		},
		destroy: function(convoHeader){
			var convoHeaderList = this;
			convoHeaderList.$firebaseRefs.all.child(convoHeader['.key']).remove();
		}
	},
	created: function(){
		var convoHeaderList = this;
		convoHeaderList.resetNew();
	}
});

var ConvoHeader = Vue.extend({
	data: function(){
		return {
			title: ''
		}
	}
});

document.addEventListener('DOMContentLoaded', function(){
	var convoList = new ConvoHeaderList({
		el: '#convoheaders',
		firebase: {
			all: fb.ref('/convoheaders')
		}
	});

	var console = new Vue({
		el: '#console',
		firebase: {
			all: fb.ref('/')
		}
	});
});
