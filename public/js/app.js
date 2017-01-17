'use strict';

firebase.initializeApp({
	databaseURL: 'ws://127.0.1:5000'
});

document.addEventListener('DOMContentLoaded', function(){
	new Vue({
		el: '#app',
		data: {
			message: 'Vue is alive!'
		}
	});
});
