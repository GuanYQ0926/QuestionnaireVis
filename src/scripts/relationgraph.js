import * as d3 from 'd3'


export default class Relationgraph {
  constructor() {
    this.width = window.innerWidth / 4 * 3
    this.height = window.innerHeight*1.2
  }
  initScene() {
    fetch('../static/relation.json')
      .then(res => res.json())
      .then(dataset => {
        const hnodes = dataset.hnodes,
          snodes = dataset.snodes,
          edges = dataset.edges,
          space = 400
        // prepare node data
        for(const i in hnodes) {
          const node = hnodes[i]
          node.x = 470
          node.y = (node.nid+1) * 17
        }
        for(const i in snodes) {
          const node = snodes[i]
          node.x = 470+space
          node.y = (node.nid+1) * 17
        }
        const nodeData = hnodes.concat(snodes)
        // prepare edge data
        const edgeData = []
        for(const i in edges) {
          const edge = edges[i]
          const hindex = edge.source,
            sindex = edge.target
          const source = hnodes[hindex],
            target = snodes[sindex]
          edgeData.push({source: source, target: target})
        }

        const margin = {top: 20, right: 10, bottom: 10, left: 100}
        // const colormap = ['#e6194b', '#3cb44b', '#ffe119', '#0082c8', '#f58231',
        //   '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe', '#008080',
        //   '#e6beff', '#aa6e28', '#fffac8', '#800000', '#aaffc3', '#808000',
        //   '#ffd8b1', '#000080', '#808080', '#FFFFFF', '#000000']
        const svg = d3.select(document.getElementById('relationgraph'))
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
        const extent = d3.extent(nodeData, d => d.count)
        const vmax = extent[1],
          vmin = extent[0]

        // darw title
        const titleData = [
          {text: '自己対処: 人数', x:470, y:0, position: 'end'},
          {text: '希望するサービス: 人数', x:470+space, y:0, position: 'start'}]
        svg.selectAll('.title')
          .data(titleData)
          .enter().append('g')
          .append('text')
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .style('text-anchor', d => d.position)
          .style('font-size', '17px')
          .style('fill', 'steelblue')
          .text(d => d.text)


        // draw edge
        const link = svg.selectAll('.links')
          .data(edgeData)
          .enter().append('g')
          .attr('class', 'links')
          .append('path')
          .attr('d', d => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`)
          .attr('stroke-width', 2)

        // draw node
        const node = svg.selectAll('.nodes')
          .data(nodeData)
          .enter().append('g')
          .attr('class', 'nodes')
          .on('mouseover', function(d) {
            node.style('fill', null)
            node.selectAll('text').style('fill', '#999')

            d3.select(this).selectAll('circle').style('fill', '#db084e')
            d3.select(this).selectAll('text').style('fill', 'black')
            d3.select(this).selectAll('text').style('font-size', 'large')
            const nodeConneted = edgeData.map(e => {
              return e.source === d ? e.target
                : e.target === d ? e.source : 0}).filter(d => d)
            node.filter(d => nodeConneted.indexOf(d) >= 0)
              .selectAll('circle')
              .style('fill', '#db084e')
            node.filter(d => nodeConneted.indexOf(d) >= 0)
              .selectAll('text')
              .style('fill', 'black')
              .style('font-size', 'large')
            link.style('stroke', link_d => link_d.source === d | link_d.target === d ? '#db084e' : null)
              .style('stroke-width', link_d => link_d.source === d | link_d.target === d ? 3 : null)
          })
          .on('mouseout', function() {
            link.style('stroke', null)
            node.selectAll('circle').style('fill', null)
            node.selectAll('text').style('fill', null)
            node.selectAll('text').style('font-size', null)
          })

        node.append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', d => 5+(d.count-vmin)*10/(vmax-vmin))
        node.append('text')
          .attr('x', d => d.type == 'handle' ? d.x-10 : d.x+10)
          .attr('y', d => d.y+5)
          .style('text-anchor', d => d.type == 'handle' ? 'end' : 'start')
          .text(d => `${d.text} :${d.count}`)
      })
  }
}
