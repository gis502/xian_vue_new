import { useRoute } from 'vue-router';

/**
 * 首页导航相关钩子函数
 * @returns 顶部导航映射和激活状态判断函数
 */
export const useIndex = () => {
  const route = useRoute();

  /**
   * 顶部导航映射配置
   */
  const topNavMap = [
    { title: '暴雨灾害链', name: 'rainstorm', query: { identification: 1 } },
    { title: '地震灾害链', name: 'earthquake', query: { identification: 2 } },
    { title: '多灾种灾害链分析', name: 'index', query: { identification: 3 } },
    { title: '灾害链情景推演', name: 'index', query: { identification: 4 } },
    { title: '数据管理', name: 'index', query: { identification: 5 } },
    { title: '文件管理', name: 'index', query: { identification: 6 } },
  ];

  /**
   * 判断当前导航项是否激活
   * @param identification - 导航项标识
   * @returns 是否为激活状态
   */
  const isActive = (identification: number) => {
    const targetId = identification.toString();
    let currentId = route.query.identification;
    if (!currentId) return targetId === '1';
    if (Array.isArray(currentId)) currentId = currentId[0];
    return currentId === targetId || route.query.identification === targetId;
  };

  return { topNavMap, isActive };
};
