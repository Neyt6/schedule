import React, { useState } from 'react';
import './HamburgerMenu.css'; 

const HamburgerMenu = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="hamburger" onClick={toggleMenu}>
                {"☰"}
            </button>
            {isOpen && (
                <div className="menu border">
                    {children}
                </div>
            )}

        </>
    );
};

export default HamburgerMenu;
