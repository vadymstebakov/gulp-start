/* global Swiper */

'use strict';

$(document).ready(function() {
	// Resize function
	function onResize() {
		console.log('e');
	}
	let doit;
	doit = setTimeout(onResize, 400);
	window.onresize = function() {
		clearTimeout(doit);
		doit = setTimeout(onResize, 400);
	};

});