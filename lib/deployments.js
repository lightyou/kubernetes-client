'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseObject = require('./base');
var ContainerBaseObject = require('./container-base-object');

var NamedDeployments = function (_ContainerBaseObject) {
  _inherits(NamedDeployments, _ContainerBaseObject);

  function NamedDeployments(options) {
    _classCallCheck(this, NamedDeployments);

    return _possibleConstructorReturn(this, (NamedDeployments.__proto__ || Object.getPrototypeOf(NamedDeployments)).call(this, Object.assign({
      resources: ['status', 'scale', 'rollback']
    }, options)));
  }

  return NamedDeployments;
}(ContainerBaseObject);

var Deployments = function (_BaseObject) {
  _inherits(Deployments, _BaseObject);

  function Deployments(options) {
    var _this2;

    _classCallCheck(this, Deployments);

    return _this2 = _possibleConstructorReturn(this, (Deployments.__proto__ || Object.getPrototypeOf(Deployments)).call(this, Object.assign({}, options, {
      fn: function fn(name) {
        return new NamedDeployments({
          api: options.api,
          name: name,
          parentPath: _this2.path
        });
      },
      name: options.name || 'deployments'
    })));
  }

  return Deployments;
}(BaseObject);

module.exports = Deployments;