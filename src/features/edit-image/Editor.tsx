import useEditorStore from "./utils/editorStore";

const Layers = () => {
    const { selectedLayer, setSelectedLayer, addText, canvasOptions } = useEditorStore();

    const handleSelectedLayer = (layer: any) => {
        setSelectedLayer(layer);

        if (layer === "text") {
            addText();
        }
    };
    return (
        <div className="layers">
            <div className="layersTitle">
                <h3>Layers</h3>
                <p>Select a layer to edit</p>
            </div>
            <div
                onClick={() => handleSelectedLayer("text")}
                className={`layer ${selectedLayer === "text" ? "selected" : ""}`}
            >
                <div className="layerImage">
                    <img src="./assets/text.png" alt="" width={48} height={48} />
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