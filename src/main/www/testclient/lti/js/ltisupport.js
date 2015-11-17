
LTI = {};

LTI.installLTIApp = function(configUrl, callback) {
    $.ajax({
        url: configUrl,
        dataType: "xml",
        success: function(data) {
            var data = {
                title: $(data).find("blti\\:title").first().text(),
                description: $(data).find("blti\\:description").first().text(),
                launch_url: $(data).find("blti\\:launch_url").first().text()

            };
            callback(data);
        }
    });
    /*
    $.get(configUrl, function(data) {
        var data = {
            title: $(data).find("blti\\:title").first().text(),
            description: $(data).find("blti\\:description").first().text(),
            launch_url: $(data).find("blti\\:launch_url").first().text()

        };
        callback(data);
    });
    */
};

//$(document).ready(function(){
//    LTI.loadLTIApp("https://www.edu-apps.org/lti_public_resources/config.xml?id=youtube");
//});
