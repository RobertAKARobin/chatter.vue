'use strict';

var fb = (function(){
	firebase.initializeApp({
		databaseURL: 'ws://127.0.1:5000'
	});
	return firebase.database();
})();

var ConvoList = Vue.extend({
	data: function(){
		return {
			isShown: false,
			newConvo: {
				content: ''
			}
		}
	},
	methods: {
		create: function(){
			var convoList = this;
			convoList.$firebaseRefs.all.push(convoList.newConvo);
			convoList.newConvo = {};
		},
		destroy: function(convo){
			var convoList = this;
			convoList.$firebaseRefs.all.child(convo['.key']).remove();
		}
	}
});

document.addEventListener('DOMContentLoaded', function(){
	var convoList = new ConvoList({
		el: '#convos',
		firebase: {
			all: fb.ref('/convos')
		}
	});

	var console = new Vue({
		el: '#console',
		firebase: {
			all: fb.ref('/')
		}
	});
});
