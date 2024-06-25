<template>
  <div class="home-page">
    <!-- S 用户活跃度 -->
    <div class="user-activity-wrapper">
      <UserActivity :csvData="csvData" />
    </div>
    <!-- E 用户活跃度 -->

    <!-- S 用户活跃度 -->
    <div class="country-distribution-wrapper">
      <CountryDistribution :csvData="csvData" />
    </div>
    <!-- E 用户活跃度 -->
  </div>
</template>

<script lang="ts" setup>
import { ref, } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';

import UserActivity from '@/components/UserActivity/index.vue';
import CountryDistribution from '@/components/CountryDistribution/index.vue';

const csvData = ref<Record<string, any>[]>([]);

const getCSVData = (): void => {
  axios.get('/test_data.csv').then(({ data, }) => {
    if (data) {
      const lines = data.split('\n');
      const headers = lines[0].split(',');

      csvData.value = lines.slice(1)
        .map((line: string) => {
          const rows = line.split(',');

          return headers.reduce((obj: Record<string, any>, cur: string, index: number) => {
            obj[cur.replace(/["\s]/g, '')] = rows[index]?.replace(/"|\r/g, '');

            return obj;
          }, {});
        })
        .sort((a: Record<string, any>, b: Record<string, any>) => dayjs(a.created_at_date).valueOf() - dayjs(b.created_at_date).valueOf());
    }
  });
};

getCSVData();

</script>

<style lang="scss" scoped>
.home-page {
  overflow: auto;
  display: flex;
  align-items: center;
  gap: .2rem;
  width: 100%;
  height: 100%;
  padding: .2rem;
  font-size: .16rem;

  .user-activity-wrapper,
  .country-distribution-wrapper {
    width: calc((100% - .2rem) / 2);
    height: 100%;
  }
}

</style>
