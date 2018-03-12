'use strict';

/**
 * @file Convert a Swagger specification into a kubernetes-client API client.
 *
 * Represent Swagger a Path Item Object [1] with chains of objects:
 *
 *   /api/v1/namespaces -> api.v1.namespaces
 *
 * Associate operations on a Path Item Object with functions:
 *
 *   GET /api/v1/namespaces -> api.v1.namespaces.get()
 *
 * Represent Path Templating [2] with function calls:
 *
 *   /api/v1/namespaces/{namespace}/pods -> api.v1.namespaces(namespace).pods
 *
 * Iterate over a Paths Object [3] to generate whole API client.
 *
 * [1]: https://swagger.io/specification/#pathItemObject
 * [2]: https://swagger.io/specification/#pathTemplating
 * [3]: https://swagger.io/specification/#pathsObject
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var merge = require('lodash.merge');

var getAliases = require('./common').getAliases;

var Endpoint =
/**
 * Internal representation of a Swagger Path Item Object.
 * @param {object} options - Options object
 * @param {string} options.name - Path Item Object name
 * @param {array} options.splits - Pathname pieces split in '/'
 * @param {object} options.pathItem - Swagger Path Item Object.
 */
function Endpoint(options) {
  _classCallCheck(this, Endpoint);

  this.name = options.name;
  this.splits = options.splits;
  this.pathItem = options.pathItem;
};

