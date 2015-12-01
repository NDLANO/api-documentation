LMS = {};
LMS.content = [];

LMS.getLtiProviders = function(callback){
    $.ajax({
        url: window.location.origin + "/packages/lti/providers",
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
    content.title = decodeURIComponent(content.title).replace(/\+/g, " ");

    if(content.return_type == "iframe") {
        LMS.content.push(content);
        Slideshow.addSlide($("#slideshow-container"), content);
    } else if(content.return_type == "url") {
        LMS.content.push(content);
        Slideshow.addUrl($("#slideshow-container"), content);
    } else if(content.return_type == "oembed") {
        alert("Ingen støtte for embedding av oembed i denne klienten.");
    } else if(content.return_type == "lti_launch_url") {
        alert("Ingen støtte for embedding av LTI-tilbydere i denne klienten.");
    } else if(content.return_type == "image_url") {
        alert("Ingen støtte for embedding av bilder i denne klienten.");
    } else if(content.return_type == "file") {
        alert("Ingen støtte for embedding av filer i denne klienten.");
    }
};

LMS.savePackage = function(){
    var packetId = $("#packageId").val();
    var packet = {
        id: packetId,
        content: LMS.content
    };

    $.ajax({
        url: window.location.origin + "/packages/" + packetId,
        method: "POST",
        processData: false,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(packet),
        success: function(data){
            alert("pakke med id " + packetId + " lagret.");
        },
        error: function(err){
            if(err.status == 200){
                alert("pakke med id " + packetId + " lagret.");
            } else {
                alert("feil under lagring av pakke med id " + packetId);
            }
        }
    });
};

LMS.launchLtiProvider = function(provider){
    var ltiWindow = $("<iframe>")
        .attr("width", "100%")
        .attr("height", "90%")
        .attr("id", "lti-provider-window");

    $("#lti-provider-window").replaceWith(ltiWindow);
    if(LMS.ltiProviders[provider] == null){
        return false;
    }
    var launchUrl = LMS.ltiProviders[provider].launch_url;
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

    // Allow content inside iframes to post messages back to main body
    window.addEventListener("message", function(event){
        var source = event.data.source;
        source = source.substr(source.lastIndexOf("/") + 1);
        if(source == "embedcontent.html"){
            LMS.addContent(event.data.payload);
        }
    }, false);
};

LMS.updateLtiProvidersSelector = function(selector){
    LMS.getLtiProviders(function(ltiProviders){
        selector.empty();
        LMS.ltiProviders = ltiProviders;
        for(var ltiProvider in ltiProviders){
            $("#lti-provider-selector").append(
                $("<option>")
                    .attr("value", ltiProvider)
                    .append(ltiProvider));
        }
    });
};

LMS.addSlideButtonClicked = function(element){
    $("#lti-provider-selector").get().pop().selectedIndex = -1;
    $("#lti-content-selector").css("visibility", "visible");
};

LMS.ltiProviderSelected = function(selector){
    var selectedLti = selector.selectedOptions[0].value;
    LMS.launchLtiProvider(selectedLti);
};
