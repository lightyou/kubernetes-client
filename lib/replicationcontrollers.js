'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseObject = require('./base');

var ReplicationControllers = function (_BaseObject) {
  _inherits(ReplicationControllers, _BaseObject);

  /**
   * Create a ReplicationControllers Kubernetes API object
   * @extends BaseObject
   * @property {ReplicationControllerPods} pods - Object representing the Pods
   * selected by this ReplicationController.
   * @param {object} options - Options object
   * @param {Api} options.api - API object
   * @param {string} options.parentPath - Optional path of parent resource
   * @param {string} options.path - Optional path of this resource
   */
  function ReplicationControllers(options) {
    _classCallCheck(this, ReplicationControllers);

    return _possibleConstructorReturn(this, (ReplicationControllers.__proto__ || Object.getPrototypeOf(ReplicationControllers)).call(this, Object.assign({}, options, {
      name: options.name || 'replicationcontrollers' })));
  }

  /**
   * Delete a Kubernetes ReplicationController and by default all its Pods
   * @param {RequestOptions|string} options - DELETE options, or resource name
   * @param {boolean} options.preservePods - If true, do not delete the Pods
   * @param {callback} cb - The callback that handles the response
   */


  _createClass(ReplicationControllers, [{
    key: '_delete',
    value: function _delete(options, cb) {
      var _this2 = this;

      if (typeof options === 'string') {
        options = { name: options };
      }

      if (options.preservePods) {
        this.api.delete({ path: [this.path, options.name] }, cb);
        return;
      }

      var patch = { spec: { replicas: 0 } };
      this.api.patch({
        path: [this.path, options.name],
        body: patch
      }, function (err) {
        if (err) return cb(err);
        _this2.api.delete({ path: [_this2.path, options.name] }, cb);
      });
    }
  }]);

  return ReplicationControllers;
}(BaseObject);

module.exports = ReplicationControllers;