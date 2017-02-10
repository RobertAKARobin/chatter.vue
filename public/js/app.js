'use strict';

var FB,
	ConvoList,
	ConvoFormNew,
	Convo,
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
			db: {
				title: Math.round(Date.now() / 1000)
			}
		}
	},
	methods: {
		create: function(){
			var input = this;
			FB.ref('/convos').push(input.db);
			Object.assign(input.$data, ConvoFormNew.options.data.call(input));
		}
	}
});

Convo = Vue.component('convo', {
	template: '#convo',
	props: ['fbid'],
	firebase: function(){
		var convo = this;
		return {
			db: {
				source: FB.ref('/convos').child(convo.fbid),
				asObject: true
			}
		}
	}
});

Router = new VueRouter({
	routes: [
		{
			path: '/',
			name: 'convoList',
			component: ConvoList
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
