'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiGroup = require('./api-group');

var Batch = function (_ApiGroup) {
  _inherits(Batch, _ApiGroup);

  function Batch(options) {
    _classCallCheck(this, Batch);

    var resources = ['cronjobs', 'jobs',
    // Deprecated name for cronjobs in kubernetes 1.4
    'scheduledjobs'];
    options = Object.assign({}, options, {
      path: 'apis/batch',
      version: options.version || 'v1',
      groupResources: resources,
      namespaceResources: resources
    });
    return _possibleConstructorReturn(this, (Batch.__proto__ || Object.getPrototypeOf(Batch)).call(this, options));
  }

  return Batch;
}(ApiGroup);

module.exports = Batch;