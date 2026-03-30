import { CourseCategory } from './course';

export interface Slice {
  id: string;
  title: string;
  description: string;
  fileUrl: string;           // SVS 文件路径
  thumbnailUrl: string;      // 缩略图
  magnification: number;     // 最大放大倍数
  width: number;
  height: number;
  category: CourseCategory;
  tags: string[];
  annotations: Annotation[];
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  path: Point[];             // 标注路径点
  color: string;
  lineWidth: number;
  label?: string;
  createdBy: string;
  createdAt: Date;
}

export type AnnotationType =
  | 'pen'        // 自由绘制
  | 'line'       // 直线测量
  | 'area'       // 区域测量
  | 'point'      // 计数点
  | 'text';      // 文字标注

export interface Point {
  x: number;
  y: number;
}

export type ToolType =
  | 'pan'       // 平移
  | 'pen'       // 画笔
  | 'measure'   // 测量
  | 'count'     // 计数
  | 'label'     // 标签
  | 'discuss';  // 讨论

// 切片浏览器状态
export interface SliceViewState {
  zoom: number;
  position: Point;
  magnification: number;
}

// 测量结果
export interface Measurement {
  id: string;
  type: 'line' | 'area';
  value: number;
  unit: string;
  points: Point[];
}
