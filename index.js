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
    image: _react2['default'].PropTypes.any,
    widthLabel: _react2['default'].PropTypes.string,
    heightLabel: _react2['default'].PropTypes.string,
    offsetXLabel: _react2['default'].PropTypes.string,
    offsetYLabel: _react2['default'].PropTypes.string,
    onImageLoaded: _react2['default'].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      center: false,
      width: 'Width',
      height: 'Height',
      offsetXLabel: 'Offset X',
      offsetYLabel: 'Offset Y'
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

  onLoad: function onLoad(evt) {
    var _this = this;

    var box = _react2['default'].findDOMNode(this).getBoundingClientRect();
    this.setState({
      imageLoaded: true,
      width: box.width,
      height: box.height
    }, function () {
      var img = _react2['default'].findDOMNode(_this.refs.image);
      _this.props.onImageLoaded && _this.props.onImageLoaded(img);
    });
  },

  cropImage: function cropImage() {
    var canvas = _react2['default'].findDOMNode(this.refs.canvas);
    var img = _react2['default'].findDOMNode(this.refs.image);
    var ctx = canvas.getContext('2d');
    var xScale = img.naturalWidth / this.state.width;
    var yScale = img.naturalHeight / this.state.height;

    var imageOffsetX = xScale < 1 ? 0 : this.state.offset.left * xScale;
    var imageOffsetY = yScale < 1 ? 0 : this.state.offset.top * yScale;
    var imageWidth = xScale < 1 ? img.naturalWidth : this.state.dimensions.width * xScale;
    var imageHeight = yScale < 1 ? img.naturalHeight : this.state.dimensions.height * yScale;

    var canvasOffsetX = xScale < 1 ? Math.floor((this.state.dimensions.width - img.naturalWidth) / 2) : 0;
    var canvasOffsetY = yScale < 1 ? Math.floor((this.state.dimensions.height - img.naturalHeight) / 2) : 0;
    var canvasWidth = xScale < 1 ? img.naturalWidth : this.props.width;
    var canvasHeight = yScale < 1 ? img.naturalHeight : this.props.height;

    ctx.clearRect(0, 0, this.props.width, this.props.height);
    ctx.drawImage(img, imageOffsetX, imageOffsetY, imageWidth, imageHeight, canvasOffsetX, canvasOffsetY, canvasWidth, canvasHeight);
    return (0, _dataUriToBlob2['default'])(canvas.toDataURL());
  },

  onChange: function onChange(offset, dimensions) {
    this.setState({ offset: offset, dimensions: dimensions });
  },

  render: function render() {
    var url = window.URL.createObjectURL(this.props.image);
    return _react2['default'].createElement(
      'div',
      {
        className: 'Cropper',
        style: {
          minWidth: this.props.width,
          minHeight: this.props.height
        } },
      _react2['default'].createElement('canvas', {
        className: 'Cropper-canvas',
        ref: 'canvas',
        width: this.props.width,
        height: this.props.height }),
      _react2['default'].createElement('img', {
        ref: 'image',
        src: url,
        className: 'Cropper-image',
        onLoad: this.onLoad,
        style: { top: this.state.height / 2 } }),
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
            onChange: this.onChange,
            widthLabel: this.props.widthLabel,
            heightLabel: this.props.heightLabel,
            offsetXLabel: this.props.offsetXLabel,
            offsetYLabel: this.props.offsetYLabel },
          _react2['default'].createElement('div', { className: 'Cropper-box' })
        )
      )
    );
  }
});
module.exports = exports['default'];
