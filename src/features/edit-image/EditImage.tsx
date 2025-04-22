import previewImg from './assets/img_1.png';

const EditImage: React.FC = () => {
    return (
        <div className='flex space-x-2 space-y-4 bg-mountain-100 rounded-lg w-full h-full overflow-y-hidden'>
            <div className='flex flex-col justify-between space-y-2 bg-white border border-mountain-200 rounded-lg w-20 h-full'>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>Arrange</p>
                </div>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>Select</p>
                </div>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>Crop</p>
                </div>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>Brush</p>
                </div>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>Text</p>
                </div>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>Shape</p>
                </div>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>Upload</p>
                </div>
                <div className='flex justify-center items-center hover:bg-mountain-50 rounded-lg w-full h-20'>
                    <p className='text-mountain-600 text-xs'>More</p>
                </div>
            </div>
            <div>Workspace</div>
            <div>Layer</div>
        </div>
    );
};

export default EditImage