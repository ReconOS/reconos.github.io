// JavaScript Document

config = {
	speed : 1000,
	interval : 5000,
	selector : "#slider-content"
}

slider = {
	$slider : null,
	$pages : null,

	current : 0,
	animating : false,

	auto : 0
};

function initSlider() {
	// initialize slider
	slider.$slider = $(config.selector);
	slider.$pages = slider.$slider.children("ul").children("li");

	// add buttons
	slider.$slider.append('<div id="slider-next"></div>');
	$("#slider-next").click(function(e) {
        nextPage();
    });
	slider.$slider.append('<div id="slider-prev"></div>');
	$("#slider-prev").click(function(e) {
        prevPage()
    });

	// set default state of pages
	slider.$pages.css("display", "none");
	slider.$pages.eq(0).css("display", "block");

	// only state animation if we have more than one page
	if (slider.$pages.length > 1)
		resetInterval();
}

function resetInterval() {
	clearInterval(slider.auto);
	slider.auto = setInterval(function(){nextPage();}, config.interval);
}

function incCurrent() {
	slider.current++;

	if (slider.current == slider.$pages.length)
		slider.current = 0;
}

function decCurrent() {
	slider.current--;

	if (slider.current < 0)
		slider.current = slider.$pages.length - 1;
}

function nextPage() {
	if (slider.animating) {
		return
	}

	slider.animating = true;

	slider.$pages.eq(slider.current).fadeOut(config.speed);
	incCurrent();
	slider.$pages.eq(slider.current).fadeIn(config.speed, function() {slider.animating = false;});

	resetInterval();
}

function prevPage() {
	if (slider.animating) {
		return
	}

	slider.animating = true;

	slider.$pages.eq(slider.current).fadeOut(config.speed);
	decCurrent();
	slider.$pages.eq(slider.current).fadeIn(config.speed, function() {slider.animating = false;});

	resetInterval();
}

// Initialize slider whe page is loaded
//$(function () {initSlider();});
$(document).ready(function(e) {
    initSlider();
});