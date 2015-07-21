var crawler     = require('./lib/crawler');
var extractCss  = require('./lib/plugins/url-extractor-css');
var extractHtml = require('./lib/plugins/url-extractor-html');

var chalk       = require('chalk');
var parse       = require('parse-cache-control');

var NIB_URL       = /^http(s?):\/\/[a-z]+\.online4\.nib\.com\.au\//;
var CACHE_HEADER  = 'Cache-Control';
var categories    = {};

crawler()
  .add('https://dev.online4.nib.com.au/')
  .use(extractCss({
    filter: function(url) {
      return NIB_URL.test(url);
    }
  }))
  .use(extractHtml({
    filter: function(url) {
      return NIB_URL.test(url);
    }
  }))
  .use(function(crawler) {
    crawler.on('response', function(url, res) {

      if (res.getHeader(CACHE_HEADER)) {
        categories[res.getHeader(CACHE_HEADER)] = categories[res.getHeader(CACHE_HEADER)] || [];
        categories[res.getHeader(CACHE_HEADER)].push(url);
      } else {
        categories['<No Cache-Control header>'] = categories['<No Cache-Control header>'] || [];
        categories['<No Cache-Control header>'].push(url);
      }

    });
  })
  .on('error', function(err) {
    console.error('error: ', err.url, err);
  })
  .on('finished', function() {

    for (var cat in categories) {
      if (categories.hasOwnProperty(cat)) {
        console.log('Cache-Control: '+chalk.blue(cat));
        categories[cat].forEach(function(item) {
          console.log(item);
        });
        console.log('\n\n');
      }
    }

  })
  .start()
;