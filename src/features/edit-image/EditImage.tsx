import React, { useEffect, useRef, useState } from 'react';

//Libs
import Draggable from 'react-draggable';
import { ChromePicker } from 'react-color';

//Components
import { Button, Tooltip } from '@mui/material';
import Panels from './components/panels/Panels';

//Icons
import { IoCrop } from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { RiText } from "react-icons/ri";
import { IoShapesOutline } from "react-icons/io5";
import { PiDiamondsFourLight } from "react-icons/pi";
import { HiDotsHorizontal } from "react-icons/hi";
import { Plus } from 'lucide-react';
import { MdOutlineSaveAlt } from "react-icons/md";
import { MdFlipToFront } from "react-icons/md";
import { IoIosColorFilter } from "react-icons/io";
import { Rnd } from "react-rnd";
import ZoomTool from './components/tools/Zoom';

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
    const [canvasSize, setCanvasSize] = useState({ width: 540, height: 540 });
    const [openColorSettings, setOpenColorSettings] = useState(false);

    //Texts
    const [texts, setTexts] = useState<TextItem[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    const [layers, setLayers] = useState<ImageLayer[]>([
        {
            id: crypto.randomUUID(),
            src: '',
            zoom: zoomLevel,
            opacity: opacity,
            flipH: flipHorizontal,
            flipV: flipVertical,
            brightness: brightness,
            contrast: contrast,
            saturation: saturation,
            hue: hue,
            sepia: sepia,
            backgroundColor: '#ffffff',
        }
    ]);

    const [selectedLayerId, setSelectedLayerId] = useState<string | null>();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [imageContainerSize, setImageContainerSize] = useState({ width: 540, height: 540 });

    useEffect(() => {
        const imageLayer = layers.find((l) => l.src);
        if (!imageLayer) return;

        const img = new Image();
        img.src = imageLayer.src;
        img.onload = () => {
            const targetHeight = 540;
            const scale = targetHeight / img.naturalHeight;
            const scaledWidth = img.naturalWidth * scale;

            setCanvasSize({
                width: scaledWidth,
                height: targetHeight,
            });
        };
    }, [layers]);


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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                textContainerRef.current &&
                !textContainerRef.current.contains(event.target as Node)
            ) {
                setSelectedTextId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageSrc = reader.result as string;

            const img = new Image();
            img.onload = () => {
                const maxWidth = 540;
                const maxHeight = 540;

                let width = img.width;
                let height = img.height;

                const widthRatio = maxWidth / width;
                const heightRatio = maxHeight / height;
                const scale = Math.min(widthRatio, heightRatio);

                const scaledWidth = width * scale;
                const scaledHeight = height * scale;

                setLayers(prev => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        type: 'image',
                        zoom: zoomLevel,
                        src: imageSrc,
                        x: (maxWidth - scaledWidth) / 2,
                        y: (maxHeight - scaledHeight) / 2,
                        width: scaledWidth,
                        height: scaledHeight,
                        opacity: 1,
                        flipH: false,
                        flipV: false,
                        brightness: 100,
                        contrast: 100,
                        saturation: 100,
                        hue: 0,
                        sepia: 0,
                    },
                ]);
            };

            img.src = imageSrc;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className='flex p-4 w-full h-[calc(100vh-4rem)] overflow-hidden'>
            <div className='flex space-y-4 bg-mountain-100 border border-mountain-200 rounded-lg w-full h-full overflow-y-hidden'>
                <div className='z-50 relative flex h-full'>
                    <div className='flex flex-col justify-between bg-white border border-mountain-200 rounded-lg rounded-r-none w-28 h-full'>
                        <div className='flex flex-col space-y-2'>
                            {/* Layers Header */}
                            <div className='flex justify-center items-center bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 h-10 font-medium text-mountain-800'>
                                Layers
                            </div>
                            <Tooltip title="Add Layer" arrow placement='right'>
                                <div
                                    className="flex justify-center items-center p-2 py-0 border-mountain-400 w-full h-10 hover:cursor-pointer"
                                    onClick={() => document.getElementById('image-upload')?.click()}>
                                    <div className="flex justify-center items-center border border-mountain-200 w-full h-full">
                                        <Plus className="size-4" />
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </Tooltip>
                            {[...layers]
                                .slice(1)
                                .reverse()
                                .map((layer) => (
                                    <div
                                        key={layer.id}
                                        className='flex justify-center items-center px-2 rounded-sm w-full h-20 hover:cursor-pointer'
                                        onClick={() => setSelectedLayerId(layer.id)}>
                                        <img
                                            src={layer.src}
                                            className={`rounded-sm w-full h-full object-cover border-1 ${selectedLayerId === layer.id ? 'border-indigo-400' : 'border-mountain-200'}`} />
                                    </div>
                                ))}
                            <Tooltip title="Background" arrow placement='right'>
                                <div
                                    ref={containerRef}
                                    onClick={() => {
                                        setSelectedLayerId(layers[0].id);
                                        setOpenColorSettings(!openColorSettings);
                                    }}
                                    className='flex px-2'>
                                    <div
                                        className={`flex justify-center items-center border-2 w-full h-12 text-mountain-600 text-sm italic hover:cursor-pointer ${selectedLayerId === layers[0].id ? 'border-indigo-400' : 'border-mountain-200'}`}
                                        style={{ backgroundColor: layers[0].backgroundColor }}
                                    />
                                </div>
                            </Tooltip>
                            {openColorSettings && selectedLayerId === layers[0].id && (
                                <Draggable handle=".drag-handle">
                                    <div className="z-50 absolute bg-white shadow-md border rounded">
                                        <div className="bg-indigo-100 px-3 py-1 rounded-t font-semibold text-indigo-700 text-sm cursor-move drag-handle">
                                            🎨 Background Color
                                        </div>
                                        <ChromePicker
                                            color={layers[0].backgroundColor}
                                            onChangeComplete={(color) => {
                                                const updated = [...layers];
                                                updated[0].backgroundColor = color.hex;
                                                setLayers(updated);
                                            }}
                                        />
                                    </div>
                                </Draggable>
                            )}
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
                    <ZoomTool zoomLevel={zoomLevel} handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
                </div>
                <div className="relative flex justify-center items-center bg-mountain-200 w-full h-full">
                    <div
                        ref={imageContainerRef}
                        className="relative mx-auto w-[540px] h-[540px] overflow-hidden"
                        style={{
                            transform: `scale(${zoomLevel})`,
                            backgroundColor: layers[0].backgroundColor,
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                width: `${canvasSize.width}px`,
                                height: `${canvasSize.height}px`,
                                overflow: 'hidden',
                                transformOrigin: 'top left',
                                border: '1px solid #ccc',
                            }}
                        >
                            {layers && layers.length > 0 && layers.slice(1).map((layer) => {
                                const isSelected = selectedLayerId === layer.id;
                                return (
                                    <Rnd
                                        key={layer.id}
                                        size={{ width: layer.width!, height: layer.height! }}
                                        position={{ x: layer.x!, y: layer.y! }}
                                        onDragStart={() => setSelectedLayerId(layer.id)}
                                        onDragStop={(_, d) => {
                                            setLayers((prev) =>
                                                prev.map((l) =>
                                                    l.id === layer.id ? { ...l, x: d.x, y: d.y } : l
                                                )
                                            );
                                        }}
                                        onResizeStop={(_, __, ref, _delta, position) => {
                                            setLayers((prev) =>
                                                prev.map((l) =>
                                                    l.id === layer.id
                                                        ? {
                                                            ...l,
                                                            width: parseInt(ref.style.width, 10),
                                                            height: parseInt(ref.style.height, 10),
                                                            ...position,
                                                        }
                                                        : l
                                                )
                                            );
                                        }}
                                        style={{
                                            zIndex: layer.id,
                                            border: isSelected ? '2px dashed #4f46e5' : 'none',
                                            background: 'transparent',
                                        }}
                                    >
                                        <img
                                            src={layer.src}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                pointerEvents: 'none',
                                                filter:
                                                    `
                                                    saturate(${layer.saturation}%)
                                                    hue-rotate(${layer.hue}deg)
                                                    brightness(${layer.brightness}%)
                                                    contrast(${layer.contrast}%)
                                                    opacity(${layer.opacity})
                                                    sepia(${layer.sepia}%)
                                                    `,
                                                transform:
                                                    `
                                                        scaleX(${layer.flipH ? -1 : 1})
                                                        scaleY(${layer.flipV ? -1 : 1})
                                                    `,
                                            }}
                                            draggable={false}
                                        />
                                    </Rnd>
                                );
                            })}
                        </div>
                        <div ref={textContainerRef}>
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
                                    onMouseDown={() => setSelectedTextId(t.id)}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            fontSize: t.fontSize,
                                            color: t.color,
                                            userSelect: 'none',
                                            cursor: 'move',
                                            border: selectedTextId ? '2px dashed #fff' : 'transparent',
                                            boxSizing: 'border-box',
                                        }}
                                        className='p-4 outline-0 tras'
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
                </div>
                {/* Settings Panel */}
                <Panels
                    activePanel={activePanel!}
                    selectedLayerId={selectedLayerId!}
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
                        <HiOutlineAdjustmentsHorizontal className='size-6 text-mountain-600' />
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