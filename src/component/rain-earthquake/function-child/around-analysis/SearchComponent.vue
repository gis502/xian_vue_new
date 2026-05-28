<template>
  <div class="search-component-box">
    <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearch"
        popper-class="my-autocomplete"
        placeholder="搜索地点"
        @select="handleSelect"
        @focus="handleFocus"
        clearable
        :disabled="!canSearch" 
        :teleported="false"
    >
      <template #suffix>
        <el-icon class="el-input__icon">
          <edit />
        </el-icon>
      </template>
      <template #default="{ item }">
        <div class="value">{{ item.value }}</div>
        <span class="link">{{ item.lon?.toFixed(4) }}, {{ item.lat?.toFixed(4) }}</span>
      </template>
    </el-autocomplete>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import { useAroundAnalysis } from '@/hooks/rain-earthquake/useAroundAnalysis';

const { 
  state, 
  canSearch, 
  querySearch, 
  handleSelect, 
  handleFocus, 
  loadAllPointData 
} = useAroundAnalysis();

onMounted(() => {
  loadAllPointData();
});
</script>

<style scoped>
.search-component-box {
  position: absolute;
  top: 125px;
  right: 210px;
  z-index: 10000;
  width: 220px;
}

.search-component-box :deep(.el-input__wrapper) {
  background: rgba(60, 99, 147, 0.9) ;
  box-shadow: 0 0 0 1px rgba(160, 173, 192, 0.5) ;
  border-radius: 7px;
}

.search-component-box :deep(.el-input__inner) {
  color: #fff;
}

.search-component-box :deep(.el-input__inner::placeholder) {
  color: #9ca9b9;
}

.search-component-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(79, 131, 194, 0.9);
}

.search-component-box :deep(.my-autocomplete) {
  background: rgba(26, 58, 95, 0.95);
  border: 1px solid #2a3d58;
}

.search-component-box :deep(.my-autocomplete li) {
  padding: 2px 6px; 
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  color: #e6edf3;
  font-size: 13px; 
}

.search-component-box :deep(.my-autocomplete li .value) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.search-component-box :deep(.my-autocomplete li .link) {
  font-size: 12px; 
  margin-left: 8px;
  flex-shrink: 0;
}

.search-component-box :deep(.my-autocomplete li:hover),
.search-component-box :deep(.my-autocomplete li.highlighted) {
  background: rgba(58, 112, 169, 0.7);
  color: #fff;
}
</style>
