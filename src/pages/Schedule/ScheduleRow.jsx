import React from "react";

const ScheduleRow = ({ row }) => {

    var dateString = row[0].substring(4)

    const months = {
        "января": 0,
        "февраля": 1,
        "марта": 2,
        "апреля": 3,
        "мая": 4,
        "июня": 5,
        "июля": 6,
        "августа": 7,
        "сентября": 8,
        "октября": 9,
        "ноября": 10,
        "декабря": 11
    };

    const [day, monthName] = dateString.split('  ');

    const month = months[monthName];
    const currentDate = new Date();

    var rowClass = ""
    if (Number(day) === currentDate.getDate() && month === currentDate.getMonth()){
        console.log(true);
        rowClass = " rowGlow"
    }

    return (
        <div className={"row" + rowClass}>
            {row.map((cell, ind) =>
                <code key={ind} className="cell">
                    {cell}
                </code>
            )}
        </div>
    )
}

export default ScheduleRow