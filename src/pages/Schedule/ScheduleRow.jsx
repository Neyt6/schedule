import React from "react";

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
        cell = cell.replace(new RegExp("АКТРУ", 'gi'), "")

        return <div>{cell}<a className="actruLink" href={"https://aktru.sfedu.ru/timetable/day/"} target="_blank" rel="noreferrer" >АКТРУ</a></div>
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
                <div key={ind} className="cell">
                    {/[А-Яа-я]-\d{3}/.test(cell) && <div className="offlineTitle">Очно📚</div>}
                    {(cell.includes("LMS") || cell.includes("АКТРУ")) && <div className="onlineTitle">Онлайн💻</div>}
                    {addAktru(cell)}
                </div>
            )}
        </div>
    )
}

export default ScheduleRow