var authKey = "2118d3827b3d449e94e71783ba06ee1a";


var queryTerm = "";
var numResults = 0;
var startYear = 0;
var endYear = 0;


var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + authKey;


function runQuery(numArticles, queryURL) {

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (NYTData) {

        $("#well-section").empty();

        for (var i = 0; i < numArticles; i++) {
            var wellSection = $("<div>");
            wellSection.addClass("well");
            wellSection.addClass("alert alert-dark");
            wellSection.attr("id", "article-well-" + i);
            $("#well-section").append(wellSection);


            if (NYTData.response.docs[i].headline !== "null") {
                console.log(NYTData.response.docs[i].headline.main);
                $("#article-well-" + i)
                    .append("<h3>" + NYTData.response.docs[i].headline.main + "</h3>");
            }


            if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.original) {
                console.log(NYTData.response.docs[i].byline.original);
                $("#article-well-" + i).append("<h5>" + NYTData.response.docs[i].byline.original + "</h5>");
            }


            $("#article-well-" + i).append("<h5>" + NYTData.response.docs[i].section_name + "</h5>");
            $("#article-well-" + i).append("<h5>" + NYTData.response.docs[i].pub_date + "</h5>");
            $("#article-well-" + i)
                .append(
                    "<a href=" + NYTData.response.docs[i].web_url + ">" +
                    NYTData.response.docs[i].web_url + "</a>"
                );
        }

    });

}

$("#search-btn").on("click", function (event) {
 event.preventDefault();

    queryTerm = $("#search").val().trim();
    var newURL = queryURLBase + "&q=" + queryTerm;
    numResults = $("#num-records").val();
    startYear = $("#start-year").val().trim();
    endYear = $("#end-year").val().trim();

    if (parseInt(startYear)) {
        startYear += "0101";
        newURL = newURL + "&begin_date=" + startYear;
    }
    if (parseInt(endYear)) {
        endYear += "0101";
        newURL = newURL + "&end_date=" + endYear;
    }

    runQuery(numResults, newURL);
});

//clear button 
function clear() {
    $("#well-section").empty();
  }

  $("#clear").on("click", clear);