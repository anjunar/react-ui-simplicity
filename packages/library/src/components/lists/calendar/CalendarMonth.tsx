import "./CalendarMonth.css"
import React from "react"
import CalendarDay from "./CalendarDay"
import {ChronoField, LocalDate} from "@js-joda/core";
import Calendar from "./Calendar";

function CalendarMonth(properties : CalendarMonth.Attributes) {

    const { children, events, month, year, onDayClick, validDays } = properties

    const calendar = []

    const startDay = LocalDate.of(year, month, 1)
    const endDay = startDay.plusMonths(1)

    let cursor = startDay
    while (cursor.isBefore(endDay)) {
        calendar.push(cursor)
        cursor = cursor.plusDays(1)
    }

    const activeDay = (day : LocalDate) => {
        if (validDays.findIndex((validDay : Calendar.ValidDay) => {
            return day.get(ChronoField.DAY_OF_WEEK) === validDay.day.value()
        }) > -1) {
            return true
        }
        return false
    }

    function onDayClickHandler(date : LocalDate) {
        if (activeDay(date)) {
            onDayClick(date)
        }
    }

    return (
        <div className={"calendar-month"}>
            {calendar.map((day, index) => {
                return (
                    <CalendarDay events={events} key={index} day={day} onDayClick={onDayClickHandler} className={activeDay(day) ? "active" : "passive"}>
                        {children}
                    </CalendarDay>
                )
            })}
        </div>
    )
}

namespace CalendarMonth {

    export interface Attributes {
        children : React.ReactNode
        events : any[]
        month : any
        year : any
        onDayClick : (date : LocalDate) => void
        validDays? : Calendar.ValidDay[]
    }
}

export default CalendarMonth