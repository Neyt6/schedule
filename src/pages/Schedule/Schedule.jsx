import axios from "axios";
import React, { useEffect, useState, } from "react";

import "./Schedule.css"
import ScheduleRow from "./ScheduleRow";
import HideBlock from "../../components/HideBlock";
import HamburgerMenu from "../../components/HamburgerMenu";

import colorSchemes from "./colorSchemes";
import Switch from "../../components/Switch";

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

    let [currentColorScheme, setCurrentColorScheme] = useState(localStorage.getItem('currentColorScheme') || colorSchemes[0].name)

    let [mainColor, setMainColor] = useState(localStorage.getItem('mainColor') || colorSchemes[0].mainColor);
    document.documentElement.style.setProperty('--main-color', mainColor);

    let [contrastColor, setContrastColor] = useState(localStorage.getItem('contrastColor') || colorSchemes[0].contrastColor);
    document.documentElement.style.setProperty('--contrast-color', contrastColor);

    let [textColor, setTextColor] = useState(localStorage.getItem('textColor') || colorSchemes[0].textColor);
    document.documentElement.style.setProperty('--text-color', textColor);

    let [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('backgroundColor') || colorSchemes[0].backgroundColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);

    let [onVPK, setOnVPK] = useState((localStorage.getItem('onVPK') === "true") || false);
    let [onOnlineTitle, setOnOnlineTitle] = useState((localStorage.getItem('onOnlineTitle') === "true") || false);

    let [itsWeekend,] = useState(new Date().toDateString().includes("Sun"))

    const getDataByWeek = (week) => {
        let tempGroupTable = []

        axios.get("https://shedule.rdcenter.ru/schedule-api/?group=" + currentGroup + "&week=" + week)
            .then(res => {
                tempGroupTable = res.data.table.table
                if (currentVPK) {
                    axios.get("https:/shedule.rdcenter.ru/schedule-api/?group=" + currentVPK + "&week=" + week)
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
                setNotification("Расписания для этой недели пока нет :(")
                console.log(error)
            })
    }

    const getGroupList = (currentQuery) => {
        if (currentQuery !== "") {
            axios.get("https://shedule.rdcenter.ru/schedule-api/?query=" + currentQuery)
                .then(res => {
                    if (res.data.result === "no_entries") {
                        setGroupList([{ name: "Нет результатов" }])
                    }
                    else if (!res.data.choices) {
                        showGroupSchedule(res.data.table.group)
                    }
                    else {
                        let l = res.data.choices.sort((a, b) => a.name.localeCompare(b.name));
                        setGroupList(l)
                    }
                })
        }
    }

    const getVPKList = () => {
        axios.get("https://shedule.rdcenter.ru/schedule-api/?query=впк")
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

        setScheduleTable( tempScheduleTable)
    }

    const changeColor = (setFunk, colorName, color) => {
        setFunk(color)
        localStorage.setItem(colorName, color)
    }

    const changeCurrentColorScheme = (scheme) => {
        localStorage.setItem("currentColorScheme", scheme)
        scheme = colorSchemes.find(item => item.name === scheme)

        changeColor(setMainColor, "mainColor", scheme.mainColor)
        changeColor(setContrastColor, "contrastColor", scheme.contrastColor)
        changeColor(setTextColor, "textColor", scheme.textColor)
        changeColor(setBackgroundColor, "backgroundColor", scheme.backgroundColor)
    }

    const changeOffVPK = (e) => {
        setOnVPK(e)
        localStorage.setItem("onVPK", e)

        if (!e) {
            setVPKList([])
            setCurrentVPK("")
            setCurrentVPKName("")
            localStorage.removeItem("VPK")
        }
    }

    const changeOnlineTitle = (e) => {
        setOnOnlineTitle(e)
        localStorage.setItem("onOnlineTitle", e)

        if (!e) {
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
            axios.get("https:/shedule.rdcenter.ru/schedule-api/?group=" + currentGroup)
                .then(res => {
                    let tempGroupTable = res.data.table.table
                    setScheduleWeeks(res.data.weeks)
                    setCurrentWeek(res.data.table.week)
                    setCurrentGroupName(res.data.table.name)

                    if (currentVPK) {
                        axios.get("https:/shedule.rdcenter.ru/schedule-api/?group=" + currentVPK)
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
                        <label htmlFor="mainColor" className="text">Основной цвет </label>
                        <input type="color" value={mainColor} id="mainColor" onChange={e => changeColor(setMainColor, "mainColor", e.target.value)}></input>
                        <button onClick={() => changeColor(setMainColor, "mainColor", colorSchemes[0].mainColor)} className="text resetButton">✖</button>
                    </div>

                    <div>
                        <label htmlFor="contrastColor" className="text">Контрастный цвет </label>
                        <input type="color" value={contrastColor} id="contrastColor" onChange={e => changeColor(setContrastColor, "contrastColor", e.target.value)}></input>
                        <button onClick={() => changeColor(setContrastColor, "contrastColor", colorSchemes[0].contrastColor)} className="text resetButton">✖</button>
                    </div>

                    <div>
                        <label htmlFor="textColor" className="text">Цвет текста </label>
                        <input type="color" value={textColor} id="textColor" onChange={e => changeColor(setTextColor, "textColor", e.target.value)}></input>
                        <button onClick={() => changeColor(setTextColor, "textColor", colorSchemes[0].textColor)} className="text resetButton">✖</button>
                    </div>

                    <div>
                        <label htmlFor="backgroundColor" className="text">Задний фон </label>
                        <input type="color" value={backgroundColor} id="backgroundColor" onChange={e => changeColor(setBackgroundColor, "backgroundColor", e.target.value)}></input>
                        <button onClick={() => changeColor(setBackgroundColor, "backgroundColor", colorSchemes[0].backgroundColor)} className="text resetButton">✖</button>
                    </div>

                    <label htmlFor="selectColorScheme">Выбрать цветовую схему:</label>
                    <select
                        id="selectColorScheme"
                        className="colorChoise border text"
                        value={currentColorScheme}
                        onChange={(e) => { setCurrentColorScheme(e.target.value); changeCurrentColorScheme(e.target.value) }}
                    >
                        {colorSchemes.map((item, ind) => <option key={ind} value={item.name}>{item.name}</option>)}
                    </select>

                    <Switch defaultValue={onVPK} title={"Включить ВПК"} onChangeValue={changeOffVPK} />
                    <Switch defaultValue={onOnlineTitle} title={"Отображать тип пары"} onChangeValue={changeOnlineTitle} />

                </HamburgerMenu>

                <div className="scheduleContent">
                    {itsWeekend && <div className="text">Сегодня выходной вообще-то, что ты тут забыл?</div>}

                    <div className="inputBlock">
                        <input id="groupInput" className="border text shadow" placeholder={currentGroupName + (currentVPKName ? " + " + currentVPKName : "")} onKeyDown={onKeyDown} />

                        <button
                            className="groupButton border text shadow"
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
                        <div className="weeks border shadow">
                            {scheduleWeeks.map((week, ind) =>
                                <div key={ind} className={"week" + (week === currentWeek ? " currentWeek weekActive" : "")} onClick={() => { getDataByWeek(week); addClassToWeek(week) }} >
                                    {week}
                                </div>
                            )}
                        </div>
                    }

                    {scheduleTable.length === 0 ?
                        <div className="text">
                            {currentGroup ? notification : "Введите группу, фамилию преподавателя или номер аудитории"}
                        </div>
                        :
                        <div className="schedule border shadow sheduleText">
                            {scheduleTable.map((row, ind) => <ScheduleRow key={ind} row={row} onOnline={onOnlineTitle}/>)}
                        </div>
                    }

                    {VPKList.length === 0 ? <> </> :
                        <HideBlock title={"ВПК"} hide={false}>
                            <div className="vpks border shadow">
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