<!-- Please do not edit this file. Edit the `blah` field in the `package.json` instead. If in doubt, open an issue. -->


















# puppeteer-search-scraper

 [![Support me on Patreon][badge_patreon]][patreon] [![Buy me a book][badge_amazon]][amazon] [![PayPal][badge_paypal_donate]][paypal-donations] [![Ask me anything](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/puppeteer-search-scraper.svg)](https://www.npmjs.com/package/puppeteer-search-scraper) [![Downloads](https://img.shields.io/npm/dt/puppeteer-search-scraper.svg)](https://www.npmjs.com/package/puppeteer-search-scraper) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

<a href="https://www.buymeacoffee.com/H96WwChMy" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>







> Scrape Search Engines using Puppeteer

















## :cloud: Installation

```sh
# Using npm
npm install --save puppeteer-search-scraper

# Using yarn
yarn add puppeteer-search-scraper
```













## :clipboard: Example



```js
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











## :question: Get Help

There are few ways to get help:



 1. Please [post questions on Stack Overflow](https://stackoverflow.com/questions/ask). You can open issues with questions, as long you add a link to your Stack Overflow question.
 2. For bug reports and feature requests, open issues. :bug:
 3. For direct and quick help, you can [use Codementor](https://www.codementor.io/johnnyb). :rocket:





## :memo: Documentation


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














## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :sparkling_heart: Support my projects
I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:


 - Starring and sharing the projects you like :rocket:
 - [![Buy me a book][badge_amazon]][amazon]—I love books! I will remember you after years if you buy me one. :grin: :book:
 - [![PayPal][badge_paypal]][paypal-donations]—You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on Patreon][badge_patreon]][patreon]—Set up a recurring monthly donation and you will get interesting news about what I'm doing (things that I don't share with everyone).
 - **Bitcoin**—You can send me bitcoins at this address (or scanning the code below): `1P9BRsmazNQcuyTxEqveUsnf5CERdq35V6`

    ![](https://i.imgur.com/z6OQI95.png)


Thanks! :heart:
























## :scroll: License

[MIT][license] © [Ionică Bizău][website]






[license]: /LICENSE
[website]: https://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
[badge_patreon]: https://ionicabizau.github.io/badges/patreon.svg
[badge_amazon]: https://ionicabizau.github.io/badges/amazon.svg
[badge_paypal]: https://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: https://ionicabizau.github.io/badges/paypal_donate.svg
[patreon]: https://www.patreon.com/ionicabizau
[amazon]: http://amzn.eu/hRo9sIZ
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
