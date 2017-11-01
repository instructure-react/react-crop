'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  _createClass(_class, [{
    key: 'getDefaultProps',
    value: function getDefaultProps() {
      return {
        widthLabel: 'Width',
        heightLabel: 'Height',
        offsetXLabel: 'Offset X',
        offsetYLabel: 'Offset Y'
      };
    }
  }]);

  function _class(props) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

    _initialiseProps.call(_this);

    var _this$preserveAspectR = _this.preserveAspectRatio(_this.props.width, _this.props.height),
        _this$preserveAspectR2 = _slicedToArray(_this$preserveAspectR, 2),
        width = _this$preserveAspectR2[0],
        height = _this$preserveAspectR2[1];

    var centerYOffset = (_this.props.height - height) / 2;
    var centerXOffset = (_this.props.width - width) / 2;
    _this.state = {
      top: centerYOffset,
      left: centerXOffset,
      bottom: centerYOffset,
      right: centerXOffset,
      width: width,
      height: height
    };
    return _this;
  }

  _createClass(_class, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
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
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mousemove', this.eventMove);
      document.removeEventListener('mouseup', this.eventEnd);
      document.removeEventListener('touchmove', this.eventMove);
      document.removeEventListener('touchend', this.eventEnd);
      document.removeEventListener('keydown', this.handleKey);
    }

    // If you do this, be careful of constraints

  }, {
    key: 'constrainBoundary',
    value: function constrainBoundary(side) {
      return side < 0 ? 0 : side;
    }
  }, {
    key: 'getClientCoordinates',
    value: function getClientCoordinates(evt) {
      return evt.touches ? {
        clientX: evt.touches[0].clientX,
        clientY: evt.touches[0].clientY
      } : {
        clientX: evt.clientX,
        clientY: evt.clientY
      };
    }

    // Resize methods


    // resize strategies


    // Move methods

  }, {
    key: 'render',
    value: function render() {
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
  }]);

  return _class;
}(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.displayName = 'DraggableResizableBox';
  this.propTypes = {
    width: _propTypes2.default.number.isRequired,
    height: _propTypes2.default.number.isRequired,
    center: _propTypes2.default.bool,
    image: _propTypes2.default.any,
    widthLabel: _propTypes2.default.string,
    heightLabel: _propTypes2.default.string,
    offsetXLabel: _propTypes2.default.string,
    offsetYLabel: _propTypes2.default.string,
    onImageLoaded: _propTypes2.default.func,
    minConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number)
  };

  this.calculateDimensions = function (_ref) {
    var top = _ref.top,
        left = _ref.left,
        bottom = _ref.bottom,
        right = _ref.right;

    return { width: _this2.props.width - left - right, height: _this2.props.height - top - bottom };
  };

  this.preserveAspectRatio = function (width, height) {
    if (_this2.props.minConstraints) {
      width = Math.max(width, _this2.props.minConstraints[0]);
      height = Math.max(height, _this2.props.minConstraints[1]);
    }
    var currentAspectRatio = width / height;

    if (currentAspectRatio < _this2.props.aspectRatio) {
      return [width, width / _this2.props.aspectRatio];
    } else if (currentAspectRatio > _this2.props.aspectRatio) {
      return [height * _this2.props.aspectRatio, height];
    } else {
      return [width, height];
    }
  };

  this.eventMove = function (evt) {
    if (_this2.state.resizing) {
      _this2.onResize(evt);
    } else if (_this2.state.moving) {
      _this2.eventMoveBox(evt);
    }
  };

  this.eventEnd = function (evt) {
    if (_this2.state.resizing) {
      _this2.stopResize(evt);
    } else if (_this2.state.moving) {
      _this2.stopMove(evt);
    }
  };

  this.startResize = function (corner, event) {
    event.stopPropagation();
    event.preventDefault();
    _this2.setState({
      resizing: true,
      corner: corner
    });
  };

  this.stopResize = function () {
    _this2.setState({ resizing: false });
  };

  this.nw = function (mousePos, boxPos) {
    var pos = _extends({}, _this2.state, {
      top: _this2.constrainBoundary(mousePos.clientY - boxPos.top),
      left: _this2.constrainBoundary(mousePos.clientX - boxPos.left)
    });
    var dimensions = _this2.calculateDimensions(pos);

    var _preserveAspectRatio = _this2.preserveAspectRatio(dimensions.width, dimensions.height),
        _preserveAspectRatio2 = _slicedToArray(_preserveAspectRatio, 2),
        width = _preserveAspectRatio2[0],
        height = _preserveAspectRatio2[1];

    pos.top = _this2.props.height - pos.bottom - height;
    pos.left = _this2.props.width - pos.right - width;
    return pos;
  };

  this.ne = function (mousePos, boxPos) {
    var pos = _extends({}, _this2.state, {
      top: _this2.constrainBoundary(mousePos.clientY - boxPos.top),
      right: _this2.constrainBoundary(boxPos.right - mousePos.clientX)
    });
    var dimensions = _this2.calculateDimensions(pos);

    var _preserveAspectRatio3 = _this2.preserveAspectRatio(dimensions.width, dimensions.height),
        _preserveAspectRatio4 = _slicedToArray(_preserveAspectRatio3, 2),
        width = _preserveAspectRatio4[0],
        height = _preserveAspectRatio4[1];

    pos.top = _this2.props.height - pos.bottom - height;
    pos.right = _this2.props.width - pos.left - width;
    return pos;
  };

  this.se = function (mousePos, boxPos) {
    var pos = _extends({}, _this2.state, {
      bottom: _this2.constrainBoundary(boxPos.bottom - mousePos.clientY),
      right: _this2.constrainBoundary(boxPos.right - mousePos.clientX)
    });
    var dimensions = _this2.calculateDimensions(pos);

    var _preserveAspectRatio5 = _this2.preserveAspectRatio(dimensions.width, dimensions.height),
        _preserveAspectRatio6 = _slicedToArray(_preserveAspectRatio5, 2),
        width = _preserveAspectRatio6[0],
        height = _preserveAspectRatio6[1];

    pos.bottom = _this2.props.height - pos.top - height;
    pos.right = _this2.props.width - pos.left - width;
    return pos;
  };

  this.sw = function (mousePos, boxPos) {
    var pos = _extends({}, _this2.state, {
      bottom: _this2.constrainBoundary(boxPos.bottom - mousePos.clientY),
      left: _this2.constrainBoundary(mousePos.clientX - boxPos.left)
    });
    var dimensions = _this2.calculateDimensions(pos);

    var _preserveAspectRatio7 = _this2.preserveAspectRatio(dimensions.width, dimensions.height),
        _preserveAspectRatio8 = _slicedToArray(_preserveAspectRatio7, 2),
        width = _preserveAspectRatio8[0],
        height = _preserveAspectRatio8[1];

    pos.bottom = _this2.props.height - pos.top - height;
    pos.left = _this2.props.width - pos.right - width;
    return pos;
  };

  this.onResize = function (event) {
    var box = _this2.refs.box.parentElement.parentElement.getBoundingClientRect();
    var coordinates = _this2.getClientCoordinates(event);
    var position = _this2[_this2.state.corner](coordinates, box);
    _this2.resize(position, coordinates);
  };

  this.controlsResize = function (event) {
    var box = _this2.refs.box.parentElement.parentElement.getBoundingClientRect();
    var width = event.target.name === 'width' ? +event.target.value : +event.target.value * _this2.props.aspectRatio;
    var height = event.target.name === 'height' ? +event.target.value : +event.target.value / _this2.props.aspectRatio;
    var dimensions = _this2.preserveAspectRatio(width, height);
    width = dimensions[0];
    height = dimensions[1];

    if (width > box.width - _this2.state.left || height > box.height - _this2.state.top) return;

    var widthDifference = _this2.state.width - width;
    var heightDifference = _this2.state.height - height;
    var pos = _extends({}, _this2.state, {
      right: _this2.state.right + widthDifference,
      bottom: _this2.state.bottom + heightDifference
    });
    var coordinates = {
      clientX: box.right - pos.right,
      clientY: box.bottom - pos.bottom
    };

    _this2.resize(pos, coordinates);
  };

  this.resize = function (position, coordinates) {
    var dimensions = _this2.calculateDimensions(position);
    var widthChanged = dimensions.width !== _this2.state.width,
        heightChanged = dimensions.height !== _this2.state.height;
    if (!widthChanged && !heightChanged) return;

    _this2.setState(_extends({}, coordinates, position, dimensions), function () {
      _this2.props.onChange({
        top: position.top,
        left: position.left
      }, dimensions);
    });
  };

  this.startMove = function (evt) {
    var _getClientCoordinates = _this2.getClientCoordinates(evt),
        clientX = _getClientCoordinates.clientX,
        clientY = _getClientCoordinates.clientY;

    _this2.setState({
      moving: true,
      clientX: clientX,
      clientY: clientY
    });
  };

  this.stopMove = function (evt) {
    _this2.setState({
      moving: false
    });
  };

  this.eventMoveBox = function (evt) {
    evt.preventDefault();

    var _getClientCoordinates2 = _this2.getClientCoordinates(evt),
        clientX = _getClientCoordinates2.clientX,
        clientY = _getClientCoordinates2.clientY;

    var movedX = clientX - _this2.state.clientX;
    var movedY = clientY - _this2.state.clientY;

    _this2.moveBox(clientX, clientY, movedX, movedY);
  };

  this.controlsMoveBox = function (evt) {
    var movedX = evt.target.name === 'x' ? evt.target.value - _this2.state.left : 0;
    var movedY = evt.target.name === 'y' ? evt.target.value - _this2.state.top : 0;
    _this2.moveBox(0, 0, movedX, movedY);
  };

  this.moveBox = function (clientX, clientY, movedX, movedY) {
    var position = {
      top: _this2.constrainBoundary(_this2.state.top + movedY),
      left: _this2.constrainBoundary(_this2.state.left + movedX),
      bottom: _this2.constrainBoundary(_this2.state.bottom - movedY),
      right: _this2.constrainBoundary(_this2.state.right - movedX)
    };

    if (!position.top) {
      position.bottom = _this2.props.height - _this2.state.height;
    }
    if (!position.bottom) {
      position.top = _this2.props.height - _this2.state.height;
    }
    if (!position.left) {
      position.right = _this2.props.width - _this2.state.width;
    }
    if (!position.right) {
      position.left = _this2.props.width - _this2.state.width;
    }

    _this2.setState(_extends({}, {
      clientX: clientX,
      clientY: clientY
    }, position), function () {
      _this2.props.onChange({
        top: position.top,
        left: position.left
      }, _this2.calculateDimensions(position));
    });
  };

  this.keyboardResize = function (change) {
    if (_this2.state.right - change < 0) {
      return;
    }
    if (_this2.state.bottom - change < 0) {
      return;
    }

    var _preserveAspectRatio9 = _this2.preserveAspectRatio(_this2.state.width + change, _this2.state.height + change),
        _preserveAspectRatio10 = _slicedToArray(_preserveAspectRatio9, 2),
        width = _preserveAspectRatio10[0],
        height = _preserveAspectRatio10[1];

    var widthChange = width - _this2.state.width;
    var heightChange = height - _this2.state.height;

    _this2.setState({
      bottom: _this2.state.bottom - heightChange,
      right: _this2.state.right - widthChange,
      width: width,
      height: height
    });
  };

  this.handleKey = function (event) {
    // safari doesn't support event.key, so fall back to keyCode
    if (event.shiftKey) {
      if (event.key === 'ArrowUp' || event.keyCode === 38) {
        _this2.keyboardResize(-10);
        event.preventDefault();
      } else if (event.key === 'ArrowDown' || event.keyCode === 40) {
        _this2.keyboardResize(10);
        event.preventDefault();
      } else if (event.key === 'ArrowLeft' || event.keyCode === 37) {
        _this2.keyboardResize(-10);
        event.preventDefault();
      } else if (event.key === 'ArrowRight' || event.keyCode === 39) {
        _this2.keyboardResize(10);
        event.preventDefault();
      }
    } else {
      if (event.key === 'ArrowUp' || event.keyCode === 38) {
        _this2.moveBox(_this2.state.clientX, _this2.state.clientY, 0, -10);
        event.preventDefault();
      } else if (event.key === 'ArrowDown' || event.keyCode === 40) {
        _this2.moveBox(_this2.state.clientX, _this2.state.clientY, 0, 10);
        event.preventDefault();
      } else if (event.key === 'ArrowLeft' || event.keyCode === 37) {
        _this2.moveBox(_this2.state.clientX, _this2.state.clientY, -10, 0);
        event.preventDefault();
      } else if (event.key === 'ArrowRight' || event.keyCode === 39) {
        _this2.moveBox(_this2.state.clientX, _this2.state.clientY, 10, 0);
        event.preventDefault();
      }
    }
  };
};

exports.default = _class;
