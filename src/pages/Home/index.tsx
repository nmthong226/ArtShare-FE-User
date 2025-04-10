// Core
import { Link } from 'react-router-dom';

// Assets
import app_logo from '/logo_app_v_101.png';
import illustrate from '/illustration2.png';

const user1 = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const user2 = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const user3 = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// Libs
import { Link as NavLink, Element as MyElement } from 'react-scroll';
import { motion } from "framer-motion"

// Icons
import { IoMdArrowRoundForward } from "react-icons/io";
import { SiSocialblade } from "react-icons/si";
import { IoMdColorPalette } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { IoArrowUp, IoHeart } from "react-icons/io5";
import { RiImageAiLine } from 'react-icons/ri';
import { FaRegCompass } from "react-icons/fa";
import { MdSettingsAccessibility } from "react-icons/md";
import { IoStar } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa6";

//Components
import { PricingSection } from "@/components/ui/pricing-section"
import { BsInstagram, BsTwitterX } from 'react-icons/bs';

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export const TIERS = [
  {
    id: "individuals",
    name: "Individuals",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Used by art lovers",
    features: [
      "Upload up to 10 artworks",
      "Basic AI enhancements",
      "Community engagement & likes",
      "Standard resolution downloads",
      "Basic profile customization",
    ],
    cta: "Get started",
  },
  {
    id: "artists",
    name: "Pro Artists",
    price: {
      monthly: 9,
      yearly: 7.5,
    },
    description: "Great for small businesses",
    features: [
      "Unlimited artwork uploads",
      "Advanced AI enhancements",
      "Single-user account",
      "Premium profile customization",
      "Higher-resolution downloads",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    id: "studios",
    name: "Studios",
    price: {
      monthly: 120,
      yearly: 100,
    },
    description: "Great for large businesses",
    features: [
      "All Pro Artist features +",
      "Team collaboration (up to 5 members)",
      "Private project sharing",
      "Custom watermarking",
      "Sell digital art with 0% commission",
    ],
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "Masterpiece",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For Large art agencies & businesses",
    features: [
      "All Studio features +",
      "Unlimited team members",
      "API access for art automation",
      "Personalized support & consulting",
      "Exclusive marketing & promotion",
    ],
    cta: "Contact Us",
    highlighted: true,
  },
]

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-white w-full h-screen">
      {/* Header */}
      <MyElement name='section0' className="flex justify-between items-center bg-white px-4 md:px-8 lg:px-16 xl:px-24 py-5 w-full h-20">
        <div className='flex items-center space-x-2'>
          <img src={app_logo} className="shadow rounded-sm w-8 md:w-10 h-8 md:h-10" />
          <p className="bg-clip-text bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 font-bold text-transparent text-base md:text-xl">Art Share</p>
        </div>
        <div className='flex items-center space-x-4 md:space-x-8 font-semibold'>
          <NavLink to="section2" smooth={true} duration={500} className='max-sm:hidden text-mountain-950 hover:text-indigo-600 hover:cursor-pointer'>Features</NavLink>
          <NavLink to="section3" smooth={true} duration={500} className='max-sm:hidden text-mountain-950 hover:text-indigo-600 hover:cursor-pointer'>Testimonials</NavLink>
          <NavLink to="section4" smooth={true} duration={500} className='max-sm:hidden text-mountain-950 hover:text-indigo-600 hover:cursor-pointer'>Pricing</NavLink>
          <Link to="/login" className='bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 hover:brightness-110 p-1 md:p-2 px-4 md:px-6 rounded-full text-mountain-50 text-sm md:text-base hover:cursor-pointer'>Get Started</Link>
        </div>
      </MyElement>
      <div className="sm:hidden -bottom-1 z-50 fixed flex justify-center items-center bg-white/70 py-5 w-full h-20">
        <div className='flex justify-between items-center md:space-x-8 bg-white px-4 border rounded-full w-[90%] h-12 font-semibold'>
          <NavLink to="section2" smooth={true} duration={500} className='text-mountain-950 hover:text-indigo-600 hover:cursor-pointer'>Features</NavLink>
          <NavLink to="section3" smooth={true} duration={500} className='text-mountain-950 hover:text-indigo-600 hover:cursor-pointer'>Testimonials</NavLink>
          <NavLink to="section4" smooth={true} duration={500} className='text-mountain-950 hover:text-indigo-600 hover:cursor-pointer'>Pricing</NavLink>
        </div>
      </div>
      {/* Hero Section */}
      <MyElement name='section1' className='flex sm:flex-row flex-col justify-between items-center gap-x-4 bg-mountain-50 p-4 md:p-8 lg:p-12 xl:p-20 px-4 md:px-10 lg:px-16 xl:px-24 w-full sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]'>
        <div className='flex flex-col space-y-4 lg:space-y-6 xl:space-y-8 my-4 sm:my-0 w-full sm:w-[50%]'>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='flex flex-col xl:space-y-2'>
            <p className='bg-clip-text bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 font-bold text-transparent text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>Create, Share, Inspire</p>
            <p className='bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 font-bold text-transparent text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>Art Without Limits</p>
          </motion.div>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='text-mountain-800 text-xs md:text-sm lg:text-lg xl:text-xl'>
            Art Share is a creative platform for artists to showcase their work, connect with a vibrant community, and find inspiration through shared creativity.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='flex space-x-4'>
            <Link to="/login" className='flex justify-center items-center bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 p-1 lg:p-3 px-4 lg:px-6 rounded-full text-mountain-50 hover:cursor-pointer'>
              <p className='mr-2 text-sm md:text-base'>Start For Free</p>
              <IoMdArrowRoundForward className='text-white' />
            </Link>
            <Link to="/" className='bg-white shadow p-1 lg:p-3 px-6 border rounded-full text-mountain-950 text-sm md:text-base'>Learn More</Link>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='flex items-center space-x-2 lg:space-x-4'>
            <div className="flex -space-x-1 overflow-hidden">
              <img className="inline-block rounded-full ring-2 ring-white size-6 md:size-8" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              <img className="inline-block rounded-full ring-2 ring-white size-6 md:size-8" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              <img className="sm:hidden inline-block md:inline-block rounded-full ring-2 ring-white size-6 lg:size-8" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
              <img className="sm:hidden inline-block lg:inline-block rounded-full ring-2 ring-white size-6 lg:size-8" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            </div>
            <p className='text-mountain-600 text-xs lg:text-base'>Joined by <span className='font-bold'>5000+</span> Art Enthusiasts & Artists</p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className='relative flex sm:justify-end w-full sm:w-[50%]'>
          <img src={illustrate} className='flex shadow-md border-10 border-white rounded-xl w-[540px] h-fit' />
          <div className='right-0 md:-right-6 lg:-right-12 -bottom-4 lg:-bottom-6 absolute flex items-center space-x-2 bg-white shadow-md px-4 rounded-lg w-48 lg:w-64 h-16 lg:h-24'>
            <div className='flex justify-center items-center bg-indigo-100 rounded-full w-10 lg:w-14 h-10 lg:h-14'>
              <SiSocialblade className='size-4 lg:size-6 text-indigo-700' />
            </div>
            <div className='flex flex-col'>
              <p className='text-mountain-600 text-xs lg:text-sm'>Social Connect</p>
              <p className='font-bold text-mountain-900 text-sm lg:text-lg'>+27% This Week</p>
            </div>
          </div>
        </motion.div>
      </MyElement>
      {/* Core Features */}
      <MyElement name="section2" className='flex flex-col justify-center space-y-12 bg-white my-4 sm:my-0 p-4 md:p-8 lg:p-12 xl:p-20 px-4 md:px-8 lg:px-16 xl:px-24 w-full h-fit sm:min-h-[900px] lg:min-h-[800px]'>
        <div className='flex flex-col justify-center items-center space-y-3 lg:space-y-5'>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 font-semibold text-transparent'>
            POWERFUL FEATURES
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='bg-clip-text bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 font-bold text-transparent text-lg xs:text-xl sm:text-3xl lg:text-4xl'>
            Everything You Need to Achieve More
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='flex w-[80%] xl:w-[50%] text-mountain-800 text-base lg:text-lg text-center'>
            Art Share is a creative platform for artists to showcase their work, connect with a vibrant community, and find inspiration through shared creativity.
          </motion.p>
        </div>
        <div className='gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='flex flex-col'>
            <div className='flex items-center space-x-2 xl:space-x-4 bg-gradient-to-r from-blue-500 to-blue-700 px-2 xl:px-5 py-5 rounded-t-lg w-full'>
              <div className='flex justify-center items-center bg-white/20 rounded-lg w-10 h-10'>
                <IoMdColorPalette className='size-6 text-white' />
              </div>
              <p className='font-semibold text-white text-lg'>Showcase Your Art</p>
            </div>
            <div className='flex bg-white shadow-lg px-2 xl:px-5 py-5 rounded-b-lg text-mountain-700'>
              <p className='line-clamp-2'>Upload and present your artwork in high quality, making it easy to share your creativity.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className='flex flex-col'>
            <div className='flex items-center space-x-2 xl:space-x-4 bg-gradient-to-r from-indigo-500 to-indigo-700 px-2 xl:px-5 py-5 rounded-t-lg w-full'>
              <div className='flex justify-center items-center bg-white/20 rounded-lg w-10 h-10'>
                <FaUserFriends className='size-6 text-white' />
              </div>
              <p className='font-semibold text-white text-lg'>Connect with Artists</p>
            </div>
            <div className='flex bg-white shadow-lg px-2 xl:px-5 py-5 rounded-b-lg text-mountain-700'>
              <p className='line-clamp-2'>Follow, interact, and collaborate with a vibrant community of creators across different art styles.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            className='flex flex-col'>
            <div className='flex items-center space-x-2 xl:space-x-4 bg-gradient-to-r from-purple-500 to-purple-700 px-2 xl:px-5 py-5 rounded-t-lg w-full'>
              <div className='flex justify-center items-center bg-white/20 rounded-lg w-10 h-10'>
                <IoHeart className='size-6 text-white' />
              </div>
              <p className='font-semibold text-white text-lg'>Gain Recognition</p>
            </div>
            <div className='flex bg-white shadow-lg px-2 xl:px-5 py-5 rounded-b-lg text-mountain-700'>
              <p className='line-clamp-2'>Receive likes, comments, and feedback to grow your presence and get discovered by more art lovers.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6 }}
            className='flex flex-col'>
            <div className='flex items-center space-x-2 xl:space-x-4 bg-gradient-to-r from-sky-500 to-sky-700 px-2 xl:px-5 py-5 rounded-t-lg w-full'>
              <div className='flex justify-center items-center bg-white/20 rounded-lg w-10 h-10'>
                <RiImageAiLine className='size-6 text-white' />
              </div>
              <p className='font-semibold text-white text-lg'>AI Art Generation</p>
            </div>
            <div className='flex bg-white shadow-lg px-2 xl:px-5 py-5 rounded-b-lg text-mountain-700'>
              <p className='line-clamp-2'>Transform your ideas into stunning digital masterpieces with powerful AI-powered tools.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8 }}
            className='flex flex-col'>
            <div className='flex items-center space-x-2 xl:space-x-4 bg-gradient-to-r from-cyan-500 to-cyan-700 px-2 xl:px-5 py-5 rounded-t-lg w-full'>
              <div className='flex justify-center items-center bg-white/20 rounded-lg w-10 h-10'>
                <FaRegCompass className='size-6 text-white' />
              </div>
              <p className='font-semibold text-white text-lg'>Discover & Explore</p>
            </div>
            <div className='flex bg-white shadow-lg px-2 xl:px-5 py-5 rounded-b-lg text-mountain-700'>
              <p className='line-clamp-2'>Browse trending artworks, explore diverse styles, and find inspiration from a global community.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className='flex flex-col'>
            <div className='flex items-center space-x-2 xl:space-x-4 bg-gradient-to-r from-teal-500 to-teal-700 px-2 xl:px-5 py-5 rounded-t-lg w-full xl'>
              <div className='flex justify-center items-center bg-white/20 rounded-lg w-10 h-10'>
                <MdSettingsAccessibility className='size-6 text-white' />
              </div>
              <p className='font-semibold text-white text-lg leading-5'>Personalized Experience</p>
            </div>
            <div className='flex bg-white shadow-lg px-2 xl:px-5 py-5 rounded-b-lg text-mountain-700'>
              <p className='line-clamp-2'>Browse trending artworks, explore diverse styles, and find inspiration from a global community.</p>
            </div>
          </motion.div>
        </div>
      </MyElement>
      {/* Testimonials */}
      <MyElement name="section3" className='flex flex-col justify-center space-y-12 bg-mountain-50 p-4 md:p-8 lg:p-12 xl:p-20 px-4 md:px-8 lg:px-16 xl:px-24 w-full h-fit sm:min-h-[400px] md:min-h-[500px] xl:min-h-[600px]'>
        <div className='flex flex-col justify-center items-center space-y-3 lg:space-y-5'>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 font-semibold text-transparent'>
            SUCCESS STORIES
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='bg-clip-text bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 font-bold text-transparent text-xl sm:text-3xl lg:text-4xl'>
            What Our Users Say
          </motion.p>
        </div>
        <div className='gap-8 grid grid-cols-1 sm:grid-cols-3 w-full'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className='flex flex-col shadow-md rounded-lg'>
            <div className='flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-1.5 rounded-t-lg w-full' />
            <div className='flex flex-col justify-between space-y-4 bg-white px-5 py-5 text-mountain-700'>
              <p className='line-clamp-2'>Sharing my art and connecting with other creators is so easy! The AI feature is great to explore new ideas.</p>
              <div className='flex space-x-2'>
                <img src={user1} className='rounded-full w-12 h-12' />
                <div className='flex flex-col justify-end leading-4'>
                  <p className='font-semibold'>David Chen</p>
                  <p className='text-mountain-600 text-sm'>Freelance Artist</p>
                </div>
              </div>
            </div>
            <div className='flex space-x-1 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 rounded-b-lg w-full'>
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className='flex flex-col shadow-md rounded-lg'>
            <div className='flex items-center space-x-4 bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-1.5 rounded-t-lg w-full' />
            <div className='flex flex-col justify-between space-y-4 bg-white px-5 py-5 text-mountain-700'>
              <p className='line-clamp-2'>A good platform for art inspiration! The community is supportive, I love seeing diverse artworks.</p>
              <div className='flex space-x-2'>
                <img src={user2} className='rounded-full w-12 h-12' />
                <div className='flex flex-col justify-end leading-4'>
                  <p className='font-semibold'>Alan Smith</p>
                  <p className='text-mountain-600 text-sm'>Art Enthusiast</p>
                </div>
              </div>
            </div>
            <div className='flex space-x-1 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4 rounded-b-lg w-full'>
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className='flex flex-col shadow-md rounded-lg'>
            <div className='flex items-center space-x-4 bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-1.5 rounded-t-lg w-full' />
            <div className='flex flex-col justify-between space-y-4 bg-white px-5 py-5 text-mountain-700'>
              <p className='line-clamp-2'>Art Share makes showcasing my work effortless! The design is sleek, and I’ve gained great exposure.</p>
              <div className='flex space-x-2'>
                <img src={user3} className='rounded-full w-12 h-12' />
                <div className='flex flex-col justify-end leading-3'>
                  <p className='font-semibold'>Emma Brown</p>
                  <p className='text-mountain-600 text-sm'>Content Creator</p>
                </div>
              </div>
            </div>
            <div className='flex space-x-1 bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-4 rounded-b-lg w-full'>
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
              <IoStar className='text-yellow-400' />
            </div>
          </motion.div>
        </div>
      </MyElement>
      {/* Pricing */}
      <MyElement name="section4" className='flex flex-col justify-center bg-white p-8 lg:p-12 xl:p-20 px-10 lg:px-16 xl:px-24 w-full h-fit md:min-h-[1300px] xl:min-h-[900px]'>
        <div className='flex flex-col justify-center items-center space-y-3 lg:space-y-5'>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 font-semibold text-transparent'>
            PRICING PLANS
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='bg-clip-text bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 font-bold text-transparent text-xl sm:text-3xl lg:text-4xl'>
            Choose The Right Plan For You
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='flex justify-center items-center w-full text-mountain-800 text-base lg:text-lg text-center'>
            Flexible options to suit individuals, just pick the one that fuels your creativity!
          </motion.p>
        </div>
        <div className="relative flex justify-between items-center w-full">
          <div className="-z-10 absolute inset-0">
            <div className="bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 w-full h-full [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          </div>
          <PricingSection
            frequencies={PAYMENT_FREQUENCIES}
            tiers={TIERS}
          />
        </div>
      </MyElement>
      <div className='flex justify-center items-center w-full min-h-20'>
        <NavLink to='section0' smooth={true} duration={500} className='flex justify-center items-center bg-mountain-50 shadow-md border rounded-full w-12 h-12 hover:scale-120 transition duration-300 hover:cursor-pointer'>
          <IoArrowUp />
        </NavLink>
      </div>
      {/* Footer */}
      <div className='flex flex-col justify-center bg-mountain-950 w-full min-h-[300px] sm:min-h-[240px]'>
        <div className='flex sm:flex-row flex-col sm:justify-between sm:items-end px-10 lg:px-16 xl:px-24 py-6'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center space-x-2'>
              <img src={app_logo} className="shadow rounded-sm w-10 h-10" />
              <p className="bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 font-bold text-transparent text-xl">Art Share</p>
            </div>
            <p className='text-mountain-300 text-sm lg:text-base line-clamp-1'>A creative platform for artists to showcase, connect, and find inspiration.</p>
          </div>
          <div className='flex flex-col space-y-4'>
            <div className='flex space-x-4 lg:space-x-8'>
              <div className='font-semibold text-mountain-50 text-sm lg:text-base'>Features</div>
              <div className='font-semibold text-mountain-50 text-sm lg:text-base'>Benefits</div>
              <div className='font-semibold text-mountain-50 text-sm lg:text-base'>Testimonials</div>
              <div className='font-semibold text-mountain-50 text-sm lg:text-base'>Pricing</div>
            </div>
            <div className='flex sm:justify-end space-x-4'>
              <div className='flex justify-center items-center border rounded-lg w-8 h-8'>
                <FaFacebookF className='size-4 text-white' />
              </div>
              <div className='flex justify-center items-center border rounded-lg w-8 h-8'>
                <BsInstagram className='size-4 text-white' />
              </div>
              <div className='flex justify-center items-center border rounded-lg w-8 h-8'>
                <BsTwitterX className='size-4 text-white' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex sm:flex-row flex-col sm:justify-between sm:items-end px-10 lg:px-16 xl:px-24 py-6 border-mountain-700 border-t-2'>
          <p className='text-mountain-50 text-sm'>© 2025 Copyright. All rights reserved.</p>
          <div className='flex space-x-4 sm:space-x-8'>
            <Link to="/" className='text-mountain-50 text-sm underline'>Terms and Conditions</Link>
            <Link to="/" className='text-mountain-50 text-sm underline'>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage