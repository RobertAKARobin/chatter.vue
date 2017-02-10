'use strict';

var FB,
	ConvoList,
	ConvoShow,
	PostList,
	Router;

FB = firebase.initializeApp({
	databaseURL: 'ws://127.0.1:5000'
}).database();

ConvoList = Vue.component('convoList', {
	template: '#convoList',
	data: function(){
		return {
			error: '',
			tags: [
				{name: ''},
				{name: ''},
				{name: ''}
			],
			form: {
				title: Math.round(Date.now() / 1000),
				tags: {}
			}
		}
	},
	methods: {
		create: function(){
			var list = this;
			var form = list.form;
			form.tags = {};
			list.tags.forEach(function(tag){
				form.tags[tag.name] = true;
			});
			FB.ref('/convos').push(list.form, function(err){
				if(err){
					list.error = 'Nope!';
				}else{
					list.error = '';
					list.form = ConvoList.options.data.call(list).form;
				}
			});
		}
	},
	created: function(){
		var list = this;
		list.$bindAsArray('convos', FB.ref('/convos'));
	}
});

ConvoShow = Vue.component('convoShow', {
	template: '#convoShow',
	props: ['fbid'],
	data: function(){
		return {
			isEditing: false,
			error: ''
		}
	},
	methods: {
		save: function(){
			var convo = this;
			delete convo.form['.key'];
			convo.$firebaseRefs.db.update(convo.form, function(err){
				if(err){
					convo.error = 'Nope!';
				}else{
					convo.error = '';
				}
			});
		},
		destroy: function(){
			var convo = this;
			convo.$firebaseRefs.db.remove();
			Router.push({name: 'convoList'});
		}
	},
	created: function(){
		var convo = this;
		convo.$bindAsObject('db', FB.ref('/convos').child(convo.$route.params.fbid));
		convo.$bindAsObject('form', FB.ref('/convos').child(convo.$route.params.fbid));
	}
});

PostList = Vue.component('postList', {
	template: '#postList',
	props: ['convoFbid'],
	data: function(){
		return {
			error: '',
			form: {
				content: ''
			}
		}
	},
	methods: {
		create: function(){
			var list = this;
			list.$firebaseRefs.posts.push(list.form, function(err){
				if(err){
					list.error = 'Nope!';
				}else{
					list.error = '';
					list.form = PostList.options.data.call(list).form;
				}
			});
		}
	},
	created: function(){
		var list = this;
		list.$bindAsArray('posts', FB.ref('/posts').child(list.convoFbid));
	}
});

Router = new VueRouter({
	routes: [
		{
			path: '/',
			name: 'convoList',
			component: ConvoList
		},
		{
			path: '/convos/:fbid',
			name: 'convoShow',
			component: ConvoShow
		}
	]
});

document.addEventListener('DOMContentLoaded', function(){
	new Vue({
		el: '#app',
		router: Router
	});
	new Vue({
		el: '#console',
		firebase: {
			all: FB.ref('/')
		}
	});
});
