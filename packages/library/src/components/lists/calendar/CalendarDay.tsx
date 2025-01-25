import "./CalendarDay.css"
import React from "react"
import Calendar from "./Calendar"
import {LocalDate} from "@js-joda/core";
import {format} from "../../shared/DateTimeUtils";
import {classes} from "../../shared/Utils";

function CalendarDay(properties: CalendarDay.Attributes) {

    const {children, className, day, events, onDayClick} = properties

    return (
        <div className={classes("calendar-day", className)}
             style={{display: "flex", width: "100%"}} onClick={() => onDayClick(day)}>
            <div className={"week"}>
                <small>{format(day, "EEEE")}</small>
            </div>
            <div className={"date"} key={format(day, "dd.MM.yyyy")}>
                <div style={{margin: "10px"}}>
                    <small>{format(day, "dd.MM.yyyy")}</small>
                    {events
                        .filter((event: any) => {
                            return day.isEqual(event.start.toLocalDate())
                        })
                        .map((event: any) => (
                            <Calendar.Provider key={event.id} data={event}>
                                {children}
                            </Calendar.Provider>
                        ))}
                </div>
            </div>
        </div>
    )
}

namespace CalendarDay {
    export interface Attributes {
        children: React.ReactNode
        day: LocalDate
        events: any
        onDayClick: (date : LocalDate) => void
        className? : string
    }
}

export default CalendarDay