import React, { useEffect, useRef, useState } from 'react';

//Libs
import Draggable from 'react-draggable';

//Components
import Panels from './components/panels/Panels';

//Icons
import { IoCrop } from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { RiText } from "react-icons/ri";
import { IoShapesOutline } from "react-icons/io5";
import { PiDiamondsFourLight } from "react-icons/pi";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdFlipToFront } from "react-icons/md";
import { IoIosColorFilter } from "react-icons/io";
import Moveable from "react-moveable";
import LayerToolsBar from './components/tools/LayerToolsBar';

const EditImage: React.FC = () => {
    //Images
    const [zoomLevel, setZoomLevel] = useState(1);
    const [activePanel, setActivePanel] = useState<"arrange" | "crop" | "adjust" | "filter" | "text" | null>(null);
    const [rotation, setRotation] = useState(0);
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

    //Texts
    const [texts, setTexts] = useState<TextItem[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const moveableRef = useRef<Moveable>(null);

    const [layers, setLayers] = useState<ImageLayer[]>([
        {
            id: crypto.randomUUID(),
            src: '',
            zoom: zoomLevel,
            opacity: opacity,
            flipH: flipHorizontal,
            flipV: flipVertical,
            x: 0,
            y: 0,
            rotation: rotation,
            brightness: brightness,
            contrast: contrast,
            saturation: saturation,
            hue: hue,
            sepia: sepia,
            backgroundColor: '#ffffff',
        }
    ]);

    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
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

    const handleRotationChange = (newRotation: number) => {
        setRotation(newRotation);
        if (selectedLayerId) updateSelectedLayer({ rotation: newRotation });
        setTimeout(() => {
            moveableRef.current?.updateRect();
        }, 0);
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

    return (
        <div className='flex p-4 w-full h-[calc(100vh-4rem)] overflow-hidden'>
            <div className='flex space-y-4 bg-mountain-100 border border-mountain-200 rounded-lg w-full h-full overflow-y-hidden'>
                <LayerToolsBar
                    layers={layers}
                    zoomLevel={zoomLevel}
                    selectedLayerId={selectedLayerId}
                    setLayers={setLayers}
                    setSelectedLayerId={setSelectedLayerId}
                    handleZoomIn={handleZoomIn}
                    handleZoomOut={handleZoomOut}
                    handleDownload={handleDownload}
                />
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
                            {layers.slice(1).map((layer) => (
                                <div key={layer.id}>
                                    <div
                                        ref={(el) => {
                                            layerRefs.current[layer.id] = el;
                                        }}
                                        style={{
                                            width: layer.width,
                                            height: layer.height,
                                            transform: `
                                                translate(${layer.x}px, ${layer.y}px)
                                                rotate(${layer.rotation}deg)
                                            `,
                                            transformOrigin: "center",
                                            position: "absolute",
                                            zIndex: layer.id,
                                            background: "transparent",
                                        }}
                                        onMouseDown={() => setSelectedLayerId(layer.id)}
                                    >
                                        <img
                                            src={layer.src}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                pointerEvents: 'none',
                                                filter: `
                                                saturate(${layer.saturation}%)
                                                hue-rotate(${layer.hue}deg)
                                                brightness(${layer.brightness}%)
                                                contrast(${layer.contrast}%)
                                                opacity(${layer.opacity})
                                                sepia(${layer.sepia}%)
                                            `,
                                                transform: `
                                                scaleX(${layer.flipH ? -1 : 1})
                                                scaleY(${layer.flipV ? -1 : 1})
                                            `,
                                                border: selectedLayerId ? '2px dashed #4f46e5' : 'none',
                                            }}
                                            draggable={false}
                                        />
                                    </div>
                                    {selectedLayerId === layer.id && (
                                        <Moveable
                                            ref={moveableRef}
                                            target={layerRefs.current[layer.id]}
                                            draggable
                                            resizable
                                            rotatable
                                            rotationPosition="top"
                                            throttleResize={1}
                                            renderDirections={["nw", "ne", "sw", "se"]}
                                            keepRatio={false}
                                            onDrag={({ beforeTranslate }) => {
                                                setLayers((prev) =>
                                                    prev.map((l) =>
                                                        l.id === layer.id
                                                            ? { ...l, x: beforeTranslate[0], y: beforeTranslate[1] }
                                                            : l
                                                    )
                                                );
                                            }}
                                            onResize={({ width, height, drag, target }) => {
                                                target.style.width = `${width}px`;
                                                target.style.height = `${height}px`;
                                                target.style.transform = drag.transform; // includes translation
                                            }}
                                            onResizeEnd={(e) => {
                                                const { lastEvent } = e;
                                                if (!lastEvent) return;

                                                const { width, height, drag } = lastEvent;

                                                setLayers((prev) =>
                                                    prev.map((l) =>
                                                        l.id === layer.id
                                                            ? {
                                                                ...l,
                                                                width,
                                                                height,
                                                                x: drag.beforeTranslate[0],
                                                                y: drag.beforeTranslate[1],
                                                            }
                                                            : l
                                                    )
                                                );
                                            }}
                                            onRotate={({ rotation }) => {
                                                setLayers((prev) =>
                                                    prev.map((l) =>
                                                        l.id === layer.id ? { ...l, rotation } : l
                                                    )
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
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
                    handleRotationChange={handleRotationChange}
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
                    <div
                        onClick={() =>
                            setActivePanel(prev => (prev === "crop" ? null : "crop"))
                        }
                        className='flex flex-col justify-center items-center space-y-1 hover:bg-mountain-50 rounded-lg w-full h-20 select-none'>
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