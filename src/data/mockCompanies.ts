import type { CompanyIntel } from '../types';

export const mockCompanies: CompanyIntel[] = [
  { id:'comp-01', name:'字节跳动', shortName:'字节', industry:'互联网/IT', size:'10000人以上', riskLevel:'green', riskFactors:[], employeeReviewSummary:'技术氛围好，成长快', antiOvertimeIndex:30 },
  { id:'comp-02', name:'美团', shortName:'美团', industry:'互联网/IT', size:'10000人以上', riskLevel:'green', riskFactors:[], employeeReviewSummary:'业务稳定，福利完善', antiOvertimeIndex:55 },
  { id:'comp-03', name:'理想汽车', shortName:'理想', industry:'制造', size:'5000-9999人', riskLevel:'yellow', riskFactors:['加班严重'], employeeReviewSummary:'新能源风口，加班多', antiOvertimeIndex:35 },
  { id:'comp-04', name:'蚂蚁集团', shortName:'蚂蚁', industry:'金融', size:'10000人以上', riskLevel:'yellow', riskFactors:['裁员频繁'], employeeReviewSummary:'金融科技头部', antiOvertimeIndex:40 },
  { id:'comp-05', name:'网易', shortName:'网易', industry:'互联网/IT', size:'10000人以上', riskLevel:'green', riskFactors:[], employeeReviewSummary:'WLB好，福利不错', antiOvertimeIndex:75 },
  { id:'comp-06', name:'小红书', shortName:'小红书', industry:'互联网/IT', size:'5000-9999人', riskLevel:'green', riskFactors:[], employeeReviewSummary:'增长快，年轻化', antiOvertimeIndex:50 },
  { id:'comp-07', name:'哔哩哔哩', shortName:'B站', industry:'互联网/IT', size:'5000-9999人', riskLevel:'yellow', riskFactors:['裁员频繁'], employeeReviewSummary:'社区文化好', antiOvertimeIndex:45 },
  { id:'comp-08', name:'平安科技', shortName:'平安', industry:'金融', size:'10000人以上', riskLevel:'yellow', riskFactors:['合同纠纷'], employeeReviewSummary:'适合养老，节奏慢', antiOvertimeIndex:70 },
  { id:'comp-09', name:'好未来', shortName:'好未来', industry:'教育', size:'5000-9999人', riskLevel:'red', riskFactors:['裁员频繁','经营异常'], employeeReviewSummary:'受政策影响大', antiOvertimeIndex:20 },
  { id:'comp-10', name:'迈瑞医疗', shortName:'迈瑞', industry:'医疗', size:'10000人以上', riskLevel:'green', riskFactors:[], employeeReviewSummary:'医疗器械龙头，稳定', antiOvertimeIndex:65 },
  { id:'comp-11', name:'百度', shortName:'百度', industry:'互联网/IT', size:'10000人以上', riskLevel:'yellow', riskFactors:['合同纠纷'], employeeReviewSummary:'AI投入大，传统业务收缩', antiOvertimeIndex:50 },
  { id:'comp-12', name:'京东', shortName:'京东', industry:'互联网/IT', size:'10000人以上', riskLevel:'green', riskFactors:[], employeeReviewSummary:'电商稳定', antiOvertimeIndex:60 },
  { id:'comp-13', name:'滴滴', shortName:'滴滴', industry:'互联网/IT', size:'5000-9999人', riskLevel:'yellow', riskFactors:['加班严重'], employeeReviewSummary:'出行龙头', antiOvertimeIndex:30 },
  { id:'comp-14', name:'商汤科技', shortName:'商汤', industry:'互联网/IT', size:'1000-4999人', riskLevel:'red', riskFactors:['经营异常','欠薪记录'], employeeReviewSummary:'AI公司，商业化困难', antiOvertimeIndex:15 },
  { id:'comp-15', name:'比亚迪', shortName:'比亚迪', industry:'制造', size:'10000人以上', riskLevel:'green', riskFactors:[], employeeReviewSummary:'新能源霸主，扩张期', antiOvertimeIndex:55 },
];
