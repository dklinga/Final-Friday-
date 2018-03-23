var url = "https://api.nytimes.com/svc/topstories/v2/business.json";
url += '?' + $.param({
    'api-key': "2118d3827b3d449e94e71783ba06ee1a"
});
$.ajax({
    url: url,
    method: 'GET',
}).done(function (result) {
    console.log(result);
    document.getElementById("headline").innerHTML = result.results["0"].title;
    document.getElementById("headline1").innerHTML = result.results["1"].title;
    document.getElementById("headline2").innerHTML = result.results["2"].title;
    document.getElementById("headline3").innerHTML = result.results["3"].title;
    document.getElementById("headline4").innerHTML = result.results["4"].title;
    document.getElementById("headline5").innerHTML = result.results["5"].title;


    document.getElementById("abstract").innerHTML = result.results["0"].abstract;
    document.getElementById("abstract1").innerHTML = result.results["1"].abstract;
    document.getElementById("abstract2").innerHTML = result.results["3"].abstract;
    document.getElementById("abstract3").innerHTML = result.results["4"].abstract;
    document.getElementById("abstract4").innerHTML = result.results["5"].abstract;
    document.getElementById("abstract5").innerHTML = result.results["6"].abstract;


    document.getElementById("byline").innerHTML = result.results["0"].byline;
    document.getElementById("byline1").innerHTML = result.results["1"].byline;
    document.getElementById("byline2").innerHTML = result.results["2"].byline;
    document.getElementById("byline3").innerHTML = result.results["3"].byline;
    document.getElementById("byline4").innerHTML = result.results["4"].byline;
    document.getElementById("byline5").innerHTML = result.results["5"].byline;



    $("#url").append("<a href=" + result.results["0"].url + ">" +
        result.results["0"].url + "</a>");
    $("#url1").append("<a href=" + result.results["1"].url + ">" +
        result.results["1"].url + "</a>");
    $("#url2").append("<a href=" + result.results["2"].url + ">" +
        result.results["2"].url + "</a>");
    $("#url3").append("<a href=" + result.results["3"].url + ">" +
        result.results["3"].url + "</a>");
    $("#url4").append("<a href=" + result.results["4"].url + ">" +
        result.results["4"].url + "</a>");
    $("#url5").append("<a href=" + result.results["5"].url + ">" +
        result.results["5"].url + "</a>");

}).fail(function (err) {
    throw err;
});


/* my-financial.js */
// **************************************************************************
// GLOBALS
//
// **************************************************************************
//
// ---- CONSTANTS ----
const IEXSuffix = "/company";
const IEXEndpoint = "https://api.iextrading.com/1.0/stock/";
const AlphaAPIKEY = "51J2DL5ZC7RQBE6J";
const AlphaBatch = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=";
const AlphaSuffix = "&apikey=" + AlphaAPIKEY;
const AlphaTS = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=";
const AlphaTSSuffix = AlphaSuffix;

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&outputsize=full&apikey=demo

//
// ---- VARIABLES ----
// Initialize Firebase
  var config = {
    "apiKey": "AIzaSyBAFhIsrnS798a2VSRGcvbuzSb-woD6z6E",
    "authDomain": "stocks-info-36826.firebaseapp.com",
    "databaseURL": "https://stocks-info-36826.firebaseio.com",
    "projectId": "stocks-info-36826",
    "storageBucket": "stocks-info-36826.appspot.com",
    "messagingSenderId": "799807828291"
  };

  var database;
  var currentWatchRow = {
    "symbol": "",
    "currentPrice": 0,
    "previousPrice": 0,
    "change": 0,
    "pctChange": 0,
    "companyName": "",
    "website": "",
    "description": ""
  };

  firebase.initializeApp(config);

  database = firebase.database();

  // **************************************************************************

