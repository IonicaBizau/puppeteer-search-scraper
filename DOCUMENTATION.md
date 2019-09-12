## Documentation

You can see below the API reference of this module.

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

