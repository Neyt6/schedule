import React from "react";
import { Link } from "react-router-dom";

const itsToday = (dateString) => {

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

    if (Number(day) === currentDate.getDate() && month === currentDate.getMonth()) {
        return true
    }
    return false
}

const addAktru = (cell) => {
    if (cell.includes("АКТРУ")) {
        cell = cell.replace("АКТРУ", "")
        return <div>{cell}<Link className="actruLink" href='https://aktru.sfedu.ru/timetable/'>АКТРУ</Link></div>
    }

    return cell
}

const ScheduleRow = ({ row }) => {

    var rowClass = ""
    if (itsToday(row[0].substring(4))) {
        rowClass = " rowGlow"
    }

    return (
        <div className={"row" + rowClass}>
            {row.map((cell, ind) =>
                <code key={ind} className="cell">
                    {addAktru(cell)}
                </code>
            )}
        </div>
    )
}

export default ScheduleRow