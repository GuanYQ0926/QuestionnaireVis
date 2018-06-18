<template>
  <div id="app">
    <div id="heatmap-selector">
      <el-select v-model="data1" placeholder="A1初期" size="mini">
        <el-option
          v-for="data in dataset1"
          :key="data.value"
          :label="data.label"
          :value="data.value">
        </el-option>
      </el-select>
      <el-select v-model="data2" placeholder="--" size="mini">
        <el-option
          v-for="data in dataset2"
          :key="data.value"
          :label="data.label"
          :value="data.value">
        </el-option>
      </el-select>
    </div>
    <heatmap></heatmap>
    <div id="relationgraph-selector">
      <el-select v-model="data3" placeholder="問題31全員" size="mini">
        <el-option
          v-for="data in dataset3"
          :key="data.value"
          :label="data.label"
          :value="data.value">
        </el-option>
      </el-select>
    </div>
    <relationgraph></relationgraph>
    <wordcloud></wordcloud>
  </div>
</template>

<script>
import Heatmap from './components/Heatmap.vue'
import Wordcloud from './components/Wordlayout.vue'
import Relationgraph from './components/Relationgraph.vue'

export default {
  name: 'App',
  data: () => ({
    data1: '../static/A1.json',
    dataset1: [
      {value: '../static/A.json', label: 'A初産'},
      {value: '../static/A1.json', label: 'A1初期'},
      {value: '../static/A2.json', label: 'A2中期'},
      {value: '../static/A3.json', label: 'A3後期'},
      {value: '../static/B.json', label: 'B径産'},
      {value: '../static/B1.json', label: 'B1初期'},
      {value: '../static/B2.json', label: 'B2中期'},
      {value: '../static/B3.json', label: 'B3後期'}
    ],
    data2: 'None',
    dataset2: [
      {value: 'None', label: '--'},
      {value: '../static/A.json', label: 'A初産'},
      {value: '../static/A1.json', label: 'A1初期'},
      {value: '../static/A2.json', label: 'A2中期'},
      {value: '../static/A3.json', label: 'A3後期'},
      {value: '../static/B.json', label: 'B径産'},
      {value: '../static/B1.json', label: 'B1初期'},
      {value: '../static/B2.json', label: 'B2中期'},
      {value: '../static/B3.json', label: 'B3後期'}
    ],
    data3: 'q31_all',
    dataset3: [
      {value: 'q31_all', label: '問題31全員'},
      {value: 'q31_with_job', label: '問題31仕事有り'},
      {value: 'q31_without_job', label: '問題31仕事無し'}
    ],
  }),
  components: {
    heatmap: Heatmap,
    wordcloud: Wordcloud,
    relationgraph: Relationgraph,
  },
  watch: {
    data1(val) {
      this.eventHub.$emit('initHeatmapScene', this.data1, this.data2)
    },
    data2(val) {
      this.eventHub.$emit('initHeatmapScene', this.data1, this.data2)
    },
    data3(val) {
      this.eventHub.$emit('initRelationgraphScene', this.data3)
    }
  },
  methods: {
  },
  mounted() {
    this.eventHub.$emit('initHeatmapScene', this.data1, this.data2)
    this.eventHub.$emit('initRelationgraphScene', this.data3)
  }
}
</script>

<style>
</style>
