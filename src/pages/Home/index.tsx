// Core
import { Link } from 'react-router-dom';

// Assets
import app_logo from '/logo_app_v_101.png';
import illustrate from '/illustration2.png';

// Icons
import { IoMdArrowRoundForward } from "react-icons/io";

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-white w-full h-full">
      <nav className="flex justify-between items-center bg-white px-24 py-5 w-full h-20">
        <div className='flex items-center space-x-2'>
          <img src={app_logo} className="shadow rounded-sm w-10 h-10" />
          <p className="bg-clip-text bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 font-bold text-transparent text-xl">Art Share</p>
        </div>
        <div className='flex items-center space-x-8 font-semibold'>
          <div className='text-mountain-950'>Features</div>
          <div className='text-mountain-950'>Benefits</div>
          <div className='text-mountain-950'>Testimonials</div>
          <div className='text-mountain-950'>Pricing</div>
          <Link to="/login" className='bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 p-2 px-4 rounded-full text-mountain-50'>Get Started</Link>
        </div>
      </nav>
      <div className='flex justify-between items-center bg-mountain-50 p-20 px-24 w-full h-[70%]'>
        <div className='flex flex-col space-y-8 w-[40%]'>
          <div className='flex flex-col space-y-2'>
            <p className='bg-clip-text bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 font-bold text-transparent text-5xl'>Create, Share, Inspire</p>
            <p className='bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 font-bold text-transparent text-5xl'>Art Without Limits</p>
          </div>
          <p className='text-mountain-800 text-xl'>Art Share is a creative platform for artists to showcase their work, connect with a vibrant community, and find inspiration through shared creativity.</p>
          <div className='flex space-x-4'>
            <Link to="/login" className='flex justify-center items-center bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 p-3 px-6 rounded-full text-mountain-50'>
              <p className='mr-2'>Start For Free</p>
              <IoMdArrowRoundForward className='text-white' />
            </Link>
            <Link to="/" className='bg-white shadow p-3 px-6 border rounded-full text-mountain-950'>Learn More</Link>
          </div>
          <div className='flex items-center space-x-4'>
            <div className="flex -space-x-1 overflow-hidden">
              <img className="inline-block rounded-full ring-2 ring-white size-8" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              <img className="inline-block rounded-full ring-2 ring-white size-8" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              <img className="inline-block rounded-full ring-2 ring-white size-8" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
              <img className="inline-block rounded-full ring-2 ring-white size-8" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            </div>
            <p className='text-mountain-600'>Joined by <span className='font-bold'>5000+</span> Art Enthusiasts & Artists</p>
          </div>
        </div>
        <div className='relative flex justify-end w-[60%]'>
          <img src={illustrate} className='flex shadow-md border-10 border-white rounded-xl w-[600px] h-fit' />
          <div className='-right-12 -bottom-6 absolute flex bg-white shadow-md rounded-lg w-48 h-24'>a</div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage