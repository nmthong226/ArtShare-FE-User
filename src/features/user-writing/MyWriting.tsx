import Editor from './components/Editor'
import Toolbar from './components/Toolbar'
import { LuPencilLine } from 'react-icons/lu'

const WriteBlog = () => {
  return (
    <div className='flex flex-col bg-mountain-50'>
      <Toolbar />
      <div className='z-0 relativeflex flex-col justify-center print:bg-white print:p-0 pb-20 w-full h-screen overflow-x-hidden sidebar'>
        <div className='right-60 bottom-4 fixed flex justify-center items-center bg-gradient-to-b from-blue-400 to-purple-400 shadow-md rounded-full w-14 h-14 hover:scale-105 transition duration-300 ease-in-out hover:cursor-pointer'>
          <LuPencilLine className="size-6 text-white" />
        </div>
        <div className='flex mx-auto py-4 print:py-0 pb-20 w-[816px] print:w-full min-w-max min-h-[1037px] overflow-y-hidden'>
          <Editor />
        </div>
      </div>
    </div>
  )
}

export default WriteBlog