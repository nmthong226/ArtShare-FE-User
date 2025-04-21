import { useState } from "react";
import useEditorStore from "./utils/editorStore";
import { HexColorPicker } from "react-colorful";

interface AspectRatioSize {
  name: string;
  width: number;
  height: number;
}

interface PreviewImg {
  width: number;
  height: number;
}

interface OptionsProps {
  previewImg: PreviewImg;
}

const portraitSizes: AspectRatioSize[] = [
  { name: "1:2", width: 1, height: 2 },
  { name: "9:16", width: 9, height: 16 },
  { name: "2:3", width: 2, height: 3 },
  { name: "3:4", width: 3, height: 4 },
  { name: "4:5", width: 4, height: 5 },
  { name: "1:1", width: 1, height: 1 },
];

const landscapeSizes: AspectRatioSize[] = [
  { name: "2:1", width: 2, height: 1 },
  { name: "16:9", width: 16, height: 9 },
  { name: "3:2", width: 3, height: 2 },
  { name: "4:3", width: 4, height: 3 },
  { name: "5:4", width: 5, height: 4 },
  { name: "1:1", width: 1, height: 1 },
];

const Options: React.FC<OptionsProps> = ({ previewImg }) => {
  const {
    selectedLayer,
    textOptions,
    setTextOptions,
    canvasOptions,
    setCanvasOptions,
  } = useEditorStore();

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const originalOrientation =
    previewImg.width < previewImg.height ? "portrait" : "landscape";

  const handleOrientationClick = (orientation: "portrait" | "landscape") => {
    const sameOrientation = originalOrientation === orientation;
    const newHeight = sameOrientation
      ? (375 * previewImg.height) / previewImg.width
      : (375 * previewImg.width) / previewImg.height;

    setCanvasOptions({
      ...canvasOptions,
      orientation,
      size: "original",
      height: newHeight,
    });
  };

  const handleSizeClick = (size: AspectRatioSize | "original") => {
    let newHeight: number;

    if (size === "original") {
      const sameOrientation = originalOrientation === canvasOptions.orientation;
      newHeight = sameOrientation
        ? (375 * previewImg.height) / previewImg.width
        : (375 * previewImg.width) / previewImg.height;

      setCanvasOptions({
        ...canvasOptions,
        size: "original",
        height: newHeight,
      });
    } else {
      newHeight = (375 * size.height) / size.width;

      setCanvasOptions({
        ...canvasOptions,
        size: size.name,
        height: newHeight,
      });
    }
  };

  return (
    <div className="options">
      {selectedLayer === "text" ? (
        <>
          <div className="editingOption">
            <span>Font Size</span>
            <input
              type="number"
              value={textOptions.fontSize}
              onChange={(e) =>
                setTextOptions({
                  ...textOptions,
                  fontSize: parseInt(e.target.value, 10),
                })
              }
            />
          </div>

          <div className="editingOption">
            <span>Color</span>
            <div className="textColor">
              <div
                className="colorPreview"
                style={{ backgroundColor: textOptions.color }}
                onClick={() => setIsColorPickerOpen((prev) => !prev)}
              />
              {isColorPickerOpen && (
                <div className="colorPicker">
                  <HexColorPicker
                    color={textOptions.color}
                    onChange={(color) =>
                      setTextOptions({ ...textOptions, color })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="editingOption">
            <span>Orientation</span>
            <div className="orientations">
              {["portrait", "landscape"].map((orientation) => (
                <div
                  key={orientation}
                  className={`orientation ${
                    canvasOptions.orientation === orientation ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleOrientationClick(orientation as "portrait" | "landscape")
                  }
                >
                  {orientation[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div className="editingOption">
            <span>Size</span>
            <div className="sizes">
              <div
                className={`size ${
                  canvasOptions.size === "original" ? "selected" : ""
                }`}
                onClick={() => handleSizeClick("original")}
              >
                Original
              </div>
              {(canvasOptions.orientation === "portrait"
                ? portraitSizes
                : landscapeSizes
              ).map((size) => (
                <div
                  key={size.name}
                  className={`size ${
                    canvasOptions.size === size.name ? "selected" : ""
                  }`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size.name}
                </div>
              ))}
            </div>
          </div>

          <div className="editingOption">
            <span>Background Color</span>
            <div className="bgColor">
              <div className="textColor">
                <div
                  className="colorPreview"
                  style={{ backgroundColor: canvasOptions.backgroundColor }}
                  onClick={() => setIsColorPickerOpen((prev) => !prev)}
                />
                {isColorPickerOpen && (
                  <div className="colorPicker">
                    <HexColorPicker
                      color={canvasOptions.backgroundColor}
                      onChange={(color) =>
                        setCanvasOptions({
                          ...canvasOptions,
                          backgroundColor: color,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Options;
