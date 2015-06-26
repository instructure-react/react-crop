import React from 'react'
import DraggableResizableBox from './draggable-resizable-box'

export default React.createClass({
  displayName: 'Cropper',

  getInitialState() {
    return {
      imageLoaded: false,
      width: this.props.width,
      height: this.props.height
    }
  },

  componentDidMount () {
//    this.renderImage()
  },

  componentDidUpdate () {
    var {image} = this.props
    if (image.size !== image.size ||
        image.name !== image.name ||
        image.type !== image.type) {
//      this.renderImage()
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

  renderImage (evt) {
    let ctx = React.findDOMNode(this.refs.canvas).getContext('2d')
    const img = new Image()
    img.src = ''
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
    const url = window.URL.createObjectURL(this.props.image)
    console.log(url)
    return (
      <div className='Cropper'>
        <canvas className='Cropper-canvas' ref='canvas'></canvas>
        <img src={url} className='Cropper-preview' onLoad={this.onLoad}/>
        {this.state.imageLoaded &&
          <div className='box'>
            <DraggableResizableBox
              aspectRatio={this.props.width / this.props.height}
              width={this.state.width}
              height={this.state.height}
              minConstraints={[this.props.width, this.props.height]}>
                <div className='Cropper-box'></div>
            </DraggableResizableBox>
          </div>}
      </div>
    )
  }
})
