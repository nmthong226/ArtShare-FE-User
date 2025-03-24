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
        <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-10 xl:px-20 py-8">
            <div className="flex flex-col space-x-3">
                <h1 className="font-bold text-mountain-800 dark:text-mountain-50 text-2xl xl:text-3xl leading-6">Account Recovery</h1>
                <p className="mt-4 text-mountain-500 dark:text-mountain-300 text-xs xl:text-sm">Return your account by email</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm">Step 1: Enter Your Email</label>
                    <Input
                        placeholder="Input Your Email"
                        id="email"
                        className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
                    />
                    <Button type="submit" className="bg-mountain-800 hover:bg-mountain-700 disabled:bg-mountain-800 dark:bg-gradient-to-r dark:from-blue-800 dark:via-purple-700 dark:to-pink-900 hover:brightness-110 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full h-10 font-bold text-white dark:text-mountain-50 hover:cursor-pointer">Send My Verification Code</Button>
                </div>
                <hr className="border-0.5 border-mountain-200 dark:border-mountain-700 w-full"/>
                <div className="space-y-2">
                    <label htmlFor="otp" className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm">Step 2: Input The OTP</label>
                    <InputOTP id="otp" maxLength={4} className="flex justify-between mt-1 w-full" onChange={() => { }} disabled>
                        <InputOTPGroup className="w-1/4">
                            <InputOTPSlot index={0} className="dark:border-mountain-600 w-full h-10" />
                        </InputOTPGroup>
                        <InputOTPSeparator/>
                        <InputOTPGroup className="w-1/4">
                            <InputOTPSlot index={1} className="dark:border-mountain-600 w-full h-10" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup className="w-1/4">
                            <InputOTPSlot index={2} className="dark:border-mountain-600 w-full h-10" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup className="w-1/4">
                            <InputOTPSlot index={3} className="dark:border-mountain-600 w-full h-10" />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button disabled type="submit" className="bg-mountain-800 hover:bg-mountain-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white hover:cursor-pointer">
                        Check My OTP
                    </Button>
                </div>
                <hr className="border-0.5 border-mountain-200 dark:border-mountain-700 w-full"/>
                <div className="space-y-2">
                    <label htmlFor="password" className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm">Step 3: Choose New Password</label>
                    <Input
                        placeholder="Input Your New Password"
                        id="password"
                        className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
                        disabled
                    />
                    <p className="text-muted-foreground text-xs lg:text-sm">Min 6 characters, numbers & letters</p>
                    <Button disabled type="submit" className="bg-mountain-800 hover:bg-mountain-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">
                        Recover My Account
                    </Button>
                </div>
                <p className="text-indigo-600 dark:text-indigo-300 text-sm">If you need any help, don't hestiate to go to the<span className="ml-1 font-bold">Help Center</span></p>
            </div>
        </div >
    )
}

export default ForgotPassword