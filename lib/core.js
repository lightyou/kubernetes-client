'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiGroup = require('./api-group');
var ReplicationControllers = require('./replicationcontrollers');
var Pods = require('./pods');

var Core = function (_ApiGroup) {
  _inherits(Core, _ApiGroup);

  function Core(options) {
    _classCallCheck(this, Core);

    var commonResources = ['configmaps', 'endpoints', 'events', 'limitranges', 'persistentvolumes', 'persistentvolumeclaims', 'podtemplates', 'resourcequotas', 'secrets', 'serviceaccounts', 'services'];
    options = Object.assign({}, options, {
      path: 'api',
      version: options.version || 'v1',
      groupResources: commonResources.concat(['componentstatuses', 'nodes', 'pods', 'replicationcontrollers']),
      //
      // The custom Pods and ReplicationControllers objects implement
      // functionality available only in namespaces.
      //
      namespaceResources: commonResources.concat([{ name: 'replicationcontrollers', Constructor: ReplicationControllers }, { name: 'pods', Constructor: Pods }])
    });
    return _possibleConstructorReturn(this, (Core.__proto__ || Object.getPrototypeOf(Core)).call(this, options));
  }

  return Core;
}(ApiGroup);

module.exports = Core;