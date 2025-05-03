//Components
import AdjustmentSlider from '../../components/sliders/AdjustmentSlider';
import { Button, Tooltip, tooltipClasses } from '@mui/material';

//Icons
import { IoText } from "react-icons/io5";
import { X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { RiResetRightLine } from "react-icons/ri";
import { MdOutlineFlip } from "react-icons/md";
import ArrangePanel from './ArrangePanel';
import FilterPanel from './FilterPanel';

type PanelsProp = {
    selectedLayerId: string,
    activePanel: string,
    layers: ImageLayer[],
    setActivePanel: Dispatch<SetStateAction<"arrange" | "adjust" | "filter" | "text" | null>>;
    handleOpacityChange: (newOpacity: number) => void;
    toggleFlipHorizontal: () => void;
    toggleFlipVertical: () => void;
    handleDuplicate: (layerId: string) => void;
    updateSelectedLayer: (updates: Partial<ImageLayer>) => void;
    handleSaturation: (newSaturation: number) => void;
    handleHue: (newHue: number) => void;
    handleBrightness: (newBrightness: number) => void;
    handleContrast: (newContrast: number) => void;
    handleSepia: (newSepia: number) => void;

    addText: () => void;
}

const Panels: React.FC<PanelsProp> = ({
    selectedLayerId,
    activePanel,
    layers,
    handleOpacityChange,
    toggleFlipHorizontal,
    toggleFlipVertical,
    handleDuplicate,
    setActivePanel,
    handleSaturation,
    handleHue,
    handleBrightness,
    handleContrast,
    handleSepia,
    addText
}) => {
    return (
        <div className='z-50'>
            {activePanel && (
                <div className="flex flex-col space-y-2 bg-gradient-to-b from-white to-mountain-50 shadow border border-mountain-200 w-72 h-[calc(100vh-98px)]">
                    <div className="relative flex justify-center items-center bg-white border-mountain-200 border-b-1 h-[5%] font-semibold text-mountain-700 text-sm">
                        <X className='left-2 absolute size-4 hover:text-red-700' onClick={() => setActivePanel(null)} />
                        <p className='capitalize'>{activePanel}</p>
                    </div>
                    <div className='custom-scrollbar-left flex flex-col space-y-4 px-6 py-4 max-h-[82%] overflow-y-auto'>
                        {activePanel == "arrange" && (
                            <ArrangePanel
                                layers={layers}
                                selectedLayerId={selectedLayerId}
                                handleOpacityChange={handleOpacityChange}
                                toggleFlipHorizontal={toggleFlipHorizontal}
                                toggleFlipVertical={toggleFlipVertical}
                                handleDuplicate={handleDuplicate}
                            />
                        )}
                        {activePanel === "adjust" && (
                            <>
                                <AdjustmentSlider
                                    label='Saturation'
                                    value={layers.find(l => l.id === selectedLayerId)?.saturation ?? 100}
                                    onChange={handleSaturation}
                                    min={0}
                                    max={200}
                                    gradientColors={["#808080", "#ff0000"]}
                                />
                                <AdjustmentSlider
                                    label='Hue'
                                    value={layers.find(l => l.id === selectedLayerId)?.hue ?? 0}
                                    onChange={handleHue}
                                    min={-180}
                                    max={180}
                                    gradientColors={[
                                        "#808080", // neutral gray (0% saturation)
                                        "#ff0000", // red
                                        "#ffff00", // yellow
                                        "#00ff00", // green
                                        "#00ffff", // cyan
                                        "#0000ff", // blue
                                        "#ff00ff", // magenta
                                        "#ff0000"  // wrap back to red (for a smooth loop)
                                    ]}
                                />
                                <AdjustmentSlider
                                    label='Brightness'
                                    value={layers.find(l => l.id === selectedLayerId)?.brightness ?? 100}
                                    onChange={handleBrightness}
                                    min={0}
                                    max={200}
                                />
                                <AdjustmentSlider
                                    label='Contrast'
                                    value={layers.find(l => l.id === selectedLayerId)?.contrast ?? 100}
                                    onChange={handleContrast}
                                    min={0}
                                    max={200}
                                />
                            </>
                        )}
                        {activePanel === "filter" && (
                            <FilterPanel
                                layers={layers}
                                selectedLayerId={selectedLayerId}
                                handleSaturation={handleSaturation}
                                handleBrightness={handleBrightness}
                                handleHue={handleHue}
                                handleContrast={handleContrast}
                                handleSepia={handleSepia}
                            />
                        )}
                        {activePanel === "text" && (
                            <>
                                <div onClick={addText} className='flex justify-center items-center w-full h-10'>
                                    <Button className='flex justify-center items-center bg-white border border-mountain-200 rounded-lg w-full h-full font-normal text-sm'>
                                        <IoText className='mr-2 size-5'/>
                                        <p>Add Text</p>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                    {activePanel === "filter" ? (
                        <>
                            <hr className='flex mb-4 border-mountain-200 border-t-1 w-full' />
                            <div className='flex space-x-2 w-full h-10'>
                                <div className='flex justify-center items-center pl-6 w-1/2 h-10'>
                                    <Button className='flex justify-center items-center bg-indigo-200 border border-mountain-200 rounded-lg w-full h-full font-normal text-sm'>
                                        <p>Apply</p>
                                    </Button>
                                </div>
                                <div className='flex justify-center items-center pr-6 w-1/2 h-10'>
                                    <Button className='flex justify-center items-center bg-white border border-mountain-200 rounded-lg w-full h-full font-normal text-sm'>
                                        <p>Cancel</p>
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (activePanel === "arrange" || activePanel === "adjust") && (
                        <>
                            <hr className='flex mb-4 border-mountain-200 border-t-1 w-full' />
                            <div className='flex justify-center items-center px-6 w-full h-10'>
                                <Tooltip
                                    title="Hold down"
                                    placement="top"
                                    arrow
                                    slotProps={{
                                        popper: {
                                            sx: {
                                                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                                {
                                                    marginTop: '4px',
                                                },
                                                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                                                {
                                                    marginBottom: '4px',
                                                },
                                                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                                                {
                                                    marginLeft: '4px',
                                                },
                                                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                                                {
                                                    marginRight: '4px',
                                                },
                                            },
                                        },
                                    }}>
                                    <Button className='flex justify-center items-center bg-white border border-mountain-200 rounded-lg w-full h-full font-normal text-sm'>
                                        <MdOutlineFlip className='mr-2' />
                                        <p>Compare</p>
                                    </Button>
                                </Tooltip>
                            </div>
                            <div className='flex justify-center items-center px-6 w-full h-10'>
                                <Button className='flex justify-center items-center bg-white border border-mountain-200 rounded-lg w-full h-full font-normal text-sm'>
                                    <RiResetRightLine className='mr-2' />
                                    <p>Reset</p>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Panels