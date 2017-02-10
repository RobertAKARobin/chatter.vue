'use strict';

var FB,
	ConvoList,
	Router;

FB = firebase.initializeApp({
	databaseURL: 'ws://127.0.1:5000'
}).database();

ConvoList = Vue.component('convoList', {
	template: '#convoList'
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
