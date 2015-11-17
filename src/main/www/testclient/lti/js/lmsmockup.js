LMS = {};

LMS.setupLocalStorage = function(){
    if(localStorage.getItem("lti-providers") == null){
        localStorage.setItem("lti-providers", "add-lti-provider");
    }
    localStorage.setItem("add-lti-provider/launchUrl", "add-lti-provider.html");
};

LMS.getLtiProviders = function(callback){
    $.ajax({
        url: "http://api.test.ndla.no/packages/lti-providers",
        dataType: "json",
        success: function(data) {
            ltiProviders = data;
            callback(data);
        }
    });
};

LMS.addLtiProvider = function(config){
    $("#lti-content-selector").css("visibility", "hidden");
    localStorage.setItem(config.title + "/launchUrl", config.launch_url);
    localStorage.setItem("lti-providers", localStorage.getItem("lti-providers") + ";" + config.title);
};

LMS.addContent = function(content){
    $("#lti-content-selector").css("visibility", "hidden");
    content.url = decodeURIComponent(content.url);
    LMS.addSlide($("#slideshow-container"), content);
};

LMS.launchLtiProvider = function(provider){
    var ltiWindow = $("<iframe>")
        .attr("width", "100%")
        .attr("height", "90%")
        .attr("id", "lti-provider-window");

    $("#lti-provider-window").replaceWith(ltiWindow);
    ltiWindow.load(function(){
        console.log("loaded!");
    });
    var launchUrl = localStorage.getItem(provider + "/launchUrl");
    if(launchUrl == null){
        console.log("launch url " + provider + " was not found :(");
        return false;
    }
    var form = $("<form>").attr("action", launchUrl).attr("method", "post")
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "lti_message_type")
            .attr("value", "basic-lti-launch-request"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "lti_version")
            .attr("value", "LTI-1p1"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "roles")
            .attr("value", "Instructor"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "ext_content_return_url")
            .attr("value", "http://api.test.ndla.no/testclient/lti/embedcontent.html"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "ext_content_return_types")
            .attr("value", "oembed,lti_launch_url,url,image_url"))
        .append($("<input>")
            .attr("type", "hidden")
            .attr("name", "ext_content_intended_use")
            .attr("value", "embed"));

    ltiWindow.contents().find("body").append(form);
    form.submit();
};

LMS.init = function(){
    LMS.updateLtiProvidersSelector($("#lti-provider-selector"));
    Slideshow.prepareSlideshow($("#slideshow-container"));
    $("#lti-provider-selector").get().pop().selectedIndex = -1;
    LMS.messageDispatcher = {};
    LMS.messageDispatcher["add-lti-provider.html"] = LMS.addLtiProvider;
    LMS.messageDispatcher["embedcontent.html"] = LMS.addContent;
    window.addEventListener("message", function(event){
        message = event;
        var source = event.data.source;
        source = source.substr(source.lastIndexOf("/") + 1);
        if(messageDispatcher[source] != null){
            messageDispatcher[source].call(this, event.data.payload);
        } else {
            console.log("no event handler for " + source + " found");
        }
    }, false);
};

LMS.addSlide = function(root, contentData){
    var host = contentData.url.match(/^https?:\/\/[\w.]+/);
    var frontpageContent = undefined;
    var mainContent = undefined;
    if(host == null) {
        console.log("pattern does not match: " + contentData.url);
        return;
    } else if(host[0].endsWith("youtube.com")){
        var videoId = contentData.url.substr(contentData.url.indexOf("/embed/") + "/embed/".length).split("?")[0];
        frontpageContent = $("<img>")
            .attr("src", "https://img.youtube.com/vi/" + videoId + "/0.jpg")
            .attr("width", "200px")
            .attr("height", "150px");
        mainContent = $("<iframe>")
            .attr("src", contentData.url)
            .attr("width", "100%")
            .attr("height", "480px")
            .attr("allowfullscreen", "true");
    } else {

    }

    var frontpageSlide = $("<div>").attr("class", "frontpage-slide").append(frontpageContent);
    var mainSlide = $("<div>").attr("class", "slide").append(mainContent);
    root.find(".frontpage-slides").append(frontpageSlide);
    root.find(".slideshow-slides-group").append(mainSlide);
    Slideshow.drawFrontpageProgressBar(root);
    Slideshow.indexSlides(root);
    Slideshow.drawSlideshowProgressBar(root);
};

LMS.updateLtiProvidersSelector = function(selector){
    LMS.getLtiProviders(function(ltiProviders){
        selector.empty();
        LMS.ltiProviders = {};
        for(ltiProvider in ltiProviders){
            LTI.loadLtiApp(ltiProviders[ltiProvider], function(config){
                LMS.ltiProviders[ltiProvider] = config;
                $("#lti-provider-selector").append(
                    $("<option>")
                        .attr("value", config.title)
                        .append(ltiProvider));
            });
        }
        selector.get().pop().selectedIndex = -1;
    });
};

LMS.addSlideButtonClicked = function(element){
    $("#lti-content-selector").css("visibility", "visible");
};

LMS.ltiProviderSelected = function(selector){
    var selectedLti = selector.selectedOptions[0].value;
    LMS.launchLtiProvider(selectedLti);
};
