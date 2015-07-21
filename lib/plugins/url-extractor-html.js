var URL         = require('url');
var mime        = require('mime-types');
var htmlparser  = require('htmlparser2');

var TAGS = {
  a:        'href',
  link:     'href',
  script:   'src',
  img:      'src'
};

module.exports = function(options) {

  options.accept = options.accept || function(url) {return true;};

  return function(crawler) {
      crawler.on('response', function(url, res, next) {

        var urls = [], stream = res.getBody();

        //ignore non-HTML files
        if (mime.extension(res.getContentType()) !== 'html') {
          return next();
        }

        var parser = new htmlparser.Parser({
          onopentag: function(name, attribs) {

            if (name in TAGS && TAGS.hasOwnProperty(name)) {
              if (attribs[TAGS[name]]) {
                var extractedUrl = URL.resolve(url, attribs[TAGS[name]]);

                //strip the hash from the URL - we don't care in HTTP requests
                var hashIndex = extractedUrl.indexOf('#');
                if (hashIndex !== -1) {
                  extractedUrl = extractedUrl.substr(0, hashIndex);
                }

                //ignore non-HTTP(S) URLs
                if (extractedUrl.substr(0, 4) !== 'http') {
                  return;
                }

                if (options.accept(extractedUrl)) {
                  urls.push(extractedUrl);
                }

              }
            }

          }
        }, {decodeEntities: true});

        stream.on('end', function() {
          urls.forEach(crawler.add.bind(crawler));
          next();
        });

        stream.pipe(parser);

      });

  };
};