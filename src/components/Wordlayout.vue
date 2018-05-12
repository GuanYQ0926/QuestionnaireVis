<template>
  <div id="wordlayout">
    <table class="block">
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
    </table>
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
    this.eventHub.$on('initWordlayoutScene', () => this.wc.initScene())
  }
}
</script>

<style>
  .block {
    position: relative;
    float:right;
    font-size: 15px;
    font-family: Consolas, courier;
  }
</style>
