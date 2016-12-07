import React from 'react'
import ReactDOM from 'react-dom'
import Cropper from '../lib/index.src.js'

const WIDTH = 262;
const HEIGHT = 147;

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

  crop () {
    this.refs.crop.cropImage().then((image) => {
      this.setState({
        previewUrl: window.URL.createObjectURL(image)
      })
    })
  },

  clear () {
    this.refs.file.value = null
    this.setState({
      previewUrl: null,
      image: null
    })
  },

  imageLoaded (img) {
    if (img.naturalWidth && img.naturalWidth < WIDTH &&
        img.naturalHeight && img.naturalHeight < HEIGHT) {
      this.crop()
    }
  },

  render () {
    return (
      <div>
        <input ref='file' type='file' onChange={this.onChange}/>
        <div className='Wrapper'>
          {this.state.image &&
            <div>
              <Cropper
                ref='crop'
                image={this.state.image}
                width={WIDTH}
                height={HEIGHT}
                onImageLoaded={this.imageLoaded} />
            </div>}
        </div>
        <div>
          <button onClick={this.crop}>Crop</button>
          <button onClick={this.clear}>Clear</button>
        </div>
          {this.state.previewUrl &&
            <img src={this.state.previewUrl} />}
      </div>
    )
  }
})

ReactDOM.render(<Wrapper />, document.querySelector('#view'))
