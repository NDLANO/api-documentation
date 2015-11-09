var searchUrl = "/images/";

function loadImage(id){
    var request = window.superagent;
    request.get(searchUrl + id).end(
        function(err, res) {
            if(res.ok){
                showImage(res.body);
            } else {
                showError('Klarte ikke å laste bilde med id ' + id + '.');
            }
        }
    )
}

function showImage(jsonData) {
    $('#detailrow').show();

    $('#imagetitle').empty();
    $.each(jsonData["titles"], function(index, element) {
        $('#imagetitle').append(element["title"] + ' (' + element["language"] + ')', "<br/>");
    });

    $('#alttext').empty();
    $.each(jsonData["alttexts"], function(index, element) {
        $('#alttext').append(element["alttext"], "<br/>");
    });

    $('#imagesize').empty().append(jsonData["images"]["full"]["size"]);

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

    $('#imagetags').empty();
    $.each(jsonData["tags"], function(index, element){
        $('#imagetags').append('<a href="#" class="tag" onclick=\'searchFor("' + element["tag"] + '");\'>' + element["tag"] + '</a>');
    });

    var fullsizeUrl = jsonData["images"]["full"]["url"];

    $('#imageview').empty().append('<a href="' + fullsizeUrl + '" target="_blank"><img src="' + fullsizeUrl + '"/></a>');
}

function showError(message) {
    $('#errormessage').empty();
    $('#errormessage').append(message);
    $('#errorcontainer').show();
    $("#detailview").hide();
}