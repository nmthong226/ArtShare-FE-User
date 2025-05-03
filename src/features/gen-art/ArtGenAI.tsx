//Core
import { useEffect, useRef, useState } from 'react';

//Components
import { Button, CircularProgress, TextareaAutosize } from '@mui/material';
import PromptResult from './components/PromptResult';
import TokenPopover from './components/TokenPopover';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import AIBot from './components/AIBot';

//Icons
import { TbChessQueenFilled } from "react-icons/tb";
import { IoMdArrowDropdown } from "react-icons/io";

//Css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const result3_images =
    [
        {
            id: '9',
            url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/arasef6bmgopjnqhwzrc'
        },
        {
            id: '10',
            url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/sir6kdbszkcmcmehatdp'
        },
        {
            id: '11',
            url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/g4dzfj4t74rjgjmr6l1r'
        },
        {
            id: '12',
            url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/s9pjhgywgozbske8byog'
        },
    ]

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
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/ymz4f8uldlagpgfosjo5'
                },
                {
                    id: '2',
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/xw990iearcg71iefho4u'
                },
                {
                    id: '3',
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/stfmbrgaumkjjfijkyxy'
                },
                {
                    id: '4',
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/opbbxebjw79xosse6zlz'
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
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/au2c5vvtjresit5dqnt5'
                },
                {
                    id: '6',
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/lhsyjfgg1zz1ejr6hjlh'
                },
                {
                    id: '7',
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/glxcivoy2s3ant70cgjc'
                },
                {
                    id: '8',
                    url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/asuz4vezfti3yi3j4m82'
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
                                        url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/arasef6bmgopjnqhwzrc'
                                    },
                                    {
                                        id: '10',
                                        url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/sir6kdbszkcmcmehatdp'
                                    },
                                    {
                                        id: '11',
                                        url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/g4dzfj4t74rjgjmr6l1r'
                                    },
                                    {
                                        id: '12',
                                        url: 'https://res.cloudinary.com/dqxtf297o/image/upload/f_auto,q_auto/s9pjhgywgozbske8byog'
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
        <div className='flex p-4 pr-0 pb-0 w-full h-[calc(100vh-4rem)]'>

            <div className='relative flex flex-col space-y-4 w-full h-full overflow-y-hidden'>
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
        </div>
    )
}

export default ArtGenAI