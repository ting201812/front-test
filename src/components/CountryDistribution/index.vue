<template>
  <div class="country-distribution">
    <div class="distribution-title">
      用户国家分布图
    </div>
    <div class="distribution-chart" ref="chartDom" />
    <div class="distribution-table">
      <a-table
        :columns="columns"
        :data="chartTable"
        :scroll="{y: '100%', x: '120%',}"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { nextTick, onMounted, ref, watch, onBeforeUnmount, } from 'vue';
import chinaJson from '@/assets/world.json';
import country from '@/assets/country.json';

const props = defineProps({
  csvData: {
    type: Array<any>,
    default: () => [],
  },
});

const options: Record<string, any> = {
  tooltip: {},
  visualMap: {
    min: 0,
    max: 2000,
  },
  geo: {
    map: 'world',
    roam: true,
  },
  series: {
    name: '用户分布',
    type: 'map',
    geoIndex: 0,
    data: [],
  },
};

const columns: Record<string, any>[] = [
  {
    title: 'country',
    dataIndex: 'country',
  },
  {
    title: 'app_version',
    dataIndex: 'app_version',
  },
  {
    title: 'app_token',
    dataIndex: 'app_token',
  },
  {
    title: 'event_count',
    dataIndex: 'event_count',
  },
  {
    title: 'created_at_date',
    dataIndex: 'created_at_date',
  },
];

let chart: any;
const chartDom = ref<HTMLElement>();
const chartTable = ref<Record<string, any>[]>([]);

/**
 * 初始化图表
 * @returns {void}
 */
const initChart = (): void => {
  echarts.registerMap('world', chinaJson as any);
  chart = echarts.init(chartDom.value);
  chart.on('click', (data: any) => {
    const countryMap = country as Record<string, string>;
    const key = Object.keys(countryMap)
      .find((item: string) => countryMap[item] === data.name);

    chartTable.value = props.csvData.filter((item: Record<string, any>) => item.country === key);
  });
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
  const countryMap = country as Record<string, string>;
  const temp = props.csvData.reduce((obj: Record<string, number>, cur: Record<string, any>) => {
    if (obj[cur.country]) {
      obj[cur.country] += 1;
    } else {
      obj[cur.country] = 1;
    }

    return obj;
  }, {});

  options.series.data = Object.keys(temp).map((item: string) => ({
    name: countryMap[item],
    value: temp[item],
  }));
  chart.setOption(options);
};

watch(() => props.csvData, () => {
  nextTick(() => {
    drawChart();
  });
});

onMounted(() => {
  initChart();
  window.addEventListener('resize', chartResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', chartResize);
});
</script>

<style lang="scss" scoped>
.country-distribution {
  width: 100%;
  height: 100%;

  .distribution-title {
    margin-bottom: 0.2rem;
    font-weight: 600;
    line-height: 0.32rem;
  }

  .distribution-chart {
    height: calc(100% - 3.72rem);
    background-color: #e3e3e3;
  }

  .distribution-table {
    height: 3rem;
    margin-top: .2rem;
  }

  :deep().arco-table {
    .arco-table-container  {
      height: 100%;

      .arco-scrollbar:last-child {
        height: 100%;

        .arco-table-element {
          height: 100%;
        }
      }
    }
  }
}
</style>
