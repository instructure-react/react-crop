'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draggableResizableBox = require('./draggable-resizable-box');

var _draggableResizableBox2 = _interopRequireDefault(_draggableResizableBox);

var _dataUriToBlob = require('data-uri-to-blob');

var _dataUriToBlob2 = _interopRequireDefault(_dataUriToBlob);

require('./cropper.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'Cropper',

  propTypes: {
    width: _react2.default.PropTypes.number.isRequired,
    height: _react2.default.PropTypes.number.isRequired,
    center: _react2.default.PropTypes.bool,
    image: _react2.default.PropTypes.any,
    widthLabel: _react2.default.PropTypes.string,
    heightLabel: _react2.default.PropTypes.string,
    offsetXLabel: _react2.default.PropTypes.string,
    offsetYLabel: _react2.default.PropTypes.string,
    onImageLoaded: _react2.default.PropTypes.func,
    minConstraints: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number)
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
      height: this.props.height,
      url: window.URL.createObjectURL(this.props.image)
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.image !== nextProps.image) {
      this.setState({
        url: window.URL.createObjectURL(nextProps.image),
        imageLoaded: false
      });
    }
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    var image = this.props.image;

    return nextProps.image.size !== image.size || nextProps.image.name !== image.name || nextProps.image.type !== image.type || nextState.imageLoaded !== this.state.imageLoaded;
  },
  onLoad: function onLoad(evt) {
    var _this = this;

    var box = this.refs.box.getBoundingClientRect();
    this.setState({
      imageLoaded: true,
      width: box.width,
      height: box.height
    }, function () {
      var img = _this.refs.image;
      _this.props.onImageLoaded && _this.props.onImageLoaded(img);
    });
  },
  cropImage: function cropImage() {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var canvas = _this2.refs.canvas;
        var img = _this2.refs.image;
        var ctx = canvas.getContext('2d');
        var xScale = img.naturalWidth / _this2.state.width,
            yScale = img.naturalHeight / _this2.state.height;


        var imageOffsetX = xScale < 1 ? 0 : _this2.state.offset.left * xScale;
        var imageOffsetY = yScale < 1 ? 0 : _this2.state.offset.top * yScale;
        var imageWidth = xScale < 1 ? img.naturalWidth : _this2.state.dimensions.width * xScale;
        var imageHeight = yScale < 1 ? img.naturalHeight : _this2.state.dimensions.height * yScale;

        var canvasOffsetX = xScale < 1 ? Math.floor((_this2.state.dimensions.width - img.naturalWidth) / 2) : 0;
        var canvasOffsetY = yScale < 1 ? Math.floor((_this2.state.dimensions.height - img.naturalHeight) / 2) : 0;
        var canvasWidth = xScale < 1 ? img.naturalWidth : _this2.props.width;
        var canvasHeight = yScale < 1 ? img.naturalHeight : _this2.props.height;

        ctx.clearRect(0, 0, _this2.props.width, _this2.props.height);
        ctx.drawImage(img, imageOffsetX, imageOffsetY, imageWidth, imageHeight, canvasOffsetX, canvasOffsetY, canvasWidth, canvasHeight);
        resolve((0, _dataUriToBlob2.default)(canvas.toDataURL()));
      };
      img.src = window.URL.createObjectURL(_this2.props.image);
    });
  },
  onChange: function onChange(offset, dimensions) {
    this.setState({ offset: offset, dimensions: dimensions });
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      {
        ref: 'box',
        className: 'Cropper',
        style: {
          minWidth: this.props.width,
          minHeight: this.props.height
        } },
      _react2.default.createElement('canvas', {
        className: 'Cropper-canvas',
        ref: 'canvas',
        width: this.props.width,
        height: this.props.height }),
      _react2.default.createElement('img', {
        ref: 'image',
        src: this.state.url,
        className: 'Cropper-image',
        onLoad: this.onLoad,
        style: { top: this.state.height / 2 } }),
      this.state.imageLoaded && _react2.default.createElement(
        'div',
        { className: 'box' },
        _react2.default.createElement(
          _draggableResizableBox2.default,
          {
            aspectRatio: this.props.width / this.props.height,
            width: this.state.width,
            height: this.state.height,
            minConstraints: this.props.minConstraints,
            onChange: this.onChange,
            widthLabel: this.props.widthLabel,
            heightLabel: this.props.heightLabel,
            offsetXLabel: this.props.offsetXLabel,
            offsetYLabel: this.props.offsetYLabel },
          _react2.default.createElement('div', { className: 'Cropper-box' })
        )
      )
    );
  }
});
