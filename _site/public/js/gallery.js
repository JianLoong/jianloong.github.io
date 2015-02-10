
function zeroPad(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

function clickPicture(){
	document.getElementById('links').onclick = function (event) {
		event = event || window.event;
		var target = event.target || event.srcElement,
		link = target.src ? target.parentNode : target,
		options = {index: link, event: event},
		links = this.getElementsByTagName('a');
		blueimp.Gallery(links, options);
	};
}

function loadPicture(){
	for ( var i = 0, l = 12; i < l; i++ ) {
		$('#links').append("<a href='/public/img/Screenshots/Screenshot" + zeroPad(i,3) + ".jpg' title='Diablo 3' data-gallery><img style='display:inline' src='/public/img/thumbs/Screenshot" + zeroPad(i,3) + "_thumb.jpg' alt='Paragon Level'>");
	}	
}