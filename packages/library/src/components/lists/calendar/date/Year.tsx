import "./Year.css"
import React, {CSSProperties, useState} from "react"

function Year(properties: Year.Attributes) {

    const {value, onItemClick, ...rest} = properties

    const [year, setYear] = useState(value)

    const yearUp = (event : any) => {
        let number = year - 1
        setYear(number)
        if (onItemClick) {
            onItemClick(number)
        }
    }

    const yearDown = (event : any) => {
        let number = year + 1
        setYear(number)
        if (onItemClick) {
            onItemClick(number)
        }
    }

    return (
        <div className={"year"} style={{position: "relative"}}>
            <button
                className={"material-icons button-up"}
                type={"button"}
                onClick={yearUp}
            >
                arrow_drop_up
            </button>
            <div {...rest}>{year}</div>
            <button
                className={"material-icons button-down"}
                type={"button"}
                onClick={yearDown}
            >
                arrow_drop_down
            </button>
        </div>
    )
}

namespace Year {
    export interface Attributes {
        value: any
        onItemClick: any
        style : CSSProperties
    }
}

export default Year