<template>
  <Card>
    <BarChart class="chart" v-if="chartData" :chart-data="chartData" :options="chartOptions"></BarChart>
    <template v-slot:foot>
      <CardFoot>
        <Button :onClick="fillData">Randomize</Button>
      </CardFoot>
    </template>
  </Card>
</template>

<script  lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { colorsLight } from '../../utils/style.util'
import Button from '../Button.vue'
import Card from '../card/Card.vue'
import CardFoot from '../card/CardFoot.vue'

export interface ChartData {
  labels: Array<string | number>
  datasets: Array<{
    label: string
    backgroundColor: string
    data: Array<string | number>
  }>
}

@Component({
  components: {
    BarChart: () => import('./BarChart.vue'),
    Button,
    Card,
    CardFoot,
  },
  data() {
    return { chartData: undefined }
  },
})
export default class LineExample extends Vue {
  public chartData?: ChartData

  public chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  public mounted() {
    this.fillData()
  }

  public fillData() {
    this.chartData = {
      labels: [1, 2, 3, 4],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: this.getRandomColor(),
          data: [
            this.getRandomInt() / 2,
            this.getRandomInt() / 2,
            this.getRandomInt() / 2,
            this.getRandomInt() / 2,
          ],
        },
        {
          label: 'Data Two',
          backgroundColor: this.getRandomColor(),
          data: [
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
          ],
        },
      ],
    }
  }

  public getRandomInt() {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5
  }

  public getRandomColor() {
    const keys = Object.keys(colorsLight)
    // tslint:disable-next-line
    return colorsLight[keys[(keys.length * Math.random()) << 0]]
  }
}
</script>

<style scoped>
.chart {
  max-height: 200px;
}
</style>
