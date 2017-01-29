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
		},
		show: function(convoHeader){
			var convoHeaderList = this;
			Vue.set(convoHeader, 'isShown', !(convoHeader.isShown));
			if(!convoHeader.convo){
				convoHeader.convo = new Convo({
					el: document.getElementById(convoHeader['.key']),
					firebase: {
						all: fb.ref('/convos').child(convoHeader['.key'])
					}
				});
			}
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

var Convo = Vue.extend({
	data: function(){
		return {
			newPost: {}
		}
	},
	methods: {
		resetNew: function(){
			var convo = this;
			convo.newPost = Post.options.data();
		},
		createPost: function(){
			var convo = this;
			convo.$firebaseRefs.all.push(convo.newPost);
			convo.resetNew();
		}
	}
});

var Post = Vue.extend({
	data: function(){
		return {
			content: ''
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