var Component = function () {
  /**
   * Represents a single path split, child Components, and potentially a Path
   * Item Object.
   * @param {object} options - Options object
   * @param {object} options.http - kubernetes-client Request object
   * @param {array} options.splits - Absolute pathname (split on '/')
   * @param {string} options.parameter - Optional Path Template parameter
   */
  function Component(options) {
    _classCallCheck(this, Component);

    var component = void 0;

    //
    // Support Path Templating: use a function to create a a Component-like
    // object if required. Otherwise use a vanilla object (that isn't callable).
    //
    if (options.parameter) {
      component = function templatedComponent(name) {
        var splits = component.splits.concat([name]);
        //
        // Assume that we'll never have a path with adjacent template parameters.
        // E.g., assume `/foo/{name}/{property}` cannot exist.
        //
        var namedComponent = new Component({
          splits: splits,
          http: component.http
        });
        component.templatedEndpoints.forEach(function (child) {
          namedComponent._addEndpoint(child);
        });
        return namedComponent;
      };
      component.templatedEndpoints = [];

      //
      // Attach methods
      //
      Object.getOwnPropertyNames(Component.prototype).forEach(function (name) {
        if (name === 'constructor') return;
        component[name] = Component.prototype[name].bind(component);
      });
    } else {
      component = this;
      component.templatedEndpoints = null;
    }

    component.parameter = options.parameter;
    component.splits = options.splits.slice();
    component.http = options.http;
    return component;
  }

  /**
   * Add endpoints defined by a swagger spec to this component. You would
   * typically call this only on the root component to add API resources. For
   * example, during client initialization, to extend the client with CRDs.
   * @param {object} spec - Swagger specification
   */


  _createClass(Component, [{
    key: '_addSpec',
    value: function _addSpec(spec) {
      var _this = this;

      //
      // TODO(sbw): It's important to add endpoints with templating before adding
      // any endpoints with paths that are subpaths of templated paths.
      //
      // E.g., add /api/v1/namepaces/{namespace} before adding /api/v1/namepaces
      //
      // This is important because ._addEndpoint constructs Component objects on
      // demand, and Component requires specifying if it's templated or not. If we
      // cause ._addEndpoint to construct a un-templated Component, templated
      // operations that share the Components subpath will not work.
      //
      Object.keys(spec.paths).map(function (name) {
        var leadingAndTrailingSlashes = /(^\/)|(\/$)/g;
        var splits = name.replace(leadingAndTrailingSlashes, '').split('/');
        return new Endpoint({ name: name, splits: splits, pathItem: spec.paths[name] });
      }).sort(function (endpoint0, endpoint1) {
        return endpoint1.splits.length - endpoint0.splits.length;
      }).forEach(function (endpoint) {
        _this._addEndpoint(endpoint);
      });
    }

    /**
     * Add endpoints for a CustomeResourceDefinition.
     * @param {object} manifest - CustomerResourceDefinition manifest
     */

  }, {
    key: 'addCustomResourceDefinition',
    value: function addCustomResourceDefinition(manifest) {
      var _paths;

      var group = manifest.spec.group;
      var version = manifest.spec.version;
      var name = manifest.spec.names.plural;

      //
      // Make just enough of Swagger spec to generate some useful endpoints.
      //
      var templatePath = '/apis/' + group + '/' + version + '/namespaces/{namespace}/' + name + '/{name}';
      var templateOperations = ['delete', 'get', 'patch', 'post', 'put'].reduce(function (acc, method) {
        acc[method] = {
          operationId: '' + method + name
        };
        return acc;
      }, {});

      var path = '/apis/' + group + '/' + version + '/namespaces/{namespace}/' + name;
      var operations = {
        get: {
          operationId: 'list' + name
        }
      };

      var spec = {
        paths: (_paths = {}, _defineProperty(_paths, path, operations), _defineProperty(_paths, templatePath, templateOperations), _paths)
      };

      this._addSpec(spec);
    }
  }, {
    key: '_walkSplits',
    value: function _walkSplits(endpoint) {
      var splits = this.splits.slice();
      var nextSplits = endpoint.splits.slice();

      var parent = this;
      while (nextSplits.length) {
        var split = nextSplits.shift();
        splits.push(split);

        var parameter = null;
        if (nextSplits.length && nextSplits[0].startsWith('{')) {
          parameter = nextSplits.shift();
        }

        if (!(split in parent)) {
          var component = new Component({
            parameter: parameter,
            splits: splits,
            http: this.http
          });
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = getAliases(split)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var type = _step.value;
              parent[type] = component;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        parent = parent[split];

        //
        // Path Template parameter: save it and walk it once the user specifies
        // the value.
        //
        if (parameter) {
          if (!parent.parameter) {
            throw new Error('Created Component, but require templated one. ' + 'This is a bug. Please report: ' + 'https://github.com/godaddy/kubernetes-client/issues');
          }
          parent.templatedEndpoints.push(new Endpoint({
            name: endpoint.name,
            splits: nextSplits,
            pathItem: endpoint.pathItem
          }));
          return null;
        }
      }
      return parent;
    }

    /**
     * Add an Endpoint by creating an object chain according to its pathname
     * splits; and adding operations according to the pathItem.
     * @param {Endpoint} endpoint - Endpoint object.
     */

  }, {
    key: '_addEndpoint',
    value: function _addEndpoint(endpoint) {
      var component = this._walkSplits(endpoint);
      if (!component) return;

      //
      // "Expose" operations by omitting the leading _ from the method name.
      //
      Object.keys(endpoint.pathItem).filter(function (key) {
        return endpoint.pathItem[key].operationId;
      }).forEach(function (method) {
        component[method] = component['_' + method];
        if (method === 'get') component.getStream = component._getStream;
      });
    }

    /**
     * Invoke a REST method
     * @param {string} method - HTTP method
     * @param {ApiRequestOptions} options - Options object
     * @returns {Promise} Promise
     */

  }, {
    key: '_requestAsync',
    value: function _requestAsync(method, options) {
      var _this2 = this;

      options = Object.assign({ path: this.splits }, options);
      return new Promise(function (resolve, reject) {
        _this2.http.request(method, options, function (err, res) {
          if (err) return reject(err);
          resolve(res);
        });
      });
    }

    //
    // Supported operations.
    //

    /**
     * Invoke a GET request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @returns {Stream} Stream
     */

  }, {
    key: '_getStream',
    value: function _getStream(options) {
      options = Object.assign({ path: this.splits }, options);
      return this.http.request('GET', options);
    }

    /**
     * Invoke a GET request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @returns {Promise} Promise
     */

  }, {
    key: '_get',
    value: function _get(options) {
      return this._requestAsync('GET', options);
    }

    /**
     * Invoke a DELETE request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object.
     * @returns {Promise} Promise
     */

  }, {
    key: '_delete',
    value: function _delete(options) {
      return this._requestAsync('DELETE', options);
    }

    /**
     * Invoke a PATCH request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object
     * @returns {Promise} Promise
     */

  }, {
    key: '_patch',
    value: function _patch(options) {
      return this._requestAsync('PATCH', merge({
        headers: { 'content-type': 'application/strategic-merge-patch+json' }
      }, options));
    }

    /**
     * Invoke a POST request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object
     * @returns {Promise} Promise
     */

  }, {
    key: '_post',
    value: function _post(options) {
      return this._requestAsync('POST', merge({
        headers: { 'content-type': 'application/json' }
      }, options));
    }

    /**
     * Invoke a PUT request against the Kubernetes API server
     * @param {ApiRequestOptions} options - Options object
     * @returns {Promise} Promise
     */

  }, {
    key: '_put',
    value: function _put(options) {
      return this._requestAsync('PUT', merge({
        headers: { 'content-type': 'application/json' }
      }, options));
    }
  }]);

  return Component;
}();

var SwaggerClient =

/**
 * Swagger-based API client.
 *
 * @param {object} options - Request options object.
 * @param {object} options.spec - Swagger specification
 * @param {object} options.http - kubernetes-client Request object
 */
function SwaggerClient(options) {
  _classCallCheck(this, SwaggerClient);

  var spec = options.spec;
  var root = new Component({ splits: [], http: options.http });
  root._addSpec(spec);
  return root;
};

module.exports = SwaggerClient;