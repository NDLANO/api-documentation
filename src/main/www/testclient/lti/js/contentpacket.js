function range(num){
    return Array.apply(null, Array(num)).map(function(_, i){return i;});
}
function updateProgressBar(){
    var numSlides = $("#slideshow > .slide").size();
    var progressBarWidth = $(".slideshow-progressbar").width();
    var progressBarHeight = $(".slideshow-progressbar").height();
    $(".slideshow-progressbar svg")
        .attr("width", progressBarWidth)
        .attr("height", progressBarHeight);
    var backgroundLinePadding = progressBarHeight / 2;
    var slideSpacing = (progressBarWidth - 2*backgroundLinePadding) / (numSlides-1);
    var slideXPositions = range(numSlides).map(function(i){return backgroundLinePadding + (i * slideSpacing);});
    $(".progressbar-slide")
        .attr("cx", function(index) {
            return slideXPositions[$(this).attr("index")];
        });
    $(".progressbar-backgroundline")
        .attr("x2", progressBarWidth - backgroundLinePadding);
}
function drawProgressBar(){
    var progressBar = $(".slideshow-progressbar > svg");
    progressBar.find(".progressbar-backgroundline-group").empty();
    progressBar.find(".progressbar-slides-group").empty();
    var progressBarWidth = $(".slideshow-progressbar").width();
    var progressBarHeight = $(".slideshow-progressbar").height();
    progressBar
        .attr("width", progressBarWidth)
        .attr("height", progressBarHeight);
    var backgroundLinePadding = progressBarHeight / 2;
    var backgroundLine = $(document.createElementNS("http://www.w3.org/2000/svg", "line"));
    backgroundLine
        .attr("class", "progressbar-backgroundline")
        .attr("x1", backgroundLinePadding)
        .attr("y1", backgroundLinePadding)
        .attr("x2", progressBarWidth - backgroundLinePadding)
        .attr("y2", backgroundLinePadding)
        .attr("stroke", "rgb(96,96,96)")
        .attr("stroke-width", "2");
    progressBar.find(".progressbar-backgroundline-group").append(backgroundLine);
    var progressBarSlidesGroup = progressBar.find(".progressbar-slides-group");
    var numSlides = $("#slideshow > .slide").size();
    var slideSpacing = (progressBarWidth - 2*backgroundLinePadding) / (numSlides-1);
    var slideXPositions = range(numSlides).map(function(i){return backgroundLinePadding + (i * slideSpacing);});
    for(var key in slideXPositions){
        var xPos = slideXPositions[key];
        var circle = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
        circle
            .attr("class", "progressbar-slide")
            .attr("index", key)
            .attr("cx", xPos)
            .attr("cy", backgroundLinePadding)
            .attr("r", 0.95*backgroundLinePadding)
            .attr("fill", "url(#inactiveSlideGradient)")
            .attr("stroke", "rgb(96,96,96)")
            .attr("stroke-width", "1");
        progressBarSlidesGroup.append(circle);
    }

    $("#slide1").attr("fill", "url(#activeSlideGradient)");
    $(".slideshow-progressbar > svg .progressbar-slide").attr("fill", "url(#inactiveSlideGradient)");
}

function updateSlideshowState(){
    var numSlides = $("#slideshow > .slide").size();

    // If on last slide, hide 'next' button
    if($(".progressbar-slide:first").attr("index") == numSlides-1) {
        $(".previous-next-container .next").hide();
    } else {
        $(".previous-next-container .next").show();
    }

    // If on first slide, hide 'previous' button
    if($(".progressbar-slide:first").attr("index") == 0) {
        $(".previous-next-container .prev").hide();
    } else {
        $(".previous-next-container .prev").show();
    }

}

function nextSlide(){
    $("#slideshow > .slide:first")
        .hide()
        .next()
        .show()
        .end()
        .appendTo("#slideshow");
    $(".slideshow-progressbar > svg .progressbar-slide:first")
        .attr("fill", "url(#inactiveSlideGradient)")
        .next()
        .attr("fill", "url(#activeSlideGradient)")
        .end()
        .appendTo(".slideshow-progressbar > svg > .progressbar-slides-group");
    updateSlideshowState();
}
function prevSlide(){
    $("#slideshow > .slide")
        .first()
        .hide()
        .end()
        .last()
        .show()
        .prependTo("#slideshow");
    $(".slideshow-progressbar > svg .progressbar-slide")
        .attr("fill", "url(#inactiveSlideGradient)")
        .last()
        .attr("fill", "url(#activeSlideGradient)")
        .prependTo(".slideshow-progressbar > svg > .progressbar-slides-group");
    updateSlideshowState();
}

