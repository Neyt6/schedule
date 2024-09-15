import { useRef } from "react";
import "./HideBlock.css"

const HideBlock = ({ children, title, hide = false }) => {

    const childRef = useRef(null);
    const titleRef = useRef(null);

    const hideBlock = () => {
        childRef.current.classList.toggle("disableBlock")
        titleRef.current.classList.toggle("arrowRight")
        titleRef.current.classList.toggle("arrowDown")
    }

    return (
        <>
            <div
                ref={titleRef}
                className={"pointer " + (hide ? "arrowRight" : "arrowDown")}
                onClick={() => hideBlock()}>
                {title}
            </div>

            <div ref={childRef} className={hide ? "disableBlock" : ""}>
                {children}
            </div>
        </>
    )
}

export default HideBlock