"use strict";

const puppeteer = require('puppeteer')
    , fs = require("fs")


class SearchScraper {

    log (...args) {
        console.log(...args)
    }

    /**
     * register
     *
     * @name register
     * @function
     * @static
     * @param {Object} c The SearchScraper options along with the `name` of the scraper.
     * @returns {SearchScraper} The instance of the scraper.
     */
    static register (c) {
        return this._scrapers[c.name] = new SearchScraper(c)
    }

    /**
     * getScraper
     *
     * @name getScraper
     * @function
     * @static
     * @param {String} name The name of the scraper
     * @returns {SearchScraper} The instance of the scraper.
     */
    static getScraper (name) {
        return this._scrapers[name]
    }

    /**
     * configure
     *
     * @name configure
     * @function
     * @static
     * @param {Array} conf An array containing:
     */
    static configure (conf) {
        if (!Array.isArray(conf)) {
            conf = [conf]
        }
        return conf.map(c => SearchScraper.register(c))
    }

    static search (term, options) {
        const scr = SearchScraper.getScraper(options.engine)
        return scr.search(term, options)
    }

    /**
     * puppeteerGoogleScraper
     * Scrape Google using Puppeteer
     *
     * @name puppeteerGoogleScraper
     * @function
     * @param {String} term The term to search.
     * @param {Object} options An object containing:
     *
     *     - `limit` (Number): The limit of the results (default: 100)
     *     - `headless` (Boolean): Whether the browser should be headless or not.
     *
     * @returns {Promise} A promise resolving with an array of elements containing:
     *
     *     - `title` (String)
     *     - `url` (String)
     */
    constructor (options) {
        this.options = Object.assign({
            limit: 100
          , headless: true
          , debugDir: ""
          , searchUrl: "https://google.com"
          , selectors: {}
        }, options)
    }

    async search (term, _options) {
        const options = Object.assign({}, this.options, _options)
        this.log("Loading the browser", options)

        const browser = await puppeteer.launch({
            headless: options.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // Debug function
        const saveHtmlAndImg = async index => {
            if (!options.debugDir) {
                return
            }
            this.log("Saving " + index)
            const p = `${options.debugDir}/${index}`
            await page.screenshot({ path: `${p}.png` })
            const html = await page.$eval("html", e => e.outerHTML)
            fs.writeFileSync(`${p}.html`, html)
        }

        this.log("Launching the page")

        const page = await browser.newPage();
        await page.goto(options.searchUrl);

        await saveHtmlAndImg(1)

        this.log("Waiting for the input")
        const searchInputSelector = "form[action='/search'] input[type='text']"
        await page.waitFor(2000)
        await saveHtmlAndImg(2)
        await page.waitFor(searchInputSelector);

        this.log("Typing the search term")
        await page.type(searchInputSelector, term, { delay: 100 }); // Types slower, like a user
        await saveHtmlAndImg(3)
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "networkidle0"
            })
          , await page.keyboard.press('Enter')
        ])

        this.log("Waiting for the response")
        //await page.waitForResponse(res => {
        //    return res.url().includes("/search")
        //})
        await saveHtmlAndImg(4)

        let nextIndex = 4
        const allLinks = []
        const doSync = async () => {
            this.log("Random timeout")
            await page.waitFor(Math.floor(1000 + Math.random() * 2000))
            await saveHtmlAndImg(++nextIndex)
            this.log("Waiting for the page results")
            const resultSelector = options.selectors.result_items
            await page.waitFor(resultSelector);
            this.log("Parsing the page results")
            debugger
            const newLinks = await page.evaluate(opts => {
                const resultSelector = opts.resultSelector
                    , titleSelector = opts.titleSelector
                    , linkSelector = opts.linkSelector

                return [].slice.apply(document.querySelectorAll(resultSelector)).map(function (c) {
                    return {
                        title: (
                            (titleSelector ? c.querySelector(titleSelector) : c) ||
                            { textContent: null }
                        ).textContent
                      , title: (
                            (linkSelector ? c.querySelector(linkSelector) : c) ||
                            { href: null }
                        ).href
                    }
                }).filter(c => c.title !== null)
            }, {
                resultSelector
              , titleSelector: options.selectors.result.title
              , linkSelector: options.selectors.result.link
            })

            allLinks.push.apply(allLinks, newLinks)
            if (allLinks.length > options.limit) {
                return allLinks
            }

            const existsNext = await page.$("#pnnext")
            if (!existsNext) {
                return allLinks
            }

            this.log("Random timeout")
            await page.waitFor(Math.floor(1000 + Math.random() * 2000))
            this.log("Going to the next page")
            await Promise.all([
                page.waitForNavigation({
                    waitUntil: "networkidle0"
                })
              , await page.click("#pnnext", { delay: 20 })
            ])
            await doSync()
        }

        await doSync()

        this.log("Closing the browser")
        await browser.close();
        return allLinks.slice(0, options.limit)
    }
}

// Scrapers and Selectors
SearchScraper._scrapers = {}
SearchScraper.Selectors = {
    GOOGLE: {
        search_box: "form[action='/search'] input[type='text']"
      , result_items: "#search a[onmousedown], #search a[ping]"
      , next_page: "#pnnext"
      , result: {
            title: "h3"
          , link: null
        }
    },
    BING: {
        search_box: "form[action='/search'] input[type='text']"
      , result_items: "#b_results .b_algo"
      , next_page: "#pnnext"
      , result: {
            title: "h2"
          , link: "a"
        }
    }
}

module.exports = SearchScraper
