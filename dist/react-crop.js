(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactCrop"] = factory(require("react"));
	else
		root["ReactCrop"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _draggableResizableBox = __webpack_require__(2);
	
	var _draggableResizableBox2 = _interopRequireDefault(_draggableResizableBox);
	
	var _dataUriToBlob = __webpack_require__(3);
	
	var _dataUriToBlob2 = _interopRequireDefault(_dataUriToBlob);
	
	__webpack_require__(4);
	
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _react2.default.createClass({
	  displayName: 'DraggableResizableBox',
	
	  propTypes: {
	    aspectRatio: _react2.default.PropTypes.number.isRequired,
	    width: _react2.default.PropTypes.number.isRequired,
	    height: _react2.default.PropTypes.number.isRequired,
	    onChange: _react2.default.PropTypes.func,
	    offset: _react2.default.PropTypes.array,
	    minConstraints: _react2.default.PropTypes.array,
	    children: _react2.default.PropTypes.node,
	    widthLabel: _react2.default.PropTypes.string,
	    heightLabel: _react2.default.PropTypes.string,
	    offsetXLabel: _react2.default.PropTypes.string,
	    offsetYLabel: _react2.default.PropTypes.string
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      widthLabel: 'Width',
	      heightLabel: 'Height',
	      offsetXLabel: 'Offset X',
	      offsetYLabel: 'Offset Y'
	    };
	  },
	  getInitialState: function getInitialState() {
	    var _preserveAspectRatio = this.preserveAspectRatio(this.props.width, this.props.height),
	        _preserveAspectRatio2 = _slicedToArray(_preserveAspectRatio, 2),
	        width = _preserveAspectRatio2[0],
	        height = _preserveAspectRatio2[1];
	
	    var centerYOffset = (this.props.height - height) / 2;
	    var centerXOffset = (this.props.width - width) / 2;
	    return {
	      top: centerYOffset,
	      left: centerXOffset,
	      bottom: centerYOffset,
	      right: centerXOffset,
	      width: width,
	      height: height
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    document.addEventListener('mousemove', this.eventMove);
	    document.addEventListener('mouseup', this.eventEnd);
	    document.addEventListener('touchmove', this.eventMove);
	    document.addEventListener('touchend', this.eventEnd);
	    document.addEventListener('keydown', this.handleKey);
	    this.props.onChange({
	      top: this.state.top,
	      left: this.state.left
	    }, {
	      width: this.state.width,
	      height: this.state.height
	    });
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    document.removeEventListener('mousemove', this.eventMove);
	    document.removeEventListener('mouseup', this.eventEnd);
	    document.removeEventListener('touchmove', this.eventMove);
	    document.removeEventListener('touchend', this.eventEnd);
	    document.removeEventListener('keydown', this.handleKey);
	  },
	  calculateDimensions: function calculateDimensions(_ref) {
	    var top = _ref.top,
	        left = _ref.left,
	        bottom = _ref.bottom,
	        right = _ref.right;
	
	    return { width: this.props.width - left - right, height: this.props.height - top - bottom };
	  },
	
	
	  // If you do this, be careful of constraints
	  preserveAspectRatio: function preserveAspectRatio(width, height) {
	    if (this.props.minConstraints) {
	      width = Math.max(width, this.props.minConstraints[0]);
	      height = Math.max(height, this.props.minConstraints[1]);
	    }
	    var currentAspectRatio = width / height;
	
	    if (currentAspectRatio < this.props.aspectRatio) {
	      return [width, width / this.props.aspectRatio];
	    } else if (currentAspectRatio > this.props.aspectRatio) {
	      return [height * this.props.aspectRatio, height];
	    } else {
	      return [width, height];
	    }
	  },
	  constrainBoundary: function constrainBoundary(side) {
	    return side < 0 ? 0 : side;
	  },
	  getClientCoordinates: function getClientCoordinates(evt) {
	    return evt.touches ? {
	      clientX: evt.touches[0].clientX,
	      clientY: evt.touches[0].clientY
	    } : {
	      clientX: evt.clientX,
	      clientY: evt.clientY
	    };
	  },
	  eventMove: function eventMove(evt) {
	    if (this.state.resizing) {
	      this.onResize(evt);
	    } else if (this.state.moving) {
	      this.eventMoveBox(evt);
	    }
	  },
	  eventEnd: function eventEnd(evt) {
	    if (this.state.resizing) {
	      this.stopResize(evt);
	    } else if (this.state.moving) {
	      this.stopMove(evt);
	    }
	  },
	
	
	  // Resize methods
	  startResize: function startResize(corner, event) {
	    event.stopPropagation();
	    event.preventDefault();
	    this.setState({
	      resizing: true,
	      corner: corner
	    });
	  },
	  stopResize: function stopResize() {
	    this.setState({ resizing: false });
	  },
	
	
	  // resize strategies
	  nw: function nw(mousePos, boxPos) {
	    var pos = _extends({}, this.state, {
	      top: this.constrainBoundary(mousePos.clientY - boxPos.top),
	      left: this.constrainBoundary(mousePos.clientX - boxPos.left)
	    });
	    var dimensions = this.calculateDimensions(pos);
	
	    var _preserveAspectRatio3 = this.preserveAspectRatio(dimensions.width, dimensions.height),
	        _preserveAspectRatio4 = _slicedToArray(_preserveAspectRatio3, 2),
	        width = _preserveAspectRatio4[0],
	        height = _preserveAspectRatio4[1];
	
	    pos.top = this.props.height - pos.bottom - height;
	    pos.left = this.props.width - pos.right - width;
	    return pos;
	  },
	  ne: function ne(mousePos, boxPos) {
	    var pos = _extends({}, this.state, {
	      top: this.constrainBoundary(mousePos.clientY - boxPos.top),
	      right: this.constrainBoundary(boxPos.right - mousePos.clientX)
	    });
	    var dimensions = this.calculateDimensions(pos);
	
	    var _preserveAspectRatio5 = this.preserveAspectRatio(dimensions.width, dimensions.height),
	        _preserveAspectRatio6 = _slicedToArray(_preserveAspectRatio5, 2),
	        width = _preserveAspectRatio6[0],
	        height = _preserveAspectRatio6[1];
	
	    pos.top = this.props.height - pos.bottom - height;
	    pos.right = this.props.width - pos.left - width;
	    return pos;
	  },
	  se: function se(mousePos, boxPos) {
	    var pos = _extends({}, this.state, {
	      bottom: this.constrainBoundary(boxPos.bottom - mousePos.clientY),
	      right: this.constrainBoundary(boxPos.right - mousePos.clientX)
	    });
	    var dimensions = this.calculateDimensions(pos);
	
	    var _preserveAspectRatio7 = this.preserveAspectRatio(dimensions.width, dimensions.height),
	        _preserveAspectRatio8 = _slicedToArray(_preserveAspectRatio7, 2),
	        width = _preserveAspectRatio8[0],
	        height = _preserveAspectRatio8[1];
	
	    pos.bottom = this.props.height - pos.top - height;
	    pos.right = this.props.width - pos.left - width;
	    return pos;
	  },
	  sw: function sw(mousePos, boxPos) {
	    var pos = _extends({}, this.state, {
	      bottom: this.constrainBoundary(boxPos.bottom - mousePos.clientY),
	      left: this.constrainBoundary(mousePos.clientX - boxPos.left)
	    });
	    var dimensions = this.calculateDimensions(pos);
	
	    var _preserveAspectRatio9 = this.preserveAspectRatio(dimensions.width, dimensions.height),
	        _preserveAspectRatio10 = _slicedToArray(_preserveAspectRatio9, 2),
	        width = _preserveAspectRatio10[0],
	        height = _preserveAspectRatio10[1];
	
	    pos.bottom = this.props.height - pos.top - height;
	    pos.left = this.props.width - pos.right - width;
	    return pos;
	  },
	  onResize: function onResize(event) {
	    var box = this.refs.box.parentElement.parentElement.getBoundingClientRect();
	    var coordinates = this.getClientCoordinates(event);
	    var position = this[this.state.corner](coordinates, box);
	    this.resize(position, coordinates);
	  },
	  controlsResize: function controlsResize(event) {
	    var box = this.refs.box.parentElement.parentElement.getBoundingClientRect();
	    var width = event.target.name === 'width' ? +event.target.value : +event.target.value * this.props.aspectRatio;
	    var height = event.target.name === 'height' ? +event.target.value : +event.target.value / this.props.aspectRatio;
	    var dimensions = this.preserveAspectRatio(width, height);
	    width = dimensions[0];
	    height = dimensions[1];
	
	    if (width > box.width - this.state.left || height > box.height - this.state.top) return;
	
	    var widthDifference = this.state.width - width;
	    var heightDifference = this.state.height - height;
	    var pos = _extends({}, this.state, {
	      right: this.state.right + widthDifference,
	      bottom: this.state.bottom + heightDifference
	    });
	    var coordinates = {
	      clientX: box.right - pos.right,
	      clientY: box.bottom - pos.bottom
	    };
	
	    this.resize(pos, coordinates);
	  },
	  resize: function resize(position, coordinates) {
	    var _this = this;
	
	    var dimensions = this.calculateDimensions(position);
	    var widthChanged = dimensions.width !== this.state.width,
	        heightChanged = dimensions.height !== this.state.height;
	    if (!widthChanged && !heightChanged) return;
	
	    this.setState(_extends({}, coordinates, position, dimensions), function () {
	      _this.props.onChange({
	        top: position.top,
	        left: position.left
	      }, dimensions);
	    });
	  },
	
	
	  // Move methods
	  startMove: function startMove(evt) {
	    var _getClientCoordinates = this.getClientCoordinates(evt),
	        clientX = _getClientCoordinates.clientX,
	        clientY = _getClientCoordinates.clientY;
	
	    this.setState({
	      moving: true,
	      clientX: clientX,
	      clientY: clientY
	    });
	  },
	  stopMove: function stopMove(evt) {
	    this.setState({
	      moving: false
	    });
	  },
	  eventMoveBox: function eventMoveBox(evt) {
	    evt.preventDefault();
	
	    var _getClientCoordinates2 = this.getClientCoordinates(evt),
	        clientX = _getClientCoordinates2.clientX,
	        clientY = _getClientCoordinates2.clientY;
	
	    var movedX = clientX - this.state.clientX;
	    var movedY = clientY - this.state.clientY;
	
	    this.moveBox(clientX, clientY, movedX, movedY);
	  },
	  controlsMoveBox: function controlsMoveBox(evt) {
	    var movedX = evt.target.name === 'x' ? evt.target.value - this.state.left : 0;
	    var movedY = evt.target.name === 'y' ? evt.target.value - this.state.top : 0;
	    this.moveBox(0, 0, movedX, movedY);
	  },
	  moveBox: function moveBox(clientX, clientY, movedX, movedY) {
	    var _this2 = this;
	
	    var position = {
	      top: this.constrainBoundary(this.state.top + movedY),
	      left: this.constrainBoundary(this.state.left + movedX),
	      bottom: this.constrainBoundary(this.state.bottom - movedY),
	      right: this.constrainBoundary(this.state.right - movedX)
	    };
	
	    if (!position.top) {
	      position.bottom = this.props.height - this.state.height;
	    }
	    if (!position.bottom) {
	      position.top = this.props.height - this.state.height;
	    }
	    if (!position.left) {
	      position.right = this.props.width - this.state.width;
	    }
	    if (!position.right) {
	      position.left = this.props.width - this.state.width;
	    }
	
	    this.setState(_extends({}, {
	      clientX: clientX,
	      clientY: clientY
	    }, position), function () {
	      _this2.props.onChange({
	        top: position.top,
	        left: position.left
	      }, _this2.calculateDimensions(position));
	    });
	  },
	  keyboardResize: function keyboardResize(change) {
	    if (this.state.right - change < 0) {
	      return;
	    }
	    if (this.state.bottom - change < 0) {
	      return;
	    }
	
	    var _preserveAspectRatio11 = this.preserveAspectRatio(this.state.width + change, this.state.height + change),
	        _preserveAspectRatio12 = _slicedToArray(_preserveAspectRatio11, 2),
	        width = _preserveAspectRatio12[0],
	        height = _preserveAspectRatio12[1];
	
	    var widthChange = width - this.state.width;
	    var heightChange = height - this.state.height;
	
	    this.setState({
	      bottom: this.state.bottom - heightChange,
	      right: this.state.right - widthChange,
	      width: width,
	      height: height
	    });
	  },
	  handleKey: function handleKey(event) {
	    // safari doesn't support event.key, so fall back to keyCode
	    if (event.shiftKey) {
	      if (event.key === 'ArrowUp' || event.keyCode === 38) {
	        this.keyboardResize(-10);
	        event.preventDefault();
	      } else if (event.key === 'ArrowDown' || event.keyCode === 40) {
	        this.keyboardResize(10);
	        event.preventDefault();
	      } else if (event.key === 'ArrowLeft' || event.keyCode === 37) {
	        this.keyboardResize(-10);
	        event.preventDefault();
	      } else if (event.key === 'ArrowRight' || event.keyCode === 39) {
	        this.keyboardResize(10);
	        event.preventDefault();
	      }
	    } else {
	      if (event.key === 'ArrowUp' || event.keyCode === 38) {
	        this.moveBox(this.state.clientX, this.state.clientY, 0, -10);
	        event.preventDefault();
	      } else if (event.key === 'ArrowDown' || event.keyCode === 40) {
	        this.moveBox(this.state.clientX, this.state.clientY, 0, 10);
	        event.preventDefault();
	      } else if (event.key === 'ArrowLeft' || event.keyCode === 37) {
	        this.moveBox(this.state.clientX, this.state.clientY, -10, 0);
	        event.preventDefault();
	      } else if (event.key === 'ArrowRight' || event.keyCode === 39) {
	        this.moveBox(this.state.clientX, this.state.clientY, 10, 0);
	        event.preventDefault();
	      }
	    }
	  },
	  render: function render() {
	    var style = {
	      position: 'absolute',
	      top: this.state.top,
	      left: this.state.left,
	      right: this.state.right,
	      bottom: this.state.bottom
	    };
	
	    var _calculateDimensions = this.calculateDimensions(this.state),
	        width = _calculateDimensions.width,
	        height = _calculateDimensions.height;
	
	    var topStyle = {
	      height: this.state.top
	    };
	    var bottomStyle = {
	      height: this.state.bottom
	    };
	    var leftStyle = {
	      top: this.state.top,
	      right: width + this.state.right,
	      bottom: this.state.bottom
	    };
	    var rightStyle = {
	      top: this.state.top,
	      left: width + this.state.left,
	      bottom: this.state.bottom
	    };
	
	    return _react2.default.createElement(
	      'div',
	      { ref: 'box', className: 'DraggableResizable' },
	      _react2.default.createElement(
	        'div',
	        { className: 'DraggableResizable-controls' },
	        _react2.default.createElement(
	          'label',
	          null,
	          this.props.offsetXLabel,
	          _react2.default.createElement('input', {
	            name: 'x',
	            value: Math.round(this.state.left),
	            onChange: this.controlsMoveBox,
	            tabIndex: '-1',
	            type: 'number' })
	        ),
	        _react2.default.createElement(
	          'label',
	          null,
	          this.props.offsetYLabel,
	          _react2.default.createElement('input', {
	            name: 'y',
	            value: Math.round(this.state.top),
	            onChange: this.controlsMoveBox,
	            tabIndex: '-1',
	            type: 'number' })
	        ),
	        _react2.default.createElement(
	          'label',
	          null,
	          this.props.widthLabel,
	          _react2.default.createElement('input', {
	            name: 'width',
	            value: Math.round(width),
	            type: 'number',
	            tabIndex: '-1',
	            onChange: this.controlsResize })
	        ),
	        _react2.default.createElement(
	          'label',
	          null,
	          this.props.heightLabel,
	          _react2.default.createElement('input', {
	            value: Math.round(height),
	            type: 'number',
	            name: 'height',
	            tabIndex: '-1',
	            onChange: this.controlsResize })
	        )
	      ),
	      _react2.default.createElement('div', { className: 'DraggableResizable-top', style: topStyle }),
	      _react2.default.createElement('div', { className: 'DraggableResizable-left', style: leftStyle }),
	      _react2.default.createElement(
	        'div',
	        { style: style, onMouseDown: this.startMove, onTouchStart: this.startMove },
	        this.props.children,
	        _react2.default.createElement('div', { className: 'resize-handle resize-handle-se',
	          onMouseDown: this.startResize.bind(null, 'se'),
	          onTouchStart: this.startResize.bind(null, 'se') }),
	        _react2.default.createElement('div', { className: 'resize-handle resize-handle-ne',
	          onMouseDown: this.startResize.bind(null, 'ne'),
	          onTouchStart: this.startResize.bind(null, 'ne') }),
	        _react2.default.createElement('div', { className: 'resize-handle resize-handle-sw',
	          onMouseDown: this.startResize.bind(null, 'sw'),
	          onTouchStart: this.startResize.bind(null, 'sw') }),
	        _react2.default.createElement('div', { className: 'resize-handle resize-handle-nw',
	          onMouseDown: this.startResize.bind(null, 'nw'),
	          onTouchStart: this.startResize.bind(null, 'nw') })
	      ),
	      _react2.default.createElement('div', { className: 'DraggableResizable-right', style: rightStyle }),
	      _react2.default.createElement('div', { className: 'DraggableResizable-bottom', style: bottomStyle })
	    );
	  }
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	
	/**
	 * Blob constructor.
	 */
	
	var Blob = window.Blob;
	
	/**
	 * ArrayBufferView support.
	 */
	
	var hasArrayBufferView = new Blob([new Uint8Array(100)]).size == 100;
	
	/**
	 * Return a `Blob` for the given data `uri`.
	 *
	 * @param {String} uri
	 * @return {Blob}
	 * @api public
	 */
	
	module.exports = function(uri){
	  var data = uri.split(',')[1];
	  var bytes = atob(data);
	  var buf = new ArrayBuffer(bytes.length);
	  var arr = new Uint8Array(buf);
	  for (var i = 0; i < bytes.length; i++) {
	    arr[i] = bytes.charCodeAt(i);
	  }
	
	  if (!hasArrayBufferView) arr = buf;
	  var blob = new Blob([arr], { type: mime(uri) });
	  blob.slice = blob.slice || blob.webkitSlice;
	  return blob;
	};
	
	/**
	 * Return data uri mime type.
	 */
	
	function mime(uri) {
	  return uri.split(';')[0].slice(5);
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./cropper.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./cropper.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	
	
	// module
	exports.push([module.id, ".Cropper{position:relative;display:inline-block;max-width:100%;max-height:100%}.box,.Cropper-box{position:absolute;top:0;left:0;bottom:0;right:0}.Cropper-box{cursor:move;border:1px solid #fff}.Cropper-canvas{visibility:hidden;position:absolute}.Cropper-image{vertical-align:middle;max-width:100%;position:relative;transform:translate(-50%,-50%);left:50%}.resize-handle{position:absolute;background-color:#eceeef;border:1px solid #8295ab;width:13px;height:13px;z-index:1}.resize-handle-se{bottom:0;right:0;cursor:nwse-resize;transform:translate(50%,50%)}.resize-handle-ne{right:0;top:0;cursor:nesw-resize;transform:translate(50%,-50%)}.resize-handle-sw{bottom:0;left:0;cursor:nesw-resize;transform:translate(-50%,50%)}.resize-handle-nw{top:0;bottom:0;cursor:nwse-resize;transform:translate(-50%,-50%)}.DraggableResizable{position:relative;width:100%;height:100%}.DraggableResizable-controls{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.DraggableResizable-bottom,.DraggableResizable-left,.DraggableResizable-right,.DraggableResizable-top{position:absolute;background-color:rgba(0,0,0,.7)}.DraggableResizable-top{top:0;left:0;right:0}.DraggableResizable-bottom{bottom:0;left:0;right:0}.DraggableResizable-left{left:0}.DraggableResizable-right{right:0}", ""]);
	
	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-crop.js.map