<template>
  <div id="wordlayout">
    <!-- <table class="block">
      <tr><td>
        <div>
          <p>ワード クラウド A</p>
          <canvas id="word_canvas_a"></canvas>
        </div>
      </td></tr>
      <tr><td>
        <div>
          <p>ワード クラウド B</p>
          <canvas id="word_canvas_b"></canvas>
        </div>
      </td></tr>
    </table> -->
    <canvas id="word_canvas_a"></canvas>
    <canvas id="word_canvas_b"></canvas>
  </div>
</template>

<script>
import Wordlayout from '../scripts/wordlayout'

export default {
  name: 'Wordlayout',
  data: () => ({
    wc: new Wordlayout(),
  }),
  mounted() {
    this.eventHub.$on('initWordlayoutScene', (word1, word2) => this.wc.initScene(word1, word2))
  }
}
</script>

<style>
  .block {
    margin-right: 70px;
    position: relative;
    float:right;
    font-size: 15px;
    font-family: Consolas, courier;
  }
</style>
