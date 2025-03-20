"use client"
import {useState} from "react"
import "./calendar.css"
import Button from "./Button";

function generateDaysOfMonth(year, month, minDate, maxDate){
    const days = [];
    const date = new Date(year, month, 1);
    const minTime = minDate ? new Date(minDate): null;
    const maxTime = maxDate ? new Date(maxDate): null;

    while (date.getMonth() === month){
        const disbled = (minTime !== null && date < minTime) || (maxTime !== null && date > maxTime);

        days.push({
            year: new Date(date).getFullYear(),
            month: new Date(date).getMonth() + 1,
            fullDate: new Date(date), 
            disbled,
            daysOfWeek: date.getDay(),
        })
        date.setDate(date.getDate() + 1);
    }
    return days
}

export default function Calendar({onDateSelect, minDate, maxDate}){
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
    const today = new Date();
    const [currentDay, setCurrentDay] = useState(today)
    const [display, setDisplay] = useState("false")
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectView, setSelectView] = useState("months");
    const year = currentDay.getFullYear();
    const month = currentDay.getMonth();
    const days = generateDaysOfMonth(year, month, minDate, maxDate);

    function monthDisable(mon, minDate, maxDate){
        const newDate = new Date(currentDay).setMonth(mon)
        if (new Date(newDate).setDate(1) < new Date(minDate).setDate(1) || new Date(newDate).setDate(1) > new Date(maxDate).setDate(1)){
            return true;
        }
        return false
    }
    function handlePrevYear(){
        const newDate = new Date(currentDay);
        if(newDate.setFullYear(year - 1) < new Date(minDate).setMonth(0)) return
        setCurrentDay(newDate);
    }
    function handleNextYear(){
        const newDate = new Date(currentDay);
        if(newDate.setFullYear(year + 1) > new Date(maxDate).setMonth(11)) return
        setCurrentDay(newDate)
    }
    function handlePrevMonth(){
        const newDate = new Date(currentDay);
        if (newDate.setMonth(month - 1) < new Date(minDate).setDate(1)) return
        setCurrentDay(newDate);
    }

    function handleNextMonth(){
        const newDate = new Date(currentDay);
        if(newDate.setMonth(month + 1) > new Date(maxDate).setDate(31)) return
        setCurrentDay(newDate)
    }

    function handleDateSelected(day, disabled){
        if(disabled) return
        const selected = (new Date(year, month, day))
        setSelectedDate(selected); 
        if (onDateSelect) { 
            onDateSelect(selected.toISOString().split("T")[0] ); 
        }
    }
    function handleMonthSelected(mon){
        const newDate = (new Date(currentDay)).setMonth(mon);
        if(monthDisable(newDate, minDate, maxDate)) return
        setCurrentDay(new Date(newDate))
        setSelectView("months")
    }
    return(
        <div className="calendar">
            <div className="calendar-header">
                <Button onClick={selectView === "years" ? handlePrevYear : handlePrevMonth}>{"<"}</Button>
                <p onClick={()=>{display === "true" ? setDisplay("false") :setDisplay("true") }}>
                    {selectView === "months" ? `${months[month]} de ${year}`: year}
                </p>
                <Button onClick={selectView === "years" ? handleNextYear : handleNextMonth}>{">"}</Button>
            </div>
            <div className={`container-${display}`} >
                <div className="views">
                    <p className={selectView === "years" ? "selected" : ""} onClick={()=>{setSelectView("years")}}>Años</p>
                    <p className={selectView === "years" ? "" : "selected"} onClick={()=>{setSelectView("months")}}>Meses</p>
                </div>
                {selectView === "years" && (
                    <div className="view-years">
                        {months.map((mon,index)=>{
                            return(
                                <span 
                                    key={index}
                                    onClick={()=>{ handleMonthSelected(index)}}
                                    className={monthDisable(index, minDate, maxDate) ? "disabled" : ""}
                                >{mon}</span>
                            )
                        })}
                    </div>
                )}
                {selectView === "months" && (
                    <div className="view-months">
                        <div className="days-week">
                            {dayNames.map((day, index) => {
                                return <span key={index}>{day} </span>
                            })}
                        </div>
                        <div className="calendar-grid">
                            {Array.from({length: days[0].daysOfWeek}).map((_, index) => {
                                return <span key={`empty-${index}}`} className="empty"></span>
                            })}
                            {days.map((day, index) => {
                                const isSelected = selectedDate && selectedDate.toDateString() === day.fullDate.toDateString();
                                const isToday = day.fullDate.toDateString() === today.toDateString();
                                return (
                                    <span 
                                        key={index} 
                                        onClick={() => {handleDateSelected(index + 1, day.disbled)}}
                                        className={`${
                                            day.disbled ? "disabled" : ""
                                            }${
                                            isSelected ? "selected" : isToday ? "today" : ""
                                        }`}
                                    >
                                        {index + 1} 
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    )
}