import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const AccountActivation = () => {
    return (
        <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-10 xl:px-20 py-8">
            <div className="flex flex-col space-x-3">
                <h1 className="font-bold text-gray-800 text-2xl xl:text-3xl leading-6">Email Verification</h1>
                <p className="mt-4 text-gray-500 text-xs xl:text-sm">Thankyou for Registration in Art Share!</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="username" className="block font-semibold text-gray-600 text-sm">Your Email Is:</label>
                    <Input
                        value={"example123@gmail.com"}
                        className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 disabled:font-bold disabled:text-gray-950"
                        disabled
                    />
                    <p className="text-muted-foreground text-xs lg:text-sm">In order to start using Art Share, you need to confirm your email address by clicking under button.</p>
                    <Button type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">Verify My Email</Button>
                </div>
                <p className="text-blue-600 text-sm">If you need any help, don't hestiate to go to the <span className="ml-1 font-bold text-nowrap">Help Center</span></p>
            </div>
        </div >
    )
}

export default AccountActivation