var client      = require('go-fetch');
var cookies     = require('../lib/plugins/cookie-store');
var htmlparser  = require('htmlparser2');

var
  URL       = 'https://review.nib.com.au/login',
  USERNAME  = '18422607',
  PASSWORD  = 'nib12345'
;

function authenticate(callback) {

  var http = client({https_ignore_errors: true})
    .use(cookies())
  ;

  http.get(URL, function(err, res) {
    if (err) return console.error(err);

    var stream = res.getBody();

    var parser = new htmlparser.Parser({

      //get CSRF
      onopentag: function(name, attribs) {
        if (name === 'input' && attribs.name === '__RequestVerificationToken') {

          var
            csrf = attribs.value,
            data = '__RequestVerificationToken='+encodeURIComponent(csrf)+'&Username='+encodeURIComponent(USERNAME)+'&Password='+encodeURIComponent(PASSWORD);
          ;
console.log(data);
          http.post(URL, {'Content-Type': 'application/x-www-form-urlencoded'}, data, function(err, res) {
            console.log(err);
            console.log(res.getStatus());
            //res.getBody().pipe(process.stdout);
          });

        }
      }

    }, {decodeEntities: true});

    stream.on('end', function() {
    });

    stream.pipe(parser);

  });

}


authenticate(function() {

  var factory = require('./factory');
  var crawler = factory()
    .add(process.argv.length > 2 ? process.argv[2] : 'http://dev.online4.nib.com.au/')
    .start()
  ;

});

