'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseObject = require('./base');

var ContainerBaseObject = function (_BaseObject) {
  _inherits(ContainerBaseObject, _BaseObject);

  /**
   * Create generic Kubernetes API object that might contain other resources.
   * For example, a named Pod contains .log resources (core.ns.pods('foo').log).
   *
   * @param {object} options - Options object
   * @param {string} options.resources - Array of resources to add
   */
  function ContainerBaseObject(options) {
    _classCallCheck(this, ContainerBaseObject);

    var _this = _possibleConstructorReturn(this, (ContainerBaseObject.__proto__ || Object.getPrototypeOf(ContainerBaseObject)).call(this, options));

    if (options.resources) {
      options.resources.forEach(function (resource) {
        return _this.addResource(resource);
      });
    }
    return _this;
  }

  /**
   * Add a resource to the container object.
   * @param {string|object} options - resource name or options object
   * @param {string} options.name - resource name
   * @param {fn} options.Constructor - constructor for new resource
   * @returns {object} returns this to facilitate chaining
   */


  _createClass(ContainerBaseObject, [{
    key: 'addResource',
    value: function addResource(options) {
      if (typeof options === 'string') {
        options = { name: options, Constructor: BaseObject };
      } else if (!options.name || !options.Constructor) {
        throw new RangeError('NamedBaseObject.addResource: options requires .name and .Constructor');
      }

      if (this[options.name]) {
        throw new RangeError('NamedBaseObject.addResource: .' + options.name + ' already exists');
      }
      this[options.name] = new options.Constructor({
        api: this.api,
        name: options.name,
        parentPath: this.path
      });

      return this;
    }
  }]);

  return ContainerBaseObject;
}(BaseObject);

module.exports = ContainerBaseObject;