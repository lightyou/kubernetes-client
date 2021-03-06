'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiGroup = require('./api-group');
var CustomResourceDefinitons = require('./custom-resource-definitions');

var ApiExtensions = function (_ApiGroup) {
  _inherits(ApiExtensions, _ApiGroup);

  function ApiExtensions(options) {
    _classCallCheck(this, ApiExtensions);

    options = Object.assign({}, options, {
      path: 'apis/apiextensions.k8s.io',
      version: options.version || 'v1beta1',
      groupResources: ['customresourcedefinitions'],
      namespaceResources: [{ name: 'customresourcedefinitions', Constructor: CustomResourceDefinitons }]
    });
    return _possibleConstructorReturn(this, (ApiExtensions.__proto__ || Object.getPrototypeOf(ApiExtensions)).call(this, options));
  }

  return ApiExtensions;
}(ApiGroup);

module.exports = ApiExtensions;