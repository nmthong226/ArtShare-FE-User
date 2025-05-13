
//Assets
import BlackWhite from '../../assets/Filters/BlackWhite.jpg';
import Vintage from '../../assets/Filters/Vintage.jpg';
import WarmGlow from '../../assets/Filters/WarmGlow.jpg';
import CoolBlue from '../../assets/Filters/CoolBlue.jpg';
import Sepia from '../../assets/Filters/Sepia.jpg';
import DreamPurple from '../../assets/Filters/DreamPurple.jpg';

type FilterPanelProps = {
    selectedLayerId: string,
    layers: ImageLayer[],
    handleSaturation: (newSaturation: number) => void;
    handleBrightness: (newBrightness: number) => void;
    handleHue: (newHue: number) => void;
    handleContrast: (newContrast: number) => void;
    handleSepia: (newSepia: number) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    handleSaturation,
    handleBrightness,
    handleHue,
    handleContrast,
    handleSepia
}) => {
    return (
        <div className='flex flex-col space-y-4'>
            <div className='flex flex-none bg-white shadow-md hover:brightness-105 p-1 rounded-lg h-24 hover:cursor-pointer'>
                <div
                    onClick={() => {
                        handleSaturation(0);
                        handleContrast(120);
                        handleBrightness(100);
                        handleHue(0);
                        handleSepia(0);
                    }}
                    className='flex bg-gradient-to-br from-mountain-600 to-mountain-50 p-2 rounded-lg rounded-r-none w-1/2 h-full'>
                    <p className='font-medium text-white text-sm line-clamp-1'>
                        B & W
                    </p>
                </div>
                <img src={BlackWhite} className='flex rounded-r-lg w-1/2 h-auto object-cover' loading='lazy' />
            </div>
            <div
                onClick={() => {
                    handleSaturation(60);
                    handleContrast(120);
                    handleBrightness(110);
                    handleHue(-15);
                    handleSepia(40);
                }}
                className='flex bg-white shadow-md hover:brightness-105 p-1 rounded-lg h-24 hover:cursor-pointer'>
                <div className='flex bg-gradient-to-br from-amber-900 to-orange-400 p-2 rounded-lg rounded-r-none w-1/2 h-full'>
                    <p className='font-medium text-white text-sm line-clamp-1'>
                        Vintage
                    </p>
                </div>
                <img src={Vintage} className='flex rounded-r-lg w-1/2 h-auto object-cover' loading='lazy' />
            </div>
            <div
                onClick={() => {
                    handleSaturation(130);
                    handleContrast(105);
                    handleBrightness(110);
                    handleHue(0);
                    handleSepia(20);
                }}
                className='flex flex-none bg-white shadow-md hover:brightness-105 p-1 rounded-lg h-24 hover:cursor-pointer'>
                <div className='flex bg-gradient-to-br from-red-700 to-pink-400 p-2 rounded-lg rounded-r-none w-1/2 h-full'>
                    <p className='font-medium text-white text-sm line-clamp-1'>
                        Warm Glow
                    </p>
                </div>
                <img src={WarmGlow} className='flex rounded-r-lg w-1/2 h-auto object-cover' loading='lazy' />
            </div>
            <div
                onClick={() => {
                    handleSaturation(110);
                    handleContrast(135);
                    handleBrightness(120);
                    handleHue(10);
                    handleSepia(0);
                }}
                className='flex flex-none bg-white shadow-md hover:brightness-105 p-1 rounded-lg h-24 hover:cursor-pointer'>
                <div className='flex bg-gradient-to-br from-blue-700 to-cyan-400 p-2 rounded-lg rounded-r-none w-1/2 h-full'>
                    <p className='font-medium text-white text-sm line-clamp-1'>
                        Cool Blue
                    </p>
                </div>
                <img src={CoolBlue} className='flex rounded-r-lg w-1/2 h-auto object-cover' loading='lazy' />
            </div>
            <div
                onClick={() => {
                    handleSaturation(70);
                    handleContrast(100);
                    handleBrightness(110);
                    handleHue(0);
                    handleSepia(80);
                }}
                className='flex flex-none bg-white shadow-md hover:brightness-105 p-1 rounded-lg h-24 hover:cursor-pointer'>
                <div className='flex bg-gradient-to-br from-red-900 to-yellow-50 p-2 rounded-lg rounded-r-none w-1/2 h-full'>
                    <p className='font-medium text-white text-sm line-clamp-1'>
                        Sepia Soft
                    </p>
                </div>
                <img src={Sepia} className='flex rounded-r-lg w-1/2 h-auto object-cover' loading='lazy' />
            </div>
            <div
                onClick={() => {
                    handleSaturation(120);
                    handleContrast(100);
                    handleBrightness(110);
                    handleHue(-80);
                    handleSepia(0);
                }}
                className='flex flex-none bg-white shadow-md hover:brightness-105 p-1 rounded-lg h-24 hover:cursor-pointer'>
                <div className='flex bg-gradient-to-br from-pink-700 to-purple-600 p-2 rounded-lg rounded-r-none w-1/2 h-full'>
                    <p className='font-medium text-white text-sm line-clamp-1'>
                        Purple Dream
                    </p>
                </div>
                <img src={DreamPurple} className='flex rounded-r-lg w-1/2 h-auto object-cover' loading='lazy' />
            </div>
        </div>
    )
}

export default FilterPanel