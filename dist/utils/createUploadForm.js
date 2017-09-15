'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var validImageTypes = ['image/bmp', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/tiff', 'image/x-tiff'];

var validVideoTypes = ['video/mp4', 'video/avi', 'video/msvideo', 'video/x-msvideo', 'video/avs-video', 'video/x-dv', 'video/mpeg', 'video/x-motion-jpeg', 'video/quicktime'];

var createUploadForm = function createUploadForm() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments[1];
  var allowedFileTypes = arguments[2];


  var validTypes = allowedFileTypes ? allowedFileTypes.reduce(function (p, v) {
    return v === 'image' ? [].concat(_toConsumableArray(p), validImageTypes) : v === 'video' ? [].concat(_toConsumableArray(p), validVideoTypes) : [].concat(_toConsumableArray(p), [v]);
  }, []) : null;

  var isValidType = function isValidType(item) {
    return !validTypes || item.type && validTypes.indexOf(item.type) !== -1;
  };

  var validItems = Array.from(items).filter(function (v) {
    return isValidType(v);
  });

  console.log(validItems);

  var formData = new FormData();

  validItems.forEach(function (v, index) {
    return formData.append('file_' + index, v);
  });

  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    var optionsKeys = Object.keys(options).forEach(function (k) {
      return formData.append(k, options[k]);
    });
  }

  var totalSize = validItems.reduce(function (size, item) {
    return size + item.size;
  }, 0);
  var files = validItems.map(function (item) {
    return {
      url: URL.createObjectURL(item),
      quota: item.size / totalSize
    };
  });

  return {
    formData: formData,
    files: files
  };
};

exports.default = createUploadForm;