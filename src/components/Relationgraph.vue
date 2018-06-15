<template>
  <div id="relationgraph"></div>
</template>

<script>
import Relationgraph from '../scripts/relationgraph'

export default {
  name: 'Relationgraph',
  data() {
    return {
      rg: new Relationgraph(),
    }
  },
  mounted() {
    this.eventHub.$on('initRelationgraphScene', () => this.rg.initScene())
  },
}
</script>

<style>
#relationgraph {
  position: relative;
  float: right;
}
.links path {
  fill: #777;
  stroke: #999;
  stroke-opacity: 0.6;
  stroke-width: 1.5px;
}

.nodes circle {
  fill: steelblue;
  stroke: #fff;
  stroke-width: 1px;
}

.nodes text {
  font: 10px sans-serif;
}

</style>
