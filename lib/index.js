"use strict";

const puppeteer = require('puppeteer')
    , devices = puppeteer.devices
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
        if (this._scrapers[c.name]) {
            console.warn(`There was already registered a scraper with this name: ${c.name}`)
        }
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

    static trySearch (term, options, limit) {
        const scr = SearchScraper.getScraper(options.engine)
        return scr.search(term, options, limit)
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
	  , page_limit: 10
          , headless: true
          , debugDir: ""
          , searchUrl: "https://google.com"
          , selectors: {}
          , onFileWrite (path, content) {}
        }, options)
    }

    async trySearch (term, _options, times = 10) {
        for (let i = 0; i < times; ++i) {
            try {
                const res = await this.search(term, _options)
                if (res.length) {
                    return res
                } else {
                    this.log(`No data for ${term} search term.`)
                }
            } catch (e) {
                this.log(`Failed to search ${term} but trying again.`)
                this.log(e.stack)
            }
        }
        return []
    }

    async search (term, _options) {

        const options = Object.assign({}, this.options, _options)
        options.selectors.result = options.selectors.result || {}

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

            try {
                this.log("Saving " + index)
                const p = `${options.debugDir}/${index}`
                this.log(">> ", p)
                await page.screenshot({ path: `${p}.png` })
                this.log("Screenshot saved.")
                const html = await page.$eval("html", e => e.outerHTML)
                this.log("HTML Saved")
                const filePath = `${p}.html`
                fs.writeFileSync(filePath, html)
                this.log(">> File written.")
                options.onFileWrite(filePath, html);
                this.log(">> after file write")
            } catch (e) {
                console.error("Failed to save HTML and image, but continuing: " + index)
                console.error(e.stack)
            }
        }

        this.log("Launching the page")

        const page = await browser.newPage();
        page.setRequestInterception(true)

        let inflight = 0

        page.on('request', request => {
            setTimeout(function() {
                if (!request.is_finished) {
                    page.emit('requestfailed', request)
                }
            }, 7000);
            inflight += 1
            request.continue()
        })

        page.on('requestfinished', request => {
            request.is_finished = true
            inflight -= 1
        })

        page.on('requestfailed', request => {
            request.is_finished = true
            inflight -= 1
        })

        const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout))
        const wait = async ({ waitUntil }) => {
            const maxIdle = waitUntil === 'networkidle0' ? 0 : 2

            while (inflight > maxIdle) {
                await sleep(100)
            }

            await sleep(500)

            if (inflight > maxIdle) {
                await wait({ waitUntil })
            }
        }


        if (options.device) {
            const simulator = devices[options.device] || options.device
            await page.emulate(simulator);
        }

        await page.goto(options.searchUrl);
        await saveHtmlAndImg(1)


	const acceptTerms = async () => {
		await sleep(1000)
		if (options.selectors.accept_terms_button) {
                    if (typeof options.selectors.accept_terms_button === "function") {
                        try {
                            await sleep(2000)
                            await page.evaluate(options.selectors.accept_terms_button)
                        } catch (e) {
                            console.error(e)
                        }
                    } else {
                        try {
                            await page.click(options.selectors.accept_terms_button, { delay: 20 })
                            await sleep(1000)
                            await page.click(options.selectors.accept_terms_button, { delay: 20 })
                        } catch (e) {
                            console.error(e)
                        }
                    }
		}
		await sleep(1000)
	}

        this.log("Waiting for the input")
        if (options.selectors.search_box) {
            const searchInputSelector = options.selectors.search_box
            await page.waitForTimeout(2000)
            await saveHtmlAndImg(2)

	    this.log("Accepting terms")
	    await acceptTerms()

            await page.waitForSelector(searchInputSelector);


            this.log("Typing the search term")
            await page.type(searchInputSelector, term, { delay: 100 }); // Types slower, like a user

            await saveHtmlAndImg(3)
            await page.keyboard.press('Enter')
            await wait("networkidle0")
            this.log("Waiting for the response")
            await saveHtmlAndImg(4)
        }

        this.log(">>> After Searching.")

	let currentPage = 0
        let nextIndex = 4
        let allLinks = []

        const doSync = async () => {
            this.log(">> Do Sync", currentPage)
	    if (++currentPage > options.page_limit) {
		return
	    }
	    this.log(`Scraping results' page: ${currentPage}`)
            this.log("Random timeout")
            await page.waitForTimeout(Math.floor(1000 + Math.random() * 2000))
            await saveHtmlAndImg(++nextIndex)
            this.log("Waiting for the page results")
            const resultSelector = options.selectors.result_items
            try {
                await page.waitForSelector(resultSelector);
            } catch (e) {
                this.log("Did not get the results after waiting. Perhaps there are no results returned by the search engine;.")
                return
            }

            this.log("Parsing the page results")

            let newLinks = await page.evaluate(options.scrape_fn || (opts => {

                const resultSelector = opts.selectors.result_items
                    , titleSelector = opts.selectors.result.title
                    , linkSelector = opts.selectors.result.link
                    , descriptionSelector = opts.selectors.result.description

                return [].slice.apply(document.querySelectorAll(resultSelector)).map(function (c) {
                    var newItem = {
                        title: (
                            (titleSelector ? c.querySelector(titleSelector) : c) ||
                            { textContent: null }
                        ).textContent
                      , url: (
                            (linkSelector ? c.querySelector(linkSelector) : c) ||
                            { href: null }
                        ).href
                      , description: (
                            (descriptionSelector ? c.querySelector(descriptionSelector) : c) ||
                            { textContent: null }
                        ).textContent
                    }
                    c.remove()
                    return newItem
                })
            }), options)

            options.selectors.result.filter = options.selectors.result.filter || (c => c.title !== null && /^https?:\/\//.test(c.url))
            if (options.selectors.result.filter) {
                newLinks = newLinks.filter(options.selectors.result.filter)
            }


            // Hook for results
            if (options.post_results_found) {
                await options.post_results_found(page, newLinks)
            }

            allLinks.push.apply(allLinks, newLinks)

            if (options.filter) {
                allLinks = options.filter(allLinks)
            }

            allLinks = Object.values(allLinks.reduce((acc, c) => {
                acc[c.url] = c
                return acc
            }, {}))

            if (allLinks.length > options.limit) {
                return allLinks
            }

            if (options.selectors.next_page) {
                this.log("Random timeout")
                await page.waitForTimeout(Math.floor(1000 + Math.random() * 2000))
                const existsNext = await page.$(options.selectors.next_page)
                if (!existsNext) {
                    return allLinks
                }
                this.log("Random timeout")
                await page.waitForTimeout(Math.floor(1000 + Math.random() * 2000))
                this.log("Going to the next page")
                await page.click(options.selectors.next_page, { delay: 20 })
            } else if (options.selectors.load_more) {
                const hasLoadmore = await page.$(options.selectors.load_more)
                if (!hasLoadmore) {
                    return
                }
                this.log("Random timeout")
                await page.waitForTimeout(Math.floor(1000 + Math.random() * 2000))
                this.log("Loading more, until the number of needed results is hit.")
                await page.click(options.selectors.load_more, { delay: 20 })
            }

            await wait("networkidle0")
            await doSync()
        }

        await doSync()

        this.log("Closing the browser")
	    try {
		await browser.close()
	    } catch (e) {}
        return allLinks.slice(0, options.limit)
    }
}

