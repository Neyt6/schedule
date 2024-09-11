import React from "react";

const ScheduleRow = ({ row }) => {

    return (
        <div className="row">
            {row.map((cell, ind) =>
                <code key={ind} className="cell">
                    {cell}
                </code>
            )}
        </div>
    )
}

export default ScheduleRow