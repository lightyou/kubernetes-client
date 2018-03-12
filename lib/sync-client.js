'use strict';
/* eslint-disable no-sync */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

var Request = require('./request');
var SwaggerClient = require('./swagger-client');

var SyncClient = function (_SwaggerClient) {
  _inherits(SyncClient, _SwaggerClient);

  function SyncClient(options) {
    _classCallCheck(this, SyncClient);

    var http = new Request(options.config);
    var spec = options.spec;
    if (!spec) {
      var swaggerPath = path.join(__dirname, 'specs', 'swagger-' + options.version + '.json.gz');
      spec = JSON.parse(zlib.gunzipSync(fs.readFileSync(swaggerPath)));
    }
    return _possibleConstructorReturn(this, (SyncClient.__proto__ || Object.getPrototypeOf(SyncClient)).call(this, { http: http, spec: spec }));
  }

  return SyncClient;
}(SwaggerClient);

module.exports = SyncClient;