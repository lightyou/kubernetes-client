'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Core = require('./core');
var Extensions = require('./extensions');
var Apps = require('./apps');
var Batch = require('./batch');
var Rbac = require('./rbac');
var ApiExtensions = require('./api-extensions');

var groups = {
  'extensions': Extensions,
  'apps': Apps,
  'batch': Batch,
  'rbac.authorization.k8s.io': Rbac,
  'apiextensions.k8s.io': ApiExtensions
};

var Api = function () {
  /**
   * Create an API client wrapper object.
   * @param {object} options - Options to pass to client constructors
   * @param {object} options.core - Optional default Core client
   * @param {object} options.extensions - Optional default Extensions client
   * @param {object} options.apps - Optional default Apps client
   * @param {object} options.batch - Optional default Batch client
   * @param {object} options.rbac - Optional default RBAC client
   * @param {object} options.apiExtensions - Optional default ApiExtensions client
   */
  function Api(options) {
    _classCallCheck(this, Api);

    this.options = options;
    this.core = options.core || new Core(options);
    this.extensions = options.extensions || new Extensions(options);
    this.apps = options.apps || new Apps(options);
    this.batch = options.batch || new Batch(options);
    this.rbac = options.rbac || new Rbac(options);
    this.apiExtensions = options.apiExtensions || new ApiExtensions(options);
  }

  /**
   * Return an API client for the given API group and version.
   * @param {object|string} v - Kubernetes manifest object or a string
   * @returns {ApiGroup} API client object.
   */


  _createClass(Api, [{
    key: 'group',
    value: function group(v) {
      var groupVersion = v.apiVersion || v;
      var pieces = groupVersion.split('/');
      var Group = void 0;
      var version = void 0;
      if (pieces.length > 1) {
        Group = groups[pieces[0].toLowerCase()];
        version = pieces[1];
      } else {
        Group = Core;
        version = pieces[0];
      }
      var options = Object.assign({}, this.options, { version: version });
      return new Group(options);
    }
  }]);

  return Api;
}();

module.exports = Api;