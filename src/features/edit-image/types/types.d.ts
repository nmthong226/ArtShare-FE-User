type ImageLayer = {
    id: string;
    src: string;
    zoom: number;
    opacity: number;
    flipH: boolean;
    flipV: boolean;
    saturation: number;
    hue: number;
    brightness: number;
    contrast: number;
    sepia: number;
    //More
};

type TextItem = {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
};