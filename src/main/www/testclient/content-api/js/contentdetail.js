var searchUrl = "/content/";


function showContent(jsonData) {

    $('#contenttitle').empty();
    $.each(jsonData["titles"], function(index, element) {
        $('#contenttitle').append(element["title"] + ' (' + element["language"] + ')', "<br/>");
    });

    var license = '<a href="' + jsonData["copyright"]["license"]["url"] + '" target="_blank">' + jsonData["copyright"]["license"]["description"] + '</a>';
    $('#license').empty().append(license);

    var origin = '<a href="' + jsonData["copyright"]["origin"] + '" target="_blank">' + jsonData["copyright"]["origin"] + '</a>';
    $('#origin').empty().append(origin);

    $('#authors').empty();
    var numElements = jsonData["copyright"]["authors"].length;

    $.each(jsonData["copyright"]["authors"], function(index, element){
        $('#authors').append(element["name"]);
        if(index < numElements-1){
            $('#authors').append(", ");
        }
    });

    $('#contenttags').empty();
    $.each(jsonData["tags"], function(index, element){
        $('#contenttags').append('<a href="#" class="tag" onclick=\'searchFor("' + element["tag"] + '");\'>' + element["tag"] + '</a>');
    });

    $('#detailrow').show();

    $.each(jsonData["requiredLibraries"], function(index, element){
        if(element["mediaType"] == "text/javascript") {
            var scriptAppend = '<script type="' + element["mediaType"] + '" src="' + element["url"] + '"></script>';
            $('head').append(scriptAppend);
        } else if(element["mediaType"] == "text/css"){
            var styleAppend = '<link href="' + element["url"] + '" rel="stylesheet" type="' + element["mediaType"] + '"/>';
            $('head').append(styleAppend);
        }
    });

    // put title in header
    $("#header").append("<h1>" + jsonData["titles"][0].title + "</h1>");

    // put authors in header
    $.each(jsonData["copyright"]["authors"], function(index, element){
        $('#header').append("<a rel=\"author\">" + element["name"] + "</a><br>");
    });

    $('#preview').append(jsonData["content"][0]["content"]);
    $('#preview').show();
}

function loadContent(id){
    var request = window.superagent;
    request.get(searchUrl + id).end(
        function(err, res) {
            if(res.ok){
                showContent(res.body);
            } else {
                showError('Klarte ikke å laste innhold med id ' + id + '.');
            }
        }
    )
}

function showError(message) {
    $('#errormessage').empty();
    $('#errormessage').append(message);
    $('#errorcontainer').show();
    $("#detailview").hide();
}
