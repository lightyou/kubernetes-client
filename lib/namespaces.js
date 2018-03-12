'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var async = require('async');

var aliasResources = require('./common').aliasResources;
var BaseObject = require('./base');
var ContainerBaseObject = require('./container-base-object');

var NamedNamespaces = function (_ContainerBaseObject) {
  _inherits(NamedNamespaces, _ContainerBaseObject);

  function NamedNamespaces(options) {
    _classCallCheck(this, NamedNamespaces);

    var _this = _possibleConstructorReturn(this, (NamedNamespaces.__proto__ || Object.getPrototypeOf(NamedNamespaces)).call(this, options));

    aliasResources(_this);
    return _this;
  }

  /**
   * Return the API object for the given Kubernetes kind
   * @param {object|string} k - Kubernetes manifest object or a string
   * @returns {BaseObject} Kubernetes API object.
   */


  _createClass(NamedNamespaces, [{
    key: 'kind',
    value: function kind(k) {
      return this[(k.kind || k).toLowerCase()];
    }
  }]);

  return NamedNamespaces;
}(ContainerBaseObject);

var Namespaces = function (_BaseObject) {
  _inherits(Namespaces, _BaseObject);

  /**
   * Create a Namespaces Kubernetes API object
   * @extends BaseObject
   * @param {object} options - Options object
   * @param {Api} options.api - API object
   * @param {string} options.parentPath - Optional path of parent resource
   * @param {string} options.path - Optional path of this resource
   */
  function Namespaces(options) {
    _classCallCheck(this, Namespaces);

    var _this2 = _possibleConstructorReturn(this, (Namespaces.__proto__ || Object.getPrototypeOf(Namespaces)).call(this, Object.assign({}, options, {
      fn: function fn(name) {
        return new NamedNamespaces({
          api: options.api,
          name: name,
          parentPath: _this2.path,
          resources: _this2.namedResources
        });
      },
      name: options.name || 'namespaces'
    })));

    _this2.namedResources = options.resources.slice();
    return _this2;
  }

  _createClass(Namespaces, [{
    key: 'addNamedResource',
    value: function addNamedResource(options) {
      this.namedResources.push(options);
      return this;
    }
  }, {
    key: '_wait',
    value: function _wait(options, cb) {
      var _this3 = this;

      var interval = 1000;
      var times = Math.ceil(options.timeout / interval);
      async.retry({ times: times, interval: interval }, function (next) {
        _this3.get(options.name, function (err, result) {
          if (err) {
            if (err.code === 404) return next(null);
            return next(err);
          }
          if (result.metadata.uid !== options.uid) return next(null);
          next(new Error('Waiting for namespace removal'));
        });
      }, cb);
    }

    /**
     * Delete a Kubernetes resource
     * @param {RequestOptions|string} options - DELETE options, or resource name
     * @param {string} options.timeout - Optional timeout to wait for namespace
     *   deletion to complete
     * @param {callback} cb - The callback that handles the response
     */

  }, {
    key: 'delete',
    value: function _delete(options, cb) {
      var _this4 = this;

      if (typeof options === 'string') options = { name: options };

      _get(Namespaces.prototype.__proto__ || Object.getPrototypeOf(Namespaces.prototype), 'delete', this).call(this, options, function (err, result) {
        if (err) return cb(err);
        if (!options.timeout) return cb(null, result);

        _this4._wait({
          timeout: options.timeout,
          name: options.name,
          uid: result.metadata.uid
        }, function (waitErr) {
          return cb(waitErr, result);
        });
      });
    }
  }]);

  return Namespaces;
}(BaseObject);

module.exports = Namespaces;