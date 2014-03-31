// JavaScript Document

// Create captions for images in the content section
// Wrap them by a div to control margins
function createImageCaptions() {
	$('#content img').each(function() {
		$(this).wrap('<div class="figure"></div>')
		caption = $(this).attr('alt');
		if (caption !== "")
			$(this).after('<p>' + caption + '</p>');
	});
}

$(document).ready(function(e) {
	createImageCaptions();
});
