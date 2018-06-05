<template>
  <div id="app">
    <div id="heatmap-selector">
      <el-select v-model="data1" placeholder="A1" size="mini">
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
    <div id="wordcloud-selector">
      <el-select v-model="word1" placeholder="C妊娠期仕事有" size="mini">
        <el-option
          v-for="data in wordcloud1"
          :key="data.value"
          :label="data.label"
          :value="data.value">
        </el-option>
      </el-select>
      <el-select v-model="word2" placeholder="D妊娠期仕事なし" size="mini">
        <el-option
          v-for="data in wordcloud2"
          :key="data.value"
          :label="data.label"
          :value="data.value">
        </el-option>
      </el-select>
    </div>
    <!-- <canvas id="line_canvas"></canvas> -->
    <wordcloud></wordcloud>
  </div>
</template>

<script>
import Heatmap from './components/Heatmap.vue'
import Wordcloud from './components/Wordlayout.vue'

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
    word1: 'c_all',
    wordcloud1: [
      {value: 'c_all', label: 'C妊娠期仕事有'},
      {value: 'c_1', label: 'C1初産n'},
      {value: 'c_2', label: 'C2径産'},
      {value: 'c_3', label: 'C3初期'},
      {value: 'c_4', label: 'C4中期'},
      {value: 'c_5', label: 'C5後期'},
      {value: 'd_all', label: 'D妊娠期仕事なし'}
    ],
    word2: 'd_all',
    wordcloud2: [
      {value: 'c_all', label: 'C妊娠期仕事有'},
      {value: 'c_1', label: 'C1初産n'},
      {value: 'c_2', label: 'C2径産'},
      {value: 'c_3', label: 'C3初期'},
      {value: 'c_4', label: 'C4中期'},
      {value: 'c_5', label: 'C5後期'},
      {value: 'd_all', label: 'D妊娠期仕事なし'}
    ],
  }),
  components: {
    heatmap: Heatmap,
    wordcloud: Wordcloud
  },
  watch: {
    data1(val) {
      this.eventHub.$emit('initHeatmapScene', this.data1, this.data2)
    },
    data2(val) {
      this.eventHub.$emit('initHeatmapScene', this.data1, this.data2)
    },
    word1(val) {
      this.eventHub.$emit('initWordlayoutScene', this.word1, this.word2)
    },
    word2(val) {
      this.eventHub.$emit('initWordlayoutScene', this.word1, this.word2)
    },
  },
  methods: {
  },
  mounted() {
    this.eventHub.$emit('initHeatmapScene', this.data1, this.data2)
    this.eventHub.$emit('initWordlayoutScene', this.word1, this.word2)
  }
}
</script>

<style>
</style>
