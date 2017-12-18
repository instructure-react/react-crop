import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toBlob from 'data-uri-to-blob'
import DraggableResizableBox from './draggable-resizable-box'
import './cropper.css'

export default class Cropper extends Component {
  static displayName = 'Cropper'

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    image: PropTypes.any,
    widthLabel: PropTypes.string,
    heightLabel: PropTypes.string,
    offsetXLabel: PropTypes.string,
    offsetYLabel: PropTypes.string,
    onImageLoaded: PropTypes.func,
    minConstraints: PropTypes.arrayOf(PropTypes.number),
  }

  static defaultProps = {
    image: null,
    widthLabel: 'Width',
    heightLabel: 'Height',
    offsetXLabel: 'Offset X',
    offsetYLabel: 'Offset Y',
    onImageLoaded: () => {},
    minConstraints: [],
  }

  state = {
    imageLoaded: false,
    width: this.props.width,
    height: this.props.height,
    url: window.URL.createObjectURL(this.props.image),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image !== nextProps.image) {
      this.setState({
        url: window.URL.createObjectURL(nextProps.image),
        imageLoaded: false,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { image } = this.props
    return (
      nextProps.image.size !== image.size ||
      nextProps.image.name !== image.name ||
      nextProps.image.type !== image.type ||
      nextState.imageLoaded !== this.state.imageLoaded
    )
  }

  onLoad = () => {
    const box = this.box.getBoundingClientRect()
    this.setState({
      imageLoaded: true,
      width: box.width,
      height: box.height,
    }, () => this.props.onImageLoaded(this.image))
  }

  onChange = (offset, dimensions) => this.setState({ offset, dimensions })

  cropImage = () => (
    new Promise((resolve) => {
      const image = new Image()

      image.onload = () => {
        const img = this.image
        const ctx = this.canvas.getContext('2d')
        const [xScale, yScale] = [
          img.naturalWidth / this.state.width,
          img.naturalHeight / this.state.height,
        ]

        const imageOffsetX = xScale < 1 ? 0 : this.state.offset.left * xScale
        const imageOffsetY = yScale < 1 ? 0 : this.state.offset.top * yScale
        const imageWidth = xScale < 1 ? img.naturalWidth : this.state.dimensions.width * xScale
        const imageHeight = yScale < 1 ? img.naturalHeight : this.state.dimensions.height * yScale

        const canvasOffsetX = xScale < 1
          ? Math.floor((this.state.dimensions.width - img.naturalWidth) / 2)
          : 0
        const canvasOffsetY = yScale < 1
          ? Math.floor((this.state.dimensions.height - img.naturalHeight) / 2)
          : 0
        const canvasWidth = xScale < 1 ? img.naturalWidth : this.props.width
        const canvasHeight = yScale < 1 ? img.naturalHeight : this.props.height

        ctx.clearRect(0, 0, this.props.width, this.props.height)
        ctx.drawImage(
          img,
          imageOffsetX,
          imageOffsetY,
          imageWidth,
          imageHeight,
          canvasOffsetX,
          canvasOffsetY,
          canvasWidth,
          canvasHeight
        )
        resolve(toBlob(this.canvas.toDataURL()))
      }

      image.src = window.URL.createObjectURL(this.props.image)
    })
  )

  render() {
    return (
      <div
        ref={node => this.box = node}
        className="Cropper"
        style={{ minWidth: this.props.width, minHeight: this.props.height }}>
        <canvas
          className="Cropper-canvas"
          ref={node => this.canvas = node}
          width={this.props.width}
          height={this.props.height}
        />
        <img
          ref={node => this.image = node}
          src={this.state.url}
          className="Cropper-image"
          onLoad={this.onLoad}
          style={{ top: this.state.height / 2 }}
          alt="cropper"
        />
        {this.state.imageLoaded &&
          <div className="box">
            <DraggableResizableBox
              aspectRatio={this.props.width / this.props.height}
              width={this.state.width}
              height={this.state.height}
              minConstraints={this.props.minConstraints}
              onChange={this.onChange}
              widthLabel={this.props.widthLabel}
              heightLabel={this.props.heightLabel}
              offsetXLabel={this.props.offsetXLabel}
              offsetYLabel={this.props.offsetYLabel}>
              <div className="Cropper-box" />
            </DraggableResizableBox>
          </div>}
      </div>
    )
  }
}
