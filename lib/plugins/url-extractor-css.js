var URL       = require('url');
var mime      = require('mime-types');
var rework    = require('rework');
var reworkUrl = require('rework-plugin-url');

module.exports = function(options) {

  options.accept = options.accept || function(url) {return true;};

  return function(crawler) {
      crawler.on('response', function(url, res, next) {

        var urls = [], stream = res.getBody(), css = '';

        //ignore non-CSS files
        if (mime.extension(res.getContentType()) !== 'css') {
          return next();
        }

        stream
          .on('data', function(data) {
            css += data.toString();
          })
          .on('end', function() {

            try {
              rework(css)
                .use(reworkUrl(function(extractedUrl) {
                  extractedUrl = URL.resolve(url, extractedUrl);

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

                  return url;
                }))
                .toString()
              ;

            } catch (err) {
              console.error(url, err);
            }

            urls.forEach(crawler.add.bind(crawler));
            next();

          })
        ;

      });

  };
};