import useEditorStore from "./utils/editorStore";
import textIcon from './assets/text.png';

const Layers = () => {
    const { selectedLayer, setSelectedLayer, addText, canvasOptions } = useEditorStore();

    const handleSelectedLayer = (layer: string) => {
        setSelectedLayer(layer);

        if (layer === "text") {
            addText();
        }
    };
    return (
        <div className="flex flex-col p-4 border w-72">
            <div className="layersTitle">
                <h3>Layers</h3>
                <p>Select a layer to edit</p>
            </div>
            <div
                onClick={() => handleSelectedLayer("text")}
                className={`layer ${selectedLayer === "text" ? "selected" : ""}`}
            >
                <div className="layerImage">
                    <img src={textIcon} alt="" width={48} height={48} />
                </div>
                <span>Add Text</span>
            </div>
            <div
                onClick={() => handleSelectedLayer("canvas")}
                className={`layer ${selectedLayer === "canvas" ? "selected" : ""}`}
            >
                <div
                    className="layerImage"
                    style={{ backgroundColor: canvasOptions.backgroundColor }}
                ></div>
                <span>Canvas</span>
            </div>
        </div>
    );
};

export default Layers;