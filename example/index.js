"use strict";

const SearchScraper = require("../lib");

const headless = false
SearchScraper.configure([
    {
        name: "GoogleCom"
      , debugDir: "public/GoogleCom"
      , searchUrl: "http://google.com/webhp?num=100"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE
      , headless
    }
  , {
        name: "GoogleCoUk"
      , debugDir: "public/GoogleCoUk"
      , searchUrl: "http://google.co.uk/webhp?num=100"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE
      , headless
    }
  , {
        name: "GoogleCoAu"
      , debugDir: "public/GoogleComAu"
      , searchUrl: "http://google.com.au/webhp?num=100"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE
      , headless
    }
  , {
        name: "Bing"
      , debugDir: "public/Bing"
      , searchUrl: "http://bing.com/"
      , limit: 100
      , selectors: SearchScraper.Selectors.BING
      , headless
    }
])

const QUERY = "who killed kennedy"
console.log(">>>> Google.com")
SearchScraper.search(QUERY, { engine: "GoogleCom" }).then(res => {
    console.log(res)
    console.log(">>>> Google.com")
    return SearchScraper.search(QUERY, { engine: "GoogleCom" })
}).then(res => {
    console.log(res)
    console.log(">>>> Google.co.uk")
    return SearchScraper.search(QUERY, { engine: "GoogleCoUk" })
}).then(res => {
    console.log(res)
    console.log(">>>> Google.com.au")
    return SearchScraper.search(QUERY, { engine: "GoogleCoAu" })
}).then(res => {
    console.log(res)
//Promise.resolve().then(() => {
    console.log(">>>> Bing.com")
    return SearchScraper.search(QUERY, { engine: "Bing" })
}).then(res => {
    console.log(res)
}).catch(err => {
    console.error(err)
})
