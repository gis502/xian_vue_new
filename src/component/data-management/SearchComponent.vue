<template>
  <div class="search-component-container">
    <div class="search-box">
      <span class="search-label">表名</span>
      <el-input
        v-model="searchKeyword"
        placeholder="请输入表名或表描述进行搜索"
        clearable
        @input="handleSearch"
        @clear="handleClear"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Search } from '@element-plus/icons-vue';

  // 定义事件
  const emit = defineEmits<{
    search: [keyword: string]
    clear: []
  }>();

  // 搜索关键字
  const searchKeyword = ref('');

  // 处理搜索输入
  const handleSearch = () => {
    emit('search', searchKeyword.value);
  };

  // 处理清空
  const handleClear = () => {
    searchKeyword.value = '';
    emit('clear');
  };
</script>

<style scoped>
  .search-component-container {
    padding: 15px 20px;
    background-color: rgba(15, 61, 118, 0.8);
    border-radius: 8px;
    margin: 40px 20px 0 20px;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .search-label {
    font-size: 18px;
    font-weight: bold;
    color: white;
    white-space: nowrap;
  }

  :deep(.el-input) {
    flex: 1;
  }

  :deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  :deep(.el-input__inner) {
    color: white;
  }

  :deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.5);
  }
</style>
