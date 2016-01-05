var searchUrl = "/h5p/";

function showAdvancedSearch() {
    $('#advancedsearch').toggle("fast");
    $('#minSize').val('');
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
        var resultElem = '<div class="w3-row result"><div class="w3-col"><a href="h5pdetail.html?id=' + element["id"]+ '" target="_blank" class="ndla-blue">' + element["title"] + '</a></div>' + '<a href="'+ element["metaUrl"] +'" class="w3-small">' + element["metaUrl"] + '</a></div>'
        $('#resultsection').append(resultElem);
    });
}

function search() {
    var tagString = $('#tags').val();
    var language = $('#inLanguage').val();

    var request = window.superagent;
    var getRequest = request.get(searchUrl);

    if(tagString) {
        getRequest = getRequest.query("query=" + tagString)
    }
    if(language) {
        getRequest = getRequest.query("language=" + language)
    }

    $('#detailrow').hide();

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