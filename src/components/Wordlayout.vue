<template>
  <div id="wordlayout">
    <table class="block">
      <tr><td>
        <div>
          <el-select v-model="word1" placeholder="C妊娠期仕事有" size="mini">
            <el-option
              v-for="data in wordcloud1"
              :key="data.value"
              :label="data.label"
              :value="data.value">
            </el-option>
          </el-select>
        </div>
      </td></tr>
      <tr><td>
        <div>
          <canvas id="word_canvas_a"></canvas>
        </div>
      </td></tr>
      <tr><td>
        <div>
          <el-select v-model="word2" placeholder="D妊娠期仕事なし" size="mini">
            <el-option
              v-for="data in wordcloud2"
              :key="data.value"
              :label="data.label"
              :value="data.value">
            </el-option>
          </el-select>
        </div>
      </td></tr>
      <tr><td>
        <div>
          <canvas id="word_canvas_b"></canvas>
        </div>
      </td></tr>
    </table>
  </div>
</template>

<script>
import Wordlayout from '../scripts/wordlayout'

export default {
  name: 'Wordlayout',
  data: () => ({
    wc: new Wordlayout(),
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
  mounted() {
    // this.eventHub.$on('initWordlayoutScene', (this.word1, this.word2) => this.wc.initScene(this.word1, this.word2))
    this.wc.initScene(this.word1, this.word2)
  }
}
</script>

<style>
  .block {
    margin-right: 70px;
    position: relative;
    float:left;
    font-size: 15px;
    font-family: Consolas, courier;
  }
</style>
