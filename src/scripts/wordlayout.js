const Wordcloud = require('wordcloud')


export default class Wordlayout {
  constructor() {
    this.width = window.innerWidth/2
    this.height = window.innerHeight/2
  }
  initScene(word, canvasName) {
    fetch('../../static/wordcloud/deal.json').then(function(res) {
      return res.json()
    }).then(function(data) {
      const list = []
      const temp = data[word]
      for(const word in temp) {
        list.push([word, temp[word]])
      }
      Wordcloud.minFontSize = '15px'
      Wordcloud(document.getElementById(canvasName), {
        list: list
      })
    })
  }
}
