'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseObject = require('./base');
var ContainerBaseObject = require('./container-base-object');

var NamedPods = function (_ContainerBaseObject) {
  _inherits(NamedPods, _ContainerBaseObject);

  /**
   * Create a named Pod Kubernetes object with a log.
   * @extends BaseObject
   * @param {object} options - Options object
   * @param {Api} options.api - API object
   * @param {string} options.parentPath - Optional path of parent resource
   * @param {string} options.path - Optional path of this resource
   */
  function NamedPods(options) {
    _classCallCheck(this, NamedPods);

    return _possibleConstructorReturn(this, (NamedPods.__proto__ || Object.getPrototypeOf(NamedPods)).call(this, Object.assign({
      resources: ['log']
    }, options)));
  }

  return NamedPods;
}(ContainerBaseObject);

var Pods = function (_BaseObject) {
  _inherits(Pods, _BaseObject);

  /**
   * Create a Pods Kubernetes API object
   * @extends BaseObject
   * @param {object} options - Options object
   * @param {Api} options.api - API object
   * @param {string} options.parentPath - Optional path of parent resource
   * @param {string} options.path - Optional path of this resource
   */
  function Pods(options) {
    var _this2;

    _classCallCheck(this, Pods);

    return _this2 = _possibleConstructorReturn(this, (Pods.__proto__ || Object.getPrototypeOf(Pods)).call(this, Object.assign({}, options, {
      fn: function fn(name) {
        return new NamedPods({
          api: options.api,
          name: name,
          parentPath: _this2.path
        });
      },
      name: options.name || 'pods'
    })));
  }

  return Pods;
}(BaseObject);

module.exports = Pods;