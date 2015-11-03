
Slideshow = {};

function range(num){
    return Array.apply(null, Array(num)).map(function(_, i){return i;});
}

Slideshow.updateSlideshowProgressBar = function(slideshowContainer){
    var numSlides = slideshowContainer.find(".slideshow .slide").size();
    var progressBarWidth = slideshowContainer.find(".slideshow .slideshow-progressbar").width();
    var progressBarHeight = slideshowContainer.find(".slideshow .slideshow-progressbar").height();
    slideshowContainer.find(".slideshow .slideshow-progressbar svg")
        .attr("width", progressBarWidth)
        .attr("height", progressBarHeight);
    var backgroundLinePadding = progressBarHeight / 2;
    var slideSpacing = (progressBarWidth - 2*backgroundLinePadding) / (numSlides-1);
    var slideXPositions = range(numSlides).map(function(i){return backgroundLinePadding + (i * slideSpacing);});
    slideshowContainer.find(".slideshow .progressbar-slide")
        .attr("cx", function(index) {
            return slideXPositions[$(this).attr("index")];
        });
    slideshowContainer.find(".slideshow .progressbar-backgroundline")
        .attr("x2", progressBarWidth - backgroundLinePadding);
}
Slideshow.drawFrontpageProgressBar = function(slideshowContainer){
    var progressBar = slideshowContainer.find(".frontpage-progressbar");
    var progressBarWidth = slideshowContainer.find(".frontpage-progressbar-container").width();
    var progressBarHeight = slideshowContainer.find(".frontpage-progressbar-container").height();
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
    var numSlides = slideshowContainer.find(".slideshow-frontpage-content .frontpage-slide").size();
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

Slideshow.drawSlideshowProgressBar = function(slideshowContainer){
    var progressBar = slideshowContainer.find(".slideshow .slideshow-progressbar svg");
    progressBar.find(".progressbar-backgroundline-group").empty();
    progressBar.find(".progressbar-slides-group").empty();
    var progressBarWidth = slideshowContainer.find(".slideshow .slideshow-progressbar").width();
    var progressBarHeight = slideshowContainer.find(".slideshow .slideshow-progressbar").height();
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
    var numSlides = slideshowContainer.find(".slideshow .slide").size();
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

    slideshowContainer.find(".slideshow .slideshow-progressbar svg .progressbar-slide").attr("fill", "url(#inactiveSlideGradient)");
}

Slideshow.updateSlideshowState = function(slideshowContainer){
    var numSlides = slideshowContainer.find(".slideshow .slide").size();

    // If on last slide, hide 'next' button
    if(slideshowContainer.find(".slideshow .progressbar-slide:first").attr("index") == numSlides-1) {
        slideshowContainer.find(".slideshow .previous-next-container .next").hide();
    } else {
        slideshowContainer.find(".slideshow .previous-next-container .next").show();
    }

    // If on first slide, hide 'previous' button
    if(slideshowContainer.find(".slideshow .progressbar-slide:first").attr("index") == 0) {
        slideshowContainer.find(".slideshow .previous-next-container .prev").hide();
    } else {
        slideshowContainer.find(".slideshow .previous-next-container .prev").show();
    }
}

Slideshow.indexSlides = function(slideshowContainer){
    $(slideshowContainer.find(".slideshow .slide")
        .each(function(slide){
            $(this).attr("index", slide);
        }));
}

Slideshow.nextSlide = function(slideshowContainer){
    slideshowContainer.find(".slideshow .slide:first")
        .hide()
        .next()
        .show()
        .end()
        .appendTo(slideshowContainer.find(".slideshow > .slideshow-slides-group"));
    slideshowContainer.find(".slideshow .slideshow-progressbar > svg .progressbar-slide:first")
        .attr("fill", "url(#inactiveSlideGradient)")
        .next()
        .attr("fill", "url(#activeSlideGradient)")
        .end()
        .appendTo(slideshowContainer.find(".slideshow-progressbar > svg > .progressbar-slides-group"));
    Slideshow.updateSlideshowState(slideshowContainer);
}
Slideshow.prevSlide = function(slideshowContainer){
    slideshowContainer.find(".slideshow .slide")
        .first()
        .hide()
        .end()
        .last()
        .show()
        .prependTo(slideshowContainer.find(".slideshow > .slideshow-slides-group"));
    slideshowContainer.find(".slideshow .slideshow-progressbar svg .progressbar-slide")
        .attr("fill", "url(#inactiveSlideGradient)")
        .last()
        .attr("fill", "url(#activeSlideGradient)")
        .prependTo(slideshowContainer.find(".slideshow-progressbar > svg > .progressbar-slides-group"));
    Slideshow.updateSlideshowState(slideshowContainer);
}

Slideshow.setStateToFrontpage = function(slideshowContainer){
    slideshowContainer.find(".slideshow").hide();
    slideshowContainer.find(".slideshow-frontpage").show();
}

Slideshow.setStateToSlideshow = function(slideshowContainer){
    location.hash = "1";
    slideshowContainer.find(".slideshow .slide")
        .hide()
        .first()
        .show();
    Slideshow.updateSlideshowState(slideshowContainer);
    slideshowContainer.find(".slideshow-frontpage").hide();
    slideshowContainer.find(".slideshow").show();
    Slideshow.updateSlideshowProgressBar(slideshowContainer);
}

Slideshow.startSlideshow = function(slideshowContainer){
    // Wind slideshow back to first slide
    slideshowContainer.find(".slideshow .slide").sort(function(a,b){
        var aIndex = parseInt(a.getAttribute("index"));
        var bIndex = parseInt(b.getAttribute("index"));
        return aIndex - bIndex;
    }).appendTo(slideshowContainer.find(".slideshow .slideshow-slides-group"));
    slideshowContainer.find(".slideshow .slideshow-progressbar svg .progressbar-slide").sort(function(a,b){
        var aIndex = parseInt(a.getAttribute("index"));
        var bIndex = parseInt(b.getAttribute("index"));
        return aIndex - bIndex;
    }).appendTo(slideshowContainer.find(".slideshow .slideshow-progressbar svg .progressbar-slides-group"));
    slideshowContainer.find(".slideshow .slideshow-progressbar svg .progressbar-slide")
        .attr("fill", "url(#inactiveSlideGradient)")
        .first()
        .attr("fill", "url(#activeSlideGradient)");
    Slideshow.setStateToSlideshow(slideshowContainer);
}

Slideshow.prepareSlideshow = function(slideshowContainer){
    $(window).on("hashchange", function(){
        if(location.hash == "#1"){
            Slideshow.setStateToSlideshow(slideshowContainer);
        }
        else {
            Slideshow.setStateToFrontpage(slideshowContainer);
        }
    });
    $(window).resize(function(){Slideshow.updateSlideshowProgressBar(slideshowContainer);});
    Slideshow.indexSlides(slideshowContainer);
    Slideshow.drawFrontpageProgressBar(slideshowContainer);
    Slideshow.drawSlideshowProgressBar(slideshowContainer);
    Slideshow.setStateToFrontpage(slideshowContainer);
}

