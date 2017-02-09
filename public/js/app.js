'use strict';

var fb,
	app,
	FBConsole,
	Router,
	ConvoHeaderList,
	ConvoHeaderForm,
	ConvoHeader,
	Convo,
	PostForm;

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
	computed: {
		isSubmittable: function(){
			var form = this;
			return (form.db.title);
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
			form.$firebaseRefs.db.update(form.db, form.ifError);
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
	props: ['fbid'],
	computed: {
		route: function(){
			var convoHeader = this;
			return {
				name: 'convoShow',
				params: {
					fbid: convoHeader.db['.key']
				}
			}
		}
	},
	created: function(){
		var convoHeader = this;
		convoHeader.$bindAsObject('db', fb.ref('/convoHeaders').child(convoHeader.fbid));
	}
});

Convo = Vue.component('convo', {
	template: '#convo',
	data: function(){
		return {
			error: ''
		}
	},
	methods: {
		countUp: function(){
			var convo = this;
			convo.$firebaseRefs.header.update({
				count: (convo.header.count || 0) + 1
			});
		}
	},
	created: function(){
		var convo = this;
		var fbid = convo.$route.params.fbid;
		convo.$bindAsObject('header', fb.ref('/convoHeaders').child(fbid));
		convo.$bindAsArray('all', fb.ref('/convos').child(fbid));
	}
});

PostForm = Vue.component('postForm', {
	template: '#postForm',
	props: ['convoFbid'],
	data: function(){
		return {
			error: '',
			db: {
				content: ''
			}
		}
	},
	methods: {
		create: function(){
			var form = this;
			fb.ref('/convos').child(form.convoFbid).push(form.db, function(err){
				if(err){
					form.ifError(err);
				}else{
					form.$emit('postcreated');
					form.reset();
				}
			});
		},
		ifError: function(err){
			var form = this;
			form.error = (err ? 'Cannot be blank!' : '');
		},
		reset: function(){
			var form = this;
			Object.assign(form.$data, PostForm.options.data.call(form));
		}
	}
});

FBConsole = Vue.component('fbConsole', {
	template: '#fbConsole',
	data: function(){
		return {
			all: null
		}
	},
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
				path: '/convo/:fbid',
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
