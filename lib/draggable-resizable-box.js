import React from 'react'
import Draggable from 'react-draggable'

export default React.createClass({
  displayName: 'DraggableResizableBox',

  propTypes: {
    aspectRatio: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  getInitialState() {
    let [width, height] = this.preserveAspectRatio(this.props.width, this.props.height, [0, 0])
    return {
      top: 0,
      left: 0,
      bottom: this.props.height - height,
      right: this.props.width - width
    }
  },

  componentDidMount () {
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('mouseup', this.mouseUp)
  },

  componentWillRecieveProps (nextProps) {
    let [width, height] = this.preserveAspectRatio(this.props.width, this.props.height)
    this.setState({
      top: 0,
      left: 0,
      bottom: this.props.height - height,
      right: this.props.width - width
    })
  },

  mouseMove (evt) {
    if (this.state.resizing) {
      this.onResize(evt)
    } else if (this.state.moving) {
      this.move(evt)
    }
  },

  mouseUp (evt) {
    if (this.state.resizing) {
      this.stopResize(evt)
    } else if (this.state.moving) {
      this.stopMove(evt)
    }
  },

  startResize (corner, event) {
    event.stopPropagation()
    this.setState({
      resizing: true,
      corner
    })
  },

  stopResize () {
    this.setState({resizing: false})
  },

  // resize strategies
  nw (mousePos, boxPos) {
    let pos = Object.assign({}, this.state, {
      top: mousePos.clientY - boxPos.top,
      left: mousePos.clientX - boxPos.left
    })
    let dimensions = this.calculateDimensions(pos)
    let [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.bottom, pos.right])
    pos.top = this.props.height - pos.bottom - height
    pos.left = this.props.width - pos.right - width
    return pos
  },
  ne (mousePos, boxPos) {
    let pos = Object.assign({}, this.state, {
      top: mousePos.clientY - boxPos.top,
      right: boxPos.right - mousePos.clientX
    })
    let dimensions = this.calculateDimensions(pos)
    let [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.bottom, pos.left])
    pos.top = this.props.height - pos.bottom - height
    pos.right = this.props.width - pos.left - width
    return pos
  },
  se (mousePos, boxPos) {
    let pos = Object.assign({}, this.state, {
      bottom: boxPos.bottom - mousePos.clientY,
      right: boxPos.right - mousePos.clientX
    })
    let dimensions = this.calculateDimensions(pos)
    let [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.top, pos.left])
    pos.bottom = this.props.height - pos.top - height
    pos.right = this.props.width - pos.left - width
    return pos
  },
  sw (mousePos, boxPos) {
    let pos = Object.assign({}, this.state, {
      bottom: boxPos.bottom - mousePos.clientY,
      left: mousePos.clientX - boxPos.left
    })
    let dimensions = this.calculateDimensions(pos)
    let [width, height] = this.preserveAspectRatio(dimensions.width, dimensions.height, [pos.top, pos.right])
    pos.bottom = this.props.height - pos.top - height
    pos.left = this.props.width - pos.right - width
    return pos
  },

  onResize(event) {
    let box = React.findDOMNode(this).parentElement.getBoundingClientRect()
    let mousePos = {
      clientX: Math.max(box.left, Math.min(event.clientX, box.right)),
      clientY: Math.max(box.top, Math.min(event.clientY, box.bottom))
    }
    let position = this[this.state.corner](mousePos, box)

    let dimensions = this.calculateDimensions(position)
    var widthChanged = dimensions.width !== this.state.width, heightChanged = dimensions.height !== this.state.height
    if (!widthChanged && !heightChanged) return

//      if (this.props.lockAspectRatio) {
//        [width, height] = this.preserveAspectRatio(width, height)
//      }
//
    this.setState(Object.assign({}, {
      clientX: mousePos.clientX,
      clientY: mousePos.clientY
    }, position, dimensions))
  },

  startMove (evt) {
    this.setState({
      moving: true,
      clientX: evt.clientX,
      clientY: evt.clientY
    })
  },

  stopMove (evt) {
    this.setState({
      moving: false
    })
  },

  move (evt) {
    let movedX = evt.clientX - this.state.clientX
    let movedY = evt.clientY - this.state.clientY

    let position = this.constrain({
      top: this.state.top + movedY,
      left: this.state.left + movedX,
      bottom: this.state.bottom - movedY,
      right: this.state.right - movedX,
    })

    this.setState(Object.assign({}, {
      clientX: evt.clientX,
      clientY: evt.clientY
    }, position))
  },

  constrain ({top, left, bottom, right}) {
    if (!this.constrainBoundary(top)) {
      top = 0
      bottom = this.props.height - this.state.height
    }
    if (!this.constrainBoundary(left)) {
      left = 0
      right = this.props.width - this.state.width
    }
    if (!this.constrainBoundary(bottom)) {
      bottom = 0
      top = this.props.height - this.state.height
    }
    if (!this.constrainBoundary(right)) {
      right = 0
      left = this.props.width - this.state.width
    }
    return {top, left, bottom, right}
  },

  calculateDimensions ({top, left, bottom, right}) {
    return {width: this.props.width - left - right, height: this.props.height - top - bottom}
  },

  // If you do this, be careful of constraints
  preserveAspectRatio(width, height) {
    var currentAspectRatio = width / height
    if (currentAspectRatio < this.props.aspectRatio) {
      return [width, width / this.props.aspectRatio]
    } else if (currentAspectRatio > this.props.aspectRatio) {
      return [height * this.props.aspectRatio, height]
    } else {
      return [width, height]
    }
  },

  constrainBoundary (side) {
    return side < 0 ? 0 : side
  },

  render () {
    let style = {
      position: 'absolute',
      top: this.state.top,
      left: this.state.left,
      right: this.state.right,
      bottom: this.state.bottom
    }

    return (
      <div style={style} onMouseDown={this.startMove}>
        {this.props.children}
        <div className='resize-handle resize-handle-se'
          onMouseDown={this.startResize.bind(null, 'se')}>
        </div>
        <div className='resize-handle resize-handle-ne'
          onMouseDown={this.startResize.bind(null, 'ne')}>
        </div>
        <div className='resize-handle resize-handle-sw'
          onMouseDown={this.startResize.bind(null, 'sw')}>
        </div>
        <div className='resize-handle resize-handle-nw'
          onMouseDown={this.startResize.bind(null, 'nw')}>
        </div>
      </div>
    )
  }
})
