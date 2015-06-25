import React from 'react'
import Cropper from '../lib/index.src.js'

let Wrapper = React.createClass({
  displayName: 'Wrapper',

  getInitialState () {
    return {
      image: null
    }
  },

  onChange (evt) {
    this.setState({
      image: evt.target.files[0]
    })
  },

  render () {
    console.log(this.state.image)
    return (
      <div className='Wrapper'>
        <input type='file' onChange={this.onChange}/>

        {this.state.image &&
          <Cropper
            image={this.state.image}
            width={262}
            height={147}/>}
      </div>
    )
  }
})

React.render(<Wrapper />, document.querySelector('#view'))
