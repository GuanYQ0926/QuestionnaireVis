import * as d3 from 'd3'
import colormap from 'colormap'


export default class Heatmap {
  constructor() {
    this.margin = {top: 20, right: 0, bottom: 100, left: 20}
    this.questionNum = 97
    this.width = window.innerWidth
    this.height = Math.floor((this.width - this.margin.left - this.margin.right) / this.questionNum) *9
  }
  initScene(file1, file2) {
    const margin = this.margin,
      gridSize = Math.floor((this.width - margin.left - margin.right) / this.questionNum),
      answers = ['1', '2', '3', '4', '5'],
      legendWidth = 300,
      questions = d3.range(1, 30)  // 0-28 29-53 54-70 71-96
        .concat(d3.range(1, 26)
          .concat(d3.range(1, 18)
            .concat(d3.range(1, 27)))).map(d => d.toString())

    document.getElementById('heatmap').innerHTML = ''
    const svg = d3.select(document.getElementById('heatmap')).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    g.selectAll('.answerlabel')
      .data(answers)
      .enter().append('text')
      .text(d => d)
      .attr('x', 0)
      .attr('y', (d, i) => i * gridSize)
      .style('text-anchor', 'end')
      .style('font-size', '0.7em')
      .attr('transform', `translate(-6, ${gridSize/1.5})`)

    g.selectAll('.questionlabel')
      .data(questions)
      .enter().append('text')
      .text(d => d)
      .attr('x', (d, i) => i * gridSize)
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .style('font-size', '0.7em')
      .attr('transform', `translate(${gridSize/2}, -6)`)
      .attr('class', (d, i) => {return (i>=29&&i<=53) || (i>=71&&i<=96) ? 'q24' : 'q13'})

    if(file2 == 'None') {
      d3.json(file1).then(function(gridData) {
        d3.json('../../static/questions.json').then(function(questionData) {
          heatmapChart(gridData, questionData.questions)
        })
      })
    }
    else {
      d3.json(file1).then(function(gridData1) {
        d3.json(file2).then(function(gridData2) {
          d3.json('../../static/questions.json').then(function(questionData) {
            const gridData = []
            for(let i=0; i<gridData1.length; i++) {
              const temp = gridData1[i].value - gridData2[i].value
              gridData.push({question: gridData1[i].question, answer: gridData1[i].answer, value: temp})
            }
            heatmapChartCompare(gridData, questionData.questions)
          })
        })
      })
    }

    // define function
    function heatmapChart(gridData, questionData) {
      const mindata = d3.min(gridData, d => d.value)
      const maxdata = d3.max(gridData, d => d.value)
      const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([0, maxdata])
      // draw grid
      const grids = g.selectAll('.grid')
        .data(gridData)
      grids.append('title')
      grids.enter().append('rect')
        .attr('x', d => d.question*gridSize)
        .attr('y', d => d.answer*gridSize)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', 'grid')
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', d => colorScale(d.value))
        .on('mouseover', d => mouseoverGrid(d, questionData))
        .on('mouseleave', () => (d3.select('#text_g').remove()))
        .merge(grids)
        .transition()
        .duration(1000)
        .style('fill', d => colorScale(d.value))
      grids.select('title').text(d => d.value)
      grids.exit().remove()
      // draw legend
      const legendmap = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([0, legendWidth])
      const legend = g.selectAll('.legend')
        .data(d3.range(legendWidth))
        .enter().append('rect')
        .attr('x', d => d)
        .attr('y', 6*gridSize)
        .attr('width', 1)
        .attr('height', gridSize/2)
        .style('fill', d => legendmap(d))
      g.append('text')
        .attr('class', 'mono')
        .attr('x', 0)
        .attr('y', 7*gridSize)
        .style('font-size', '0.7em')
        .style('text-anchor', 'middle')
        .text(`${mindata}`)
      g.append('text')
        .attr('class', 'mono')
        .attr('x', legendWidth)
        .attr('y', 7*gridSize)
        .style('font-size', '0.7em')
        .style('text-anchor', 'middle')
        .text(`${maxdata}人`)
      legend.exit().remove()
    }

    function heatmapChartCompare(gridData, questionData) {
      const mindata = d3.min(gridData, d => d.value)
      const maxdata = d3.max(gridData, d => d.value)
      const colorScalePlus = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([0, maxdata])
      const colorScaleMinus = d3.scaleSequential(d3.interpolateYlOrBr)
        .domain([0, mindata])
      // draw grid
      const grids = g.selectAll('.grid')
        .data(gridData)
      grids.append('title')
      grids.enter().append('rect')
        .attr('x', d => d.question*gridSize)
        .attr('y', d => d.answer*gridSize)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', 'grid')
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', d => {
          if(d.value==0) {
            return '#ffffd9'
          }
          else if(d.value<0) {
            return colorScaleMinus(d.value)
          }
          else {
            return colorScalePlus(d.value)
          }
        })
        .on('mouseover', d => mouseoverGrid(d, questionData))
        .on('mouseleave', () => (d3.select('#text_g').remove()))
        .merge(grids)
        .transition()
        .duration(1000)
        .style('fill', d => {
          if(d.value==0) {
            return '#ffffd9'
          }
          else if(d.value<0) {
            return colorScaleMinus(d.value)
          }
          else {
            return colorScalePlus(d.value)
          }
        })
      grids.select('title').text(d => d.value)
      grids.exit().remove()
      // draw legend
      const legendmap1 = d3.scaleSequential(d3.interpolateYlOrBr)
        .domain([legendWidth/2, 0])
      const legend1 = g.selectAll('.legend')
        .data(d3.range(legendWidth/2))
        .enter().append('rect')
        .attr('x', d => d)
        .attr('y', 6*gridSize)
        .attr('width', 1)
        .attr('height', gridSize/2)
        .style('fill', d => legendmap1(d))
      g.append('text')
        .attr('class', 'mono')
        .attr('x', 0)
        .attr('y', 7*gridSize)
        .style('font-size', '0.7em')
        .style('text-anchor', 'middle')
        .text(`${mindata}`)
      legend1.exit().remove()
      const legendmap2 = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([0, legendWidth/2])
      const legend2 = g.selectAll('.legend')
        .data(d3.range(legendWidth/2))
        .enter().append('rect')
        .attr('x', d => d+legendWidth/2)
        .attr('y', 6*gridSize)
        .attr('width', 1)
        .attr('height', gridSize/2)
        .style('fill', d => legendmap2(d))
      g.append('text')
        .attr('class', 'mono')
        .attr('x', legendWidth/2)
        .attr('y', 7*gridSize)
        .style('font-size', '0.7em')
        .style('text-anchor', 'middle')
        .text('0')
      g.append('text')
        .attr('class', 'mono')
        .attr('x', legendWidth)
        .attr('y', 7*gridSize)
        .style('font-size', '0.7em')
        .style('text-anchor', 'middle')
        .text(`${maxdata}人`)
      legend2.exit().remove()
    }

    function mouseoverGrid(gData, qData) {
      const answerList = ['思う', 'やや思う', 'どちらともいえない', 'あまり思わない', '思わない']
      d3.select('#text_g').remove()
      const text_g = svg.append('g')
        .attr('id', 'text_g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
      const gridText = text_g.selectAll('.gridText')
        .data([gData])
      gridText.enter().append('text')
        .text(d => {
          if(file2 == 'None') {
            return `問題：${qData[d.question]} に 「${answerList[d.answer]}」と回答した人数は${d.value}名`
          }
          else {
            const fn1 = file1.split('/')[2].split('.')[0],
              fn2 = file2.split('/')[2].split('.')[0]
            if(d.value == 0) {
              return `${fn1}と${fn2}は 問題：${qData[d.question]} に 「${answerList[d.answer]}」と回答した人数が同じ`
            }
            else if (d.value > 0) {
              return `${fn1}は${fn2}より 問題：${qData[d.question]} に 「${answerList[d.answer]}」と回答した人数が${d.value}人多い`
            }
            else {
              return `${fn1}は${fn2}より 問題：${qData[d.question]} に 「${answerList[d.answer]}」と回答した人数が${-d.value}人少ない`
            }
          }
        })
        .attr('x', legendWidth+70)
        .attr('y', gridSize*5.5+margin.top)
        .style('text-anchor', 'start')
        .style('font-size', '0.7em')
        .attr('class', 'details')
    }
  }
}
