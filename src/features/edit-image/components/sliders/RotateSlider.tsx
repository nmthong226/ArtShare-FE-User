import { Slider, Box } from '@mui/material';
import { Label } from '@/components/ui/label'; // Adjust path as needed
import { Input } from '@/components/ui/input';

function valuetext(value: number) {
    return `${value}%`;
}

export default function RotateSlider({ rotate, onChange, min = -360, max = 360 }: { rotate: number, onChange?: (value: number) => void, min?: number, max?: number }) {
    const handleChange = (_: Event, newValue: number | number[]) => {
        const val = Array.isArray(newValue) ? newValue[0] : newValue;
        onChange?.(val);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = Number(e.target.value);
        if (!isNaN(rawValue)) {
            const clampedValue = Math.max(min, Math.min(max, rawValue));
            onChange?.(clampedValue);
        }
    };

    return (
        <div className='flex flex-col space-y-2'>
            <div className='flex justify-between w-full'>
                <Label className='font-medium'>Rotation</Label>
                <Input
                    type="number"
                    inputMode="numeric"
                    className='p-2 w-16 text-sm text-right'
                    value={Math.floor(rotate)}
                    onChange={handleInputChange}
                    min={min}
                    max={max}
                    style={{ direction: "ltr" }}
                />
            </div>
            <Box sx={{ width: "98%" }}>
                <Slider
                    value={rotate}
                    onChange={handleChange}
                    getAriaValueText={valuetext}
                    step={1}
                    min={min}
                    max={max}
                    valueLabelDisplay="off"
                    sx={{
                        '& .MuiSlider-track': {
                            border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                            height: 20,
                            width: 20,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            '&:hover': {
                                boxShadow: '0 0 0 8px rgba(79, 70, 229, 0.16)',
                            },
                            '&.Mui-active': {
                                boxShadow: '0 0 0 14px rgba(79, 70, 229, 0.16)',
                            },
                        },
                        '& .MuiSlider-valueLabel': {
                            background: "none",
                            backgroundColor: '#4f46e5',
                            borderRadius: '4px',
                        },
                    }}
                />
            </Box>
        </div>
    );
}
