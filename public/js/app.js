'use strict';

var FB,
	Convo,
	ConvoList,
	ConvoFormNew,
	ConvoFormEdit,
	ConvoShow,
	Router;

FB = firebase.initializeApp({
	databaseURL: 'ws://127.0.1:5000'
}).database();

ConvoList = Vue.component('convoList', {
	template: '#convoList',
	firebase: {
		convos: FB.ref('/convos')
	}
});

ConvoFormNew = Vue.component('convoFormNew', {
	template: '#convoFormNew',
	data: function(){
		return {
			form: {
				title: Math.round(Date.now() / 1000)
			}
		}
	},
	methods: {
		create: function(){
			var convo = this;
			FB.ref('/convos').push(convo.form);
			Object.assign(convo.$data, ConvoFormNew.options.data.call(convo));
		}
	}
});

ConvoShow = Vue.component('convoShow', {
	template: '#convoShow',
	props: ['fbid'],
	data: function(){
		return {
			isEditing: false
		}
	},
	firebase: function(){
		var convo = this;
		return {
			db: {
				source: FB.ref('/convos').child(convo.$route.params.fbid),
				asObject: true
			},
			form: {
				source: FB.ref('/convos').child(convo.$route.params.fbid),
				asObject: true
			}
		}
	},
	methods: {
		save: function(){
			var convo = this;
			delete convo.form['.key'];
			convo.$firebaseRefs.db.update(convo.form);
		}
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
