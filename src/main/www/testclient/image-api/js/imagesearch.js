var searchUrl = "/images/";

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
        var previewImg = '<a href="imagedetail.html?id=' + element["id"] + '" target="_blank" class="imgpreview"><img src="' + element["previewUrl"] + '"/></a>';
        $('#resultsection').append(previewImg);
    });
}

function search() {
    var tagString = $('#tags').val();
    var minSize = $('#minSize').val();
    var license = $('#withLicense').val();
    var language = $('#inLanguage').val();

    var request = window.superagent;
    var getRequest = request.get(searchUrl)

    if(tagString) {
        getRequest = getRequest.query("query=" + tagString)
    }
    if(minSize) {
        getRequest = getRequest.query("minimum-size=" + minSize)
    }
    if(license) {
        getRequest = getRequest.query("license=" + license)
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