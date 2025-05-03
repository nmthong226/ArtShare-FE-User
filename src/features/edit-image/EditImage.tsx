import React, { useEffect, useRef, useState } from 'react';

//Libs
import Draggable from 'react-draggable';

//Components
import { Button } from '@mui/material';
import Panels from './components/panels/Panels';

//Icons
import { IoCrop } from "react-icons/io5";
import TuneIcon from '@mui/icons-material/Tune';
import { RiText } from "react-icons/ri";
import { IoShapesOutline } from "react-icons/io5";
import { PiDiamondsFourLight } from "react-icons/pi";
import { HiDotsHorizontal } from "react-icons/hi";
import { Plus } from 'lucide-react';
import { MdOutlineSaveAlt } from "react-icons/md";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { MdFlipToFront } from "react-icons/md";
import { IoIosColorFilter } from "react-icons/io";

//Assets
import previewImg from './assets/img_1.png';

const EditImage: React.FC = () => {
    //Images
    const [zoomLevel, setZoomLevel] = useState(1);
    const [activePanel, setActivePanel] = useState<"arrange" | "adjust" | "filter" | "text" | null>(null);
    const [opacity, setOpacity] = useState(1);
    const [flipHorizontal, setFlipHorizontal] = useState(false);
    const [flipVertical, setFlipVertical] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [hue, setHue] = useState(0);
    const [sepia, setSepia] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    //Texts
    const [texts, setTexts] = useState<TextItem[]>([]);
    // const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

    const [layers, setLayers] = useState<ImageLayer[]>([{
        id: crypto.randomUUID(),
        src: previewImg,
        zoom: zoomLevel,
        opacity: opacity,
        flipH: flipHorizontal,
        flipV: flipVertical,
        brightness: brightness,
        contrast: contrast,
        saturation: saturation,
        hue: hue,
        sepia: sepia,
    }]);

    useEffect(() => {
        const img = new Image();
        img.src = layers[0].src;
        img.onload = () => {
            setCanvasSize({ width: img.naturalWidth, height: img.naturalHeight });
        };
    }, [layers]);

    const [selectedLayerId, setSelectedLayerId] = useState<string>(layers[0].id);

    const updateSelectedLayer = (updates: Partial<ImageLayer>) => {
        setLayers(prev =>
            prev.map(layer =>
                layer.id === selectedLayerId ? { ...layer, ...updates } : layer
            )
        );
    };

    const handleDuplicate = (layerId: string) => {
        const layerToDuplicate = layers.find(l => l.id === layerId);
        if (!layerToDuplicate) return;

        const newLayer = {
            ...layerToDuplicate,
            id: crypto.randomUUID()
        };

        setLayers(prev => [...prev, newLayer]);
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => {
            const newZoom = Math.min(prev + 0.1, 3);
            if (selectedLayerId) updateSelectedLayer({ zoom: newZoom });
            return newZoom;
        });
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => {
            const newZoom = Math.max(prev - 0.1, 0.1);
            if (selectedLayerId) updateSelectedLayer({ zoom: newZoom });
            return newZoom;
        });
    };

    const handleOpacityChange = (newOpacity: number) => {
        setOpacity(newOpacity);
        if (selectedLayerId) updateSelectedLayer({ opacity: newOpacity });
    };

    const toggleFlipHorizontal = () => {
        setFlipHorizontal(prev => {
            const newFlip = !prev;
            if (selectedLayerId) updateSelectedLayer({ flipH: newFlip });
            return newFlip;
        });
    };

    const toggleFlipVertical = () => {
        setFlipVertical(prev => {
            const newFlip = !prev;
            if (selectedLayerId) updateSelectedLayer({ flipV: newFlip });
            return newFlip;
        });
    };

    const handleBrightness = (newBrightness: number) => {
        setBrightness(newBrightness);
        if (selectedLayerId) updateSelectedLayer({ brightness: newBrightness });
    };

    const handleContrast = (newContrast: number) => {
        setContrast(newContrast);
        if (selectedLayerId) updateSelectedLayer({ contrast: newContrast });
    };

    const handleSaturation = (newSaturation: number) => {
        setSaturation(newSaturation);
        if (selectedLayerId) updateSelectedLayer({ saturation: newSaturation });
    };

    const handleHue = (newHue: number) => {
        setHue(newHue);
        if (selectedLayerId) updateSelectedLayer({ hue: newHue });
    };

    const handleSepia = (newSepia: number) => {
        setSepia(newSepia);
        if (selectedLayerId) updateSelectedLayer({ sepia: newSepia });
    };

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [imageContainerSize, setImageContainerSize] = useState({ width: 540, height: 540 });

    useEffect(() => {
        if (imageContainerRef.current) {
            const { width, height } = imageContainerRef.current.getBoundingClientRect();
            setImageContainerSize({ width, height });
        }
    }, []);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault(); // Prevent browser zooming

                if (!selectedLayerId) return;

                setLayers(prevLayers =>
                    prevLayers.map(layer => {
                        if (layer.id !== selectedLayerId) return layer;

                        const newZoom = e.deltaY < 0
                            ? Math.min(layer.zoom + 0.1, 3)
                            : Math.max(layer.zoom - 0.1, 0.1);

                        // Sync UI zoomLevel if needed
                        setZoomLevel(newZoom);

                        return { ...layer, zoom: newZoom };
                    })
                );
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [selectedLayerId]);

    const renderTexts = (ctx: CanvasRenderingContext2D) => {
        const scaleFactor = canvasSize.width / imageContainerSize.width;
        texts.forEach(t => {
            ctx.save();
            ctx.font = `${t.fontSize * scaleFactor}px sans-serif`; // or use a custom font
            ctx.fillStyle = t.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(t.text, t.x * scaleFactor, t.y * scaleFactor);
            ctx.restore();
        });
    };

    const renderToCanvas = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        layers.forEach(layer => {
            const img = new Image();
            img.src = layer.src;

            img.onload = () => {
                ctx.save();

                // Move to center
                ctx.translate(canvas.width / 2, canvas.height / 2);

                // Apply zoom and flip
                const scaleX = layer.flipH ? -1 : 1;
                const scaleY = layer.flipV ? -1 : 1;
                ctx.scale(scaleX * layer.zoom, scaleY * layer.zoom);

                ctx.globalAlpha = layer.opacity;

                // Draw image centered
                ctx.drawImage(
                    img,
                    -img.naturalWidth / 2,
                    -img.naturalHeight / 2,
                    img.naturalWidth,
                    img.naturalHeight
                );

                ctx.restore();

                // ✅ Only render text after image is loaded
                renderTexts(ctx); // <-- move text drawing into a function
            };
        });
    };

    const handleDownload = () => {
        renderToCanvas();

        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const link = document.createElement("a");
            link.download = "edited-image.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        }, 300); // ensure all images finish drawing
    };

    const imageContainerRef = useRef<HTMLDivElement>(null);

    const addText = () => {
        const container = imageContainerRef.current;
        if (!container) return;

        const defaultFontSize = 20;
        const sampleText = "Double-click to edit";

        // Rough text width estimate (can be replaced with measureText logic)
        const textWidth = sampleText.length * (defaultFontSize * 0.4);
        const textHeight = defaultFontSize;

        const centerX = container.clientWidth / 2 - textWidth / 2;
        const centerY = container.clientHeight / 2 - textHeight / 2;

        setTexts((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                x: centerX,
                y: centerY,
                text: sampleText,
                fontSize: defaultFontSize,
                color: "#000",
            },
        ]);
    };


    return (
        <div className='flex p-4 w-full h-[calc(100vh-4rem)] overflow-hidden'>

            <div className='flex space-y-4 bg-mountain-100 border border-mountain-200 rounded-lg w-full h-full overflow-y-hidden'>
                <div className='z-50 relative flex h-full'>
                    <div className='flex flex-col justify-between bg-white border border-mountain-200 rounded-lg rounded-r-none w-28 h-full'>
                        <div className='flex flex-col space-y-2'>
                            <div className='flex justify-center items-center bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 h-10 font-medium text-mountain-800'>Layers</div>
                            <div className='flex justify-center items-center p-2 py-0 border-mountain-400 w-full h-10 hover:cursor-pointer'>
                                <div className='flex justify-center items-center border border-mountain-200 w-full h-full'>
                                    <Plus className='size-4' />
                                </div>
                            </div>
                            {layers.map((layer, index) => (
                                <div
                                    key={layer.id}
                                    ref={index === 0 ? containerRef : null}
                                    className={`flex justify-center items-center px-2 w-full h-20 hover:cursor-pointer`}
                                    onClick={() => setSelectedLayerId(layer.id)}
                                >
                                    <img
                                        src={layer.src}
                                        className={`rounded-sm w-full h-full object-cover border-2 ${selectedLayerId === layer.id ? 'border-indigo-400' : 'border-mountain-200'}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-col space-y-2 py-2 border-mountain-200 border-t-1'>
                            <div className='flex justify-center items-center p-2 py-0 border-mountain-400 w-full h-10 hover:cursor-pointer'>
                                <Button className='flex justify-center items-center bg-white hover:bg-mountain-50 border border-mountain-200 rounded-lg w-full h-full hover:cursor-pointer'>
                                    <p className='font-normal'>Close</p>
                                </Button>
                            </div>
                            <div onClick={handleDownload} className='flex justify-center items-center p-2 py-0 border-mountain-400 w-full h-10 hover:cursor-pointer'>
                                <Button className='flex justify-center items-center bg-indigo-200 hover:bg-indigo-100 border border-mountain-200 rounded-lg w-full h-full hover:cursor-pointer'>
                                    <MdOutlineSaveAlt className='mr-1' />
                                    <p className='font-normal'>Export</p>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='top-1/2 -right-14 absolute flex flex-col justify-between items-center space-y-1 bg-white opacity-50 hover:opacity-100 p-1 border border-mountain-200 rounded-xl w-12 h-48 -translate-y-1/2 duration-200 ease-in-out transform'>
                        <div onClick={handleZoomIn} className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-[25%] hover:cursor-pointer select-none'>
                            <LuZoomIn />
                        </div>
                        <div className='flex justify-center items-center bg-indigo-50 p-2 rounded-lg w-full h-[50%] font-medium text-mountain-600 text-sm'>
                            {Math.round(zoomLevel * 100)}%
                        </div>
                        <div onClick={handleZoomOut} className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-[25%] hover:cursor-pointer select-none'>
                            <LuZoomOut />
                        </div>
                    </div>
                </div>
                <div className="relative flex justify-center items-center bg-mountain-200 w-full h-full">
                    <div
                        ref={imageContainerRef}
                        className="relative mx-auto w-[540px] h-[540px] overflow-hidden"
                        style={{ transform: `scale(${zoomLevel})` }}
                    >
                        {layers.map(layer => (
                            <img
                                key={layer.id}
                                src={layer.src}
                                style={{
                                    filter: `
                                    saturate(${layer?.saturation ?? 100}%)
                                    hue-rotate(${layer?.hue ?? 0}deg)
                                    brightness(${layer?.brightness ?? 100}%)
                                    contrast(${layer?.contrast ?? 100}%)
                                    opacity(${layer?.opacity ?? 1})
                                    sepia(${layer?.sepia ?? 0}%)`,
                                    transform: `
                                    scaleX(${layer.flipH ? -1 : 1})
                                    scaleY(${layer.flipV ? -1 : 1})`,
                                    transformOrigin: 'center center',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: 'auto',
                                    height: '100%',
                                    pointerEvents: 'none',
                                    translate: '-50% -50%',
                                }}
                            />
                        ))}
                        {texts.map((t) => (
                            <Draggable
                                key={t.id}
                                position={{ x: t.x, y: t.y }}
                                onStop={(_, data) => {
                                    setTexts((prev) =>
                                        prev.map((item) =>
                                            item.id === t.id ? { ...item, x: data.x, y: data.y } : item
                                        )
                                    );
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        fontSize: t.fontSize,
                                        color: t.color,
                                        userSelect: 'none',
                                        cursor: 'move',
                                    }}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onDoubleClick={(e) => e.currentTarget.focus()}
                                    onBlur={(e) => {
                                        const newText = e.currentTarget.textContent || '';
                                        setTexts((prev) =>
                                            prev.map((item) =>
                                                item.id === t.id ? { ...item, text: newText } : item
                                            )
                                        );
                                    }}
                                >
                                    {t.text}
                                </div>
                            </Draggable>
                        ))}
                    </div>
                </div>
                {/* Settings Panel */}
                <Panels
                    activePanel={activePanel!}
                    selectedLayerId={selectedLayerId}
                    layers={layers}
                    handleOpacityChange={handleOpacityChange}
                    toggleFlipHorizontal={toggleFlipHorizontal}
                    toggleFlipVertical={toggleFlipVertical}
                    handleDuplicate={handleDuplicate}
                    updateSelectedLayer={updateSelectedLayer}
                    setActivePanel={setActivePanel}
                    handleSaturation={handleSaturation}
                    handleBrightness={handleBrightness}
                    handleContrast={handleContrast}
                    handleHue={handleHue}
                    handleSepia={handleSepia}
                    /* Add text*/
                    addText={addText}
                />
                {/* Tools Bar */}
                <div className='z-50 relative flex flex-col flex-none justify-between space-y-2 bg-white border border-mountain-200 rounded-lg rounded-l-none w-20 h-full'>
                    <div
                        onClick={() =>
                            setActivePanel(prev => (prev === "arrange" ? null : "arrange"))
                        }
                        className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <MdFlipToFront className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>Arrange</p>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <IoCrop className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>Crop</p>
                    </div>
                    <div
                        onClick={() =>
                            setActivePanel(prev => (prev === "adjust" ? null : "adjust"))
                        }
                        className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <TuneIcon className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>Adjust</p>
                    </div>
                    <div
                        onClick={() =>
                            setActivePanel(prev => (prev === "filter" ? null : "filter"))
                        }
                        className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <IoIosColorFilter className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>Filter</p>
                    </div>
                    <div
                        onClick={() =>
                            setActivePanel(prev => (prev === "text" ? null : "text"))
                        }
                        className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <RiText className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>Text</p>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <IoShapesOutline className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>Shape</p>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <PiDiamondsFourLight className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>Element</p>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
                        <HiDotsHorizontal className='size-6 text-mountain-600' />
                        <p className='text-mountain-600 text-xs'>More</p>
                    </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default EditImage