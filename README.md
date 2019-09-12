
















# puppeteer-search-scraper

Scrape Search Engines using Puppeteer




## Installation

```sh
$ npm i puppeteer-search-scraper
```









## Example






```js
"use strict";

const SearchScraper = require("puppeteer-search-scraper");

const headless = false
SearchScraper.configure([
    {
        name: "GoogleCom"
      , debugDir: __dirname + "/public/GoogleCom"
      , searchUrl: "http://google.com/webhp?num=100"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE_MOBILE
      , headless
      , device: "iPhone X"
    }
  , {
        name: "GoogleCoUk"
      , debugDir: __dirname + "/public/GoogleCoUk"
      , searchUrl: "http://google.co.uk/webhp?num=100"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE
      , headless
    }
  , {
        name: "GoogleCoAu"
      , debugDir: __dirname + "/public/GoogleComAu"
      , searchUrl: "http://google.com.au/webhp?num=100"
      , limit: 100
      , selectors: SearchScraper.Selectors.GOOGLE
      , headless
    }
  , {
        name: "Bing"
      , debugDir: __dirname + "/public/Bing"
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
    console.log(">>>> Bing.com")
    return SearchScraper.search(QUERY, { engine: "Bing" })
}).then(res => {
    console.log(res)
}).catch(err => {
    console.error(err)
})

```






## Documentation





### `register(c)`

#### Params
- **Object** `c`: The SearchScraper options along with the `name` of the scraper.

#### Return
- **SearchScraper** The instance of the scraper.

### `getScraper(name)`

#### Params
- **String** `name`: The name of the scraper

#### Return
- **SearchScraper** The instance of the scraper.

### `configure(conf)`

#### Params
- **Array** `conf`: An array containing:

### `puppeteerGoogleScraper(term, options)`
Scrape Google using Puppeteer

#### Params
- **String** `term`: The term to search.
- **Object** `options`: An object containing:
    - `limit` (Number): The limit of the results (default: 100)
    - `headless` (Boolean): Whether the browser should be headless or not.

#### Return
- **Promise** A promise resolving with an array of elements containing:
    - `title` (String)
    - `url` (String)






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## License
See the [LICENSE][license] file.


[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
