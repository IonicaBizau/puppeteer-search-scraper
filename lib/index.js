"use strict";

const puppeteer = require('puppeteer')
    , fs = require("fs")

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
module.exports = async function (term, options = {}) {

    options = Object.assign({
        limit: 100
      , headless: true
      , debugDir: ""
      , searchUrl: "https://google.com"
    }, options)


    console.log("Loading the browser", options)

    const browser = await puppeteer.launch({
        headless: options.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Debug function
    const saveHtmlAndImg = async index => {
        if (!options.debugDir) {
            return
        }
        console.log("Saving " + index)
        const p = `${options.debugDir}/${index}`
        await page.screenshot({ path: `${p}.png` })
        const html = await page.$eval("html", e => e.outerHTML)
        fs.writeFileSync(`${p}.html`, html)
    }

    console.log("Launching the page")

    const page = await browser.newPage();
    await page.goto(options.searchUrl);

    await saveHtmlAndImg(1)

    console.log("Waiting for the input")
    const searchInputSelector = "form[action='/search'] input[type='text']"
    await page.waitFor(2000)
    await saveHtmlAndImg(2)
    await page.waitFor(searchInputSelector);
    console.log("Typing the search term")
    await page.type(searchInputSelector, term, { delay: 100 }); // Types slower, like a user
    await saveHtmlAndImg(3)
    await Promise.all([
        page.waitForNavigation({
            waitUntil: "networkidle0"
        })
      , await page.keyboard.press('Enter')
    ])
    console.log("Waiting for the response")
    //await page.waitForResponse(res => {
    //    return res.url().includes("/search")
    //})
    await saveHtmlAndImg(4)

    let nextIndex = 4
    const allLinks = []
    const doSync = async function () {
        console.log("Random timeout")
        await page.waitFor(Math.floor(1000 + Math.random() * 2000))
        await saveHtmlAndImg(++nextIndex)
        console.log("Waiting for the page results")
        const resultSelector = "#search a[onmousedown], #search a[ping]"
        await page.waitFor(resultSelector);
        console.log("Parsing the page results")
        const newLinks = await page.evaluate(resultSelector => {
            return [].slice.apply(document.querySelectorAll(resultSelector)).map(function (c) {
                return { title: (c.querySelector("h3") || { textContent: null }).textContent, url: c.href }
            }).filter(c => c.title !== null)
        }, resultSelector)

        allLinks.push.apply(allLinks, newLinks)
        if (allLinks.length > options.limit) {
            return allLinks
        }

        const existsNext = await page.$("#pnnext")
        if (!existsNext) {
            return allLinks
        }

        console.log("Random timeout")
        await page.waitFor(Math.floor(1000 + Math.random() * 2000))
        console.log("Going to the next page")
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "networkidle0"
            })
          , await page.click("#pnnext", { delay: 20 })
        ])
        await doSync()
    }

    await doSync()

    //await page.waitFor(100);
    //await page.waitFor("html[itemtype=http://schema.org/SearchResultsPage]");

    console.log("Closing the browser")
    await browser.close();
    return allLinks.slice(0, options.limit)
};
