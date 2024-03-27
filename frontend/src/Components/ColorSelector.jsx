import { useState, useEffect } from 'react';
import './components.css';
import {COLOR_PALETTE} from "../Utils/Constants.jsx";

const ColorSelector = ({ selectedColor = '', onChange, disabledColors = [] }) => {
    const [localSelectedColor, setLocalSelectedColor] = useState(selectedColor);
    const [colors, setColors] = useState(COLOR_PALETTE);

    useEffect(() => {
        disabledColors &&
        setColors(colors.map(color => ({
            ...color,
            disabled: disabledColors.includes(color.color),
        })));
    }, [disabledColors]);


    useEffect(() => {
        setLocalSelectedColor(selectedColor);
    }, [selectedColor]);


    const handleColorClick = (color, isDisabled) => {
        if (!isDisabled) {
            if (localSelectedColor === color) {
                setLocalSelectedColor(null);
                onChange(null);
            } else {
                setLocalSelectedColor(color);
                onChange(color);
            }
        }
    };

    return (
        <div className="flex flex-wrap">
            {colors.map((item, index) => (
                <div
                    key={index}
                    className={`rounded-box w-10 h-10 m-2 ${
                        localSelectedColor === item.color ? 'selected' : ''
                    } ${item.disabled ? 'disabled' : ''}`}
                    style={{
                        backgroundColor: item.color,
                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                        opacity: item.disabled ? 0.1 : 1,
                    }}
                    onClick={() => handleColorClick(item.color, item.disabled)}
                >
                    <div className="hover-overlay"></div>
                </div>
            ))}
        </div>)
}

export default ColorSelector;
