'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draggableResizableBox = require('./draggable-resizable-box');

var _draggableResizableBox2 = _interopRequireDefault(_draggableResizableBox);

var _dataUriToBlob = require('data-uri-to-blob');

var _dataUriToBlob2 = _interopRequireDefault(_dataUriToBlob);

exports['default'] = _react2['default'].createClass({
  displayName: 'Cropper',

  propTypes: {
    width: _react2['default'].PropTypes.number.isRequired,
    height: _react2['default'].PropTypes.number.isRequired,
    center: _react2['default'].PropTypes.bool,
    image: _react2['default'].PropTypes.any
  },

  getDefaultProps: function getDefaultProps() {
    return {
      center: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      imageLoaded: false,
      width: this.props.width,
      height: this.props.height
    };
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    var image = this.props.image;

    return nextProps.image.size !== image.size || nextProps.image.name !== image.name || nextProps.image.type !== image.type || nextState.imageLoaded !== this.state.imageLoaded;
  },

  onLoad: function onLoad() {
    var box = _react2['default'].findDOMNode(this).getBoundingClientRect();
    this.setState({
      imageLoaded: true,
      width: box.width,
      height: box.height
    });
  },

  cropImage: function cropImage() {
    var canvas = _react2['default'].findDOMNode(this.refs.canvas);
    var img = _react2['default'].findDOMNode(this.refs.image);
    var ctx = canvas.getContext('2d');
    var xScale = img.naturalWidth / this.state.width;
    var yScale = img.naturalHeight / this.state.height;

    var offsetX = this.state.offset.left * xScale;
    var offsetY = this.state.offset.top * yScale;
    var width = this.state.dimensions.width * xScale;
    var height = this.state.dimensions.height * yScale;

    ctx.clearRect(0, 0, this.props.width, this.props.height);
    ctx.drawImage(img, offsetX, offsetY, width, height, 0, 0, this.props.width, this.props.height);
    return (0, _dataUriToBlob2['default'])(canvas.toDataURL());
  },

  onChange: function onChange(offset, dimensions) {
    this.setState({ offset: offset, dimensions: dimensions });
  },

  render: function render() {
    var url = window.URL.createObjectURL(this.props.image);
    return _react2['default'].createElement(
      'div',
      { className: 'Cropper' },
      _react2['default'].createElement('canvas', {
        className: 'Cropper-canvas',
        ref: 'canvas',
        width: this.props.width,
        height: this.props.height }),
      _react2['default'].createElement('img', { ref: 'image', src: url, className: 'Cropper-image', onLoad: this.onLoad }),
      this.state.imageLoaded && _react2['default'].createElement(
        'div',
        { className: 'box' },
        _react2['default'].createElement(
          _draggableResizableBox2['default'],
          {
            aspectRatio: this.props.width / this.props.height,
            width: this.state.width,
            height: this.state.height,
            minConstraints: [this.props.width, this.props.height],
            onChange: this.onChange },
          _react2['default'].createElement('div', { className: 'Cropper-box' })
        )
      )
    );
  }
});
module.exports = exports['default'];
