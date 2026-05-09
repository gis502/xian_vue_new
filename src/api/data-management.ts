import type { ApiResponse } from "@/types/ApiResponse"
import httpInstance from "@/utils/request/http"

/**
 * 表信息接口
 */
export interface TableInfo {
  /** 表名 */
  tableName: string;
  /** 表描述 */
  tableComment?: string;
  /** 记录数 */
  rowCount?: number;
  /** 数据大小 */
  dataSize?: string;
}

/**
 * 表字段接口
 */
export interface TableColumn {
  /** 字段名 */
  column_name: string;
  /** 字段类型 */
  data_type?: string;
  /** 是否可空 */
  is_nullable?: string;
  /** 默认值 */
  column_default?: any;
}

/**
 * 表数据记录接口
 */
export interface TableDataRecord {
  [key: string]: any;
}

/**
 * 表详情接口（后端返回的数据结构）
 */
export interface TableDetailResponse {
  /** 表名 */
  tableName: string;
  /** 字段列表 */
  columns: TableColumn[];
  /** 表数据记录 */
  data: TableDataRecord[];
  /** 总记录数 */
  total: number;
}

/**
 * 获取所有数据库表信息
 * @returns 表信息数组
 */
export const getAllTables = (): Promise<ApiResponse<TableInfo[]>> => {
  return httpInstance.get('/api/table/data-management/tables')
}

/**
 * 获取表的具体数据内容
 * @param tableName - 表名
 * @param limit - 限制返回的记录数（可选，默认不限制）
 * @returns 表详情（包含字段信息和数据记录）
 */
export const getTableData = (tableName: string, limit?: number): Promise<ApiResponse<TableDetailResponse>> => {
  return httpInstance.get(`/api/table/data/${tableName}`, {
    params: limit ? { limit } : {}
  })
}
