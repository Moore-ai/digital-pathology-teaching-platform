import { create } from 'zustand';
import { Slice, Annotation, ToolType, Point, Measurement } from '@/types/slice';

interface SliceState {
  currentSlice: Slice | null;
  annotations: Annotation[];
  currentTool: ToolType;
  zoom: number;
  position: Point;
  magnification: number;
  isDrawing: boolean;
  selectedAnnotationId: string | null;

  // 绘制状态
  currentPath: Point[];
  measureStart: Point | null;
  measurements: Measurement[];

  // 历史记录（用于撤销/重做）
  history: Annotation[][];
  historyIndex: number;

  // Actions
  setCurrentSlice: (slice: Slice) => void;
  setTool: (tool: ToolType) => void;
  setZoom: (zoom: number) => void;
  setPosition: (position: Point) => void;
  setMagnification: (mag: number) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setCurrentPath: (path: Point[]) => void;
  setMeasureStart: (point: Point | null) => void;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;
  clearAnnotations: () => void;
  undoAnnotation: () => void;
  redoAnnotation: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addMeasurement: (measurement: Measurement) => void;
  clearMeasurements: () => void;
}

export const useSliceStore = create<SliceState>((set, get) => ({
  currentSlice: null,
  annotations: [],
  currentTool: 'pan',
  zoom: 1,
  position: { x: 0, y: 0 },
  magnification: 1,
  isDrawing: false,
  selectedAnnotationId: null,
  currentPath: [],
  measureStart: null,
  measurements: [],
  history: [[]],
  historyIndex: 0,

  setCurrentSlice: (slice) => set({
    currentSlice: slice,
    annotations: slice.annotations || [],
    zoom: 1,
    position: { x: 0, y: 0 },
    magnification: 1,
    history: [slice.annotations || []],
    historyIndex: 0,
  }),

  setTool: (tool) => set({ currentTool: tool, currentPath: [], measureStart: null }),

  setZoom: (zoom) => set({ zoom }),

  setPosition: (position) => set({ position }),

  setMagnification: (magnification) => set({ magnification }),

  setIsDrawing: (isDrawing) => set({ isDrawing }),

  setCurrentPath: (path) => set({ currentPath: path }),

  setMeasureStart: (point) => set({ measureStart: point }),

  addAnnotation: (annotation) => {
    const state = get()
    const newAnnotations = [...state.annotations, annotation]
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newAnnotations)

    set({
      annotations: newAnnotations,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      currentPath: [],
    })
  },

  updateAnnotation: (id, updates) => set((state) => ({
    annotations: state.annotations.map(a =>
      a.id === id ? { ...a, ...updates } : a
    ),
  })),

  removeAnnotation: (id) => {
    const state = get()
    const newAnnotations = state.annotations.filter(a => a.id !== id)
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newAnnotations)

    set({
      annotations: newAnnotations,
      selectedAnnotationId: state.selectedAnnotationId === id ? null : state.selectedAnnotationId,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),

  clearAnnotations: () => {
    const state = get()
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push([])

    set({
      annotations: [],
      selectedAnnotationId: null,
      currentPath: [],
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  undoAnnotation: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      set({
        annotations: state.history[newIndex],
        historyIndex: newIndex,
      })
    }
  },

  redoAnnotation: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      set({
        annotations: state.history[newIndex],
        historyIndex: newIndex,
      })
    }
  },

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  addMeasurement: (measurement) => set((state) => ({
    measurements: [...state.measurements, measurement],
  })),

  clearMeasurements: () => set({ measurements: [] }),
}));
