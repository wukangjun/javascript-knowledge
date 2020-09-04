"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Canvas = exports.mulit = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mulit = function mulit(a) {
  return function (b) {
    return a * b;
  };
};

exports.mulit = mulit;

var Canvas = function Canvas() {
  _classCallCheck(this, Canvas);

  this.name = 'hello world';
};

exports.Canvas = Canvas;