import React, { useState } from 'react';

import './HamburgerMenu.css'; // подключите CSS-файл для стилей

const HamburgerMenu = ({ children }) => {
    // Хук состояния для открытия/закрытия меню
    const [isOpen, setIsOpen] = useState(false);

    // Функция для переключения состояния меню
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Кнопка "гамбургер" */}

            <button className="hamburger" onClick={toggleMenu}>
                ☰
            </button>
            {/* Меню, отображаемое при isOpen === true */}
            {isOpen && (
                <div className={`menu ${isOpen ? 'open' : ''}`}>
                    {children}
                </div>
            )}
           
        </>
    );
};

export default HamburgerMenu;
