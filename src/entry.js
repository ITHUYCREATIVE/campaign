import Vue from 'vue'
import App from './App'

document.addEventListener( 'DOMContentLoaded', () => {
  const app = new Vue( {
    el: '#hello',
    data: {
      message: "Can you say hello?"
    },
    components: { App }
  } )
} )