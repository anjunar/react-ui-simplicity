import "./Month.css"
import React, {CSSProperties, useLayoutEffect, useState} from "react"

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "Sebtember", "Oktober", "November", "Dezember"];

function Month(properties: Month.Attributes) {

    const {value, onItemClick, ...rest} = properties

    let [open, setOpen] = useState(false)

    let [month, setMonth] = useState(value)

    const monthClick = (event : any) => {
        event.stopPropagation()
        setOpen(!open)
    }

    const monthUp = (event : any) => {
        let number = month - 1
        setMonth(number)
        if (onItemClick) {
            onItemClick(number)
        }
    }

    const monthDown = (event : any) => {
        let number = month + 1
        setMonth(number)
        if (onItemClick) {
            onItemClick(number)
        }
    }

    const itemClick = (month : any) => {
        setMonth(month)
        if (onItemClick) {
            onItemClick(month)
        }
    }

    useLayoutEffect(() => {
        const closeHandler = () => {
            setOpen(false)
        }

        window.addEventListener("click", closeHandler)

        return () => {
            window.removeEventListener("click", closeHandler)
        }
    }, [])

    return (
        <div className={"month"}>
            <div style={{position: "relative"}}>
                <button
                    className={"material-icons button-up"}
                    type={"button"}
                    disabled={month == 0}
                    onClick={monthUp}
                >
                    arrow_drop_up
                </button>
                <button {...rest} type={"button"} onClick={monthClick}>
                    {months[month]}
                </button>
                <button
                    className={"material-icons button-down"}
                    type={"button"}
                    disabled={month > 10}
                    onClick={monthDown}
                >
                    arrow_drop_down
                </button>
            </div>

            {open ? (
                <div className={"overlay"}>
                    {months.map((month, index) => (
                        <div
                            key={month}
                            className={"item"}
                            onClick={() => itemClick(index)}
                        >
                            <p style={{fontSize: "small"}}>{month}</p>
                        </div>
                    ))}
                </div>
            ) : (
                ""
            )}
        </div>
    )
}

namespace Month {
    export interface Attributes {
        value: any
        onItemClick: any
        style : CSSProperties
    }
}

export default Month