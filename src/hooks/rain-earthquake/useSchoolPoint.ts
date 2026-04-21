import { schoolIcon } from '@/assets';

/**
 * 学校相关钩子函数
 * @returns 字段映射和获取图标方法
 */
export const useSchoolPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    schoolName: '学校名称',
    schoolType: '学校类型',
    lon: '经度',
    lat: '纬度',
    students: '在校学生数',
    isImportant: '是否有重点保护目标',
    unitHead: '负责人',
    telephone: '联系电话',
  };

  /**
   * 获取学校图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return schoolIcon;
  }

  return { field, getDisasterIcon };
};
