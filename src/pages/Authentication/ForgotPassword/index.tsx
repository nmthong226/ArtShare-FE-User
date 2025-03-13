import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { ThemeToggle } from "@/components/ThemeToggle"

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    otp: z.string().min(4, {
        message: "OTP must be at least 4 numbers",
    }),
    password: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

const ForgotPassword = () => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            otp: "",
            password: ""
        },
    })
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <div className="flex-1 px-10 lg:px-20 py-8">
            <div className="top-5 right-[5%] absolute">
                <ThemeToggle />
            </div>
            <div className="space-y-4">
                <div className="flex flex-col space-x-3">
                    <h1 className="font-bold text-gray-800 text-2xl xl:text-3xl leading-6">Account Recovery</h1>
                    <p className="mt-4 text-gray-500 text-xs xl:text-sm">Return your account by email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 rounded-lg">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Step 1: Enter Your Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Input Your Email" {...field}
                                            className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">Send My Verification Code</Button>
                    </form>
                </Form>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 rounded-lg">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">Step 2: Input Your OTP</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={4} {...field} className="" disabled>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} className="w-20 h-10" />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={1} className="w-20 h-10" />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} className="w-20 h-10" />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} className="w-20 h-10" />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">
                            Check My OTP
                        </Button>
                    </form>
                </Form>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">Step 3: Input Your New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Input Your New Password" {...field}
                                            className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription className="text-muted-foreground">Min 6 characters, numbers & letters</FormDescription>
                                </FormItem>
                            )}
                        />
                    </form>
                    <Button disabled type="submit" className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white">
                        Recover My Account
                    </Button>
                    <p className="text-blue-600 text-sm">If you need any help, don't hestiate to go to the<span className="ml-1 font-bold">Help Center</span></p>
                </Form>
            </div>
        </div>
    )
}

export default ForgotPassword