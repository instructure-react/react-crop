import React from 'react'
import DraggableResizableBox from './draggable-resizable-box'
import toBlob from 'data-uri-to-blob'

export default React.createClass({
  displayName: 'Cropper',

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    center: React.PropTypes.bool
  },

  getDefaultProps () {
    return {
      center: false
    }
  },

  getInitialState() {
    return {
      imageLoaded: false,
      width: this.props.width,
      height: this.props.height
    }
  },

  shouldComponentUpdate (nextProps, nextState) {
    let {image} = this.props
    return nextProps.image.size !== image.size ||
        nextProps.image.name !== image.name ||
        nextProps.image.type !== image.type ||
        nextState.imageLoaded !== this.state.imageLoaded
  },

  onLoad () {
    let box = React.findDOMNode(this).getBoundingClientRect()
    this.setState({
      imageLoaded: true,
      width: box.width,
      height: box.height
    })
  },

  cropImage () {
    let canvas = React.findDOMNode(this.refs.canvas)
    let img = React.findDOMNode(this.refs.image)
    let ctx = canvas.getContext('2d')
    let [xScale, yScale] = [img.naturalWidth / this.state.width,
                            img.naturalHeight / this.state.height]

    let offsetX = this.state.offset.left * xScale
    let offsetY = this.state.offset.top * yScale
    let width = this.state.dimensions.width * xScale
    let height = this.state.dimensions.height * yScale

    ctx.clearRect(0, 0, this.props.width, this.props.height)
    ctx.drawImage(img, offsetX, offsetY, width, height, 0, 0, this.props.width, this.props.height)
    return toBlob(canvas.toDataURL())
  },

  onChange (offset, dimensions) {
    this.setState({offset, dimensions})
  },

  render () {
    const url = window.URL.createObjectURL(this.props.image)
    return (
      <div className='Cropper'>
        <canvas
          className='Cropper-canvas'
          ref='canvas'
          width={this.props.width}
          height={this.props.height}>
        </canvas>
        <img ref='image' src={url} className='Cropper-image' onLoad={this.onLoad}/>
        {this.state.imageLoaded &&
          <div className='box'>
            <DraggableResizableBox
              aspectRatio={this.props.width / this.props.height}
              width={this.state.width}
              height={this.state.height}
              minConstraints={[this.props.width, this.props.height]}
              onChange={this.onChange}>
                <div className='Cropper-box'></div>
            </DraggableResizableBox>
          </div>}
      </div>
    )
  }
})
