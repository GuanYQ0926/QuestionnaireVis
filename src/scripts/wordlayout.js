const Wordcloud = require('wordcloud')


export default class Wordlayout {
  constructor() {
    this.width = window.innerWidth/2
    this.height = window.innerHeight/2
  }
  initScene() {
    this.renderScene()
  }
  renderScene() {
    fetch('../../assets/wordcloud.json').then(function(res) {
      return res.json()
    }).then(function(data) {
      const listA = [],
        listB = []
      const tempA = data.A
      for(const word in tempA) {
        listA.push([word, tempA[word]])
      }
      const tempB = data.B
      for(const word in tempB) {
        listB.push([word, tempB[word]])
      }
      Wordcloud.minFontSize = '15px'
      Wordcloud(document.getElementById('word_canvas_a'), {
        list: listA
      })
      Wordcloud(document.getElementById('word_canvas_b'), {
        list: listB
      })
    })
  }
}
