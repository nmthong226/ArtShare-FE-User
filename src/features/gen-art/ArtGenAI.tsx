//Core
import { useEffect, useRef, useState } from 'react';

//Components
import { Button, CircularProgress, TextareaAutosize } from '@mui/material';
import PromptResult from './components/PromptResult';
import TokenPopover from './components/TokenPopover';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import AIBot from './components/AI/AIBot';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

//Icons
import { TbChessQueenFilled } from "react-icons/tb";
import { IoMdArrowDropdown } from "react-icons/io";

//Css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from '@/api/baseApi';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { aspectOptions, cameraOptions, HistoryFilter, lightingOptions, ModelKey } from './enum';
import { MockModelOptionsData } from './mock/Data';
import { BiInfoCircle } from 'react-icons/bi';
import { PricingTier } from '@/components/ui/pricing-card';
import { PricingSection } from '@/components/ui/pricing-section';

{/*
A stunning realistic scene featuring a woman astronaut curiously peeking out of 
her dormitory window aboard a futuristic space station, overlooking the breathtaking 
view of Earth below. The setting showcases a vibrant blue planet adorned with swirling 
clouds and continents. Surrounding the space station are sleek construction drones actively 
working, along with various spacecraft gliding gracefully through the cosmos. 
The artwork is richly detailed and realistic, inspired by the visionary style of Syd Mead, 
capturing the intricate design of the space station and the dynamic activity in orbit, 
with stars twinkling in the background creating a sense of vastness in space.
*/}

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export const TIERS: PricingTier[] = [
    {
        id: "individual",
        name: "Individuals",
        price: {
            monthly: "Free",
            yearly: "Free",
        },
        description: "Used by art lovers",
        features: [
            "Showcase art & build public portfolio.",
            "Connect with community of artists, fans.",
            "Generate AI art with daily credits.",
            "Explore AI artworks and prompts.",
            "Get prompt ideas from popular styles.",
            "Like, comment, follow, and share art.",
        ],
        cta: "Get started",
        actionType: "none",
    },
    {
        id: "artist",
        name: "Pro Artists",
        price: {
            monthly: 12,
            yearly: 10,
        },
        description: "Great for small businesses",
        features: [
            "Includes all Free plan features.",
            "Use advanced AI models for better art.",
            "Get a larger monthly AI quota.",
            "Generate high-res art without watermark.",
            "Gain commercial rights (T&Cs apply).",
            "Smarter, trend-based prompt suggestions.",
            "Organize art with portfolio collections.",
            "More storage for your artwork.",
        ],
        cta: "Get started",
        actionType: "checkout",
        popular: true,
    },
    {
        id: "studio",
        name: "Studios",
        price: {
            monthly: 30,
            yearly: 24,
        },
        description: "Great for large businesses",
        features: [
            "Everything in Pro Artists plan.",
            "Equip your team with collaborative tools (includes multiple user seats).",
            "Access a massive, shared pool of AI generation credits for team projects.",
            "Track team usage and artwork performance with analytics.",
            "Ensure faster workflows with top priority in the AI generation queue.",
            "Secure robust commercial rights suitable for agency and studio work.",
        ],
        cta: "Get started",
        actionType: "checkout",
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
            "Everything in Studios plan.",
            "Receive a fully bespoke platform solution tailored to enterprise needs.",
            "Negotiate custom AI generation volumes, potentially unlimited.",
            "Secure enterprise-grade Service Level Agreements (SLAs).",
            "Discuss potential white-labeling solutions for your brand.",
            "Fund custom feature development specific to your requirements.",
        ],
        cta: "Contact Us",
        actionType: "contact",
        highlighted: true,
    },
];

