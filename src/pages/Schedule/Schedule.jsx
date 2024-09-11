import axios from "axios";
import React, { useEffect, useState, } from "react";

import "./Schedule.css"
import ScheduleRow from "./ScheduleRow";
import PageTitle from "../../components/PageTitle";

const Schedule = () => {

    let [scheduleTable, setScheduleTable] = useState([])

    let [scheduleWeeks, setScheduleWeeks] = useState([])
    let [currentWeek, setCurrentWeek] = useState();
    let [currentGroupName, setCurrentGroupName] = useState();

    let [groupList, setGroupList] = useState();
    let [currentGroup, setCurrentGroup] = useState(localStorage.getItem('group') || false);

    const getDataByWeek = (week) => {
        axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentGroup + "&week=" + week)
            .then(res => {
                setScheduleTable(res.data.table.table)
            })
            .catch(error => {
                setScheduleTable([])
                console.log(error)
            })
    }

    const getGroupList = (currentQuery) => {
        if (currentQuery !== "") {
            axios.get("https://webictis.sfedu.ru/schedule-api/?query=" + currentQuery)
                .then(res => {
                    if (res.data.result === "no_entries") {
                        setGroupList([{ name: "Нет результатов" }])
                    }
                    else if (!res.data.choices) {
                        showCurrentSchedule(res.data.table.group)
                    }
                    else {
                        setGroupList(res.data.choices)
                    }
                })
        }
    }

    const addClassToWeek = async (week) => {
        let weeksEl = document.getElementsByClassName("week")

        console.log(weeksEl);


        weeksEl[Number(currentWeek) - 1].classList.add("currentWeek")

        for (let i = 0; i < weeksEl.length; i++) {
            weeksEl[i].classList.remove("weekActive")
        }
        weeksEl[Number(week) - 1].classList.add("weekActive")
    }

    const showCurrentSchedule = (group) => {
        if (group) {
            localStorage.setItem('group', group);
            setCurrentGroup(group);
            setGroupList()
            document.getElementById("groupInput").value = ""
            addClassToWeek(currentWeek)
        }
    }

    const onKeyDown = (e) => {
        if (e.code === 'Enter') {
            getGroupList(e.target.value)
        }
    }



    useEffect(() => {
        if (currentGroup) {
            axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentGroup)
                .then(res => {
                    setScheduleTable(res.data.table.table)
                    setScheduleWeeks(res.data.weeks)
                    setCurrentWeek(res.data.table.week)
                    setCurrentGroupName(res.data.table.name)

                    //addClassToWeek(res.data.table.week)

                })
        }

    }, [currentGroup])

    return (
        <>
            <PageTitle title="Расписание ИКТИБ" />

            <div className="content text">
                <div className="scheduleContent">
                    <div className="inputBlock">
                        <input id="groupInput" className="border text" placeholder={currentGroupName} onKeyDown={onKeyDown} />

                        <button
                            className="groupButton border text"
                            onClick={() => getGroupList(document.getElementById("groupInput").value)}>
                            Клик
                        </button>
                    </div>

                    {!groupList ? <> </> :
                        <div className="groupBlock">
                            {groupList.map((group, ind) =>
                                <div key={ind} className="group" onClick={() => showCurrentSchedule(group.group)} >
                                    {group.name}
                                </div>
                            )}
                        </div>
                    }

                    {!scheduleWeeks.length > 0 ? <> </> :
                        <div className="weeks border">
                            {scheduleWeeks.map((week, ind) =>
                                <div key={ind} className={"week" + (week === currentWeek ? " currentWeek weekActive" : "")} onClick={() => { getDataByWeek(week); addClassToWeek(week) }} >
                                    {week}
                                </div>
                            )}
                        </div>
                    }

                    {!scheduleTable.length > 0 ?
                        <>
                            {currentGroup ? "Loading..." : "Выберите группу"}
                        </>
                        :
                        <div className="schedule border sheduleText">
                            {scheduleTable.map((row, ind) => <ScheduleRow key={ind} row={row} />)}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Schedule