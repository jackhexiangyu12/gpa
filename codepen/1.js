import MButton from 'vue-m-button'
// for v1.0.0
// import 'vue-m-button/dist/css/default.css'

Vue.use(MButton)
new Vue({

  // Mount Vue instance to DOM with `el`
  // https://vuejs.org/v2/api/#el
  el: '#app1',

  // State with data
  // http://vuejs.org/v2/guide/instance.html#Data-and-Methods
  data() {
    return {
      showModal: true
    }
  }
});

new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})