import { useEffect, useRef } from "react";
import useEditorStore from "./utils/editorStore";
import { FiTrash2 } from "react-icons/fi";

interface WorkspaceProps {
    previewImg: string
}

const Workspace: React.FC<WorkspaceProps> = ({ previewImg }) => {
    const {
        setSelectedLayer,
        textOptions,
        setTextOptions,
        canvasOptions,
        setCanvasOptions,
    } = useEditorStore();

    const imageRef = useRef<HTMLImageElement | null>(null);
    const itemRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

useEffect(() => {
        const img = imageRef.current;
        if (img && canvasOptions.height === 0) {
            img.onload = () => {
                const canvasHeight = (375 * img.naturalHeight) / img.naturalWidth;
                setCanvasOptions({
                    ...canvasOptions,
                    height: canvasHeight,
                    orientation: canvasHeight > 375 ? "portrait" : "landscape",
                });
            };
        }
    }, [previewImg, canvasOptions, setCanvasOptions]);

    const handleMouseMove = (e: any) => {
        if (!dragging.current) return;
        setTextOptions({
            ...textOptions,
            left: e.clientX - offset.current.x,
            top: e.clientY - offset.current.y,
        });
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

    const handleMouseLeave = () => {
        dragging.current = false;
    };

    const handleMouseDown = (e: { clientX: number; clientY: number; }) => {
        setSelectedLayer("text");
        dragging.current = true;
        offset.current = {
            x: e.clientX - textOptions.left,
            y: e.clientY - textOptions.top,
        };
    };

    return (
        <div className="workspace">
            <div
                className="canvas"
                style={{
                    height: canvasOptions.height,
                    backgroundColor: canvasOptions.backgroundColor,
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                ref={containerRef}
            >
                <img src={previewImg} alt="" />
                {textOptions.text && (
                    <div
                        className="text"
                        style={{
                            left: textOptions.left,
                            top: textOptions.top,
                            fontSize: `${textOptions.fontSize}px`,
                        }}
                        ref={itemRef}
                        onMouseDown={handleMouseDown}
                    >
                        <input
                            type="text"
                            value={textOptions.text}
                            onChange={(e) =>
                                setTextOptions({ ...textOptions, text: e.target.value })
                            }
                            style={{
                                color: textOptions.color,
                            }}
                        />
                        <div
                            className="deleteTextButton"
                            onClick={() => setTextOptions({ ...textOptions, text: "" })}
                        >
                            <FiTrash2 />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Workspace;