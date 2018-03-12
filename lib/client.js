'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Request = require('./request');
var SwaggerClient = require('./swagger-client');

var Client = function (_SwaggerClient) {
  _inherits(Client, _SwaggerClient);

  function Client(options) {
    var _this2 = this;

    var _ret;

    _classCallCheck(this, Client);

    var http = new Request(options.config);
    return _ret = new Promise(function (resolve, reject) {
      http.request('GET', { path: '/swagger.json' }, function (err, res) {
        var _this;

        if (err) return reject(err);
        if (res.statusCode !== 200) {
          return reject(new Error('Failed to get swagger.json: ' + res.statusCode));
        }
        resolve((_this = _possibleConstructorReturn(_this2, (Client.__proto__ || Object.getPrototypeOf(Client)).call(_this2, { http: http, spec: res.body })), _this));
      });
    }), _possibleConstructorReturn(_this, _ret);
  }

  return Client;
}(SwaggerClient);

module.exports = Client;