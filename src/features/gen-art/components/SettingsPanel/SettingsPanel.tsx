import React, { useState } from 'react'

//Components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Button, Collapse, ToggleButton, ToggleButtonGroup } from '@mui/material';

//Icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { GoSidebarExpand } from "react-icons/go";
import { IoImageOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { GoLightBulb } from "react-icons/go";
import { AiOutlineCamera } from "react-icons/ai";
import { IoColorFillOutline } from "react-icons/io5";

//Assets
import ModelOptions from './ModelOptions';
import { aspectOptions, MockModelOptionsData } from '../../mock/Data';
import AspectRatioOptions from './AspectRatio';

const SettingsPanel: React.FC<PanelProps> = ({ isExpanded, setIsExpanded }) => {
    const [usedModel, setUsedModel] = useState<UsedModel | null>(MockModelOptionsData[0]);
    const [aspectRatio, setAspectRatio] = useState(aspectOptions[0]);
    const [numberOfImages, setNumberOfImages] = useState('4');

    const handleParentToggle = (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };

    const handleSelectNumber = (
        _: React.MouseEvent<HTMLElement>,
        newNumber: string
    ) => {
        if (newNumber) {
            setNumberOfImages(newNumber);
        }
    };

    const handleSelectModel = (model: UsedModel) => {
        setUsedModel(model);
    }

    return (
        <Accordion
            expanded={isExpanded}
            onChange={handleParentToggle}
            slots={{ transition: Collapse }}
            slotProps={{
                transition: {
                    timeout: 200,
                },
            }}
            className={`flex flex-col z-50 absolute bg-white shadow-md border border-mountain-300 rounded-xl w-[300px] ${isExpanded ? 'h-[680px]' : 'h-fit'}`}>
            <AccordionSummary
                expandIcon={<GoSidebarExpand />}
                aria-controls="panel2-content"
                id="panel2-header"
                className={`bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 ${isExpanded ? 'rounded-t-xl' : 'rounded-xl'}`}
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
                    <AccordionDetails className='flex flex-col space-y-2 pb-0'>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-mountain-600 text-sm'>Model</p>
                            <ModelOptions model={usedModel!} selectModel={handleSelectModel} />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-mountain-600 text-sm'>Aspect Ratio</p>
                            <AspectRatioOptions selectedAspect={aspectRatio} onChange={setAspectRatio} />
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
                    <AccordionDetails className='flex flex-col'>
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
    )
}

export default SettingsPanel;