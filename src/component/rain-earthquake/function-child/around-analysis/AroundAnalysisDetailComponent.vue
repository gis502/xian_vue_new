<template>
  <div v-if="showAreaDialog" class="area-dialog" :style="{ left: dialogPosition.x + 'px', top: dialogPosition.y + 'px' }">
    <div class="dialog-header">选择区域</div>
    <div class="dialog-content">
      <div class="radius-input-group">
        <span class="label">半径：</span>
        <input
          v-model.number="radius"
          type="number"
          class="radius-input"
          min="1"
          max="100"
        />
        <span class="unit">公里</span>
      </div>
    </div>
    <div class="dialog-footer">
      <button class="confirm-btn" @click="handleConfirm">确认添加</button>
      <button class="cancel-btn" @click="handleCancel">取消</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';//从Vue导入inject函数，用于依赖注入
import type { AnalysisButtonState } from '@/types/common/useAroundAnalysisType';

// 从父组件注入共享状态，明确指定类型
const analysisButtonState = inject<AnalysisButtonState>('analysisButtonState');

const { 
  showAreaDialog, 
  radius, 
  dialogPosition, 
  handleConfirm, 
  handleCancel 
} = analysisButtonState!;//使用非空断言操作符，告诉TypeScript该值一定存在
</script>

<style scoped>
/* 对话框容器样式 */
.area-dialog {
  position: absolute;
  z-index: 100001;
  min-width: 200px; 
  padding: 0;
  background: linear-gradient(180deg, rgba(0, 60, 120, 0.95), rgba(0, 40, 80, 0.95));
  border: 2px solid #00b4ff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 180, 255, 0.3);
  color: white;
  overflow: hidden;
}
/* 对话框标题栏样式 */
.dialog-header {
  padding: 8px 12px; 
  font-size: 16px; 
  font-weight: bold;
  text-align: center;
  color: white;
  background: linear-gradient(90deg, #00b4ff, #0080cc);
}

.dialog-content {
  padding: 10px 6px; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.radius-input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
 /* 标签和单位文字的样式 */
.radius-input-group .label,
.radius-input-group .unit {
  font-size: 14px; 
  color: white;
}

.radius-input {
  width: 50px;
  height: 30px;
  padding: 2px 5px;
  font-size: 14px;
  text-align: center;
  color: white;
  background: rgba(0, 100, 180, 0.6);
  border: 1px solid #00b4ff;
  border-radius: 3px;
  outline: none;
}
/* 隐藏数字输入框的上下调节按钮（针对WebKit浏览器） */
.radius-input::-webkit-inner-spin-button,
.radius-input::-webkit-outer-spin-button {
  opacity: 0;
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 8px; 
  padding: 10px 10px 8px; 
}

.confirm-btn,
.cancel-btn {
  padding: 6px 15px; 
  font-size: 14px; 
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
}

.confirm-btn {
  background: linear-gradient(180deg, #2d8a4e, #1e6b3a);
  border: 1px solid #3da862;
}

.confirm-btn:hover {
  background: linear-gradient(180deg, #3da862, #2d8a4e);
  box-shadow: 0 2px 8px rgba(45, 138, 78, 0.5);
}

.cancel-btn {
  background: linear-gradient(180deg, #c0392b, #96281b);
  border: 1px solid #e74c3c;
}

.cancel-btn:hover {
  background: linear-gradient(180deg, #e74c3c, #c0392b);
  box-shadow: 0 2px 8px rgba(192, 57, 43, 0.5);
}
</style>
