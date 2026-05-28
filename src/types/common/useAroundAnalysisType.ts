import type { LoadingResource } from './LoadingResourceType';
import type { Ref } from 'vue';
/**
 * 周边分析组件相关类型定义
 */

/**
 * 点资源分类类型
 */
export type PointResourceCategory =
  | 'school'
  | 'hospital'
  | 'danger'
  | 'shelter'
  | 'fire'
  | 'store'
  | 'hidden-danger'
  | 'risk-point'
  | 'bridge'
  | 'reservoir'
  | 'subway';

/**
 * 点资源数据结构
 */
export interface PointResource {
  /** 点ID */
  id: string | number;
  /** 显示值（名称） */
  value: string;
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
  /** 资源分类 */
  category?: PointResourceCategory;
  /** 原始类型（用于隐患点子类型区分） */
  originalType?: string;
  /** 其他任意属性 */
  [key: string]: unknown;
}

/**
 * 资源配置接口（用于 SearchComponent）
 */
export interface ResourceConfig {
  /** 加载资源键 */
  key: LoadingResource;
  /** 资源分类 */
  category: PointResourceCategory;
  /** 强制类型（用于隐患点） */
  forcedType?: string;
  /** 是否可见的判断函数 */
  isVisible: () => boolean;
}

/**
 * 资源配置接口（用于 ButtonComponent，不含 isVisible）
 */
export interface ButtonResourceConfig {
  /** 加载资源键 */
  key: LoadingResource;
  /** 资源分类 */
  category: PointResourceCategory;
  /** 强制类型（用于隐患点） */
  forcedType?: string;
}

/**
 * 分析按钮配置接口
 */
export interface AnalysisButtonConfig {
  /** 按钮默认名称 */
  name: string;
  /** 按钮激活时的名称（可选） */
  activeName?: string;
  /** 按钮点击回调函数 */
  callback: (status: boolean) => void;
}

/**
 * 对话框位置接口
 */
export interface DialogPosition {
  /** X 坐标 */
  x: number;
  /** Y 坐标 */
  y: number;
}

/**
 * 周边分析按钮状态接口（用于 provide/inject 共享）
 * 注意：响应式属性使用 Ref 类型
 */
export interface AnalysisButtonState {
  /** 当前选中的按钮索引 */
  selectedButtonIndex: Ref<number>;
  /** 是否显示区域选择弹窗 */
  showAreaDialog: Ref<boolean>;
  /** 区域半径（公里） */
  radius: Ref<number>;
  /** 弹窗位置 */
  dialogPosition: DialogPosition;
  /** 分析按钮配置列表 */
  analysisButtons: AnalysisButtonConfig[];
  /** 按钮点击处理函数 */
  handleButtonClick: (index: number, callback: (status: boolean) => void) => void;
  /** 确认添加区域分析 */
  handleConfirm: () => void;
  /** 取消区域分析 */
  handleCancel: () => void;
  /** 刷新脉冲效果 */
  refreshPulseEffect: () => void;
}
