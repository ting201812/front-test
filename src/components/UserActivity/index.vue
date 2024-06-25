<template>
  <div class="user-activity">
    <div class="activity-title">
      用户活跃走势图
    </div>
    <div class="activity-type">
      <div class="activity-type-item">
        <span>数据类型</span>
        <a-select
          v-model="dataType"
          :options="dataTypeOptions"
          placeholder="请选择数据类型"
          @change="changeDataType"
        />
      </div>
      <div class="activity-type-item">
        <span>图表类型</span>
        <a-select
          v-model="chartType"
          :options="chartTypeOptions"
          placeholder="请选择图表类型"
          @change="changeChartType"
        />
      </div>
    </div>
    <div class="activity-chart" ref="chartDom" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { SelectOptionData, } from '@arco-design/web-vue';
import { nextTick, onMounted, ref, watch, onBeforeUnmount, } from 'vue';

const props = defineProps({
  csvData: {
    type: Array<any>,
    default: () => [],
  },
});

type EChartsOption = echarts.EChartsOption & {
  xAxis: Record<string, any>,
  series: Record<string, any>,
};

// 图表配置项
const chartOptions: EChartsOption = {
  grid: {
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
  },
  dataZoom: {
    type: 'inside',
    start: 0,
    end: 10,
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: {
    name: '用户活跃度',
    type: 'bar',
    data: [],
    barMinWidth: 10,
    barMaxWidth: 20,
  },
};
let chart: any;
const chartDom = ref<HTMLElement>();
// 数据类型 day按天统计  month按月统计
const dataType = ref<string>('day');
// 数据类型选择数据
const dataTypeOptions: SelectOptionData[] = [
  {
    label: '按天统计',
    value: 'day',
  },
  {
    label: '按月统计',
    value: 'month',
  },
];

/**
 * 初始化图表
 * @returns {void}
 */
const initChart = (): void => {
  chart = echarts.init(chartDom.value);
  chart.setOption(chartOptions);
};

/**
 * 图表大小自适应
 * @returns {void}
 */
const chartResize = (): void => {
  chart.resize();
};

/**
 * 绘制图表
 * @returns {void}
 */
const drawChart = (): void => {
  const temp = props.csvData.reduce((obj: Record<string, number>, cur: Record<string, any>) => {
    const key = dataType.value === 'day' ?
      cur.created_at_date :
      dayjs(cur.created_at_date).format('YYYY-MM');

    if (obj[key]) {
      obj[key] += 1;
    } else {
      obj[key] = 1;
    }

    return obj;
  }, {});

  chartOptions.xAxis.data = Object.keys(temp);
  chartOptions.series.data = Object.values(temp);
  chart.setOption(chartOptions);
};

watch(() => props.csvData, () => {
  nextTick(() => {
    console.log('props.csvata', props.csvData);
    drawChart();
  });
});


/**
 * 更改数据类型统计
 * @returns {void}
 */
const changeDataType = (): void => {
  drawChart();
};

// 下拉图表类型选择数据
const chartTypeOptions: SelectOptionData[] = [
  {
    label: '柱状图',
    value: 'bar',
  },
  {
    label: '折线图',
    value: 'line',
  },
];
// 图表类型
const chartType = ref<string>('bar');

/**
 * 更改图表类型统计
 * @returns {void}
 */
const changeChartType = (): void => {
  chartOptions.series.type = chartType.value;
  chart.setOption(chartOptions);
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', chartResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', chartResize);
});

</script>

<style lang="scss" scoped>
.user-activity {
  width: 100%;
  height: 100%;

  .activity-title {
    font-weight: 600;
    line-height: .32rem;
  }

  .activity-type {
    display: flex;
    align-items: center;
    gap: .2rem;
    width: 100%;
    margin: .2rem 0;


    &-item {
      display: flex;
      align-items: center;
      gap: .1rem;

      :deep().arco-select {
        width: 2.5rem;
        height: .32rem;

        .arco-select-view-input,
        .arco-select-view-value {
          min-height: 0;
          font-size: .14rem;
          padding: 0;
          line-height: .32rem;
        }
      }
    }
  }

  .activity-chart {
    height: calc(100% - 1.04rem);
    background-color: #e3e3e3;
  }
}
</style>
