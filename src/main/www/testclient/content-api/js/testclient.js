function showAdvancedSearch() {
    $('#advancedsearch').toggle("fast");
    $('#withLicense').val('');
    $('#inLanguage').val('');
}

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
    $('#preview').empty().append(jsonData["content"]);
    $('#preview').show();
}

function searchFor(keyword) {
    $('#tags').val(keyword);
    search();
}

function loadContent(url){
    var request = window.superagent;
    request.get(url).end(
        function(err, res) {
            if(res.ok){
                showContent(res.body);
            } else {
                console.log("Dette gikk ikke bra...");
            }
        }
    )
}

function searchOk(jsonData){
    $('#resultsection').empty();
    $.each(jsonData, function(index, element) {
        console.log(element)
        var resultElem = '<div class="w3-row result"><div class="w3-col"><a href="#" onclick=\'loadContent("' + element["metaUrl"] + '");\' class="ndla-blue">' + element["title"] + '</a></div>' + '<a href="'+ element["metaUrl"] +'" class="w3-small">' + element["metaUrl"] + '</a>' + '<span class="w3-small"> - (' + element["license"] + ')</span></div>'
        $('#resultsection').append(resultElem);
    });
}


function search() {
    var tagString = $('#tags').val();
    var license = $('#withLicense').val();
    var language = $('#inLanguage').val();
    var searchUrl = "/content/"

    var request = window.superagent;
    var getRequest = request.get(searchUrl)

    if(tagString) {
        getRequest = getRequest.query("tags=" + tagString)
    }
    if(license) {
        getRequest = getRequest.query("license=" + license)
    }
    if(language) {
        getRequest = getRequest.query("language=" + language)
    }

    $('#detailrow').hide();
    $('#preview').hide();

    getRequest.end(
        function(err, res) {
            if(res.ok){
                searchOk(res.body);
            } else {
                console.log("Dette gikk ikke bra...");
            }
        }
    )
}