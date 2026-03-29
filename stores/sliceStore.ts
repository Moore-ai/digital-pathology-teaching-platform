import { create } from 'zustand';
import { Slice, Annotation, ToolType, Point } from '@/types/slice';

interface SliceState {
  currentSlice: Slice | null;
  annotations: Annotation[];
  currentTool: ToolType;
  zoom: number;
  position: Point;
  magnification: number;
  isDrawing: boolean;
  selectedAnnotationId: string | null;

  // Actions
  setCurrentSlice: (slice: Slice) => void;
  setTool: (tool: ToolType) => void;
  setZoom: (zoom: number) => void;
  setPosition: (position: Point) => void;
  setMagnification: (mag: number) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;
  clearAnnotations: () => void;
  undoAnnotation: () => void;
}

export const useSliceStore = create<SliceState>((set) => ({
  currentSlice: null,
  annotations: [],
  currentTool: 'pan',
  zoom: 1,
  position: { x: 0, y: 0 },
  magnification: 1,
  isDrawing: false,
  selectedAnnotationId: null,

  setCurrentSlice: (slice) => set({
    currentSlice: slice,
    annotations: slice.annotations || [],
    zoom: 1,
    position: { x: 0, y: 0 },
    magnification: 1,
  }),

  setTool: (tool) => set({ currentTool: tool }),

  setZoom: (zoom) => set({ zoom }),

  setPosition: (position) => set({ position }),

  setMagnification: (magnification) => set({ magnification }),

  setIsDrawing: (isDrawing) => set({ isDrawing }),

  addAnnotation: (annotation) => set((state) => ({
    annotations: [...state.annotations, annotation],
  })),

  updateAnnotation: (id, updates) => set((state) => ({
    annotations: state.annotations.map(a =>
      a.id === id ? { ...a, ...updates } : a
    ),
  })),

  removeAnnotation: (id) => set((state) => ({
    annotations: state.annotations.filter(a => a.id !== id),
    selectedAnnotationId: state.selectedAnnotationId === id ? null : state.selectedAnnotationId,
  })),

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),

  clearAnnotations: () => set({ annotations: [], selectedAnnotationId: null }),

  undoAnnotation: () => set((state) => ({
    annotations: state.annotations.slice(0, -1),
  })),
}));
