import * as d3 from 'd3'


export default class Relationgraph {
  constructor() {
    this.width = window.innerWidth
    this.height = 4000
  }
  initScene(dataset) {
    document.getElementById('relationgraph').innerHTML = ''
    const hnodes = dataset.hnodes,
      snodes = dataset.snodes,
      edges = dataset.edges,
      space = 200
    // prepare node data
    for(const i in hnodes) {
      const node = hnodes[i]
      node.x = 400
      node.y = (node.nid+1) * 17
    }
    for(const i in snodes) {
      const node = snodes[i]
      node.x = 400+space
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

    const margin = {top: 20, right: 10, bottom: 10, left: 10}
    const svg = d3.select(document.getElementById('relationgraph'))
      .append('svg')
      .attr('class', 'graph-svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
    const extent = d3.extent(nodeData, d => d.count)
    const vmax = extent[1],
      vmin = extent[0]

    // darw title
    const titleData = [
      {text: '自己対処: 人数', x:400, y:0, position: 'end', type: 'handle'},
      {text: '希望するサービス: 人数', x:400+space, y:0, position: 'start', type: 'service'}]
    svg.selectAll('.title')
      .data(titleData)
      .enter().append('g')
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .style('text-anchor', d => d.position)
      .style('font-size', '17px')
      .style('font-weight', 'bold')
      .style('fill', d => d.type=='handle'?'#99B898':'#FECEAB')
      .text(d => d.text)


    // draw link
    const link = svg.selectAll('.links')
      .data(edgeData)
      .enter().append('g')
      .attr('class', 'links')
      .append('path')
      .attr('d', d => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`)
      .attr('fill', 'none')

    // draw node
    const node = svg.selectAll('.nodes')
      .data(nodeData)
      .enter().append('g')
      .attr('class', 'nodes')
      .on('click', function(d) {
        node.selectAll('circle').style('fill', '#777')
        node.selectAll('text').style('fill', '#777')
        link.style('stroke-opacity', 0)

        d3.select(this).selectAll('circle').style('fill', '#E84A5F')
        d3.select(this).selectAll('text').style('font-size', 'large')
        const nodeConneted = edgeData.map(e => {
          return e.source === d ? e.target
            : e.target === d ? e.source : 0}).filter(d => d)
        node.filter(d => nodeConneted.indexOf(d) >= 0)
          .selectAll('circle')
          .style('fill', '#E84A5F')
        node.filter(d => nodeConneted.indexOf(d) >= 0)
          .selectAll('text')
          .style('font-size', 'large')
        link.style('stroke', link_d => link_d.source === d | link_d.target === d ? '#E84A5F' : null)
          .style('stroke-width', link_d => link_d.source === d | link_d.target === d ? 3 : null)
          .style('stroke-opacity', link_d => link_d.source === d | link_d.target === d ? 1 : 0)
      })
      // .on('mouseout', function() {
      //   node.selectAll('circle').style('fill', d => d.type=='handle'?'#99B898':'#FECEAB')
      //   node.selectAll('text').style('fill', '#474747')
      //   node.selectAll('text').style('font-size', null)
      //   link.style('stroke', null)
      //     .style('stroke-opacity', null)
      //     .style('stroke-width', null)
      // })
    d3.select('.graph-svg')
      .on('click', function() {
        if(this == d3.event.target) {
          node.selectAll('circle').style('fill', d => d.type=='handle'?'#99B898':'#FECEAB')
          node.selectAll('text').style('fill', '#474747')
          node.selectAll('text').style('font-size', null)
          link.style('stroke', null)
            .style('stroke-opacity', null)
            .style('stroke-width', null)
        }
      })
    node.append('circle')
      .attr('class', 'graph-circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => 5+(d.count-vmin)*10/(vmax-vmin))
      .style('fill', d => d.type=='handle'?'#99B898':'#FECEAB')
    node.append('text')
      .attr('class', 'graph-text')
      .attr('x', d => d.type == 'handle' ? d.x-10 : d.x+10)
      .attr('y', d => d.y+5)
      .style('text-anchor', d => d.type == 'handle' ? 'end' : 'start')
      .text(d => {
        if(d.type == 'handle') {
          return `${d.qs.join('&')} | ${d.text} :${d.count}`
        }
        else {
          return `${d.text} :${d.count} | ${d.qs.join('&')}`
        }
      })
  }
}
