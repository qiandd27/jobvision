export const STORAGE_KEYS = {
  JOBS: 'jobvision_jobs',
  COMPANIES: 'jobvision_companies',
  APPLICATIONS: 'jobvision_applications',
  USER_PROFILE: 'jobvision_profile',
  RESUME_DATA: 'jobvision_resume',
  FILTERS: 'jobvision_filters',
} as const;

export const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '武汉', '西安', '苏州'];
export const INDUSTRIES = ['互联网/IT', '金融', '教育', '医疗', '制造', '房地产', '零售', '能源', '物流', '传媒'];
export const EXPERIENCE_LEVELS = ['应届生', '1-3年', '3-5年', '5-10年', '10年以上', '不限'];
export const EDUCATION_LEVELS = ['大专', '本科', '硕士', '博士', '不限'];

export const MATCH_WEIGHTS = { skills: 0.40, experience: 0.25, education: 0.15, salary: 0.20 };
export const HIGH_RISK_FACTORS = ['欠薪记录', '失信被执行人', '非法经营', '劳动仲裁频繁'];
export const MEDIUM_RISK_FACTORS = ['加班严重', '裁员频繁', '合同纠纷', '经营异常'];
