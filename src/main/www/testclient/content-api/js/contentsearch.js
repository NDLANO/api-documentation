var searchUrl = "/content/";

function showAdvancedSearch() {
    $('#advancedsearch').toggle("fast");
    $('#withLicense').val('');
    $('#inLanguage').val('');
}

function searchFor(keyword) {
    $('#tags').val(keyword);
    search();
}

function searchOk(jsonData){
    $('#resultsection').empty();
    $.each(jsonData, function(index, element) {
        console.log(element)
        var resultElem = '<div class="w3-row result"><div class="w3-col"><a href="contentdetail.html?id=' + element["id"]+ '" target="_blank" class="ndla-blue">' + element["title"] + '</a></div>' + '<a href="'+ element["metaUrl"] +'" class="w3-small">' + element["metaUrl"] + '</a>' + '<span class="w3-small"> - (' + element["license"] + ')</span></div>'
        $('#resultsection').append(resultElem);
    });
}


function search() {
    var tagString = $('#tags').val();
    var license = $('#withLicense').val();
    var language = $('#inLanguage').val();

    var request = window.superagent;
    var getRequest = request.get(searchUrl)

    if(tagString) {
        getRequest = getRequest.query("query=" + tagString)
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