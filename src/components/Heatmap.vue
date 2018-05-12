<template>
  <div id="heatmap"></div>
</template>

<script>
import Heatmap from '../scripts/heatmap'

export default {
  name: 'Heatmap',
  data: () => ({
    hm: new Heatmap(),
  }),
  mounted() {
    this.eventHub.$on('initHeatmapScene', (data1, data2, brush) => this.hm.initScene(data1, data2, brush))
  }
}
</script>

<style>
  .grid {
    stroke: #E6E6E6;
    stroke-width: 0.1px;
  }
  text.mono {
    font-family: Consolas, courier;
    fill: #000;
  }
  text.q13 {
    fill: #000;
  }
  text.q24 {
    fill: #AAA;
  }
  text.details {
    font-size: 20px;
    font-family: Consolas, courier;
    fill: #000;
  }
</style>
