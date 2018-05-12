import * as d3 from 'd3'
import colormap from 'colormap'
import Chart from 'chart.js'


export default class Heatmap {
  constructor() {
    this.margin = {top: 50, right: 0, bottom: 100, left: 30}
    this.questionNum = 97
    this.width = window.innerWidth
    // this.height = window.innerHeight
    this.height = Math.floor((this.width - this.margin.left - this.margin.right) / this.questionNum) *16
  }
  initScene(file1, file2, brushon) {
    this.renderScene(file1, file2, brushon)
  }
  renderScene(file1, file2, brushon) {
    const margin = this.margin,
      gridSize = Math.floor((this.width - margin.left - margin.right) / this.questionNum),
      answers = ['1', '2', '3', '4', '5', '6'],
      buckets = 9,
      legendElementWidth = gridSize * 2,
      questions = d3.range(1, 30)//0-28 29-53 54-70 71-96
        .concat(d3.range(1, 26)
          .concat(d3.range(1, 18)
            .concat(d3.range(1, 27)))).map(d => d.toString())
    const width = this.width-margin.left-margin.right,
      height = 6*gridSize
    // linechart
    const linecanvas = document.getElementById('line_canvas')
    const ctx = linecanvas.getContext('2d')
    ctx.canvas.width = width / 1.5
    ctx.canvas.height = 30 * gridSize
    let linechart = new Chart(linecanvas, {options: {responsive: false, maintainAspectRatio: false}})

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

    const heatmapChart = function(data, colors) {
      const mindata = d3.min(data, d => d.value)
      const maxdata = d3.max(data, d => d.value)
      const delta = (maxdata - mindata) / buckets
      const labeldata = []
      for(let i=0;i<buckets;i++) {
        labeldata.push(mindata+delta*i)
      }

      const colorScale = d3.scaleQuantile()
        .domain([mindata, maxdata])
        .range(colors)


      const grids = g.selectAll('.grid')
        .data(data)
      grids.append('title')
      grids.enter().append('rect')
        .attr('x', d => d.question*gridSize)
        .attr('y', d => d.answer*gridSize)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', 'grid')
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', colors[0])
        .on('mouseover', d => mouseoverGrid(d))
        .merge(grids)
        .transition()
        .duration(1000)
        .style('fill', d => colorScale(d.value))

      grids.select('title').text(d => d.value)
      grids.exit().remove()


      const legend = g.selectAll('.legend')
        .data(labeldata)
        // .data([0].concat(colorScale.quantiles()), d => d)
      const legend_g = legend.enter().append('g')
        .attr('class', 'legend')
      legend_g.append('rect')
        .attr('x', (d, i) => legendElementWidth * i)
        .attr('y', 7*gridSize)
        .attr('width', legendElementWidth)
        .attr('height', gridSize / 2)
        .style('fill', (d, i) => colors[i])
      legend_g.append('text')
        .attr('class', 'mono')
        .text(d => `≥${Math.round(d)}`)
        .style('font-size', '0.6em')
        .attr('x', (d, i) => legendElementWidth*i)
        .attr('y', 8.5*gridSize)
      legend.exit().remove()
    }

    const brushChart = function(data) {
      const xScale = d3.scaleLinear().range([0, width])
      const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('start', brushmoved) // 'start brush end'
      const gBrush = g.append('g')
        .attr('class', 'brush')
        .call(brush)

      gBrush.selectAll('.handle--custom')
        .data([{type: 'w'}, {type: 'e'}])
        .enter().append('path')
        .attr('class', 'handle--custom')
        .attr('stroke', '#000')
        .attr('cursor', 'ew-resize')
      gBrush.call(brush.move, [0.0, 0.1].map(xScale))
      function brushmoved() {
        const s = d3.event.selection
        if (s != null) {
          const sx = s.map(xScale.invert)
          // draw linechart
          const start = Math.round(sx[0] * 97)
          const len = Math.round((sx[1] - sx[0]) * 97)
          const end = start + len
          const data1 = [],
            data2 = [],
            data3 = [],
            data4 = [],
            data5 = [],
            data6 = []
          for(let i=0;i<end;i++) {
            if(i >= start) {
              data1.push(data[i*6].value)
              data2.push(data[i*6+1].value)
              data3.push(data[i*6+2].value)
              data4.push(data[i*6+3].value)
              data5.push(data[i*6+4].value)
              data6.push(data[i*6+5].value)
            }
          }

          linechart.destroy()
          linechart = new Chart(linecanvas, {
            type: 'line',
            data: {
              labels: d3.range(start, end),
              datasets: [
                {
                  label: '思う',
                  borderColor: '#ff6384',
                  data: data1,
                  fill: false
                },
                {
                  label: 'やや思う',
                  borderColor: '#36a2eb',
                  data: data2,
                  fill: false
                },
                {
                  label: 'どちらともいえない',
                  borderColor: '#cc65fe',
                  data: data3,
                  fill: false
                },
                {
                  label: 'あまり思わない',
                  borderColor: '#ffce56',
                  data: data4,
                  fill: false
                },
                {
                  label: '思わない',
                  borderColor: '#3cba9f',
                  data: data5,
                  fill: false
                },{
                  label: '--',
                  borderColor: '#e8c3b9',
                  data: data6,
                  fill: false
                }
              ]
            },
            options: {
              responsive: false,
              maintainAspectRatio: false
            }
          })
        }
      }
    }

    function mouseoverGrid(gridData) {
      if(brushon) {
        return
      }
      else {
        d3.json('../../static/questions.json').then(function(data) {
          const questionList = data.questions
          const answerList = ['思う', 'やや思う', 'どちらともいえない', 'あまり思わない', '思わない', '--']

          d3.select('#text_g').remove()
          const text_g = svg.append('g')
            .attr('id', 'text_g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
          const gridText = text_g.selectAll('.gridText')
            .data([gridData])
          gridText.enter().append('text')
            .text(d => {
              if(file2 == 'None') {
                return `問題：${questionList[d.question]} に 「${answerList[d.answer]}」と回答した人数は${d.value}名`
              }
              else {
                const fn1 = file1.split('/')[2].split('.')[0],
                  fn2 = file2.split('/')[2].split('.')[0]
                if(d.value == 0) {
                  return `${fn1}と${fn2}は 問題：${questionList[d.question]} に 「${answerList[d.answer]}」と回答した人数が同じ`
                }
                else if (d.value > 0) {
                  return `${fn1}は${fn2}より 問題：${questionList[d.question]} に 「${answerList[d.answer]}」と回答した人数が${d.value}人多い`
                }
                else {
                  return `${fn1}は${fn2}より 問題：${questionList[d.question]} に 「${answerList[d.answer]}」と回答した人数が${-d.value}人少ない`
                }
              }
            })
            .attr('x', width/3)
            .attr('y', gridSize*10)
            .style('text-anchor', 'middle')
            .style('font-size', '0.7em')
            .attr('class', 'details')
        })
      }
    }

    if(file2 == 'None') {
      d3.json(file1).then(function(data) {
        const colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']
        heatmapChart(data, colors)
        if(brushon) {
          brushChart(data)
        }
      })
    }
    else {
      d3.json(file1).then(function(data1) {
        d3.json(file2).then(function(data2) {
          const data = []
          for(let i=0; i<data1.length; i++) {
            const temp = data1[i].value - data2[i].value
            data.push({question: data1[i].question, answer: data1[i].answer, value: temp})
          }
          const colors = colormap({
            colormap: 'blackbody',//'velocity-blue',
            nshades: 9,
            format: 'hex',
            alpha: 1
          })
          heatmapChart(data, colors)
          if(brushon) {
            brushChart(data)
          }
        })
      })
    }
  }
}
