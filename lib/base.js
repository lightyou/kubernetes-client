'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var promy = require('promy');

var matchExpression = require('./match-expression');

function cb200(cb) {
  return function (err, result) {
    if (err) return cb(err);
    if (result.statusCode < 200 || result.statusCode > 299) {
      var error = new Error(result.body.message || result.body);
      error.code = result.body.code || result.statusCode;
      return cb(error);
    }
    cb(null, result.body);
  };
}

var CallableObject =
/**
 * Create an object that invokes a function when called.
 * @param {function} fn - The function to invoke.
 */
function CallableObject(fn) {
  _classCallCheck(this, CallableObject);

  function wrap() {
    /* eslint-disable no-invalid-this */
    return fn.apply(this, arguments);
    /* eslint-enable no-invalid-this */
  }

  if (fn) {
    return Object.setPrototypeOf(wrap, Object.getPrototypeOf(this));
  }
};

var BaseObject = function (_CallableObject) {
  _inherits(BaseObject, _CallableObject);

  /**
   * Create generic Kubernetes API object. The object is callable (e.g., pod('foo')),
   * which by default returns a new object of the same type with the parent path
   * extended by the argument too the function
   * (e.g., '/api/v1/namespace/default/pods/foo'). Users customize the callable
   * behavior by passing an optional function to this constructor.
   *
   * @param {object} options - Options object
   * @param {string} options.api - Kubernetes API URL
   * @param {string} options.name - kubernetes resource name
   * @param {string} options.parentPath - Kubernetes resource parent path
   * @param {function} options.fn - Optional function to invoke when object is
   * called
   * @param {string} options.qs - Optional query string object
   */
  function BaseObject(options) {
    _classCallCheck(this, BaseObject);

    var api = options.api;
    var path = options.parentPath + '/' + options.name;

    var fn = options.fn;
    if (!fn) {
      fn = function fn(name) {
        return new _this.constructor({
          api: api,
          name: name,
          parentPath: path
        });
      };
    }

    var _this = _possibleConstructorReturn(this, (BaseObject.__proto__ || Object.getPrototypeOf(BaseObject)).call(this, fn));

    _this.api = api;
    _this._name = options.name;
    _this.parentPath = options.parentPath;
    _this.fn = options.fn;
    _this.qs = options.qs || {};

    _this.path = path;

    var apiFunctions = ['delete', 'get', 'patch', 'post', 'put'];
    apiFunctions.forEach(function (func) {
      _this[func] = promy(_this['_' + func].bind(_this));
    });
    return _this;
  }

  /**
   * Delete a Kubernetes resource
   * @param {RequestOptions|string} options - DELETE options, or resource name
   * @param {callback} cb - The callback that handles the response
   */


  _createClass(BaseObject, [{
    key: '_delete',
    value: function _delete(options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      } else if (typeof options === 'string') {
        options = { name: options };
      }
      this.api.delete({ path: this._path(options), qs: options.qs, body: options.body }, cb200(cb));
    }
  }, {
    key: '_path',
    value: function _path(options) {
      return [this.path].concat(options && options.name ? [options.name] : []);
    }

    /**
     * Get a Kubernetes resource
     * @param {RequestOptions|string} options - GET options, or resource name
     * @param {callback} cb - The callback that handles the response
     * @returns {Stream} If cb is falsy, return a stream
     */

  }, {
    key: '_get',
    value: function _get(options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      } else if (typeof options === 'string') {
        options = { name: options };
      } else if (typeof options === 'undefined') {
        options = {};
      }
      var qs = Object.assign({}, this.qs, options.qs || {});

      return this.api.get({
        path: this._path(options),
        qs: qs
      }, cb && cb200(cb));
    }

    /**
     * Get a Kubernetes resource
     * @param {RequestOptions|string} options - GET options, or resource name
     * @returns {Stream} Result stream
     */

  }, {
    key: 'getStream',
    value: function getStream(options) {
      return this._get(options);
    }

    /**
     * Patch a Kubernetes resource
     * @param {RequestOptions} options - PATCH options
     * @param {callback} cb - The callback that handle the response
     */

  }, {
    key: '_patch',
    value: function _patch(options, cb) {
      var patchOptions = {
        path: this._path(options),
        body: options.body
      };
      if ('headers' in options) patchOptions.headers = options.headers;
      this.api.patch(patchOptions, cb200(cb));
    }

    /**
     * Create a Kubernetes resource
     * @param {RequestOptions} options - POST options
     * @param {callback} cb - The callback that handle the response
     */

  }, {
    key: '_post',
    value: function _post(options, cb) {
      this.api.post({ path: this._path(options), body: options.body }, cb200(cb));
    }

    /**
     * Replace a Kubernetes resource
     * @param {RequestOptions} options - PUT options
     * @param {callback} cb - The callback that handle the response
     */

  }, {
    key: '_put',
    value: function _put(options, cb) {
      this.api.put({ path: this._path(options), body: options.body }, cb200(cb));
    }

    //
    // Higher-level porcelain methods
    //

    /**
     * Return resources matching an array Match Expressions
     * @param {MatchExpression[]} expressions - Array of expressions to match
     * @returns {object} API object
     */

  }, {
    key: 'match',
    value: function match(expressions) {
      var qs = Object.assign({}, this.qs, {
        labelSelector: matchExpression.stringify(expressions)
      });
      return new this.constructor({
        api: this.api,
        name: this._name,
        parentPath: this.parentPath,
        fn: this.fn,
        qs: qs
      });
    }

    /**
     * Return resources matching labels
     * @param {object} labels - Object of label keys and values
     * @returns {object} API object
     */

  }, {
    key: 'matchLabels',
    value: function matchLabels(labels) {
      return this.match(Object.keys(labels).map(function (key) {
        return {
          key: key,
          operator: 'In',
          values: [labels[key]]
        };
      }));
    }
  }]);

  return BaseObject;
}(CallableObject);

module.exports = BaseObject;