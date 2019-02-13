## Documentation

You can see below the API reference of this module.

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

