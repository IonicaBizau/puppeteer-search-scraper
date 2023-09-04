"use strict";

const SearchScraper = require("../lib");

const headless = true
SearchScraper.configure([
    {
        name: "GoogleCom"
      , debugDir: __dirname + "/public/GoogleCom"
      , searchUrl: "http://google.com/webhp?num=100&hl=en"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE_MOBILE
      , headless
      , device: "iPhone X"
    }
  , {
        name: "GoogleCoUk"
      , debugDir: __dirname + "/public/GoogleCoUk"
      , searchUrl: "http://google.co.uk/webhp?num=100&hl=en"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE
      , headless
    }
  , {
        name: "GoogleCoAu"
      , debugDir: __dirname + "/public/GoogleComAu"
      , searchUrl: "http://google.com.au/webhp?num=100&hl=en"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE
      , headless
    }
  , {
        name: "Bing"
      , debugDir: __dirname + "/public/Bing"
      , searchUrl: "http://bing.com/"
      , limit: 30
      , selectors: SearchScraper.Selectors.BING
      , headless
    }
])

const QUERY = "who killed kennedy";

(async () => {
	console.log(">>>> Google.com")
	console.log(await SearchScraper.search(QUERY, { engine: "GoogleCom" }))

	//console.log(">>>> Google.co.uk")
	//console.log(await SearchScraper.search(QUERY, { engine: "GoogleCoUk" }))

	//console.log(">>>> Google.com.au")
  	//console.log(await SearchScraper.search(QUERY, { engine: "GoogleCoAu" }))

	//console.log(">>>> Bing.com")
  	//console.log(await SearchScraper.search(QUERY, { engine: "Bing" }))
})()
