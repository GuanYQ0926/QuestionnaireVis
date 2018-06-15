import * as d3 from 'd3'


export default class Relationgraph {
  constructor() {
    this.width = window.innerWidth / 3 * 2
    this.height = window.innerHeight
  }
  initScene() {
    fetch('../static/relation.json')
      .then(res => res.json())
      .then(dataset => {
        const hnodes = dataset.hnodes,
          snodes = dataset.snodes,
          edges = dataset.edges
        // prepare node data
        for(const i in hnodes) {
          const node = hnodes[i]
          node.x = node.nid * 15
          node.y = 10
        }
        for(const i in snodes) {
          const node = snodes[i]
          node.x = node.nid * 15
          node.y = this.height * 0.4
        }
        const nodeData = hnodes.concat(snodes)
        console.log(nodeData);
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

        const margin = {top: 100, right: 20, bottom: 100, left: 20}
        // const colormap = ['#e6194b', '#3cb44b', '#ffe119', '#0082c8', '#f58231',
        //   '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe', '#008080',
        //   '#e6beff', '#aa6e28', '#fffac8', '#800000', '#aaffc3', '#808000',
        //   '#ffd8b1', '#000080', '#808080', '#FFFFFF', '#000000']
        const colormap = {handle: '#e6194b', service: '#3cb44b'}
        const svg = d3.select(document.getElementById('relationgraph'))
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
        const extent = d3.extent(nodeData, d => d.count)
        const vmax = extent[1],
          vmin = extent[0]

        // draw edge
        const link = svg.selectAll('.links')
          .data(edgeData)
          .enter().append('g')
          .attr('class', 'links')
          .append('path')
          // .attr('d', d => `M ${d.source.x} ${d.source.y} `
          //                  + `Q ${(d.source.x+d.target.x)/2} ${(d.source.y+d.target.y)/2}, `
          //                  + `${d.target.x} ${d.target.y}`)
          .attr('d', d => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`)
          .attr('stroke-width', 2)

        // draw node
        const node = svg.selectAll('.nodes')
          .data(nodeData)
          .enter().append('g')
          .attr('class', 'nodes')
          .on('mouseover', function(d) {
            node.style('fill', null)
            node.selectAll('text').style('fill', '#eee')

            d3.select(this).selectAll('circle').style('fill', '#db084e')
            d3.select(this).selectAll('text').style('fill', 'black')
            const nodeConneted = edgeData.map(e => {
              return e.source === d ? e.target
                : e.target === d ? e.source : 0}).filter(d => d)
            node.filter(d => nodeConneted.indexOf(d) >= 0)
              .selectAll('circle')
              .style('fill', '#db084e')
            node.filter(d => nodeConneted.indexOf(d) >= 0)
              .selectAll('text')
              .style('fill', 'black')
            link.style('stroke', link_d => link_d.source === d | link_d.target === d ? '#db084e' : null)
          })
          .on('mouseout', function() {
            link.style('stroke', null)
            node.selectAll('circle').style('fill', null)
            node.selectAll('text').style('fill', null)
          })

        node.append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', d => 5+(d.count-vmin)*15/(vmax-vmin))
          // .attr('fill', d => colormap[d.type])
        node.append('text')
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .style('text-anchor', d => d.type == 'handle' ? 'start' : 'end')
          .attr('transform', d => `rotate(-77,${d.x},${d.y})`)
          .text(d => d.text)
      })
  }
}
