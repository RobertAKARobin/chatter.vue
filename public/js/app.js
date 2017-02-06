'use strict';

var fb,
	app,
	FBConsole,
	Router,
	ConvoHeaderList,
	ConvoHeaderForm,
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
	firebase: {
		all: fb.ref('/convoHeaders')
	}
});

ConvoHeaderForm = Vue.component('convoHeaderForm', {
	template: '#convoHeaderForm',
	props: ['fbid', 'shownInit'],
	data: function(){
		var form = this;
		return {
			error: '',
			shown: (form.shownInit),
			db: {
				title: ''
			}
		}
	},
	methods: {
		create: function(){
			var form = this;
			fb.ref('/convoHeaders').push(form.db, function(err){
				if(err){
					form.ifError(err);
				}else{
					form.reset();
				}
			});
		},
		reset: function(){
			var form = this;
			Object.assign(form.$data, ConvoHeaderForm.options.data.call(form));
		},
		ifError: function(err){
			var form = this;
			form.error = (err ? 'Title cannot be blank!' : '');
		},
		show: function(){
			var form = this;
			form.shown = true;
			if(form.fbid){
				form.$bindAsObject('db', fb.ref('/convoHeaders').child(form.fbid));
			}
		},
		hide: function(){
			var form = this;
			form.shown = false;
		},
		save: function(){
			var form = this;
			delete form.db['.key']; //Hmm
			form.$firebaseRefs.db.update(form.db);
		},
		destroy: function(){
			var form = this;
			form.$firebaseRefs.db.remove();
			fb.ref('/convos').child(form.fbid).remove();
			Router.push({name: 'convoHeaderList'});
		}
	}
});

ConvoHeader = Vue.component('convoHeader', {
	template: '#convoHeader',
	props: ['db'],
	computed: {
		route: function(){
			var convoHeader = this;
			return {
				name: 'convoShow',
				params: {
					id: convoHeader.db['.key']
				}
			}
		}
	}
});

Convo = Vue.component('convo', {
	template: '#convo',
	props: [
		'convoHeaderKey'
	],
	data: function(){
		return {
			newPost: {},
			header: {}
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
		}
	},
	created: function(){
		var convo = this;
		var id = convo.$route.params.id;
		convo.$bindAsObject('header', fb.ref('/convoHeaders').child(id));
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
