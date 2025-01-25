import "./Calendar.css"
import React, {createContext, CSSProperties, useLayoutEffect, useState} from "react"
import CalendarMonth from "./CalendarMonth"
import Month from "./date/Month"
import Year from "./date/Year"
import {ChronoField, DayOfWeek, LocalDate, LocalTime} from "@js-joda/core";

function Calendar(properties: Calendar.Attributes) {

    const {children, loader, onDayClick, onMonthClick, validDays, ...rest} = properties

    const [events, setEvents] = useState(<div key={"empty"}></div>)

    const currentDate = LocalDate.now()

    const [month, setMonth] = useState(currentDate.get(ChronoField.MONTH_OF_YEAR))
    const [year, setYear] = useState(currentDate.get(ChronoField.YEAR))

    useLayoutEffect(() => {
        const selectedDate = LocalDate.of(year, month, 1)

        const startDay = selectedDate
        const endDay = selectedDate.plusMonths(1)

        let query = {
            index : 0,
            limit : 1000,
            start: startDay.toJSON(),
            end: endDay.toJSON()
        }

        if (onMonthClick) {
            onMonthClick(month - 1)
        }

        loader(query, (rows: any[], size: number) => {
            setEvents(
                <>
                    <div>
                        <div style={{border: "1px solid var(--color-background-secondary)"}}>
                            <div style={{display: "flex", gap: "10px", margin: "20px"}}>
                                <Month
                                    onItemClick={(value: any) => setMonth(value + 1)}
                                    style={{fontSize: "xx-large"}}
                                    value={currentDate.get(ChronoField.MONTH_OF_YEAR) - 1}
                                ></Month>
                                <Year
                                    onItemClick={(value: any) => setYear(value)}
                                    value={currentDate.get(ChronoField.YEAR)}
                                    style={{fontSize: "xx-large"}}
                                ></Year>
                            </div>
                        </div>
                    </div>

                    <div style={{display: "flex", justifyContent: "center"}} {...rest}>
                        <div style={{width: "100%"}}>
                            <CalendarMonth events={rows} month={month} year={year} onDayClick={onDayClick}
                                           validDays={validDays}>
                                {children}
                            </CalendarMonth>
                        </div>
                    </div>
                </>
            )
        })
    }, [month, year])

    return <div className={"calendar"} {...rest}>{events}</div>
}

const CalendarContext = createContext(null)

namespace Calendar {

    export interface ValidDay {
        day: DayOfWeek
        begin: LocalTime
        end: LocalTime
    }

    export interface Attributes {
        children: React.ReactNode
        loader: any
        onDayClick: any
        onMonthClick? : (value : number) => void
        style?: CSSProperties,
        validDays?: ValidDay[]
    }

    export const Option = CalendarContext.Consumer

    export function Provider({data, children}: { data: any, children: React.ReactNode }) {
        return (
            <CalendarContext.Provider value={data}>
                {children}
            </CalendarContext.Provider>
        )
    }

}

export default Calendar