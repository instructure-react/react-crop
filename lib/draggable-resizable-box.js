import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class DraggableResizableBox extends Component {
  static displayName = 'DraggableResizableBox'

  static propTypes = {
    aspectRatio: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    minConstraints: PropTypes.array,
    children: PropTypes.node,
    widthLabel: PropTypes.string,
    heightLabel: PropTypes.string,
    offsetXLabel: PropTypes.string,
    offsetYLabel: PropTypes.string,
  }

  static defaultProps = {
    minConstraints: undefined,
    children: null,
    widthLabel: 'Width',
    heightLabel: 'Height',
    offsetXLabel: 'Offset X',
    offsetYLabel: 'Offset Y',
  }

  constructor(props) {
    super(props)

    const [width, height] = this.preserveAspectRatio(props.width, props.height)
    const centerYOffset = (props.height - height) / 2
    const centerXOffset = (props.width - width) / 2
    this.state = {
      width,
      height,
      top: centerYOffset,
      left: centerXOffset,
      bottom: centerYOffset,
      right: centerXOffset,
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.eventMove)
    document.addEventListener('mouseup', this.eventEnd)
    document.addEventListener('touchmove', this.eventMove)
    document.addEventListener('touchend', this.eventEnd)
    document.addEventListener('keydown', this.handleKey)
    this.props.onChange(
      { top: this.state.top, left: this.state.left },
      { width: this.state.width, height: this.state.height }
    )
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.eventMove)
    document.removeEventListener('mouseup', this.eventEnd)
    document.removeEventListener('touchmove', this.eventMove)
    document.removeEventListener('touchend', this.eventEnd)
    document.removeEventListener('keydown', this.handleKey)
  }

  onResize = (event) => {
    const box = this.box.parentElement.parentElement.getBoundingClientRect()
    const coordinates = this.getClientCoordinates(event)
    const position = this[this.state.corner](coordinates, box)
    this.resize(position, coordinates)
  }

  getClientCoordinates = ({ touches: [touch] = [], clientX, clientY }) => (
    touch || { clientX, clientY }
  )

  // If you do this, be careful of constraints
  preserveAspectRatio = (rawWidth, rawWeight) => {
    let width = rawWidth
    let height = rawWeight

    if (this.props.minConstraints) {
      width = Math.max(width, this.props.minConstraints[0])
      height = Math.max(height, this.props.minConstraints[1])
    }

    const currentAspectRatio = width / height
    if (currentAspectRatio < this.props.aspectRatio) {
      return [width, width / this.props.aspectRatio]
    } else if (currentAspectRatio > this.props.aspectRatio) {
      return [height * this.props.aspectRatio, height]
    }

    return [width, height]
  }

  constrainBoundary = side => side < 0 ? 0 : side

  calculateDimensions = ({ top, left, bottom, right }) => ({
    width: this.props.width - left - right,
    height: this.props.height - top - bottom,
  })

  eventMove = (event) => {
    if (this.state.resizing) {
      this.onResize(event)
    } else if (this.state.moving) {
      this.eventMoveBox(event)
    }
  }

  eventEnd = (event) => {
    if (this.state.resizing) {
      this.stopResize(event)
    } else if (this.state.moving) {
      this.stopMove(event)
    }
  }

  // Resize methods
  startResize = (corner, event) => {
    event.stopPropagation()
    event.preventDefault()
    this.setState({ resizing: true, corner })
  }

  startResizeNW = event => this.startResize('nw', event)
  startResizeNE = event => this.startResize('ne', event)
  startResizeSE = event => this.startResize('se', event)
  startResizeSW = event => this.startResize('sw', event)

  stopResize = () => this.setState({ resizing: false })

  // resize strategies
  nw = (mousePos, boxPos) => {
    const pos = {
      ...this.state,
      top: this.constrainBoundary(mousePos.clientY - boxPos.top),
      left: this.constrainBoundary(mousePos.clientX - boxPos.left),
    }

    const dimensions = this.calculateDimensions(pos)
    const [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height)

    pos.top = this.props.height - pos.bottom - height
    pos.left = this.props.width - pos.right - width

    return pos
  }

  ne = (mousePos, boxPos) => {
    const pos = {
      ...this.state,
      top: this.constrainBoundary(mousePos.clientY - boxPos.top),
      right: this.constrainBoundary(boxPos.right - mousePos.clientX),
    }

    const dimensions = this.calculateDimensions(pos)
    const [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height)

    pos.top = this.props.height - pos.bottom - height
    pos.right = this.props.width - pos.left - width

    return pos
  }

  se = (mousePos, boxPos) => {
    const pos = {
      ...this.state,
      bottom: this.constrainBoundary(boxPos.bottom - mousePos.clientY),
      right: this.constrainBoundary(boxPos.right - mousePos.clientX),
    }

    const dimensions = this.calculateDimensions(pos)
    const [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height)

    pos.bottom = this.props.height - pos.top - height
    pos.right = this.props.width - pos.left - width

    return pos
  }

  sw = (mousePos, boxPos) => {
    const pos = {
      ...this.state,
      bottom: this.constrainBoundary(boxPos.bottom - mousePos.clientY),
      left: this.constrainBoundary(mousePos.clientX - boxPos.left),
    }

    const dimensions = this.calculateDimensions(pos)
    const [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height)

    pos.bottom = this.props.height - pos.top - height
    pos.left = this.props.width - pos.right - width

    return pos
  }

  controlsResize = ({ target: { name, value } }) => {
    const box = this.box.parentElement.parentElement.getBoundingClientRect()
    const rawWidth = name === 'width' ? Number(value) : Number(value) * this.props.aspectRatio
    const rawHeight = name === 'height' ? Number(value) : Number(value) / this.props.aspectRatio
    const [width, height] = this.preserveAspectRatio(rawWidth, rawHeight)

    if (width > box.width - this.state.left || height > box.height - this.state.top) {
      return
    }

    const widthDifference = this.state.width - width
    const heightDifference = this.state.height - height
    const pos = {
      ...this.state,
      right: this.state.right + widthDifference,
      bottom: this.state.bottom + heightDifference,
    }
    const coordinates = {
      clientX: box.right - pos.right,
      clientY: box.bottom - pos.bottom,
    }

    this.resize(pos, coordinates)
  }

  resize = (position, coordinates) => {
    const dimensions = this.calculateDimensions(position)
    const widthChanged = dimensions.width !== this.state.width
    const heightChanged = dimensions.height !== this.state.height

    if (!widthChanged && !heightChanged) {
      return
    }

    this.setState({ ...coordinates, ...position, ...dimensions }, () => {
      this.props.onChange({ top: position.top, left: position.left }, dimensions)
    })
  }

  // Move methods
  startMove = (event) => {
    const { clientX, clientY } = this.getClientCoordinates(event)
    this.setState({ clientX, clientY, moving: true })
  }

  stopMove = () => this.setState({ moving: false })

  eventMoveBox = (event) => {
    event.preventDefault()

    const { clientX, clientY } = this.getClientCoordinates(event)
    const movedX = clientX - this.state.clientX
    const movedY = clientY - this.state.clientY

    this.moveBox(clientX, clientY, movedX, movedY)
  }

  controlsMoveBox = ({ target: { name, value } }) => {
    const movedX = name === 'x' ? value - this.state.left : 0
    const movedY = name === 'y' ? value - this.state.top : 0

    this.moveBox(0, 0, movedX, movedY)
  }

  moveBox = (clientX, clientY, movedX, movedY) => {
    const position = {
      top: this.constrainBoundary(this.state.top + movedY),
      left: this.constrainBoundary(this.state.left + movedX),
      bottom: this.constrainBoundary(this.state.bottom - movedY),
      right: this.constrainBoundary(this.state.right - movedX),
    }

    if (!position.top) {
      position.bottom = this.props.height - this.state.height
    }

    if (!position.bottom) {
      position.top = this.props.height - this.state.height
    }

    if (!position.left) {
      position.right = this.props.width - this.state.width
    }

    if (!position.right) {
      position.left = this.props.width - this.state.width
    }

    this.setState({ ...position, clientX, clientY }, () => {
      this.props.onChange(
        { top: position.top, left: position.left },
        this.calculateDimensions(position)
      )
    })
  }

  keyboardResize = (change) => {
    if (this.state.right - change < 0 || this.state.bottom - change < 0) {
      return
    }

    const [width, height] = this.preserveAspectRatio(
      this.state.width + change,
      this.state.height + change
    )
    const widthChange = width - this.state.width
    const heightChange = height - this.state.height

    this.setState({
      width,
      height,
      bottom: this.state.bottom - heightChange,
      right: this.state.right - widthChange,
    })
  }

  handleKey = (event) => {
    // safari doesn't support event.key, so fall back to keyCode
    if (event.shiftKey) {
      if (event.key === 'ArrowUp' || event.keyCode === 38) {
        this.keyboardResize(-10)
        event.preventDefault()
      } else if (event.key === 'ArrowDown' || event.keyCode === 40) {
        this.keyboardResize(10)
        event.preventDefault()
      } else if (event.key === 'ArrowLeft' || event.keyCode === 37) {
        this.keyboardResize(-10)
        event.preventDefault()
      } else if (event.key === 'ArrowRight' || event.keyCode === 39) {
        this.keyboardResize(10)
        event.preventDefault()
      }
    } else {
      if (event.key === 'ArrowUp' || event.keyCode === 38) { // eslint-disable-line no-lonely-if
        this.moveBox(this.state.clientX, this.state.clientY, 0, -10)
        event.preventDefault()
      } else if (event.key === 'ArrowDown' || event.keyCode === 40) {
        this.moveBox(this.state.clientX, this.state.clientY, 0, 10)
        event.preventDefault()
      } else if (event.key === 'ArrowLeft' || event.keyCode === 37) {
        this.moveBox(this.state.clientX, this.state.clientY, -10, 0)
        event.preventDefault()
      } else if (event.key === 'ArrowRight' || event.keyCode === 39) {
        this.moveBox(this.state.clientX, this.state.clientY, 10, 0)
        event.preventDefault()
      }
    }
  }

  render() {
    const style = {
      position: 'absolute',
      top: this.state.top,
      left: this.state.left,
      right: this.state.right,
      bottom: this.state.bottom,
    }
    const { width, height } = this.calculateDimensions(this.state)
    const topStyle = { height: this.state.top }
    const bottomStyle = { height: this.state.bottom }
    const leftStyle = {
      top: this.state.top,
      right: width + this.state.right,
      bottom: this.state.bottom,
    }
    const rightStyle = {
      top: this.state.top,
      left: width + this.state.left,
      bottom: this.state.bottom,
    }

    /* eslint-disable jsx-a11y/no-static-element-interactions */

    return (
      <div ref={node => this.box = node} className="DraggableResizable">
        <div className="DraggableResizable-controls">
          <label htmlFor="x">
            {this.props.offsetXLabel}
            <input
              name="x"
              id="x"
              value={Math.round(this.state.left)}
              onChange={this.controlsMoveBox}
              tabIndex="-1"
              type="number"
            />
          </label>
          <label htmlFor="y">
            {this.props.offsetYLabel}
            <input
              name="y"
              id="y"
              value={Math.round(this.state.top)}
              onChange={this.controlsMoveBox}
              tabIndex="-1"
              type="number"
            />
          </label>
          <label htmlFor="width">
            {this.props.widthLabel}
            <input
              name="width"
              id="width"
              value={Math.round(width)}
              type="number"
              tabIndex="-1"
              onChange={this.controlsResize}
            />
          </label>
          <label htmlFor="height">
            {this.props.heightLabel}
            <input
              value={Math.round(height)}
              type="number"
              name="height"
              id="height"
              tabIndex="-1"
              onChange={this.controlsResize}
            />
          </label>
        </div>
        <div className="DraggableResizable-top" style={topStyle} />
        <div className="DraggableResizable-left" style={leftStyle} />
        <div style={style} onMouseDown={this.startMove} onTouchStart={this.startMove}>
          {this.props.children}
          <div
            className="resize-handle resize-handle-se"
            onMouseDown={this.startResizeSE}
            onTouchStart={this.startResizeSE}
          />
          <div
            className="resize-handle resize-handle-ne"
            onMouseDown={this.startResizeNE}
            onTouchStart={this.startResizeNE}
          />
          <div
            className="resize-handle resize-handle-sw"
            onMouseDown={this.startResizeSW}
            onTouchStart={this.startResizeSW}
          />
          <div
            className="resize-handle resize-handle-nw"
            onMouseDown={this.startResizeNW}
            onTouchStart={this.startResizeNW}
          />
        </div>
        <div className="DraggableResizable-right" style={rightStyle} />
        <div className="DraggableResizable-bottom" style={bottomStyle} />
      </div>
    )
  }
}
