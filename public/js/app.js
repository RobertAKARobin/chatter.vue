'use strict';

var fb,
	app,
	FBConsole,
	Router,
	ConvoHeaderList,
	ConvoHeader,
	Convo,
	Post;

fb = (function(){
	firebase.initializeApp({
		databaseURL: 'ws://127.0.1:5000'
	});
	return firebase.database();
})();

ConvoHeaderList = Vue.component('convoHeaderList', {
	template: '#convoHeaderList',
	data: function(){
		return {
			newConvoHeader: {}
		}
	},
	methods: {
		resetNew: function(){
			var convoHeaderList = this;
			convoHeaderList.newConvoHeader = new ConvoHeader();
		},
		create: function(){
			var convoHeaderList = this;
			convoHeaderList.$firebaseRefs.all.push(convoHeaderList.newConvoHeader);
			convoHeaderList.resetNew();
		},
		show: function(convoHeader){
			var convoHeaderList = this;
			Vue.set(convoHeader, 'isShown', !(convoHeader.isShown));
		}
	},
	created: function(){
		var convoHeaderList = this;
		convoHeaderList.$bindAsArray('all', fb.ref('/convoheaders'));
		convoHeaderList.resetNew();
	}
});

ConvoHeader = function(){
	return {
		title: ''
	}
}

Convo = Vue.component('convo', {
	template: '#convo',
	props: [
		'convoHeaderKey'
	],
	data: function(){
		return {
			newPost: {}
		}
	},
	methods: {
		resetNew: function(){
			var convo = this;
			convo.newPost = new Post();
		},
		createPost: function(){
			var convo = this;
			convo.$firebaseRefs.all.push(convo.newPost);
			convo.$firebaseRefs.header.update({
				count: (convo.header.count || 0) + 1
			});
			convo.resetNew();
		},
		destroy: function(){
			var convo = this;
			convo.$firebaseRefs.header.remove();
			convo.$firebaseRefs.all.remove();
			Router.push({name: 'convoHeaderList'});
		}
	},
	created: function(){
		var convo = this;
		var id = convo.$route.params.id;
		convo.$bindAsObject('header', fb.ref('/convoheaders').child(id));
		convo.$bindAsArray('all', fb.ref('/convos').child(id));
	}
});

Post = function(){
	return {
		content: ''
	}
}

FBConsole = Vue.component('fbConsole', {
	data: function(){
		return {
			all: null
		}
	},
	template: '#fbConsole',
	created: function(){
		var tree = this;
		tree.$bindAsArray('all', fb.ref('/'));
	}
});

document.addEventListener('DOMContentLoaded', function Main(){
	Router = new VueRouter({
		routes: [
			{
				path: '/',
				name: 'convoHeaderList',
				component: ConvoHeaderList
			},
			{
				path: '/convo/:id',
				name: 'convoShow',
				component: Convo
			}
		]
	});

	app = new Vue({
		router: Router
	});

	app.$mount('#app');
});
