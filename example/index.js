import React from 'react'
import Cropper from '../lib/index.src.js'

let Wrapper = React.createClass({
  displayName: 'Wrapper',

  getInitialState () {
    return {
      image: null,
      previewUrl: null
    }
  },

  onChange (evt) {
    this.setState({
      image: evt.target.files[0]
    })
  },

  async crop () {
    let image = await this.refs.crop.cropImage()
    this.setState({
      previewUrl: window.URL.createObjectURL(image)
    })
  },

  clear () {
    this.refs.file.getDOMNode().value = null
    this.setState({
      previewUrl: null,
      image: null
    })
  },

  imageLoaded (img) {
    if (img.naturalWidth && img.naturalWidth < 262 &&
        img.naturalHeight && img.naturalHeight < 147) {
      this.crop()
    }
  },

  render () {
    return (
      <div className='Wrapper'>
        <input ref='file' type='file' onChange={this.onChange}/>

        {this.state.image &&
          <div>
            <Cropper
              ref='crop'
              image={this.state.image}
              width={262}
              height={147}
              onImageLoaded={this.imageLoaded} />
            <button onClick={this.crop}>Crop</button>
            <button onClick={this.clear}>Clear</button>
          </div>}

        {this.state.previewUrl &&
          <img src={this.state.previewUrl} />}
      </div>
    )
  }
})

React.render(<Wrapper />, document.querySelector('#view'))
