//Core
import { useEffect, useRef, useState } from 'react';

//Components
import { Button, CircularProgress, TextareaAutosize } from '@mui/material';
import PromptResult from './components/PromptResult';
import TokenPopover from './components/TokenPopover';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';

//Icons
import { TbChessQueenFilled } from "react-icons/tb";
import { IoMdArrowDropdown } from "react-icons/io";

//Css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//Assets
import img_1 from "./assets/img_1.png";
import img_2 from "./assets/img_2.png";
import img_3 from "./assets/img_3.png";
import img_4 from "./assets/img_4.png";
import img_5 from "./assets/img_5.png";
import img_6 from "./assets/img_6.png";
import img_7 from "./assets/img_7.png";
import img_8 from "./assets/img_8.png";
import img_9 from "./assets/img_9.png";
import img_10 from "./assets/img_10.png";
import img_11 from "./assets/img_11.png";
import img_12 from "./assets/img_12.png";
import AIBot from './components/AIBot';


const result3_images =
    [
        {
            id: '9',
            url: img_9
        },
        {
            id: '10',
            url: img_10
        },
        {
            id: '11',
            url: img_11
        },
        {
            id: '12',
            url: img_12
        },
    ];

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

const mockUserPromptResults = [
    {
        id: '1',
        prompt: 'Dynamic angle, best quality, highly detailed, depth of field. A stunning steampunk city with towering skyscrapers and intricate clockwork mechanisms, gears and pistons move in a complex symphony, steam billows from chimneys, airships navigate the bustling skylanes, a vibrant metropolis.',
        images:
            [
                {
                    id: '1',
                    url: img_1
                },
                {
                    id: '2',
                    url: img_2
                },
                {
                    id: '3',
                    url: img_3
                },
                {
                    id: '4',
                    url: img_4
                },
            ]
        // attributes: 'handle later'
    },
    {
        id: '2',
        prompt: 'goku, in the style of Akira Toriyama, dragon ball theme, uhd image, precisionist art, character illustrations.',
        images:
            [
                {
                    id: '5',
                    url: img_5
                },
                {
                    id: '6',
                    url: img_6
                },
                {
                    id: '7',
                    url: img_7
                },
                {
                    id: '8',
                    url: img_8
                },
            ]
    },
]

const ArtGenAI = () => {
    const [promptResults, setPromptResults] = useState(mockUserPromptResults);
    const [tokenNumber] = useState<number>(35);
    const [expanded, setExpanded] = useState<boolean>(true);
    const [promptExpanded, setPromptExpanded] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState('');
    const [committedPrompt, setCommittedPrompt] = useState('');
    const [generatingImage, setGeneratingImage] = useState<boolean | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading or replace with your actual fetch call
        const timer = setTimeout(() => {
            setLoading(false); // Set to false after data is fetched
        }, 1500); // Adjust time or remove if you have real async logic

        return () => clearTimeout(timer);
    }, []);

    const handleGenerate = () => {
        if (!userPrompt.trim()) return;
        setGeneratingImage(true);
        setCommittedPrompt(userPrompt); // store the current prompt
        // Immediately scroll down
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);
        // Simulate generation delay
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);
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

    const [loadingProgress, setLoadingProgress] = useState([0, 0, 0, 0]);

    useEffect(() => {
        if (generatingImage) {
            const interval = setInterval(() => {
                setLoadingProgress((prev) => {
                    const updated = prev.map((p) =>
                        p < 100 ? Math.min(p + Math.floor(Math.random() * 10) + 1, 100) : 100
                    );
                    // Check if all progress values reached 100
                    const allComplete = updated.every((p) => p === 100);
                    if (allComplete) {
                        clearInterval(interval);
                        setGeneratingImage(false); // ✅ stop generating
                        // ✅ Only insert after progress completes
                        const newResult = {
                            id: '3',
                            prompt: userPrompt,
                            images:
                                [
                                    {
                                        id: '9',
                                        url: img_9
                                    },
                                    {
                                        id: '10',
                                        url: img_10
                                    },
                                    {
                                        id: '11',
                                        url: img_11
                                    },
                                    {
                                        id: '12',
                                        url: img_12
                                    },
                                ]
                        };
                        setPromptResults((prev) => [...prev, newResult]);
                    }
                    return updated;
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [generatingImage]);

    const handleDeleteResult = (resultId: string) => {
        setPromptResults(prev => prev.filter((result) => result.id !== resultId));
    };

    const handleDeleteSingleResult = (resultId: string, imageId: string) => {
        setPromptResults((prev) => {
            const updated = prev.map((result) =>
                result.id === resultId
                    ? {
                        ...result,
                        images: result.images.filter((img) => img.id !== imageId),
                    }
                    : result
            );

            // Remove result if all its images are deleted
            return updated.filter((result) => result.images.length > 0);
        });
    };

    return (
        <div className='relative flex flex-col space-y-4 w-full h-[calc(100vh-5rem)] overflow-y-hidden'>
            <SettingsPanel isExpanded={expanded} setIsExpanded={setExpanded} />
            <div className='flex justify-end pr-4 w-full h-fit'>
                <div className='flex items-center space-x-2 bg-white shadow-md p-2 rounded-xl w-fit h-13'>
                    <div className='flex h-full'>
                        <div className='flex justify-center items-center bg-mountain-100 px-2 rounded-lg w-fit h-full font-normal'>
                            <div className='flex items-center space-x-2'>
                                <p>Generate <span className='font-medium'>Image</span></p>
                                <IoMdArrowDropdown />
                            </div>
                        </div>
                    </div>
                    <TokenPopover tokenNumber={tokenNumber} />
                    <Button className='flex justify-center items-center bg-indigo-100 rounded-lg w-28 h-full font-normal'>
                        <TbChessQueenFilled className='mr-2 size-5' />
                        <p>Get Token</p>
                    </Button>
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
                            {promptResults.map((result, index) => (
                                <PromptResult
                                    key={index}
                                    prompt={result.prompt}
                                    images={result.images}
                                    generating={false}
                                    index={index}
                                    onDelete={() => handleDeleteResult(result.id)}
                                    onDeleteSingle={handleDeleteSingleResult}
                                    resultId={result.id}
                                />
                            ))}
                            {generatingImage && (
                                <>
                                    <PromptResult
                                        prompt={" " + committedPrompt}
                                        images={result3_images}
                                        generating={true}
                                        progress={loadingProgress}
                                    />
                                    <div className='flex justify-center items-center py-10'>
                                        <CircularProgress size={32} thickness={4} />
                                    </div>
                                </>
                            )}
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
    )
}

export default ArtGenAI