$(document).ready(() => {
  // -----------------------------------------------------------------------------------------
  // initialize database parent objects
  function initdb() {
    console.log("in initdb()");
  }


  // --------------------------------------------------------------------------
  // buildWatchBtn uses adds watch button
  // the stocks information
  function buildWatchBtn(stockSym) {
    var watchBtn = $("<button>");

    watchBtn.addClass("ml-2 btn btn-success btn-sm watch-button").
            attr("stock-id", stockSym).
            html("+ Watchlist");
            // html("Add to &#x2605;");

    return watchBtn;
  }

  // --------------------------------------------------------------------------
  // renderWatchTable adds the current stock symbol to the watchlist
  //
  function renderWatchTable(sym) {
    var tRow = $("<tr>"),
        tCellSym = $("<td>"),
        tCellPrice = $("<td>"),
        tCellChange = $("<td>"),
        tCellPct = $("<td>"),
        tCellRmv = $("<td>"),
        delBtn = $("<button>"),
        dbPath = "watchlist/" + sym,
        price, changeInPrice, pctCh,
        dbVal;

    // read current stock price from database
    database.ref(dbPath).on("value", (snapshot) => {
      dbVal = snapshot.val();
      console.log("dbVal: " + JSON.stringify(dbVal));
      console.log("price: " + dbVal.stockPrice);
      price = dbVal.stockPrice;
      changeInPrice = dbVal.change;
      pctCh = dbVal.pctChange;

      console.log("in renderWatchTable: " + price);
      // console.log("converted price: " + numeral(cprice).format("$0,0.00"));
      tCellSym.text(sym);
      tCellPrice.html(numeral(price).format("$0,0.00"));
      tCellChange.html(numeral(changeInPrice).format("+0,0.00"));
      tCellPct.html(numeral(pctCh).format("0.00%"));
      delBtn.attr("id", "btn-" + sym).
            attr("data-name", sym).
            addClass("custom-remove remove-from-watchlist").
            text("x");
      tCellRmv.append(delBtn);
      tRow.attr("id", "wrow-" + sym).
           attr("stock-sym", sym);
      // empty out row so as to not repeat stock symbol on watchlist
      $("#wrow-" + sym).empty();
      tRow = $("#wrow-" + sym).append(tCellSym, tCellPrice, tCellChange, tCellPct, tCellRmv);
    }, (errorObject) => {
      console.log("Errors handled: " + errorObject.code);
    });
    $("#watchlist-caption").show();
    $("#watch-table-header").show();
    $("#watch-table").prepend(tRow);
  }

  // --------------------------------------------------------------------------
  // addToWatchDb adds symbol and price to the database, symbol is the parent
  // and price is the child
  //
  function addToWatchDb(sym, price) {
    var dbPath = "watchlist/" + sym;

    currentWatchRow.currentPrice = price;
    database.ref(dbPath).update({"stockPrice": price});
  }

  // --------------------------------------------------------------------------
  // addRestInfoWatchDb() adds price change, percentage change to the database
  //
  function addRestInfoWatchDb(sym, previousPrice) {
    var dbPath = "watchlist/" + sym,
        change,
        pctChange;

    console.log("in addRestInfoWatchDb()");

    // get current stock price from database and calculate change in price
    database.ref(dbPath).on("value", (snapshot) => {
      change = snapshot.val().stockPrice - previousPrice;
      console.log("change in addRestInfoWatchDB: " + change);
    }, (errorObject) => {
      console.log("Errors handled: " + JSON.stringify(errorObject));
    });
    pctChange = change / previousPrice;
    currentWatchRow.pctChange = pctChange;
    currentWatchRow.previousPrice = previousPrice;
    currentWatchRow.change = change;

    console.log("current watch row: " + JSON.stringify(currentWatchRow));

    database.ref(dbPath).update({
      previousPrice,
      change,
      pctChange
    }, (errorObject) => {
      console.log("Errors handled: " + JSON.stringify(errorObject));
    });
  }

  // --------------------------------------------------------------------------
  // renderStockInfo uses the bootstrap 4 'card' functionality to render
  // the stocks information
  //
  function renderStockInfo(data) {
    var stockDiv = $("<div>").addClass("card-body").
                              attr("id","stock-info"),
        cardh5 = $("<h5>").addClass("card-title"),
        cardBody = $("<p>").addClass("card-text ticker-paragraph"),
        addToWatchBtn = buildWatchBtn(data["1. symbol"]),
        htmlText;

    // empty out any prior content of #stock-ticker-content
    $("#stock-ticker-content").empty();

    cardh5.text(data["1. symbol"]).
           attr("stock-sym", data["1. symbol"]);
    htmlText = "Price: " + numeral(data["2. price"]).format("$0,0.00") + "<br />";
    htmlText += "Volume: " + data["3. volume"] + "<br />";
    htmlText += "Company: <a href=" + currentWatchRow.website + " target=\"_blank\">" + currentWatchRow.companyName + "</a><br />";
    htmlText += "About: " + currentWatchRow.description + "<br />";

    cardBody.html(htmlText).
            append(addToWatchBtn);

    stockDiv.append(cardh5, cardBody);
    $("#stock-ticker-content").append(stockDiv);
  }


  // --------------------------------------------------------------------------
  // buildBatchURL calls the alpha batch function with only one stock symbol
  //
  function buildBatchURL(sym, fn) {
    var result,
        queryURL;

    queryURL = AlphaBatch + sym + AlphaSuffix;
    console.log("in buildBatchURL() batch url: " + queryURL);

    // get stock symbol information
    stockInfoURL(sym);

    $.ajax({
      "method": "GET",
      "url": queryURL
    }).
    done((response) => {
      result = response;
      if (result["Stock Quotes"].length === 0) {
        console.log("Stock does not exist");
      } else {
        switch (fn) {
          case "ticker":
            renderStockInfo(result["Stock Quotes"][0]);
            break;
          case "watch":
            console.log("buildBatch watch Price: " + numeral(result["Stock Quotes"][0]["2. price"]).format("$0,0.00"));
            currentWatchRow.symbol = sym;
            currentWatchRow.currentPrice = result["Stock Quotes"][0]["2. price"];
            addToWatchDb(sym, result["Stock Quotes"][0]["2. price"]);
            break;
          default:
            break;
        }
      }
    }).
    fail(() => {
      console.log("Failure from alpha batch function");
    });
  }

  // ---------------------------------------------------------------------
  // stockInfoURL() gets stock information based on stock symbol
  //
  function stockInfoURL(sym) {
    var queryURL;

    queryURL = IEXEndpoint + sym + IEXSuffix;
    console.log("in stockInfoURL -- queryURL: " + queryURL);

    $.ajax({
      "method": "GET",
      "url": queryURL
    }).
    done((response) => {
      console.log("stock info response: " + JSON.stringify(response));
      currentWatchRow.companyName = response.companyName;
      currentWatchRow.website = response.website;
      currentWatchRow.description = response.description;
    }).
    fail(() => {
      console.log("Failure from Alpha Time Series function");
    });
  }

  // ---------------------------------------------------------------------
  // buildTimeSeriesURL() builds time series url
  //
  function buildTimeSeriesURL(sym) {
    var result,
        keys,
        secondObject,
        queryURL;

    // get time-last-refreshed
    queryURL = AlphaTS + sym + AlphaTSSuffix;
    console.log("in buildTimeSeriesURL() url: " + queryURL);

    $.ajax({
      "method": "GET",
      "url": queryURL
    }).
    done((response) => {
      result = response["Time Series (Daily)"];
      // store the keys of result in the variable keys
      keys = Object.keys(result);
      secondObject = keys[0 + 1];
      // get previous Day's object, which is always the second element
      console.log("previous day price: " + result[secondObject]["4. close"]);
      currentWatchRow.previousPrice = result[secondObject]["4. close"];
      addRestInfoWatchDb(sym, result[secondObject]["4. close"]);
    }).
    fail(() => {
      console.log("Failure from Alpha Time Series function");
    });
  }

  // -----------------------------------------------------------------------
  // removeFromWatchList() removes the selected stock from the watchlist
  //
  function removeFromWatchList() {
    var stockSymbol = $(this).attr("data-name");

    console.log("in removeFromWatchList, remove: " + stockSymbol);

    // remove row so as to not repeat stock symbol on watchlist
    $("#wrow-" + stockSymbol).remove();

    // check if watch table is empty
    if ($("#watch-table").children().length === 0) {
      $("#watch-table-header").hide();
      $("#watchlist-caption").hide();
    }
  }

  // -----------------------------------------------------------------------
  // implements "stock-ticker" function
  //
  $("#stock-ticker").on("click", (event) => {
    var stockSymbol = $("#stock-input").val().
                                        trim();

    console.log("in stock-ticker() ");
    $("#financial-text").empty();

    // clear stock-input field
    $("#stock-input").val("");

    event.preventDefault();
    buildBatchURL(stockSymbol, "ticker");

  });

  $("#wlist-button").on("click", (event) => {

    console.log("in wlist-button() ");
    $("#financial-text").empty();

    event.preventDefault();

  });

  // -----------------------------------------------------------------------
  // addToWatchList adds selected stock to watch list
  //
  function addToWatchList(event) {
    var stockSymbol = $(this).attr("stock-id");

    event.preventDefault();
    // empty out stock-ticker content
    $("#stock-ticker-content").empty();

    console.log("in addToWatchList() ");
    console.log("stock symbol: " + stockSymbol);
    // $("#financial-text").empty();
    // get current price of stock symbol
    buildBatchURL(stockSymbol, "watch");

    // get yesterday's close price of stock symbol
    buildTimeSeriesURL(stockSymbol);

    // add row to watchListTable
    renderWatchTable(stockSymbol);
  }

  initdb();
  $("#watch-table-header").hide();
  $("#watchlist-caption").hide();

  // adds the selected stock to watch list
  $(document).on("click", ".watch-button", addToWatchList);

  // remove the selected stock from watch list
  $(document).on("click", ".remove-from-watchlist", removeFromWatchList);

  // End of document.ready()
});

