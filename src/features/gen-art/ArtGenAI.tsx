//Core
import { useState } from 'react';

//Components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';

//Icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { GoSidebarExpand } from "react-icons/go";
import { IoImageOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosSquareOutline } from "react-icons/io";
import { GoLightBulb } from "react-icons/go";
import { AiOutlineCamera } from "react-icons/ai";
import { IoColorFillOutline } from "react-icons/io5";
import { TbChessQueenFilled } from "react-icons/tb";
import { PiStarFourFill } from "react-icons/pi";
import { IoMdArrowDropdown } from "react-icons/io";

//Assets
import example_1 from "./assets/1.webp"
import { Input } from '@/components/ui/input';

const ArtGenAI = () => {
    const [numberOfImages, setNumberOfImages] = useState('4');
    const [expanded, setExpanded] = useState<boolean>(true);

    const handleParentToggle = (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    const handleSelectNumber = (
        _: React.MouseEvent<HTMLElement>,
        newNumber: string
    ) => {
        if (newNumber) {
            setNumberOfImages(newNumber);
        }
    };

    return (
        <div className='flex flex-1 gap-4 w-full h-[calc(100vh-6rem)]'>
            <Accordion
                expanded={expanded}
                onChange={handleParentToggle}
                className={`flex flex-col bg-white shadow-md border border-mountain-300 rounded-xl w-1/4 ${expanded ? 'h-full' : 'h-fit'}`}>
                <AccordionSummary
                    expandIcon={<GoSidebarExpand />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    className={`bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 ${expanded ? 'rounded-t-xl' : 'rounded-xl'}`}
                >
                    <Typography component="span" className="flex items-center space-x-2 font-medium">
                        <IoImageOutline className="size-5" />
                        <p>Image Generation</p>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className='flex flex-col p-0 h-[600px] overflow-y-auto custom-scrollbar'>
                    {/* Nested Accordions */}
                    <Accordion className="shadow-none" defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography component="span" className="font-medium">
                                General Settings
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className='flex flex-col space-y-2'>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-mountain-600 text-sm'>Model</p>
                                <Button className='flex justify-between bg-mountain-100 p-3 rounded-xl w-full font-normal'>
                                    <div className='flex items-center space-x-2'>
                                        <img src={example_1} className='rounded-xs w-5 h-5' />
                                        <p>Ultra Realism</p>
                                    </div>
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-mountain-600 text-sm'>Aspect Ratio</p>
                                <Button className='flex justify-between bg-mountain-100 p-3 rounded-xl w-full font-normal'>
                                    <div className='flex items-center space-x-2'>
                                        <IoIosSquareOutline className='size-5' />
                                        <p>1:1</p>
                                    </div>
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className="shadow-none" defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography component="span" className="font-medium">
                                Styles
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col space-y-1'>
                                <Button className='flex justify-between bg-mountain-100 p-3 rounded-xl w-full font-normal'>
                                    <div className='flex items-center space-x-2'>
                                        <IoColorFillOutline className='rounded-xs w-5 h-5' />
                                        <p>Styles</p>
                                    </div>
                                    <IoIosArrowForward />
                                </Button>
                                <Button className='flex justify-between bg-mountain-100 p-3 rounded-xl w-full font-normal'>
                                    <div className='flex items-center space-x-2'>
                                        <GoLightBulb className='rounded-xs w-5 h-5' />
                                        <p>Lighting</p>
                                    </div>
                                    <IoIosArrowForward />
                                </Button>
                                <Button className='flex justify-between bg-mountain-100 p-3 rounded-xl w-full font-normal'>
                                    <div className='flex items-center space-x-2'>
                                        <AiOutlineCamera className='rounded-xs w-5 h-5' />
                                        <p>Camera</p>
                                    </div>
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className="shadow-none" defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography component="span" className="font-medium">
                                Advance Settings
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-mountain-600 text-sm'>Number of Images</p>
                                <ToggleButtonGroup
                                    className="flex justify-between gap-2 m-1.5"
                                    size="large"
                                    value={numberOfImages}
                                    exclusive
                                    onChange={handleSelectNumber}
                                >
                                    <ToggleButton
                                        value="1"
                                        className="-m-0.5 px-4 py-2 border-0 rounded-full w-1/4 normal-case transition duration-300 ease-in-out transform"
                                        sx={{
                                            backgroundColor: '#e0e0e0',
                                            '&.Mui-selected': {
                                                backgroundColor: '#c7d2fe',
                                                color: '#000',
                                                '&:hover': {
                                                    backgroundColor: '#c7d2fe',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0',
                                            },
                                        }}
                                    >
                                        1
                                    </ToggleButton>
                                    <ToggleButton
                                        value="2"
                                        className="-m-0.5 px-4 py-2 border-0 rounded-full w-1/4 normal-case transition duration-300 ease-in-out transform"
                                        sx={{
                                            backgroundColor: '#e0e0e0',
                                            '&.Mui-selected': {
                                                backgroundColor: '#c7d2fe',
                                                color: '#000',
                                                '&:hover': {
                                                    backgroundColor: '#c7d2fe',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0',
                                            },
                                        }}
                                    >
                                        2
                                    </ToggleButton>
                                    <ToggleButton
                                        value="3"
                                        className="-m-0.5 px-4 py-2 border-0 rounded-full w-1/5 normal-case transition duration-300 ease-in-out transform"
                                        sx={{
                                            backgroundColor: '#e0e0e0',
                                            '&.Mui-selected': {
                                                backgroundColor: '#c7d2fe',
                                                color: '#000',
                                                '&:hover': {
                                                    backgroundColor: '#c7d2fe',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0',
                                            },
                                        }}
                                    >
                                        3
                                    </ToggleButton>
                                    <ToggleButton
                                        value="4"
                                        className="-m-0.5 px-4 py-2 border-0 rounded-full w-1/4 normal-case transition duration-300 ease-in-out transform"
                                        sx={{
                                            backgroundColor: '#e0e0e0',
                                            '&.Mui-selected': {
                                                backgroundColor: '#c7d2fe',
                                                color: '#000',
                                                '&:hover': {
                                                    backgroundColor: '#c7d2fe',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0',
                                            },
                                        }}
                                    >
                                        4
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </AccordionDetails>
            </Accordion>
            <div className='relative flex flex-col items-end rounded-xl w-4/5'>
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
                        <p>Upgrade</p>
                    </Button>
                </div>
                <div className='bottom-2 left-1/2 absolute flex -translate-x-1/2'>
                    <Input placeholder='What do you imagine about?...' className='relative flex bg-white shadow-md pr-28 border border-mountain-100 rounded-xl w-[760px] h-15 placeholder:text-mountain-400' />
                    <Button className='top-1/2 right-4 absolute flex items-center bg-indigo-100 px-4 -translate-y-1/2'>Generate</Button>
                </div>
            </div>
        </div>
    )
}

export default ArtGenAI