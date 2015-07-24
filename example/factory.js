var crawler     = require('../lib/crawler');
var extractCss  = require('../lib/plugins/url-extractor-css');
var extractHtml = require('../lib/plugins/url-extractor-html');
var reportGroup = require('./plugin-report-grouped');

var NIB_URL = /^http(s?):\/\/[a-z]+\.online4\.nib\.com\.au\//;

module.exports = function() {

  return crawler()
    .use(extractCss({
      accept: function(url) {
        return NIB_URL.test(url);
      }
    }))
    .use(extractHtml({
      accept: function(url) {
        return NIB_URL.test(url);
      }
    }))
    .use(reportGroup)
    .on('error', function(err) {
      console.error('error: ', err.url, err);
    })
  ;

};
