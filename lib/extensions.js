'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiGroup = require('./api-group');
var Deployments = require('./deployments');

var Extensions = function (_ApiGroup) {
  _inherits(Extensions, _ApiGroup);

  function Extensions(options) {
    _classCallCheck(this, Extensions);

    var commonResources = ['daemonsets', 'horizontalpodautoscalers', 'ingresses', 'jobs', 'replicasets', 'thirdpartyresources'];
    options = Object.assign({}, options, {
      path: 'apis/extensions',
      version: options.version || 'v1beta1',
      groupResources: commonResources.concat(['deployments']),
      //
      // The custom Deployments objects implement functionality available only
      // in namespaces.
      //
      namespaceResources: commonResources.concat([{ name: 'deployments', Constructor: Deployments }])
    });
    return _possibleConstructorReturn(this, (Extensions.__proto__ || Object.getPrototypeOf(Extensions)).call(this, options));
  }

  return Extensions;
}(ApiGroup);

module.exports = Extensions;