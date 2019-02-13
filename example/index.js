"use strict";

const puppeteerGoogleScraper = require("../lib");

puppeteerGoogleScraper("who killed kenedy", {
    limit: 20
  , headless: false
}).then(d => {
    console.log(d)
    // [ { title: 'John F. Kennedy assassination conspiracy theories - Wikipedia',
    //     url: 'https://en.wikipedia.org/wiki/John_F._Kennedy_assassination_conspiracy_theories' },
    //   { title: 'Assassination of John F. Kennedy - Wikipedia',
    //     url: 'https://en.wikipedia.org/wiki/Assassination_of_John_F._Kennedy' },
    //   { title: 'John F. Kennedy assassinated - HISTORY',
    //     url: 'https://www.history.com/this-day-in-history/john-f-kennedy-assassinated' },
    //   { title: 'November 22, 1963: Death of the President | JFK Library',
    //     url: 'https://www.jfklibrary.org/learn/about-jfk/jfk-in-history/november-22-1963-death-of-the-president' },
    //   { title: 'Who killed JFK? | HowStuffWorks',
    //     url: 'https://history.howstuffworks.com/history-vs-myth/who-killed-jfk.htm' },
    //   { title: 'The Man Who Killed Kennedy: The Case Against LBJ: Amazon.es ...',
    //     url: 'https://www.amazon.es/Man-Who-Killed-Kennedy-Against/dp/1629144894' },
    //   ...
    // ]
}).catch(err => {
    console.error(err)
})
