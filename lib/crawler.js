var emitter = require('emitter-on-steroids');
var queue   = require('queue');

var client            = require('go-fetch');
var contentType       = require('go-fetch-content-type');
var followRedirects   = require('go-fetch-follow-redirects');
var cookies           = require('./plugins/cookie-store');

function Crawler() {

  if (!(this instanceof Crawler)) {
    return new Crawler();
  }

  this._urls    = [];
  this._queue   = queue({concurrency: 10});
  this._client  = client({https_ignore_errors: true})
    .use(contentType)
    .use(followRedirects())
    .use(cookies())
  ;

}
emitter(Crawler.prototype);

Crawler.prototype.add = function(url) {
  var self = this;

  //ignore URLs that we've already fetched
  if (this._urls.indexOf(url) !== -1) {
    return this;
  }

  this._urls.push(url);
  this._queue.push(function(next) {
    self.fetch(url, next);
  });

  return this;
};

Crawler.prototype.use = function(plugin) {
  plugin(this);
  return this;
};

Crawler.prototype.fetch = function(url, next) {
  var self = this;

  this._client.get(url, function(err, res) {

    if (err) {
      err.url = url;
      self.emit('error', err);
      return;
    }

    self.emit('response', url, res, function(err) {
      res.getBody().resume(); //just in case nothing has read the stream causing stuff to wait till it has
      next(err);
    });

  });
  return this;
};

Crawler.prototype.start = function() {
  var self = this;
  this.emit('started');
  this._queue.start(function(err) {
    if (err) self.emit('error', err);
    self.emit('finished');
  });
  return this;
};

module.exports = Crawler;