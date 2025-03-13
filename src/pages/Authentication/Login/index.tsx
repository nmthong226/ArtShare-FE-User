import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa6";
import InstagramIcon from "/auth_logo_instagram.svg";
import { FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

const Login = () => {
    return (
        <div className="flex-1 space-y-4 px-10 lg:px-20 py-8">
            <div className="flex flex-col space-x-3">
                <h1 className="font-bold text-gray-800 text-2xl xl:text-3xl leading-6">Welcome back!</h1>
                <p className="mt-2 font-bold text-gray-600 text-2xl xl:text-3xl">Login to your account</p>
                <p className="mt-4 text-gray-500 text-xs xl:text-sm">It's nice to see you again. Ready to showcase you art?</p>
            </div>
            <form className="space-y-4">
                <div>
                    <label htmlFor="username" className="block font-semibold text-gray-600 text-sm">Username or Email</label>
                    <Input type="text" placeholder="Enter your username or email" className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10" />
                </div>
                <div>
                    <label htmlFor="password" className="block font-medium text-gray-600 text-sm">Password</label>
                    <Input type="password" placeholder="Enter your password" className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10" />
                </div>
                <div className="flex justify-between items-center mt-4">
                    <label className="flex items-center text-gray-500 text-sm">
                        <input type="checkbox" className="mr-2" />
                        Remember me
                    </label>
                    <div className="text-blue-600 text-sm">
                        <Link to="/forgot-password" className="">Forgot username or password?</Link>
                    </div>
                </div>
                <Button type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">Login</Button>
            </form>
            <div className="flex items-center space-x-4 mt-6 text-center">
                <hr className="border-gray-900 border-t-1 w-full" />
                <div className="text-gray-600 text-sm">Or</div>
                <hr className="border-gray-900 border-t-1 w-full" />
            </div>
            <div className="flex flex-col justify-between space-x-4 space-y-4 mt-4">
                <div className="flex w-full">
                    <Button variant={"outline"} className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-full h-10 font-normal text-sm">
                        <FcGoogle className="size-5" />
                        <span>Continue with Google</span>
                    </Button>
                </div>
                <div className="flex justify-between w-full">
                    <Button variant={"outline"} className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm">
                        <FaFacebookF className="size-5 text-blue-700" />
                        <span>Facebook</span>
                    </Button>
                    <Button variant={"outline"} className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm">
                        <img src={InstagramIcon} alt="Instagram" className="size-5" />
                        <span>Instagram</span>
                    </Button>
                    <Button variant={"outline"} className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm">
                        <FaApple className="size-5" />
                        <span>Apple</span>
                    </Button>
                </div>
            </div>

            <div className="mt-6 text-left">
                <p className="text-gray-600 text-xs xl:text-sm">Don’t have any accounts?
                    <Link to="/signup" className="ml-2 text-blue-600">Register</Link>
                </p>
            </div>
            <div className="mt-4 text-[10px] text-gray-500 xl:text-xs lg:text-left text-center">
                <p>By logging in to ArtShare, I confirm that I have read and agree to the ArtShare <a href="#" className="text-blue-600">Terms of Service</a>  -  <a href="#" className="text-blue-600">Privacy Policy</a> regarding data usage.</p>
            </div>
        </div>
    )
}

export default Login