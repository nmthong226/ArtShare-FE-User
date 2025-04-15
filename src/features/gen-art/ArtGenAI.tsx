//Core
import { useEffect, useRef, useState } from 'react';

//Components
import { Button, TextareaAutosize } from '@mui/material';
import Panel from './components/Panel';

//Icons
import { TbChessQueenFilled } from "react-icons/tb";
import { PiStarFourFill } from "react-icons/pi";
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
import PromptResult from './components/PromptResult';

const result1_images = [img_1, img_2, img_3, img_4];
const result2_images = [img_5, img_6, img_7, img_8];
const result3_images = [img_9, img_10, img_11, img_12];

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

const ArtGenAI = () => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [promptExpanded, setPromptExpanded] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState('');
    const [committedPrompt, setCommittedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showMockResult, setShowMockResult] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleGenerate = () => {
        if (!userPrompt.trim()) return;

        setIsLoading(true);
        setShowMockResult(false);
        setCommittedPrompt(userPrompt); // store the current prompt
        setUserPrompt(''); // optional: clear the input

        // Immediately scroll down
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);

        // Simulate generation delay
        setTimeout(() => {
            setIsLoading(false);
            setShowMockResult(true);

            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }, 100);
        }, 2000);
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

    return (
        <div className='relative flex flex-col space-y-4 w-full h-[calc(100vh-5rem)] overflow-y-hidden'>
            <Panel isExpanded={expanded} setIsExpanded={setExpanded} />
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
                    <div className='flex px-2 border-mountain-100 border-r-2 border-l-2 h-full'>
                        <div className='flex justify-center items-center space-x-2 bg-mountain-100 px-2 rounded-lg w-fit h-full font-normal'>
                            <p>50</p>
                            <PiStarFourFill className='size-5' />
                        </div>
                    </div>
                    <Button className='flex justify-center items-center bg-indigo-100 rounded-lg w-28 h-full font-normal'>
                        <TbChessQueenFilled className='mr-2 size-5' />
                        <p>Get Token</p>
                    </Button>
                </div>
            </div>
            <div className='relative flex justify-end w-full h-full'>
                <div className={`flex relative h-full custom-scrollbar flex-col ${expanded ? 'w-[78%]' : 'w-full delay-300'} items-start transition-all duration-200 ease-in-out`}>
                    <div
                        ref={scrollRef}
                        className='flex flex-col space-y-10 pr-4 h-full overflow-y-auto custom-scrollbar'>
                        <PromptResult
                            prompt={" Dynamic angle, best quality, highly detailed, depth of field. A stunning steampunk city with towering skyscrapers and intricate clockwork mechanisms, gears and pistons move in a complex symphony, steam billows from chimneys, airships navigate the bustling skylanes, a vibrant metropolis."}
                            images={result1_images}
                        />
                        <PromptResult
                            prompt={" goku, in the style of Akira Toriyama, dragon ball theme, uhd image, precisionist art, character illustrations."}
                            images={result2_images}
                        />
                        {isLoading && (
                            <div className="text-mountain-400 text-lg text-center animate-pulse">
                                Generating your dream...
                            </div>
                        )}
                        {showMockResult && (
                            <PromptResult
                                prompt={" " + committedPrompt}
                                images={result3_images}
                            />
                        )}
                        <div className='flex flex-col space-y-2'>
                            <div className='flex h-64' />
                        </div>
                    </div>
                    {/* Prompt Chat */}
                    <div className='bottom-20 left-1/2 z-50 absolute flex flex-col -translate-x-1/2'>
                        <div className={`flex bg-white py-2 border rounded-xl w-[760px] border-indigo-400 rounded-b-none overflow-hidden ${promptExpanded ? 'h-36 border-b-0' : 'hidden line-clamp-1 hover:cursor-pointer'} overflow-y-auto`}>
                            <TextareaAutosize
                                value={userPrompt}
                                ref={textareaRef}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder='What do you imagine about?'
                                className={`flex p-2 bg-white custom-scrollbar rounded-xl w-[760px] text-sm rounded-b-none h-full overflow-y-auto placeholder:text-mountain-400 outline-none focus:outline-none focus:ring-0 focus:border-transparent`}
                            />
                        </div>
                        <div
                            onClick={() => {handlePrompt()}}
                            className={`${promptExpanded && 'rounded-t-none border-t-0 pointer-events-none'} items-center text-sm flex border border-indigo-400 bg-white shadow-md px-2 py-4 rounded-xl w-[760px] h-15 line-clamp-1 hover:cursor-pointer overflow-y-auto`}>
                            {userPrompt ?
                                <>
                                    <p className={`pr-26 line-clamp-1 ${promptExpanded && 'hidden'}`}>{userPrompt}</p>
                                </>
                                :
                                <>
                                    <p className={`pr-26 text-mountain-400 ${promptExpanded && 'hidden'}`}>What do you imagine about?</p>
                                </>}
                        </div>
                        <Button
                            onClick={handleGenerate}
                            className='right-4 -bottom-2 absolute flex items-center bg-indigo-100 px-4 -translate-y-1/2'>
                            Generate
                        </Button>
                    </div>
                </div>
                <div className='bottom-0 z-10 absolute flex bg-white blur-3xl w-full h-40'>a</div>
            </div>
        </div>
    )
}

export default ArtGenAI