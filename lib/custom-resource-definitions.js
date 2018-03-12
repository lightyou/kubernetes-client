'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiGroup = require('./api-group');

var CustomResourceDefinition = function (_ApiGroup) {
  _inherits(CustomResourceDefinition, _ApiGroup);

  function CustomResourceDefinition(options) {
    _classCallCheck(this, CustomResourceDefinition);

    options = Object.assign({}, options, {
      path: 'apis/' + options.group,
      version: options.version || 'v1',
      groupResources: [],
      namespaceResources: []
    });

    var _this = _possibleConstructorReturn(this, (CustomResourceDefinition.__proto__ || Object.getPrototypeOf(CustomResourceDefinition)).call(this, options));

    if (options.resources) {
      options.resources.forEach(function (resource) {
        return _this.addResource(resource);
      });
    }
    return _this;
  }

  _createClass(CustomResourceDefinition, [{
    key: 'addResource',
    value: function addResource(resourceName) {
      this.namespace.addNamedResource(resourceName);
      _get(CustomResourceDefinition.prototype.__proto__ || Object.getPrototypeOf(CustomResourceDefinition.prototype), 'addResource', this).call(this, resourceName);
      return this;
    }
  }]);

  return CustomResourceDefinition;
}(ApiGroup);

module.exports = CustomResourceDefinition;