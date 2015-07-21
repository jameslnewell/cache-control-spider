# cache-control-spider

Crawl a site for Cache-Control headers.

- extracts URLs from HTML and CSS files
- reports URLs grouped by distinct values for the Cache-Control header

## Installation

    $ git clone git@github.com:jameslnewell/cache-control-spider.git
    $ npm i

## Usage

    $ node index.js http://dev.online4.nib.com.au

## API

### Methods

#### new Crawler()

Create a new crawler.

#### .add(url)

Add a URL to be crawled.

#### .use(plugin)

Attach a plugin to the crawler.

#### .start()

Start crawling URLs.

### Events

#### <>started

Emitted before the crawler has started crawling URLs.

#### <>request

TODO: Emitted before a request is sent to the server.

- url : `String` - the URL
- res : `Request` - the request

#### <>response

Emitted after a response is received from the server.

- url : `String` - the URL
- res : `Response` - the response

#### <>finished

Emitted after the crawler has stopped crawling URLs.

#### <>error

Emitted when an error occurs crawling a URL.

- err : `Error` - the error

### Plugins

#### url-extractor-css(options)

Extract URLs to crawl from CSS files.

- accept : `function(url) : bool` - whether the URL should be crawled

#### url-extractor-html(options)

Extract URLs to crawl from HTML files.

- accept : `function(url) : bool` - whether the URL should be crawled