"use strict";

const puppeteerGoogleScraper = require("../lib");

puppeteerGoogleScraper("who killed kenedy", {
    limit: 20
  , headless: false
}).then(d => {
    console.log(d)
    // [ { title: 'Why Node.js is cool – Andrew Winstead – Medium',
    //     url: 'https://medium.com/@awinste/why-node-js-is-cool-a61710eec906' },
    //   { title: 'Why Node.js Is Totally Awesome - Chetan Surpur',
    //     url: 'http://chetansurpur.com/blog/2010/10/why-node-js-is-totally-awesome.html' },
    //   ...  ]
}).catch(err => {
    console.error(err)
})
