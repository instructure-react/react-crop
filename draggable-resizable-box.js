'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

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
