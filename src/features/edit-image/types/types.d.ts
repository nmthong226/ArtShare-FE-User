type ImageLayer = {
    id: string;
    src: string;
    zoom: number;
    opacity: number;
    flipH: boolean;
    flipV: boolean;
    width?: number;
    height?: number;
    zoom?: number;
    x?: number;
    y?: number;
    rotation: number;
    saturation: number;
    hue: number;
    brightness: number;
    contrast: number;
    sepia: number;
    backgroundColor?: string;
};

type TextItem = {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
};