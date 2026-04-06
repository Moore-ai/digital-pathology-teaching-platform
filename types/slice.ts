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

// 切片上传状态
export type SliceUploadStatus =
  | 'pending'      // 待上传
  | 'uploading'    // 上传中
  | 'paused'       // 已暂停
  | 'processing'   // 处理中
  | 'success'      // 成功
  | 'error';       // 失败

// 上传进度信息
export interface SliceUploadProgress {
  percent: number;
  uploadedBytes: number;
  totalBytes: number;
  speed?: number;           // MB/s
  remainingTime?: number;   // 秒
}

// SVS 元数据
export interface SVSMetadata {
  magnification: number;
  width: number;
  height: number;
  mpp?: number;             // Microns Per Pixel
  vendor?: string;
  scanner?: string;
  stainType?: string;
}

// 切片上传项
export interface SliceUploadItem {
  id: string;
  file: File;
  status: SliceUploadStatus;
  progress: SliceUploadProgress;

  // 元数据
  metadata?: SVSMetadata;
  title: string;
  description: string;
  category: CourseCategory;
  tags: string[];
  isPublic: boolean;
  allowDownload: boolean;

  // 结果
  sliceId?: string;
  thumbnailUrl?: string;
  error?: string;

  // 时间戳
  createdAt: Date;
}

// 切片上传表单数据
export interface SliceFormData {
  title: string;
  description: string;
  category: CourseCategory;
  magnification: number;
  tags: string[];
  isPublic: boolean;
  allowDownload: boolean;
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
  | 'text'       // 文字标注
  | 'measure';   // 测量标注

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
