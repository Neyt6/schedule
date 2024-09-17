import { useState } from "react";
import "./HideBlock.css"

const HideBlock = ({ children, title, hide = false }) => {

    const [isOpen, setIsOpen] = useState(hide);

    const hideBlock = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <div
                className={"pointer " + (isOpen ? "arrowRight" : "arrowDown")}
                onClick={() => hideBlock()}>
                {title}
            </div>

            <div className={isOpen ? "disableBlock" : ""}>
                {children}
            </div>
        </>
    )
}

export default HideBlock