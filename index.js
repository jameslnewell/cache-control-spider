var crawler     = require('./lib/crawler');
var extractCss  = require('./lib/plugins/url-extractor-css');
var extractHtml = require('./lib/plugins/url-extractor-html');

var chalk       = require('chalk');
var parse       = require('parse-cache-control');

var CATEGORY_NOHEADER = 'No Cache-Control header';
var categories  = {};

crawler()
  .add('https://qa.online4.nib.com.au/')
  .use(extractCss({
    filter: function(url) {
      return /^http(s?):\/\/[a-z]+\.online4\.nib\.com\.au\//.test(url);
    }
  }))
  .use(extractHtml({
    filter: function(url) {
      return /^http(s?):\/\/[a-z]+\.online4\.nib\.com\.au\//.test(url);
    }
  }))
  .use(function(crawler) {
    crawler.on('fetched', function(url, res) {

      if (res.getHeader('cache-control')) {
        categories[res.getHeader('cache-control')] = categories[res.getHeader('cache-control')] || [];
        categories[res.getHeader('cache-control')].push(url);
      } else {
        categories[CATEGORY_NOHEADER] = categories[CATEGORY_NOHEADER] || [];
        categories[CATEGORY_NOHEADER].push(url);
      }

    });
  })
  .on('error', function(err) {
    console.error('error: ', err.url, err);
  })
  .on('finished', function() {

    for (var cat in categories) {
      if (categories.hasOwnProperty(cat)) {
        console.log('Cache-Control: '+chalk.blue(cat)+':');
        categories[cat].forEach(function(item) {
          console.log(item);
        });
        console.log('\n\n');
      }
    }

  })
  .start()
;