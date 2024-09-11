import axios from "axios";
import React, { useEffect, useState, } from "react";

import "./Schedule.css"
import ScheduleRow from "./ScheduleRow";
import PageTitle from "../../components/PageTitle";

const Schedule = () => {

    const [table, setTable] = useState([])

    const [scheduleTable, setScheduleTable] = useState([])
    const [scheduleWeeks, setScheduleWeeks] = useState([])

    const [currentWeek, setCurrentWeek] = useState();

    const [groupList, setGroupList] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(localStorage.getItem('group') || false);
    const [currentGroupName, setCurrentGroupName] = useState("");

    const [scheduleVPKTable, setScheduleVPKTable] = useState([])
    const [VPKList, setVPKList] = useState([]);
    const [currentVPK, setCurrentVPK] = useState(localStorage.getItem('VPK') || false);
    const [currentVPKName, setCurrentVPKName] = useState("");


    const getDataByWeek = (week) => {
        axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentGroup + "&week=" + week)
            .then(res => {
                setScheduleTable(res.data.table.table)
            })
            .catch(error => {
                setScheduleTable([])
                console.log(error)
            })

        getVPKDataByWeek(week)
        setTable(addVPK(scheduleTable, scheduleVPKTable))

    }

    const getGroupList = (currentQuery) => {
        if (currentQuery !== "") {
            axios.get("https://webictis.sfedu.ru/schedule-api/?query=" + currentQuery)
                .then(res => {
                    if (res.data.result === "no_entries") {
                        setGroupList([{ name: "Нет результатов" }])
                    }
                    else if (!res.data.choices) {
                        choiceGroup(res.data.table.group)
                    }
                    else {
                        setGroupList(res.data.choices)
                    }
                })
        }
    }

    const getVPKList = () => {
        axios.get("https://webictis.sfedu.ru/schedule-api/?query=ВПК")
            .then(res => {
                setVPKList(res.data.choices)
            })
    }

    const getVPKDataByWeek = (week) => {
        axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentVPK + "&week=" + week)
            .then(res => {
                setScheduleVPKTable(res.data.table.table)
                console.log(res.data.table.table)
            })
            .catch(error => {
                setScheduleVPKTable([])
                console.log(error)
            })
    }

    const choiceVPK = (VPK) => {
        localStorage.setItem('VPK', VPK.group);
        setCurrentVPK(VPK.group)

        setCurrentVPKName(VPK.name)
    }

    const itsVPK = (arr) => {
        for (let i = 2; i <= 7; i++) {
            console.log(arr[i]);

            if (arr[i] !== '') {
                return true;
            }
        }

        return false;
    }

    const addVPK = (arr1, arr2) => {
        console.log(arr1, arr2);

        return arr1.map((item, index) => {
            return itsVPK(arr2[index]) ? arr2[index] : item;
        });
    }

    const addClassToWeek = async (week) => {
        let weeksEl = document.getElementsByClassName("week")

        weeksEl[Number(currentWeek) - 1].classList.add("currentWeek")

        for (let i = 0; i < weeksEl.length; i++) {
            weeksEl[i].classList.remove("weekActive")
        }
        weeksEl[Number(week) - 1].classList.add("weekActive")
    }

    const choiceGroup = (group) => {
        if (group) {
            localStorage.setItem('group', group);
            setCurrentGroup(group);
            setGroupList([])
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
                })
        }
        setTable(scheduleTable)
        getVPKList()

        if (currentVPK) {
            axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentVPK)
                .then(res => {
                    setScheduleVPKTable(res.data.table.table)
                    setCurrentVPKName(res.data.table.name)
                })
            setTable(addVPK(scheduleTable, scheduleVPKTable))
        }

    }, [currentGroup, currentVPK])

    return (
        <>
            <PageTitle title="Расписание ИКТИБ" />

            <div className="content text">
                <div className="scheduleContent">
                    <div className="inputBlock">
                        <input id="groupInput" className="border text" placeholder={currentGroupName + currentVPKName} onKeyDown={onKeyDown} />

                        <button
                            className="groupButton border text"
                            onClick={() => getGroupList(document.getElementById("groupInput").value)}>
                            Клик
                        </button>
                    </div>

                    {!groupList.length > 0 ? <> </> :
                        <div className="groupBlock">
                            {groupList.map((group, ind) =>
                                <div key={ind} className="group" onClick={() => choiceGroup(group.group)} >
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

                    {!table.length > 0 ?
                        <>
                            {currentGroup ? "Loading..." : "Выберите группу"}
                        </>
                        :
                        <div className="schedule border sheduleText">
                            {table.map((row, ind) => <ScheduleRow key={ind} row={row} />)}
                        </div>
                    }

                    {!VPKList.length > 0 ? <> </> :
                        <div className="weeks border">
                            {VPKList.map((VPK, ind) =>
                                <div key={ind} className={"week" + (VPK === currentWeek ? " currentWeek weekActive" : "")} onClick={() => { choiceVPK(VPK) }} >
                                    {VPK.name.replace("ВПК ", "")}
                                </div>
                            )}
                        </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Schedule