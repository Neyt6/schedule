import axios from "axios";
import React, { useEffect, useState, } from "react";

import "./Schedule.css"
import ScheduleRow from "./ScheduleRow";
import HideBlock from "../../components/HideBlock";
import HamburgerMenu from "../../components/HamburgerMenu";

const Schedule = () => {

    let [currentWeek, setCurrentWeek] = useState(1);
    let [scheduleTable, setScheduleTable] = useState([])

    let [scheduleWeeks, setScheduleWeeks] = useState([])
    let [currentGroup, setCurrentGroup] = useState(localStorage.getItem('group') || false);
    let [currentGroupName, setCurrentGroupName] = useState("");

    let [VPKList, setVPKList] = useState([])
    let [currentVPK, setCurrentVPK] = useState(localStorage.getItem('VPK') || false);
    let [currentVPKName, setCurrentVPKName] = useState("");

    let [groupList, setGroupList] = useState();

    let [notification, setNotification] = useState("Loading...")

    let [contrastColor, setContrastColor] = useState(localStorage.getItem('contrastColor') || "#58e870");
    document.documentElement.style.setProperty('--contrast-color', contrastColor);

    let [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('backgroundColor') || "#808080");
    document.documentElement.style.setProperty('--background-color', backgroundColor);

    let [textColor, setTextColor] = useState(localStorage.getItem('textColor') || "#f0f8ff");
    document.documentElement.style.setProperty('--text-color', textColor);

    let [onVPK, setOnVPK] = useState(localStorage.getItem('onVPK') || false);

    const getDataByWeek = (week) => {
        let tempGroupTable = []

        axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentGroup + "&week=" + week)
            .then(res => {
                tempGroupTable = res.data.table.table
                if (currentVPK) {
                    axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentVPK + "&week=" + week)
                        .then(res => {
                            addVPKToTable(tempGroupTable, res.data.table.table)
                        })
                }
                else {
                    setScheduleTable(tempGroupTable)
                }

            })
            .catch(error => {
                setScheduleTable([])
                setNotification("Расписания для этой недели пока нет")
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
                        showGroupSchedule(res.data.table.group)
                    }
                    else {
                        setGroupList(res.data.choices)
                    }
                })
        }
    }

    const getVPKList = () => {
        axios.get("https://webictis.sfedu.ru/schedule-api/?query=впк")
            .then(res => {
                let vpk = res.data.choices
                vpk.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });

                setVPKList(vpk)
            })
    }

    const addClassToWeek = async (week) => {
        let weeksEl = document.getElementsByClassName("week")

        weeksEl[Number(currentWeek) - 1].classList.add("currentWeek")

        for (let i = 0; i < weeksEl.length; i++) {
            weeksEl[i].classList.remove("weekActive")
        }
        weeksEl[Number(week) - 1].classList.add("weekActive")
    }

    const showGroupSchedule = (group) => {
        if (group) {
            localStorage.setItem("group", group)
            setCurrentGroup(group);
            setGroupList()
            document.getElementById("groupInput").value = ""
            addClassToWeek(currentWeek)
        }
    }

    const showVPKSchedule = (vpk) => {
        if (vpk) {
            console.log(vpk);

            localStorage.setItem("VPK", vpk)
            setCurrentVPK(vpk);
        }
    }

    const onKeyDown = (e) => {
        if (e.code === 'Enter') {
            getGroupList(e.target.value)
        }
    }

    const itsNoEmpty = (list) => {
        for (let i = 1; i < list.length; i++) {
            if (list[i] !== "") {
                return true
            }
        }
        return false
    }

    const addVPKToTable = (tempGroupTable, tempVPKTable) => {
        let tempScheduleTable = []

        tempGroupTable.forEach((element, ind) => {
            if (itsNoEmpty(tempVPKTable[ind])) {
                tempScheduleTable.push(tempVPKTable[ind])
            }
            else {
                tempScheduleTable.push(element)
            }
        });

        return tempScheduleTable
    }

    const changeContrastColor = (color) => {
        setContrastColor(color)
        localStorage.setItem("contrastColor", color)
    }

    const changeBackgroundColor = (color) => {
        setBackgroundColor(color)
        localStorage.setItem("backgroundColor", color)
    }

    const changeTextColor = (color) => {
        setTextColor(color)
        localStorage.setItem("textColor", color)
    }

    const changeOffVPK = (e) => {
        setOnVPK(e.target.checked)
        localStorage.setItem("onVPK", e.target.checked)

        if (!e.target.checked) {
            setVPKList([])
            setCurrentVPK("")
            setCurrentVPKName("")
            localStorage.removeItem("VPK")

        }
    }

    useEffect(() => {

        const addVPKToTable = (tempGroupTable, tempVPKTable) => {
            let tempScheduleTable = []

            tempGroupTable.forEach((element, ind) => {
                if (itsNoEmpty(tempVPKTable[ind])) {
                    tempScheduleTable.push(tempVPKTable[ind])
                }
                else {
                    tempScheduleTable.push(element)
                }
            });

            setScheduleTable(tempScheduleTable)
        }

        if (onVPK) {
            getVPKList()
        }

        if (currentGroup) {
            axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentGroup)
                .then(res => {
                    let tempGroupTable = res.data.table.table
                    setScheduleWeeks(res.data.weeks)
                    setCurrentWeek(res.data.table.week)
                    setCurrentGroupName(res.data.table.name)

                    if (currentVPK) {
                        axios.get("https://webictis.sfedu.ru/schedule-api/?group=" + currentVPK)
                            .then(res => {
                                let tempVPKTable = res.data.table.table
                                setCurrentVPKName(res.data.table.name)

                                addVPKToTable(tempGroupTable, tempVPKTable)
                            })
                    }
                    else {
                        setScheduleTable(tempGroupTable)
                    }

                })
        }

    }, [currentGroup, currentVPK, onVPK])

    return (
        <>
            <div className="content text">
                <HamburgerMenu>
                    Настройки:
                    <div>
                        <label htmlFor="contrastColor" className="text">Контрасный цвет </label>
                        <input type="color" value={contrastColor} id="contrastColor" onChange={e => changeContrastColor(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="backgroundColor" className="text">Задний фон </label>
                        <input type="color" value={backgroundColor} id="backgroundColor" onChange={e => changeBackgroundColor(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="textColor" className="text">Цвет текста </label>
                        <input type="color" value={textColor} id="textColor" onChange={e => changeTextColor(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="unloadModelCheckBox" className="">Включить ВПК</label>
                        <input
                            type="checkbox"
                            id="unloadModelCheckBox"
                            checked={onVPK}
                            onChange={(e) => changeOffVPK(e)}
                        />
                    </div>
                </HamburgerMenu>

                <div className="scheduleContent">
                    <div className="inputBlock">
                        <input id="groupInput" className="border text" placeholder={currentGroupName + (currentVPKName ? " + " + currentVPKName : "")} onKeyDown={onKeyDown} />

                        <button
                            className="groupButton border text"
                            onClick={() => getGroupList(document.getElementById("groupInput").value)}>
                            Клик
                        </button>
                    </div>

                    {!groupList ? <> </> :
                        <div className="groupBlock">
                            {groupList.map((group, ind) =>
                                <div key={ind} className="group" onClick={() => showGroupSchedule(group.group)} >
                                    {group.name}
                                </div>
                            )}
                        </div>
                    }

                    {scheduleWeeks.length === 0 ? <> </> :
                        <div className="weeks border">
                            {scheduleWeeks.map((week, ind) =>
                                <div key={ind} className={"week" + (week === currentWeek ? " currentWeek weekActive" : "")} onClick={() => { getDataByWeek(week); addClassToWeek(week) }} >
                                    {week}
                                </div>
                            )}
                        </div>
                    }

                    {scheduleTable.length === 0 ?
                        <>
                            {currentGroup ? notification : "Введите группу, фамилию преподавателя или номер аудитории"}
                        </>
                        :
                        <div className="schedule border sheduleText">
                            {scheduleTable.map((row, ind) => <ScheduleRow key={ind} row={row} />)}
                        </div>
                    }

                    {VPKList.length === 0 ? <> </> :
                        <HideBlock title={"ВПК"} hide={true}>
                            <div className="vpks border">
                                {VPKList.map((vpk, ind) =>
                                    <div key={ind} className={"week vpk" + (vpk.group === currentVPK ? " currentWeek" : "")} onClick={() => showVPKSchedule(vpk.group)} >
                                        {vpk.name.replace("ВПК", "")}
                                    </div>
                                )}
                                <div className="week" onClick={() => { setCurrentVPK(false); localStorage.removeItem("VPK"); setCurrentVPKName("") }}>Убрать ВПК</div>
                            </div>
                        </HideBlock>
                    }
                </div>

            </div>
        </>
    )
}

export default Schedule