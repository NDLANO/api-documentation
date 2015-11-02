function range(num){
    return Array.apply(null, Array(num)).map(function(_, i){return i;});
}

function updateSlideshowProgressBar(){
    var numSlides = $("#slideshow .slide").size();
    var progressBarWidth = $(".slideshow .slideshow-progressbar").width();
    var progressBarHeight = $(".slideshow .slideshow-progressbar").height();
    $("#slideshow-container .slideshow .slideshow-progressbar svg")
        .attr("width", progressBarWidth)
        .attr("height", progressBarHeight);
    var backgroundLinePadding = progressBarHeight / 2;
    var slideSpacing = (progressBarWidth - 2*backgroundLinePadding) / (numSlides-1);
    var slideXPositions = range(numSlides).map(function(i){return backgroundLinePadding + (i * slideSpacing);});
    $("#slideshow-container .slideshow .progressbar-slide")
        .attr("cx", function(index) {
            return slideXPositions[$(this).attr("index")];
        });
    $("#slideshow-container .slideshow .progressbar-backgroundline")
        .attr("x2", progressBarWidth - backgroundLinePadding);
}
function drawFrontpageProgressBar(){
    var progressBar = $("#slideshow-container .frontpage-progressbar");
    var progressBarWidth = $("#slideshow-container .frontpage-progressbar-container").width();
    var progressBarHeight = $("#slideshow-container .frontpage-progressbar-container").height();
    progressBar
        .attr("width", progressBarWidth)
        .attr("height", progressBarHeight);
    var backgroundLine = $(document.createElementNS("http://www.w3.org/2000/svg", "line"));
    var padding = progressBarWidth/2.0;
    backgroundLine
        .attr("class", "progressbar-backgroundline")
        .attr("x1", padding)
        .attr("y1", padding)
        .attr("x2", padding)
        .attr("y2", progressBarHeight - padding)
        .attr("stroke", "rgb(96,96,96)")
        .attr("stroke-width", "2");
    progressBar.find(".progressbar-backgroundline-group").append(backgroundLine);
    var numSlides = $("#slideshow-container .slideshow-frontpage-content .frontpage-slide").size();
    console.log("number of slides: " + numSlides);
    var progressBarSlidesGroup = progressBar.find(".progressbar-slides-group");
    var slideSpacing = (progressBarHeight - 2 * padding) / (numSlides-1);
    var slideYPositions = range(numSlides).map(function(i){return padding + (i * slideSpacing);});
    for(var key in slideYPositions){
        var yPos = slideYPositions[key];
        var circle = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
        circle
            .attr("class", "progressbar-slide")
            .attr("index", "key")
            .attr("cx", padding)
            .attr("cy", yPos)
            .attr("r", 0.95*padding)
            .attr("fill", "url(#frontpageSlideGradient)")
            .attr("stroke", "rgb(96,96,96)")
            .attr("stroke-width", "1");
        progressBarSlidesGroup.append(circle);
    }
}

function drawSlideshowProgressBar(){
    var progressBar = $("#slideshow-container .slideshow .slideshow-progressbar svg");
    progressBar.find(".progressbar-backgroundline-group").empty();
    progressBar.find(".progressbar-slides-group").empty();
    var progressBarWidth = $("#slideshow-container .slideshow .slideshow-progressbar").width();
    var progressBarHeight = $("#slideshow-container .slideshow .slideshow-progressbar").height();
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
    var numSlides = $("#slideshow-container .slideshow .slide").size();
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

    $("#slideshow-container .slideshow .slideshow-progressbar svg .progressbar-slide").attr("fill", "url(#inactiveSlideGradient)");
}

function updateSlideshowState(){
    var numSlides = $("#slideshow-container .slideshow .slide").size();

    // If on last slide, hide 'next' button
    if($("#slideshow-container .slideshow .progressbar-slide:first").attr("index") == numSlides-1) {
        $("#slideshow-container .slideshow .previous-next-container .next").hide();
    } else {
        $("#slideshow-container .slideshow .previous-next-container .next").show();
    }

    // If on first slide, hide 'previous' button
    if($("#slideshow-container .slideshow .progressbar-slide:first").attr("index") == 0) {
        $("#slideshow-container .slideshow .previous-next-container .prev").hide();
    } else {
        $("#slideshow-container .slideshow .previous-next-container .prev").show();
    }
}

function indexSlides(){
    $("#slideshow-container .slideshow .slide")
        .each(function(slide){
            $(this).attr("index", slide);
        });
}

function nextSlide(){
    $("#slideshow-container .slideshow .slide:first")
        .hide()
        .next()
        .show()
        .end()
        .appendTo("#slideshow-container .slideshow > .slideshow-slides-group");
    $("#slideshow-container .slideshow .slideshow-progressbar > svg .progressbar-slide:first")
        .attr("fill", "url(#inactiveSlideGradient)")
        .next()
        .attr("fill", "url(#activeSlideGradient)")
        .end()
        .appendTo("#slideshow-container .slideshow-progressbar > svg > .progressbar-slides-group");
    updateSlideshowState();
}
function prevSlide(){
    $("#slideshow-container .slideshow .slide")
        .first()
        .hide()
        .end()
        .last()
        .show()
        .prependTo("#slideshow-container .slideshow > .slideshow-slides-group");
    $("#slideshow-container .slideshow .slideshow-progressbar svg .progressbar-slide")
        .attr("fill", "url(#inactiveSlideGradient)")
        .last()
        .attr("fill", "url(#activeSlideGradient)")
        .prependTo("#slideshow-container .slideshow-progressbar > svg > .progressbar-slides-group");
    updateSlideshowState();
}

function setStateToFrontpage(){
    $("#slideshow-container .slideshow").hide();
    $("#slideshow-container .slideshow-frontpage").show();
}

function setStateToSlideshow(){
    location.hash = "1";
    $("#slideshow-container .slideshow .slide")
        .hide()
        .first()
        .show();
    updateSlideshowState();
    $("#slideshow-container .slideshow-frontpage").hide();
    $("#slideshow-container .slideshow").show();
}

function startSlideshow(){
    // Wind slideshow back to first slide
    $("#slideshow-container .slideshow .slide").sort(function(a,b){
        var aIndex = parseInt(a.getAttribute("index"));
        var bIndex = parseInt(b.getAttribute("index"));
        console.log("a: " + aIndex + ", b: " + bIndex + ", sum: " + (aIndex + bIndex));
        return aIndex - bIndex;
    }).appendTo("#slideshow > .slideshow-slides-group");
    $("#slideshow-container .slideshow .slideshow-progressbar svg .progressbar-slide").sort(function(a,b){
        var aIndex = parseInt(a.getAttribute("index"));
        var bIndex = parseInt(b.getAttribute("index"));
        console.log("a: " + aIndex + ", b: " + bIndex + ", sum: " + (aIndex + bIndex));
        return aIndex - bIndex;
    }).appendTo("#slideshow-container .slideshow .slideshow-progressbar svg .progressbar-slides-group");
    $("#slideshow-container .slideshow .slideshow-progressbar svg .progressbar-slide")
        .attr("fill", "url(#inactiveSlideGradient)")
        .first()
        .attr("fill", "url(#activeSlideGradient)");
    setStateToSlideshow();
}

$(window).on("hashchange", function(){
    if(location.hash == "#1"){
        setStateToSlideshow();
    }
    else {
        setStateToFrontpage();
    }
});
