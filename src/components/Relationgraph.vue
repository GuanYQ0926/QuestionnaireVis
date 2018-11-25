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
    this.eventHub.$on('initRelationgraphScene', graphData => this.rg.initScene(graphData))
  },
}
</script>

<style>
#relationgraph {
  position: relative;
  float: right;
}
.links path {
  stroke: #777;
  stroke-opacity: 0.6;
  stroke-width: 1px;
}

/* .nodes circle {
  fill: steelblue;
  stroke: #fff;
  stroke-width: 1px;
} */

.nodes text {
  font: 10px sans-serif;
}

.title text {
}

</style>
