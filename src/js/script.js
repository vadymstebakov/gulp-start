/* global Swiper */

'use strict';

$(document).ready(function() {
	// Resize function
	let doit; 
	function resized(){ 
		console.log('resize');
	} 
	window.onresize = function() { 
		clearTimeout(doit); 
		doit = setTimeout(function() { 
			resized(); 
		}, 100); 
	};
	
});