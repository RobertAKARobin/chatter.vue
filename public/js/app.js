'use strict';

var FB,
	ConvoList,
	ConvoShow,
	Router;

FB = firebase.initializeApp({
	databaseURL: 'ws://127.0.1:5000'
}).database();

ConvoList = Vue.component('convoList', {
	template: '#convoList',
	data: function(){
		return {
			form: {
				title: Math.round(Date.now() / 1000)
			}
		}
	},
	firebase: {
		convos: FB.ref('/convos')
	},
	methods: {
		create: function(){
			var list = this;
			FB.ref('/convos').push(list.form);
			list.form = ConvoList.options.data.call(list).form;
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
		},
		destroy: function(){
			var convo = this;
			convo.$firebaseRefs.db.remove();
			Router.push({name: 'convoList'});
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
