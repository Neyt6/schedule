import React, { useState } from 'react';
import './Switch.css';

const Switch = ({ defaultValue, title, onChangeValue }) => {
    const [isChecked, setIsChecked] = useState(defaultValue || false);

    const handleChange = () => {
        setIsChecked(!isChecked);
        onChangeValue(!isChecked)
    };

    return (
        <div style={{ paddingTop: "5px" }}>
            <label htmlFor={title}>{title}</label>
            <label className="switch">
                <input id={title} type="checkbox" checked={isChecked} onChange={handleChange} />
                <span className="slider"></span>
            </label>
        </div>
    );
};

export default Switch;
