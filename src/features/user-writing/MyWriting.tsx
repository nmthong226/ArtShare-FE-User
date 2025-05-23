import { useRef } from 'react'
import Editor, { EditorHandle } from './components/Editor'
import TextEditorHeader from './components/TextEditorHeader'
import Toolbar from './components/Toolbar'
import { LuPencilLine } from 'react-icons/lu'
import api from '@/api/baseApi'

const WriteBlog = () => {
  const editorRef = useRef<EditorHandle>(null);

  const handleExportDocument = async () => {
    if (!editorRef.current) return
    const content = editorRef.current?.getContent()
    try {
      console.log(content);
      const res = await api.post('/blogs', {
        title: 'Untitled Document',
        content,
      })
      console.log('Document created:', res.data)
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  return (
    <div className={`flex flex-row w-full h-full`}>
      <div className={`flex flex-col flex-1 flex-shrink w-[calc(100vw-16rem)] h-full`}>
        <TextEditorHeader handleExport={handleExportDocument} />
        <div className={`border-l-1 bg-mountain-50 border-l-mountain-100 dark:border-l-mountain-700 h-full w-full`}>
          <Toolbar />
          <div className='z-0 relativeflex flex-col justify-center print:bg-white print:p-0 pb-20 w-full h-screen overflow-x-hidden sidebar'>
            <div className='right-60 bottom-4 z-50 fixed flex justify-center items-center bg-gradient-to-b from-blue-400 to-purple-400 shadow-md rounded-full w-14 h-14 hover:scale-105 transition duration-300 ease-in-out hover:cursor-pointer'>
              <LuPencilLine className="size-6 text-white" />
            </div>
            <div className='flex mx-auto py-4 print:py-0 pb-20 w-[794px] print:w-full min-w-max min-h-[1123px] overflow-y-hidden'>
              <Editor ref={editorRef} />
            </div>
            {/* --> Add page */}
            {/* <div className='flex mx-auto py-4 print:py-0 pb-20 w-[794px] print:w-full min-w-max min-h-[1123px] overflow-y-hidden'>
              <Editor ref={editorRef} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriteBlog