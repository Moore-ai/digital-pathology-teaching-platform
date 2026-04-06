import { create } from 'zustand';
import {
  SliceUploadItem,
  SliceUploadStatus,
  SliceUploadProgress,
  SliceFormData,
  SVSMetadata
} from '@/types/slice';
import { CourseCategory } from '@/types/course';

// 生成唯一ID
function generateId(): string {
  return `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// 模拟从SVS文件提取元数据
function extractSVSMetadata(file: File): Promise<SVSMetadata> {
  return new Promise((resolve) => {
    // 实际项目中需要解析SVS文件头
    // 这里模拟返回
    setTimeout(() => {
      resolve({
        magnification: [10, 20, 40, 60][Math.floor(Math.random() * 4)],
        width: 30000 + Math.floor(Math.random() * 30000),
        height: 25000 + Math.floor(Math.random() * 25000),
        mpp: 0.25 + Math.random() * 0.25,
        vendor: 'Hamamatsu',
        stainType: 'H&E',
      });
    }, 500);
  });
}

interface SliceUploadState {
  // 上传队列
  queue: SliceUploadItem[];

  // Actions
  addToQueue: (files: File[]) => Promise<void>;
  removeFromQueue: (id: string) => void;
  updateItem: (id: string, updates: Partial<SliceUploadItem>) => void;
  updateProgress: (id: string, progress: SliceUploadProgress) => void;
  updateStatus: (id: string, status: SliceUploadStatus) => void;
  updateFormData: (id: string, data: Partial<SliceFormData>) => void;

  // 上传操作
  startUpload: (id: string) => void;
  pauseUpload: (id: string) => void;
  resumeUpload: (id: string) => void;
  retryUpload: (id: string) => void;
  cancelUpload: (id: string) => void;

  // 批量操作
  uploadAll: () => void;
  pauseAll: () => void;
  clearCompleted: () => void;
  clearAll: () => void;

  // 查询
  getItem: (id: string) => SliceUploadItem | undefined;
  getPendingCount: () => number;
  getUploadingCount: () => number;
}

// 模拟上传进度
const simulateUpload = (
  itemId: string,
  updateProgress: (id: string, progress: SliceUploadProgress) => void,
  updateStatus: (id: string, status: SliceUploadStatus) => void,
  updateItem: (id: string, updates: Partial<SliceUploadItem>) => void,
  onComplete: () => void
) => {
  let progress = 0;
  const totalBytes = 1024 * 1024 * 1024 * 3; // 模拟3GB文件

  const interval = setInterval(() => {
    const increment = Math.random() * 5 + 2;
    progress = Math.min(progress + increment, 100);

    const uploadedBytes = (progress / 100) * totalBytes;
    const speed = 5 + Math.random() * 10; // 5-15 MB/s
    const remainingTime = ((100 - progress) / increment) * 0.2; // 秒

    updateProgress(itemId, {
      percent: Math.round(progress),
      uploadedBytes,
      totalBytes,
      speed,
      remainingTime: Math.round(remainingTime),
    });

    if (progress >= 100) {
      clearInterval(interval);
      updateStatus(itemId, 'processing');

      // 模拟处理
      setTimeout(() => {
        updateItem(itemId, {
          status: 'success',
          sliceId: `slice-${Date.now()}`,
          thumbnailUrl: `/thumbnails/mock-${Math.floor(Math.random() * 5) + 1}.jpg`,
        });
        onComplete();
      }, 2000);
    }
  }, 200);

  return interval;
};

export const useSliceUploadStore = create<SliceUploadState>((set, get) => ({
  queue: [],

  addToQueue: async (files: File[]) => {
    const newItems: SliceUploadItem[] = [];

    for (const file of files) {
      // 验证文件格式
      if (!file.name.toLowerCase().endsWith('.svs')) {
        continue;
      }

      // 提取元数据
      const metadata = await extractSVSMetadata(file);

      newItems.push({
        id: generateId(),
        file,
        status: 'pending',
        progress: {
          percent: 0,
          uploadedBytes: 0,
          totalBytes: file.size,
        },
        metadata,
        title: file.name.replace(/\.svs$/i, ''),
        description: '',
        category: 'other',
        tags: [],
        isPublic: true,
        allowDownload: false,
        createdAt: new Date(),
      });
    }

    set((state) => ({
      queue: [...state.queue, ...newItems],
    }));
  },

  removeFromQueue: (id: string) => {
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
    }));
  },

  updateItem: (id: string, updates: Partial<SliceUploadItem>) => {
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  updateProgress: (id: string, progress: SliceUploadProgress) => {
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, progress } : item
      ),
    }));
  },

  updateStatus: (id: string, status: SliceUploadStatus) => {
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    }));
  },

  updateFormData: (id: string, data: Partial<SliceFormData>) => {
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
  },

  startUpload: (id: string) => {
    const { updateStatus, updateProgress, updateItem, queue } = get();
    const item = queue.find((i) => i.id === id);

    if (!item || item.status !== 'pending') return;

    updateStatus(id, 'uploading');

    // 存储interval引用以便暂停
    const interval = simulateUpload(
      id,
      updateProgress,
      updateStatus,
      updateItem,
      () => {}
    );

    // 将interval存储在window上以便暂停
    (window as unknown as Record<string, unknown>)[`upload_${id}`] = interval;
  },

  pauseUpload: (id: string) => {
    const interval = (window as unknown as Record<string, unknown>)[`upload_${id}`];
    if (interval) {
      clearInterval(interval as number);
      delete (window as unknown as Record<string, unknown>)[`upload_${id}`];
    }
    get().updateStatus(id, 'paused');
  },

  resumeUpload: (id: string) => {
    const { updateStatus, updateProgress, updateItem, queue } = get();
    const item = queue.find((i) => i.id === id);

    if (!item || item.status !== 'paused') return;

    updateStatus(id, 'uploading');

    const interval = simulateUpload(
      id,
      updateProgress,
      updateStatus,
      updateItem,
      () => {}
    );

    (window as unknown as Record<string, unknown>)[`upload_${id}`] = interval;
  },

  retryUpload: (id: string) => {
    const { updateStatus, updateProgress, updateItem, queue } = get();
    const item = queue.find((i) => i.id === id);

    if (!item || item.status !== 'error') return;

    updateStatus(id, 'uploading');
    updateProgress(id, { percent: 0, uploadedBytes: 0, totalBytes: item.file.size });

    const interval = simulateUpload(
      id,
      updateProgress,
      updateStatus,
      updateItem,
      () => {}
    );

    (window as unknown as Record<string, unknown>)[`upload_${id}`] = interval;
  },

  cancelUpload: (id: string) => {
    const interval = (window as unknown as Record<string, unknown>)[`upload_${id}`];
    if (interval) {
      clearInterval(interval as number);
      delete (window as unknown as Record<string, unknown>)[`upload_${id}`];
    }
    get().updateStatus(id, 'pending');
    get().updateProgress(id, { percent: 0, uploadedBytes: 0, totalBytes: 0 });
  },

  uploadAll: () => {
    const { queue, startUpload } = get();
    const pendingItems = queue.filter((item) => item.status === 'pending');

    // 最多同时上传3个
    pendingItems.slice(0, 3).forEach((item) => {
      startUpload(item.id);
    });
  },

  pauseAll: () => {
    const { queue, pauseUpload } = get();
    queue
      .filter((item) => item.status === 'uploading')
      .forEach((item) => pauseUpload(item.id));
  },

  clearCompleted: () => {
    set((state) => ({
      queue: state.queue.filter(
        (item) => item.status !== 'success' && item.status !== 'error'
      ),
    }));
  },

  clearAll: () => {
    // 清理所有interval
    const { queue } = get();
    queue.forEach((item) => {
      const interval = (window as unknown as Record<string, unknown>)[`upload_${item.id}`];
      if (interval) {
        clearInterval(interval as number);
      }
    });
    set({ queue: [] });
  },

  getItem: (id: string) => {
    return get().queue.find((item) => item.id === id);
  },

  getPendingCount: () => {
    return get().queue.filter((item) => item.status === 'pending').length;
  },

  getUploadingCount: () => {
    return get().queue.filter(
      (item) => item.status === 'uploading' || item.status === 'processing'
    ).length;
  },
}));
