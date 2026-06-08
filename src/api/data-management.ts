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
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
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
  column_default?: string | number | boolean | null;
}

/**
 * 表数据记录接口
 */
export interface TableDataRecord {
  [key: string]: string | number | boolean | null | undefined;
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
  return httpInstance.get('/table/data-management/tables')
}

/**
 * 获取表的具体数据内容
 * @param tableName - 表名
 * @param page - 页码
 * @param pageSize - 每页条数
 * @returns 表详情（包含字段信息和数据记录）
 */
export const getTableData = (
  tableName: string,
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<TableDetailResponse>> => {
  return httpInstance.get(`/table/data/${tableName}`, {
    params: { page, pageSize }
  })
}

/**
 * 修改表信息
 * @param oldTableName - 原表名
 * @param newTableName - 新表名（可选）
 * @param newComment - 新表描述（可选）
 * @returns 操作结果
 */
export const updateTableInfo = (
  oldTableName: string,
  newTableName?: string,
  newComment?: string
): Promise<ApiResponse<void>> => {
  return httpInstance.put('/table/update-table-info', null, {
    params: {
      oldTableName,
      ...(newTableName && { newTableName }),
      ...(newComment && { newComment })
    }
  })
}

/**
 * 修改表数据记录
 * @param tableName - 表名
 * @param whereConditions - WHERE条件
 * @param updateData - 更新数据
 * @returns 操作结果
 */
export const updateTableData = (
  tableName: string,
  whereConditions: Record<string, unknown>,
  updateData: Record<string, unknown>
): Promise<ApiResponse<void>> => {
  return httpInstance.put(`/table/update-data/${tableName}`, {
    whereConditions,
    updateData
  })
}

/**
 * 新增表数据记录
 * @param tableName - 表名
 * @param insertData - 新增数据
 * @returns 操作结果
 */
export const insertTableData = (
  tableName: string,
  insertData: Record<string, unknown>
): Promise<ApiResponse<void>> => {
  return httpInstance.post(`/table/insert-data/${tableName}`, insertData)
}

/**
 * 删除表数据记录（物理删除）
 * @param tableName - 表名
 * @param ids - 要删除的记录主键ID列表
 * @returns 操作结果
 */
export const deleteTableData = (
  tableName: string,
  ids: (string | number)[]
): Promise<ApiResponse<void>> => {
  return httpInstance({
    url: `/table/delete-data/${tableName}`,
    method: 'DELETE',
    data: { ids }
  })
}
