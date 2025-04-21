import { create } from "zustand";

// 1. Define types
interface TextOptions {
    text: string;
    fontSize: number;
    color: string;
    top: number;
    left: number;
}

interface CanvasOptions {
    height: number;
    orientation: string;
    size: string;
    backgroundColor: string;
}

interface EditorStore {
    selectedLayer: string;
    textOptions: TextOptions;
    canvasOptions: CanvasOptions;

    setSelectedLayer: (newLayer: string) => void;
    setTextOptions: (newOptions: TextOptions) => void;
    addText: () => void;
    setCanvasOptions: (newOptions: CanvasOptions) => void;
    resetStore: () => void;
}

// 2. Create store with proper types
const useEditorStore = create<EditorStore>((set) => ({
    selectedLayer: "canvas",
    textOptions: {
        text: "",
        fontSize: 48,
        color: "#000000",
        top: 48,
        left: 0,
    },
    canvasOptions: {
        height: 0,
        orientation: "",
        size: "original",
        backgroundColor: "#008080",
    },
    setSelectedLayer: (newLayer) => set({ selectedLayer: newLayer }),
    setTextOptions: (newOptions) => set({ textOptions: newOptions }),
    addText: () =>
        set({
            textOptions: {
                text: "Add text",
                fontSize: 48,
                color: "#000000",
                top: 48,
                left: 0,
            },
        }),
    setCanvasOptions: (newOptions) => set({ canvasOptions: newOptions }),
    resetStore: () =>
        set({
            selectedLayer: "canvas",
            textOptions: {
                text: "",
                fontSize: 48,
                color: "#000000",
                top: 48,
                left: 0,
            },
            canvasOptions: {
                height: 0,
                orientation: "",
                size: "original",
                backgroundColor: "#008080",
            },
        }),
}));

export default useEditorStore;
