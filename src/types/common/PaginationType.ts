/**
 * 分页配置接口
 */
export interface PaginationType {
  /** 当前页码 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
  /** 总记录数 */
  total: number;
  /** 总页数 */
  totalPage: number;
}
