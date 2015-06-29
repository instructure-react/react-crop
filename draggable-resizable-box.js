'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

exports['default'] = _react2['default'].createClass({
  displayName: 'DraggableResizableBox',

  propTypes: {
    aspectRatio: _react2['default'].PropTypes.number.isRequired,
    width: _react2['default'].PropTypes.number.isRequired,
    height: _react2['default'].PropTypes.number.isRequired,
    onChange: _react2['default'].PropTypes.func,
    offset: _react2['default'].PropTypes.array,
    minConstraints: _react2['default'].PropTypes.array,
    children: _react2['default'].PropTypes.node
  },

  getInitialState: function getInitialState() {
    var _preserveAspectRatio = this.preserveAspectRatio(this.props.width, this.props.height);

    var _preserveAspectRatio2 = _slicedToArray(_preserveAspectRatio, 2);

    var width = _preserveAspectRatio2[0];
    var height = _preserveAspectRatio2[1];

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
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
  },

  mouseMove: function mouseMove(evt) {
    if (this.state.resizing) {
      this.onResize(evt);
    } else if (this.state.moving) {
      this.move(evt);
    }
  },

  mouseUp: function mouseUp(evt) {
    if (this.state.resizing) {
      this.stopResize(evt);
    } else if (this.state.moving) {
      this.stopMove(evt);
    }
  },

  startResize: function startResize(corner, event) {
    event.stopPropagation();
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

    var _preserveAspectRatio3 = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.bottom, pos.right]);

    var _preserveAspectRatio32 = _slicedToArray(_preserveAspectRatio3, 2);

    var width = _preserveAspectRatio32[0];
    var height = _preserveAspectRatio32[1];

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

    var _preserveAspectRatio4 = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.bottom, pos.left]);

    var _preserveAspectRatio42 = _slicedToArray(_preserveAspectRatio4, 2);

    var width = _preserveAspectRatio42[0];
    var height = _preserveAspectRatio42[1];

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

    var _preserveAspectRatio5 = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.top, pos.left]);

    var _preserveAspectRatio52 = _slicedToArray(_preserveAspectRatio5, 2);

    var width = _preserveAspectRatio52[0];
    var height = _preserveAspectRatio52[1];

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

    var _preserveAspectRatio6 = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.top, pos.right]);

    var _preserveAspectRatio62 = _slicedToArray(_preserveAspectRatio6, 2);

    var width = _preserveAspectRatio62[0];
    var height = _preserveAspectRatio62[1];

    pos.bottom = this.props.height - pos.top - height;
    pos.left = this.props.width - pos.right - width;
    return pos;
  },

  onResize: function onResize(event) {
    var _this = this;

    var box = _react2['default'].findDOMNode(this).parentElement.parentElement.getBoundingClientRect();

    var position = this[this.state.corner](event, box);

    var dimensions = this.calculateDimensions(position);
    var widthChanged = dimensions.width !== this.state.width,
        heightChanged = dimensions.height !== this.state.height;
    if (!widthChanged && !heightChanged) return;

    this.setState(_extends({}, {
      clientX: event.clientX,
      clientY: event.clientY
    }, position, dimensions), function () {
      _this.props.onChange({
        top: position.top,
        left: position.left
      }, dimensions);
    });
  },

  startMove: function startMove(evt) {
    this.setState({
      moving: true,
      clientX: evt.clientX,
      clientY: evt.clientY
    });
  },

  stopMove: function stopMove(evt) {
    this.setState({
      moving: false
    });
  },

  move: function move(evt) {
    var _this2 = this;

    evt.preventDefault();
    var movedX = evt.clientX - this.state.clientX;
    var movedY = evt.clientY - this.state.clientY;

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
      clientX: evt.clientX,
      clientY: evt.clientY
    }, position), function () {
      _this2.props.onChange({
        top: position.top,
        left: position.left
      }, _this2.calculateDimensions(position));
    });
  },

  calculateDimensions: function calculateDimensions(_ref) {
    var top = _ref.top;
    var left = _ref.left;
    var bottom = _ref.bottom;
    var right = _ref.right;

    return { width: this.props.width - left - right, height: this.props.height - top - bottom };
  },

  // If you do this, be careful of constraints
  preserveAspectRatio: function preserveAspectRatio(width, height) {
    width = Math.max(width, this.props.minConstraints[0]);
    height = Math.max(height, this.props.minConstraints[1]);
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

  render: function render() {
    var style = {
      position: 'absolute',
      top: this.state.top,
      left: this.state.left,
      right: this.state.right,
      bottom: this.state.bottom
    };

    var _calculateDimensions = this.calculateDimensions(this.state);

    var width = _calculateDimensions.width;

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

    return _react2['default'].createElement(
      'div',
      { className: 'DraggableResizable' },
      _react2['default'].createElement('div', { className: 'DraggableResizable-top', style: topStyle }),
      _react2['default'].createElement('div', { className: 'DraggableResizable-left', style: leftStyle }),
      _react2['default'].createElement(
        'div',
        { style: style, onMouseDown: this.startMove },
        this.props.children,
        _react2['default'].createElement('div', { className: 'resize-handle resize-handle-se',
          onMouseDown: this.startResize.bind(null, 'se') }),
        _react2['default'].createElement('div', { className: 'resize-handle resize-handle-ne',
          onMouseDown: this.startResize.bind(null, 'ne') }),
        _react2['default'].createElement('div', { className: 'resize-handle resize-handle-sw',
          onMouseDown: this.startResize.bind(null, 'sw') }),
        _react2['default'].createElement('div', { className: 'resize-handle resize-handle-nw',
          onMouseDown: this.startResize.bind(null, 'nw') })
      ),
      _react2['default'].createElement('div', { className: 'DraggableResizable-right', style: rightStyle }),
      _react2['default'].createElement('div', { className: 'DraggableResizable-bottom', style: bottomStyle })
    );
  }
});
module.exports = exports['default'];
