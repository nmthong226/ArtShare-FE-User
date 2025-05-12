//Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OpacitySlider from '../../components/sliders/OpacitySlider';

//Icons
import { PiFlipHorizontalLight } from "react-icons/pi";
import { PiFlipVerticalLight } from "react-icons/pi";
import { IoDuplicateOutline } from "react-icons/io5";
import { GoTrash } from "react-icons/go";

type PanelsProp = {
    selectedLayerId: string,
    layers: ImageLayer[],
    handleOpacityChange: (newOpacity: number) => void;
    toggleFlipHorizontal: () => void;
    toggleFlipVertical: () => void;
    handleDuplicate: (layerId: string) => void;
}

const ArrangePanel: React.FC<PanelsProp> = ({
    layers,
    selectedLayerId,
    toggleFlipHorizontal,
    toggleFlipVertical,
    handleOpacityChange,
    handleDuplicate
}) => {
    return (
        <>
            <div className='flex flex-col space-y-2'>
                <Label className='font-medium'>Layer Name</Label>
                <Input className='flex bg-mountain-50 border w-full placeholder:text-mountain-600' placeholder='Input Layer Name' defaultValue="Background" />
            </div>
            <div className='flex flex-col space-y-2'>
                <OpacitySlider
                    opacity={layers.find(layer => layer.id === selectedLayerId)?.opacity ?? 1}
                    onChange={handleOpacityChange}
                />
            </div>
            <div className='flex space-x-2 w-full'>
                <div onClick={toggleFlipHorizontal} className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <PiFlipHorizontalLight className='flex size-5' />
                </div>
                <div onClick={toggleFlipVertical} className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <PiFlipVerticalLight className='flex size-5' />
                </div>
                <div onClick={() => handleDuplicate(layers[layers.length - 1].id)} className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <IoDuplicateOutline className='flex size-5' />
                </div>
                <div className='flex justify-center items-center bg-mountain-50 hover:bg-mountain-100 shadow-sm border border-mountain-200 rounded-lg w-[25%] h-10 select-none'>
                    <GoTrash className='flex size-5' />
                </div>
            </div>
        </>
    )
}

export default ArrangePanel