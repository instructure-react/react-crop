import React from 'react'
import Draggable from 'react-draggable'

export default React.createClass({
  displayName: 'DraggableResizableBox',

  propTypes: {
    lockAspectRatio: React.PropTypes.bool
  },

  getInitialState() {
    return {
      width: this.props.width,
      height: this.props.height,
      aspectRatio: this.props.width / this.props.height,
      position: { left: 0, top: 0}
    }
  },

  componentDidMount () {
    document.addEventListener('mousemove', this.onResize)
    document.addEventListener('mouseup', this.stopResize)
  },

  onStop (evt, {position}) {
    this.setState({position})
  },

  startResize (corner, event) {
    event.stopPropagation()
    this.setState({
      resizing: true,
      corner,
      clientX: event.clientX,
      clientY: event.clientY
    })
  },

  stopResize () {
    if (this.state.resizing) {
      this.setState({resizing: false})
    }
  },

  // resize strategies
  nw (movedX, movedY) {
    let width = this.state.width - movedX
    let height = this.state.height - movedY
    let pos = {
      top: this.state.position.top + movedY,
      left: this.state.position.left + movedX
    }
    return [width, height, pos]
  },
  ne (movedX, movedY) {
    let width = this.state.width + movedX
    let height = this.state.height + movedY
    let pos = {
      top: this.state.position.top + movedY,
      left: this.state.position.left
    }
    return [width, height, pos]
  },
  se (movedX, movedY) {
    let width = this.state.width + movedX
    let height = this.state.height + movedY
    let pos = {
      top: this.state.position.top,
      left: this.state.position.left
    }
    return [width, height, pos]
  },
  sw (movedX, movedY) {
    let width = this.state.width - movedX
    let height = this.state.height + movedY
    let pos = {
      top: this.state.position.top,
      left: this.state.position.left + movedX
    }
    return [width, height, pos]
  },

  onResize(event) {
    if (this.state.resizing) {
      let movedX = event.clientX - this.state.clientX
      let movedY = event.clientY - this.state.clientY

      let [width, height, position] = this[this.state.corner](movedX, movedY)

      var widthChanged = width !== this.state.width, heightChanged = height !== this.state.height
      if (!widthChanged && !heightChanged) return

      if (this.props.lockAspectRatio) {
        [width, height] = this.preserveAspectRatio(width, height)
      }

      [width, height, position] = this.constrainSize(width, height, position)

      this.setState({
        width,
        height,
        position,
        clientX: event.clientX,
        clientY: event.clientY
      })
    }
  },

  constrainSize (width, height, {left, top}) {
    let xConstrained = width + this.state.position.left > this.props.width || left < 0
    let yConstrained = height + this.state.position.top > this.props.height || top < 0
    width = xConstrained ? this.props.width - this.state.position.left : width
    left = xConstrained ? this.state.position.left : left
    height = yConstrained ? this.props.height - this.state.position.top : height
    top = yConstrained ? this.state.position.top : top
    return [width, height, {left, top}]
  },

  // If you do this, be careful of constraints
  preserveAspectRatio(width, height) {
    var [min, max] = [this.props.minConstraints, this.props.maxConstraints]

    height = width / this.state.aspectRatio
    width = height * this.state.aspectRatio

    if (min) {
      width = Math.max(min[0], width)
      height = Math.max(min[1], height)
    }
    if (max) {
      width = Math.min(max[0], width)
      height = Math.min(max[1], height)
    }
    return [width, height]
  },

  render () {
    return (
      <Draggable
        ref='drag'
        bounds='parent'
        onStop={this.onStop}
        start={{x: this.state.position.left, y: this.state.position.top}}
        moveOnStartChange={true}>
          <div style={{position: 'relative', width: this.state.width, height: this.state.height}}>
            {this.props.children}
            {this.state.position.left}
            {this.state.position.top}
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
      </Draggable>
    )
  }
})
