import React from 'react'
import DraggableResizableBox from './draggable-resizable-box'

export default React.createClass({
  displayName: 'Cropper',

  componentDidMount () {
    this.renderImage()
  },

  componentDidUpdate () {
    var {image} = this.props
    if (image.size !== image.size ||
        image.name !== image.name ||
        image.type !== image.type) {
      this.renderImage()
    }
  },

  renderImage (evt) {
    let ctx = React.findDOMNode(this.refs.canvas).getContext('2d')
    const img = new Image()
    img.src = window.URL.createObjectURL(this.props.image)
    img.onload = () => {
      var canvas = React.findDOMNode(this.refs.canvas)
      const {naturalHeight, naturalWidth} = img
      const imgRatio = naturalWidth / naturalHeight
      const sizeRatio = this.props.width / this.props.height

      if (imgRatio < sizeRatio) {
        canvas.width = this.props.width
        canvas.height = naturalHeight * (this.props.width / naturalWidth)
      } else {
        canvas.height = this.props.height
        canvas.width = naturalWidth * (this.props.height / naturalHeight)
      }

      var {height, width} = canvas

//      var { naturalWidth, naturalHeight } = img
//      var imgRatio = naturalWidth / naturalHeight
//
//      var w = naturalWidth
//      var h = naturalHeight
//
//      if (naturalWidth < width || naturalHeight < height) {
//        // fits entirely inside, use natural dimensions
//      } else if (imgRatio > sizeRatio) { // cap height
//        h = height
//        w = naturalWidth / naturalHeight * height
//      } else { // cap width
//        w = width
//        h = naturalHeight / naturalWidth * width
//      }
//
//      var x = Math.floor((width - w) / 2)
//      var y = Math.floor((height - h) / 2)
//
      var ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
    }
  },

  render () {
    return (
      <div className='Cropper'>
        <canvas ref='canvas'></canvas>
        <div className='box'>
          <DraggableResizableBox
            lockAspectRatio={true}
            width={this.props.width}
            height={this.props.height}>
              <div className='Cropper-box'></div>
          </DraggableResizableBox>
        </div>
      </div>
    )
  }
})
