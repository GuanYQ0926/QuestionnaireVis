<template>
  <div id="app">
    <div id="q-selector">
      <el-transfer
        v-model="value1"
        :data="answerData"
        :titles="['未選択', '選択']">
      </el-transfer>
      <el-row>
        <el-button type="primary" @click="onSubmit">確認</el-button>
      </el-row>
    </div>
    <relationgraph></relationgraph>
  </div>
</template>

<script>
import Relationgraph from './components/Relationgraph.vue'

export default {
  name: 'App',
  data() {
    const generateAnswerData = _ => {
      const qIdx = [31, 19, 3, 35, 30, 9, 94, 34, 4, 6]
      const data = qIdx.map((d, i) => {
        return {key: d, label: `問題${d} (${i+1}位)`}
      })
      return data
    }
    return {
      value1: [],
      answerData: generateAnswerData(),
      graphData: null,
    }
  },
  components: {
    relationgraph: Relationgraph,
  },
  watch: {
  },
  methods: {
    onSubmit() {
      if(this.value1.length == 0) {
        alert('please select questions')
      }
      else {
        if(this.graphData) {
          // set data
          let data = []
          let hnodes = [],  // nid, count, type, text, qs
            snodes = [],  // nid, count, type, text, qs
            edges = []  // source, target
          let textHIdx = {},
            textSIdx = {},
            idxHInfo = {},
            idxSInfo = {}
          for(const qIdx of this.value1) {
            const dataset = this.graphData[qIdx]
            // hnodes
            for(const nObj of dataset.hnodes) {
              const nid = nObj.nid,
                count = nObj.count,
                type = nObj.type,
                text = nObj.text
              // text - id
              if(!(text in textHIdx)) {
                textHIdx[text] = Object.keys(textHIdx).length
              }
              const curIdx = textHIdx[text]
              // id info
              if(curIdx in idxHInfo) {
                idxHInfo[curIdx].count += count
                idxHInfo[curIdx].qs.push(`Q${qIdx}`)
              }
              else {
                idxHInfo[curIdx] = {
                  nid: curIdx,
                  count: count,
                  type: type,
                  text: text,
                  qs: [`Q${qIdx}`]
                }
              }
            }
            // snodes
            for(const nObj of dataset.snodes) {
              const nid = nObj.nid,
                count = nObj.count,
                type = nObj.type,
                text = nObj.text
              // text - id
              if(!(text in textSIdx)) {
                textSIdx[text] = Object.keys(textSIdx).length
              }
              const curIdx = textSIdx[text]
              // id info
              if(curIdx in idxSInfo) {
                idxSInfo[curIdx].count += count
                idxSInfo[curIdx].qs.push(`Q${qIdx}`)
              }
              else {
                idxSInfo[curIdx] = {
                  nid: curIdx,
                  count: count,
                  type: type,
                  text: text,
                  qs: [`Q${qIdx}`]
                }
              }
            }
            // edges
            for(const eObj of dataset.edges) {
              const source = eObj.source,
                target = eObj.target
              const srcText = dataset.hnodes[source].text,
                dstText = dataset.snodes[target].text
              edges.push({
                source: textHIdx[srcText],
                target: textSIdx[dstText]
              })
            }
          }
          // generate graph
          for(const idx in idxHInfo) {
            let temp = idxHInfo[idx]
            temp.nid = +idx
            hnodes.push(temp)
          }
          for(const idx in idxSInfo) {
            let temp = idxSInfo[idx]
            temp.nid = +idx
            snodes.push(temp)
          }
          this.eventHub.$emit('initRelationgraphScene', {hnodes: hnodes, snodes: snodes, edges: edges})
        }
        else {
          alert('fail to load data')
        }
      }
    },
    loadData() {
      fetch('../static/relationgraph.json')
        .then(res => res.json())
        .then(dataset => {
          this.graphData = dataset
        })
    },
    // async loadData() {
    //   const res = await fetch('../static/relationgraph.json')
    //   const graphData = await res.json()
    //   return graphData
    // },
  },
  mounted() {
    // this.loadData()
    //   .then(graphData => {
    //     this.graphData = graphData
    //   })
    this.loadData()
  }
}
</script>

<style>
#q-selector {
  position: absolute;
  margin-left: 0;
  margin-right: 100%;
}
#relationgraph {
  position: absolute;
  margin-left: 10%;
}
</style>
