var searchUrl = "/h5p/";

function loadH5P(id){
    var request = window.superagent;
    request.get(searchUrl + id).end(
        function(err, res) {
            if(res.ok){
                showH5P(res.body);
            } else {
                showError('Klarte ikke å laste H5P med id ' + id + '.');
            }
        }
    )
}

function showH5P(jsonData) {
    $('#detailrow').show();

    $('#h5ptitle').empty();
    $.each(jsonData["titles"], function(index, element) {
        $('#h5ptitle').append(element["title"] + ' (' + element["language"] + ')', "<br/>");
    });

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

    $('#h5ptags').empty();
    $.each(jsonData["tags"], function(index, element){
        $('#h5ptags').append('<a href="#" class="tag" onclick=\'searchFor("' + element["tag"] + '");\'>' + element["tag"] + '</a>');
    });

    var h5pview = $('#h5pview');
    h5pview.empty();
    jsonData["url"].forEach(function(url){
        h5pview.append('<div class="w3-row w3-image"><iframe src="' + url.url + '"></iframe></div>');
    });
}

function showError(message) {
    $('#errormessage').empty();
    $('#errormessage').append(message);
    $('#errorcontainer').show();
    $("#detailview").hide();
}