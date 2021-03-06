'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _request = require('request');

var Request = function () {
  /**
   * Internal representation of HTTP request object.
   *
   * @param {object} options - Options object
   * @param {string} options.url - Kubernetes API URL
   * @param {object} options.auth - request library auth object
   * @param {string} options.ca - Certificate authority
   * @param {string} options.cert - Client certificate
   * @param {string} options.key - Client key
   * @param {boolean} options.insecureSkipTlsVerify - Skip the validity check
   *   on the server's certificate.
   */
  function Request(options) {
    _classCallCheck(this, Request);

    this.requestOptions = options.request || {};
    this.requestOptions.baseUrl = options.url;
    this.requestOptions.ca = options.ca;
    this.requestOptions.cert = options.cert;
    this.requestOptions.key = options.key;

    if ('insecureSkipTlsVerify' in options) {
      this.requestOptions.strictSSL = !options.insecureSkipTlsVerify;
    }

    if (options.auth) {
      this.requestOptions.auth = options.auth;
    }
  }

  /**
   * @typedef {object} ApiRequestOptions
   * @property {object} body - Request body
   * @property {object} headers - Headers object
   * @property {string} path - version-less path
   * @property {object} qs - {@link https://www.npmjs.com/package/request#requestoptions-callback|
   *                          request query parameter}
   */

  /**
   * Invoke a REST request against the Kubernetes API server
   * @param {string} method - HTTP method, passed directly to `request`
   * @param {ApiRequestOptions} options - Options object
   * @param {callback} cb - The callback that handles the response
   * @returns {Stream} If cb is falsy, return a stream
   */


  _createClass(Request, [{
    key: 'request',
    value: function request(method, options, cb) {
      var uri = typeof options.path === 'string' ? options.path : options.path.join('/');
      var requestOptions = Object.assign({
        method: method,
        uri: uri,
        body: options.body,
        json: true,
        qs: options.qs,
        headers: options.headers
      }, this.requestOptions);

      if (typeof cb !== 'function') return _request(requestOptions);

      return _request(requestOptions, function (err, res, body) {
        if (err) return cb(err);
        cb(null, { statusCode: res.statusCode, body: body });
      });
    }
  }]);

  return Request;
}();

module.exports = Request;