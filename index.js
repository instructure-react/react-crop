'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

exports['default'] = _react2['default'].createClass({
  displayName: 'Cropper',

  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.image.size !== this.props.image.size || nextProps.image.name !== this.props.image.name || nextProps.image.type !== this.props.image.type;
  },

  componentDidMount: function componentDidMount() {
    this.renderImage();
  },

  componentDidUpdate: function componentDidUpdate() {
    this.renderImage();
  },

  renderImage: function renderImage(evt) {
    var _this = this;

    var ctx = _react2['default'].findDOMNode(this.refs.canvas).getContext('2d');
    var img = new Image();
    img.src = window.URL.createObjectURL(this.props.image);
    img.onload = function () {
      var canvas = _react2['default'].findDOMNode(_this.refs.canvas);
      var naturalHeight = img.naturalHeight;
      var naturalWidth = img.naturalWidth;

      var imgRatio = naturalWidth / naturalHeight;
      var sizeRatio = _this.props.width / _this.props.height;

      if (imgRatio < sizeRatio) {
        canvas.width = _this.props.width;
        canvas.height = naturalHeight * (_this.props.width / naturalWidth);
      } else {
        canvas.height = _this.props.height;
        canvas.width = naturalWidth * (_this.props.height / naturalHeight);
      }

      var height = canvas.height;
      var width = canvas.width;

      //      var { naturalWidth, naturalHeight } = img
      //      var imgRatio = naturalWidth / naturalHeight
      //
      //      var w = naturalWidth
      //      var h = naturalHeight
      //
      //      if (naturalWidth < width || naturalHeight < height) {
      //        // fits entirely inside, use natural dimensions
      //      } else if (imgRatio > sizeRatio) { // cap height
      //        h = height
      //        w = naturalWidth / naturalHeight * height
      //      } else { // cap width
      //        w = width
      //        h = naturalHeight / naturalWidth * width
      //      }
      //
      //      var x = Math.floor((width - w) / 2)
      //      var y = Math.floor((height - h) / 2)
      //
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    };
  },

  render: function render() {

    return _react2['default'].createElement(
      'div',
      { className: 'Cropper' },
      _react2['default'].createElement('canvas', { ref: 'canvas' })
    );
  }
});
module.exports = exports['default'];