// Scrapers and Selectors
const clickAcceptAllBtn = () => {
    const btns = [].slice.call(document.querySelectorAll("button")).filter(c => /accept all/i.test(c.textContent))
    btns.forEach(c => c.click())
}

SearchScraper._scrapers = {}
SearchScraper.Selectors = {
    GOOGLE: {
        search_box: "form[action='/search'] input[type='text']"
      , result_items: "#search [data-hveid], #search [data-ved]"
      , next_page: "#pnnext"
      , result: {
            title: "h3"
          , link: "a[onmousedown], a[ping], a[data-jsarwt]"
          , description: "div[data-content-feature='1']"
        }
      , accept_terms_button: clickAcceptAllBtn
    },
    GOOGLE_MOBILE: {
        search_box: "form[action='/search'] input[type='search']"
      , result_items: "[data-hveid]"
      , load_more: "a[jsname][data-ved][jsaction][aria-label]"
      , result: {
            title: "[aria-level='3']"
          , link: "a[ping]"
          , description: "div[data-content-feature='1']"
        }
      , accept_terms_button: clickAcceptAllBtn
    },
    BING: {
        search_box: "form[action='/search'] input[type='text']"
      , result_items: "#b_results .b_algo"
      , next_page: "#b_results > li.b_pag > nav > ul > li:last-of-type > a"
      , result: {
            title: "h2"
          , link: "a"
          , description: "p"
        }
      , accept_terms_button: "#bnp_btn_accept"
    }
}

module.exports = SearchScraper
