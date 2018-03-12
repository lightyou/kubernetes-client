'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var merge = require('lodash.merge');
var aliasResources = require('./common').aliasResources;
var BaseObject = require('./base');
var Namespaces = require('./namespaces');
var Request = require('./request');

var ApiGroup = function () {
  /**
   * API object
   * @param {object} options - Options object
   * @param {string} options.api - Kubernetes API URL
   * @param {string} options.version - Kubernetes API version
   * @param {string} options.namespace - Default namespace
   * @param {string} options.ca - Certificate authority
   * @param {string} options.cert - Client certificate
   * @param {string} options.key - Client key
   * @param {boolean} options.insecureSkipTlsVerify - Skip the validity check
   *   on the server's certificate.
   */
  function ApiGroup(options) {
    var _this = this;

    _classCallCheck(this, ApiGroup);

    this.url = options.url;
    this.version = options.version;
    this.path = '/' + options.path + '/' + this.version;

    var requestOptions = {};
    requestOptions.request = options.request || {};
    requestOptions.url = options.url;
    requestOptions.ca = options.ca;
    requestOptions.cert = options.cert;
    requestOptions.key = options.key;
    if ('insecureSkipTlsVerify' in options) {
      requestOptions.insecureSkipTlsVerify = options.insecureSkipTlsVerify;
    }
    if (options.auth) {
      requestOptions.auth = options.auth;
    }
    this.http = new Request(requestOptions);

    this.resourceConfig = {
      promises: options.promises
    };

    //
    // Create the default namespace so we have it directly on the API
    //
    this.namespaces = new Namespaces({
      api: this,
      parentPath: this.path,
      namespace: options.namespace,
      resources: options.namespaceResources
    });

    //
    // Create "group" resources that live at the root (e.g., /api/v1/nodes)
    //
    options.groupResources.forEach(function (type) {
      return _this.addResource(type);
    });

    aliasResources(this);
  }

  /**
   * Add a resource (e.g., nodes) to the ApiGroup group
   * @param {string|object} options - resource name or options object
   * @param {string} options.name - resource name
   * @param {fn} options.Constructor - constructor for new resource
   */


  _createClass(ApiGroup, [{
    key: 'addResource',
    value: function addResource(options) {
      if (typeof options === 'string') {
        options = { name: options, Constructor: BaseObject };
      } else if (!options.name || !options.Constructor) {
        throw new RangeError('ApiGroup.addResource: options requires .name and .Constructor');
      }

      if (this[options.name]) {
        throw new RangeError('ApiGroup.addResource: .' + options.name + ' already exists');
      }
      this[options.name] = new options.Constructor({
        api: this,
        name: options.name,
        parentPath: this.path
      });
    }

    /**
     * Invoke a GET request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @param {callback} cb - The callback that handles the response
     * @returns {Stream} If cb is falsy, return a stream
     */

  }, {
    key: 'get',
    value: function get(options, cb) {
      return this.http.request('GET', options, cb);
    }

    /**
     * Invoke a DELETE request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @param {callback} cb - The callback that handles the response
     */

  }, {
    key: 'delete',
    value: function _delete(options, cb) {
      this.http.request('DELETE', options, cb);
    }

    /**
     * Invoke a PATCH request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @param {callback} cb - The callback that handles the response
     */

  }, {
    key: 'patch',
    value: function patch(options, cb) {
      this.http.request('PATCH', merge({
        headers: { 'content-type': 'application/strategic-merge-patch+json' }
      }, options), cb);
    }

    /**
     * Invoke a POST request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @param {callback} cb - The callback that handles the response
     */

  }, {
    key: 'post',
    value: function post(options, cb) {
      this.http.request('POST', merge({
        headers: { 'content-type': 'application/json' }
      }, options), cb);
    }

    /**
     * Invoke a PUT request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @param {callback} cb - The callback that handles the response
     */

  }, {
    key: 'put',
    value: function put(options, cb) {
      this.http.request('PUT', merge({
        headers: { 'content-type': 'application/json' }
      }, options), cb);
    }
  }]);

  return ApiGroup;
}();

module.exports = ApiGroup;