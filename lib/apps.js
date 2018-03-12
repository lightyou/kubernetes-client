'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiGroup = require('./api-group');
var Deployments = require('./deployments');

var Apps = function (_ApiGroup) {
  _inherits(Apps, _ApiGroup);

  function Apps(options) {
    _classCallCheck(this, Apps);

    var resources = [
    // Deprecated name of statefulsets in kubernetes 1.4
    'petsets', 'statefulsets'];
    options = Object.assign({}, options, {
      path: 'apis/apps',
      version: options.version || 'v1beta1',
      groupResources: resources.concat(['deployments']),
      namespaceResources: resources.concat([{ name: 'deployments', Constructor: Deployments }])
    });
    return _possibleConstructorReturn(this, (Apps.__proto__ || Object.getPrototypeOf(Apps)).call(this, options));
  }

  return Apps;
}(ApiGroup);

module.exports = Apps;