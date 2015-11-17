
LTI = {};

LTI.loadLtiApp = function(configUrl, callback) {
    $.ajax({
        url: "http://api.test.ndla.no/packages/configurl?lti-config-url=" + configUrl,
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
};