const ArtGenAI = () => {
    const [promptResultList, setPromptResultList] = useState<PromptResult[]>([]);
    const [promptResult, setPromptResult] = useState<PromptResult>();
    const [tokenNumber] = useState<number>(35);
    const [expanded, setExpanded] = useState<boolean>(true);
    const [promptExpanded, setPromptExpanded] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState('');
    const [committedPrompt, setCommittedPrompt] = useState('');
    const [generatingImage, setGeneratingImage] = useState<boolean | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(true);
    const [historyFilter, setHistoryFilter] = useState<HistoryFilter>(HistoryFilter.TODAY)
    const [filteredResults, setFilteredResults] = useState<PromptResult[]>([]);

    //Setting Panel
    const [modelKey] = useState<ModelKey>(ModelKey.GPT_IMAGE_1);
    const [style, setStyle] = useState<StyleOption>(MockModelOptionsData[0]);
    const [aspectRatio, setAspectRatio] = useState<AspectOption>(aspectOptions[0]);
    const [lighting, setLighting] = useState<LightingOption>(lightingOptions[0]);
    const [camera, setCamera] = useState<CameraOption>(cameraOptions[0]);
    const [numberOfImages, setNumberOfImages] = useState<number>(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const getLabel = (filter: HistoryFilter) => {
        switch (filter) {
            case HistoryFilter.TODAY:
                return "Today";
            case HistoryFilter.YESTERDAY:
                return "Yesterday";
            case HistoryFilter.LAST7DAYS:
                return "Last 7 Days";
            case HistoryFilter.LAST30DAYS:
                return "Last 30 Days";
            default:
                return "";
        }
    };

    const handleGetPromptHistory = async () => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);
        try {
            const response = await api.get('/art-generation/prompt-history');
            setPromptResultList(response.data)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        handleGetPromptHistory();
    }, [promptResult]);

    const isInFilterRange = (createdAt: string): boolean => {
        const createdDate = new Date(createdAt);
        const now = new Date();

        switch (historyFilter) {
            case HistoryFilter.TODAY:
                return createdDate.toDateString() === now.toDateString();

            case HistoryFilter.YESTERDAY: {
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                return createdDate.toDateString() === yesterday.toDateString();
            }

            case HistoryFilter.LAST7DAYS: {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(now.getDate() - 6);
                return createdDate >= sevenDaysAgo && createdDate <= now;
            }

            case HistoryFilter.LAST30DAYS: {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 29);
                return createdDate >= thirtyDaysAgo && createdDate <= now;
            }

            default:
                return true;
        }
    };


    useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);
        const filtered = promptResultList.filter(result =>
            isInFilterRange(result.created_at)
        ).reverse();
        setFilteredResults(filtered);
    }, [historyFilter, promptResultList]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleGenerate = async () => {
        if (!userPrompt.trim() || generatingImage) return;

        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);

        setGeneratingImage(true);
        setCommittedPrompt(userPrompt);

        const payload = {
            prompt: userPrompt,
            modelKey: modelKey,
            style: style.name.toLowerCase(),
            n: numberOfImages,
            aspectRatio: aspectRatio.value,
            lighting: lighting.value,
            camera: camera.value
        };
        console.log(payload);
        try {
            const response = await api.post('/art-generation/text-to-image', payload);
            setPromptResult(response.data);
            setUserPrompt('');
            setGeneratingImage(false);
            if (intervalRef.current) clearInterval(intervalRef.current);

            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }, 100);

        } catch (e) {
            console.error('Image generation failed:', e);
            if (intervalRef.current) clearInterval(intervalRef.current);
            setGeneratingImage(false);
        }
    };

    const handlePrompt = () => {
        setPromptExpanded(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 0); // ensures it's after expansion
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                textareaRef.current &&
                !textareaRef.current.contains(event.target as Node)
            ) {
                setPromptExpanded(false);
            }
        };

        if (promptExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [promptExpanded]);

    // const handleDeleteSingleResult = (resultId: string, imageId: string) => {
    //     setPromptResults((prev) => {
    //         const updated = prev.map((result) =>
    //             result.id === resultId
    //                 ? {
    //                     ...result,
    //                     images: result.images.filter((img: { id: string; }) => img.id !== imageId),
    //                 }
    //                 : result
    //         );
    //         return updated.filter((result) => result.images.length > 0);
    //     });
    // };

    return (
        <div className='flex p-4 pr-0 pb-0 w-full h-[calc(100vh-4rem)]'>
            <div className='relative flex flex-col space-y-4 w-full h-full overflow-y-hidden'>
                <SettingsPanel
                    isExpanded={expanded}
                    setIsExpanded={setExpanded}
                    numberOfImages={numberOfImages}
                    setNumberOfImages={setNumberOfImages}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    lighting={lighting}
                    setLighting={setLighting}
                    camera={camera}
                    setCamera={setCamera}
                    style={style}
                    setStyle={setStyle}
                />
                <div className='flex justify-end pr-4 w-full h-fit'>
                    <div className='flex items-center space-x-2 bg-white shadow-md p-2 rounded-xl w-102 h-13'>
                        <div className='flex w-full h-full'>
                            <div className='flex justify-start items-center bg-mountain-100 hover:bg-mountain-200/80 px-2 rounded-lg w-full h-full font-normal'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="justify-start outline-none w-full hover:cursor-pointer">
                                        <div className="flex items-center space-x-2">
                                            <p>
                                                Show <span className="font-medium">{getLabel(historyFilter)}</span>
                                            </p>
                                            <IoMdArrowDropdown />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="flex flex-col mt-4 border-mountain-200 min-w-48 select-none">
                                        {Object.entries(HistoryFilter).map(([, value]) => (
                                            <div
                                                key={value}
                                                onClick={() => setHistoryFilter(value as HistoryFilter)}
                                                className={`${loading && 'pointer-events-none'} flex p-1.5 hover:bg-mountain-100 hover:cursor-pointer ${historyFilter === value ? "bg-indigo-50 font-medium text-mountain-800" : ""
                                                    }`}
                                            >
                                                {getLabel(value as HistoryFilter)}
                                            </div>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <TokenPopover tokenNumber={tokenNumber} />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='flex justify-center items-center bg-indigo-100 rounded-lg w-28 h-full font-normal shrink-0'>
                                    <TbChessQueenFilled className='mr-2 size-5' />
                                    <p>Upgrade</p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="flex flex-col min-w-[96%] h-[96%]">
                                <DialogHeader className=''>
                                    <DialogTitle>ArtShare Upgrade Packs</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your journey of discovering art and generating arts.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col justify-center bg-white w-full h-fit">
                                    <div className="relative flex justify-between items-center w-full">
                                        <div className="-z-10 absolute inset-0">
                                            <div className="bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 w-full h-full [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                                        </div>
                                        <PricingSection frequencies={PAYMENT_FREQUENCIES} tiers={TIERS} />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className='relative flex justify-end w-full h-full'>
                    <div className={`flex relative h-full custom-scrollbar flex-col ${expanded ? 'w-[78%]' : 'w-full delay-300'} items-start transition-all duration-200 ease-in-out`}>
                        {loading ? (
                            <div className="flex justify-center items-start mt-4 w-full h-full">
                                <div className='flex items-center space-x-4'>
                                    <CircularProgress size={32} thickness={4} />
                                    <p className='text-sm'>Loading...</p>
                                </div>
                            </div>
                        ) : (
                            <div ref={scrollRef} className='flex flex-col space-y-10 pr-4 w-full h-full overflow-y-auto custom-scrollbar'>
                                {(filteredResults && filteredResults.length > 0) || generatingImage ? filteredResults
                                    .map((result, index) => (
                                        <PromptResult
                                            key={index}
                                            result={result}
                                            generating={false}
                                        />
                                    )) : (
                                    <div className='flex justify-center items-center h-full text-mountain-600'>
                                        <BiInfoCircle className='mr-2 size-5' />
                                        <p className=''>There is no prompt result. What's on your mind?</p>
                                    </div>
                                )}
                                {generatingImage &&
                                    <>
                                        <PromptResult
                                            tempPrompt={" " + committedPrompt}
                                            tempResult={Array(numberOfImages).fill('https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/v1/artshare-asset/utzac220yrts0ujnjjq1?blur=300&q=1')}
                                            generating={true}
                                            result={promptResult!}
                                        />
                                    </>
                                }
                                <div className='flex flex-col space-y-2'>
                                    <div className='flex h-64' />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='bottom-0 z-0 absolute flex bg-white blur-3xl w-full h-40' />
                </div>
                {/* Prompt Chat */}
                <div className={`flex bottom-4 items-end left-1/2 z-50 absolute transform duration-300 ease-in-out ${expanded ? '-translate-x-1/4' : '-translate-x-1/2  delay-300'}`}>
                    <div className={`flex flex-col bg-white border ${promptExpanded ? 'border-indigo-600 shadow-lg' : 'border-mountain-300 shadow-md'} rounded-xl w-[720px] relative`}>
                        <div
                            className={`flex bg-white rounded-xl w-[719px] border-0 rounded-b-none overflow-hidden transition-all duration-400 ease-in-out transform
                            ${promptExpanded ? 'h-24 scale-y-100 opacity-100 py-2' : 'h-0 opacity-0'} 
                            overflow-y-auto`}
                        >
                            <TextareaAutosize
                                value={userPrompt}
                                ref={textareaRef}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder="What do you imagine about?"
                                className={`flex p-2 resize-none bg-white custom-scrollbar rounded-xl w-full text-sm rounded-b-none h-full overflow-y-auto placeholder:text-mountain-400 outline-none focus:outline-none focus:ring-0 focus:border-transparent`}
                            />
                        </div>
                        <div
                            onClick={() => handlePrompt()}
                            className={`${promptExpanded && 'rounded-t-none pointer-events-none'
                                } items-center text-sm flex bg-white px-2 py-4 rounded-xl w-[719px] h-15 line-clamp-1 hover:cursor-pointer overflow-y-auto`}
                        >
                            {userPrompt ? (
                                <p className={`pr-26 line-clamp-1 ${promptExpanded && 'hidden'}`}>{userPrompt}</p>
                            ) : (
                                <p className={`pr-26 text-mountain-400 ${promptExpanded && 'hidden'}`}>What do you imagine about?</p>
                            )}
                        </div>
                        <Button
                            onClick={handleGenerate}
                            className='right-4 -bottom-2 absolute flex items-center bg-indigo-100 px-4 -translate-y-1/2'>
                            Generate
                        </Button>
                    </div>
                    <AIBot />
                </div>
            </div>

        </div>
    )
}

export default ArtGenAI