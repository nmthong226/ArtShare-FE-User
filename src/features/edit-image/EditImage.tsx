import "./editor.css";
import Layers from "./Layers";
import Options from "./Options";
import Workspace from "./Workspace";

import previewImg from './assets/img_1.png';

const EditImage: React.FC = () => {
    return (
        <div className='relative flex w-full h-full overflow-y-hidden'>
            <div className="flex w-full h-full">
                <Layers />
                <Workspace previewImg={previewImg} />
                <Options previewImg={previewImg} />
            </div>
        </div>
    );
};

export default EditImage