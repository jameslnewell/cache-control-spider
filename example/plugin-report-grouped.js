var chalk = require('chalk');

var CACHE_HEADER = 'Cache-Control';

module.exports = function(crawler) {
  var categories = {};

  crawler
    .on('response', function(url, res) {

      if (res.getHeader(CACHE_HEADER)) {
        categories[res.getHeader(CACHE_HEADER)] = categories[res.getHeader(CACHE_HEADER)] || [];
        categories[res.getHeader(CACHE_HEADER)].push(url);
      } else {
        categories['<No Cache-Control header>'] = categories['<No Cache-Control header>'] || [];
        categories['<No Cache-Control header>'].push(url);
      }

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
  ;

};