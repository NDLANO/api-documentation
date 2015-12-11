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
        /*
        var previewImg = '<a href="imagedetail.html?id=' + element["id"] + '" target="_blank" class="imgpreview"><img src="' + element["previewUrl"] + '"/></a>';
        $('#resultsection').append(previewImg);
        */
        var h5pPreview = '<a href="' + element.url + '">' + element.title + '</a>';
        $('#resultsection').append(h5pPreview);
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