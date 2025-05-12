import Editor from './components/Editor'
import Toolbar from './components/Toolbar'

const WriteBlog = () => {
  return (
    <div>
      <Toolbar />
      <div className='z-0 relative flex flex-col justify-center print:bg-white print:p-0 w-full h-fit overflow-x-hidden'>
        <div className='flex mx-auto py-4 print:py-0 w-[816px] print:w-full min-w-max h-fit min-h-[1037px] overflow-y-hidden'>
          <Editor />
        </div>
      </div>
    </div>
  )
}

export default WriteBlog