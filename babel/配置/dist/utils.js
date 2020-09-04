"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Canvas = exports.mulit = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var mulit = function mulit(a) {
  return function (b) {
    return a * b;
  };
};

exports.mulit = mulit;

var Canvas = function Canvas() {
  (0, _classCallCheck2["default"])(this, Canvas);
  this.name = 'hello world';
};

exports.Canvas = Canvas;