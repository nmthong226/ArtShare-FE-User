import EditImage from '@/features/edit-image/EditImage'

const ImageEditor = () => {
    return (
        <div className='flex p-4 w-full h-[calc(100vh-4rem)] overflow-hidden'>
            <EditImage />
        </div>
    )
}

export default ImageEditor