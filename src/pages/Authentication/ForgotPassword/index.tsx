import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const ForgotPassword = () => {
    return (
        <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-20 py-8">
            <div className="flex flex-col space-x-3">
                <h1 className="font-bold text-gray-800 text-2xl xl:text-3xl leading-6">Account Recovery</h1>
                <p className="mt-4 text-gray-500 text-xs xl:text-sm">Return your account by email</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="username" className="block font-semibold text-gray-600 text-sm">Step 1: Enter Your Email</label>
                    <Input
                        placeholder="Input Your Email"
                        className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
                    />
                    <Button type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">Send My Verification Code</Button>
                </div>
                <hr className="border-0.5 border-mountain-200 w-full"/>
                <div className="space-y-2">
                    <label htmlFor="username" className="block font-semibold text-gray-600 text-sm">Step 2: Input The OTP</label>
                    <InputOTP maxLength={4} className="mt-1" onChange={() => { }} disabled>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="w-10 lg:w-20 h-10" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={1} className="w-10 lg:w-20 h-10" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={2} className="w-10 lg:w-20 h-10" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} className="w-10 lg:w-20 h-10" />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button disabled type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">
                        Check My OTP
                    </Button>
                </div>
                <hr className="border-0.5 border-mountain-200 w-full"/>
                <div className="space-y-2">
                    <label htmlFor="username" className="block font-semibold text-gray-600 text-sm">Step 3: Choose New Password</label>
                    <Input
                        placeholder="Input Your New Password"
                        className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
                        disabled
                    />
                    <p className="text-muted-foreground text-xs lg:text-sm">Min 6 characters, numbers & letters</p>
                    <Button disabled type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">
                        Recover My Account
                    </Button>
                </div>
                <p className="text-blue-600 text-sm">If you need any help, don't hestiate to go to the<span className="ml-1 font-bold">Help Center</span></p>
            </div>
        </div >
    )
}

export default ForgotPassword