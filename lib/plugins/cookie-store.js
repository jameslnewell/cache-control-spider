
var Cookie = {

  ATTRIBUTES: ['expires', 'domain', 'path', 'secure', 'httponly'],

  fromSetCookieHeader: function(header) {

    var
      cookie  = {},
      pairs   = header.split(/; */)
    ;

    for (var i=0; i<pairs.length; ++i) {

      var
        keyAndValue = pairs[i].split('='),
        key         = keyAndValue[0].toLowerCase(),
        value       = (keyAndValue[1] || '').toLowerCase()
      ;

      if (this.ATTRIBUTES.indexOf(key) === -1) {
        cookie.name   = key;
        cookie.value  = value || '';
      } else {
        cookie[key] = value || true;
      }

    }

    return cookie;
  },

  toSetCookieHeader: function(cookie) {

  },

  fromCookieHeader: function(header) {

  },

  /**
   * Serialise an array of cookies as a string for the Cookie: header
   * @param   {Array.<Object>}  cookies
   * @returns {string}
   */
  toCookieHeader: function(cookies) {
    var header = '';

    for (var i=0; i<cookies.length; ++i) {
      var cookie = cookies[i];
      header += cookie.name+'='+cookie.value+'; ';
    }

    return header;
  }

};

/**
 * A cookie store
 * @constructor
 */
function CookieStore() {
  this._cookies = [];
}

CookieStore.prototype = {

  /**
   * Get all the cookies or a specific cookie
   * @param   {string} [name]
   * @returns {Array.<Object>|Object|null}
   */
  get: function(name) {
    if (arguments.length === 0) {
      return this._cookies;
    } else {
      //TODO:
      return this;
    }
  },

  /**
   * Put a cookie in the store
   * @param   {string} name
   * @param   {string} [value]
   * @returns {CookieStore}
   */
  put: function(name, value) {
    var cookie = name;

    if (arguments.length > 1) {
      cookie = {name: name, value: value};
    }

    this._cookies.push(cookie);

    return this;
  }

};

module.exports = function() {

  var store = new CookieStore();

  var plugin = function(client)  {
    client

      //add the cookies to the request
      .on('before', function(event) {

        var cookies = store.get();

        if (cookies.length) {
          event.request.setHeader('Cookie', Cookie.toCookieHeader(cookies));
        }

        console.log(event.request.toString());

      })

      //get the cookies from the response
      .on('after', function(event) {

        var headers = event.response.getHeader('Set-Cookie');

        if (headers) {
          for (var i=0; i<headers.length; ++i) {
            store.put(Cookie.fromSetCookieHeader(headers[i]));
          }
        }

      })

    ;

  };

  plugin.store = store;

  return plugin;
};

