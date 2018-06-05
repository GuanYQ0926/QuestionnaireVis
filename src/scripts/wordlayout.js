const Wordcloud = require('wordcloud')


export default class Wordlayout {
  constructor() {
    this.width = window.innerWidth/2
    this.height = window.innerHeight/2
  }
  initScene(word1, word2) {
    fetch('../../static/wordcloud/deal.json').then(function(res) {
      return res.json()
    }).then(function(data) {
      const list1 = [],
        list2 = []
      const temp1 = data[word1]
      for(const word in temp1) {
        list1.push([word, temp1[word]])
      }
      const temp2 = data[word2]
      for(const word in temp2) {
        list2.push([word, temp2[word]])
      }
      Wordcloud.minFontSize = '15px'
      Wordcloud(document.getElementById('word_canvas_a'), {
        list: list1
      })
      Wordcloud(document.getElementById('word_canvas_b'), {
        list: list2
      })
    })
  }
}
