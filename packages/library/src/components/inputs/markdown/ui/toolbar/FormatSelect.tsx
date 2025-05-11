import React, {useContext, useEffect, useState} from "react"

function FormatSelect(properties: FormatSelect.Attributes) {

    const {children, callback, command, className, style} = properties

    const [value, setValue] = useState("p")

    const [disabled, setDisabled] = useState(false)


    return (
        <select disabled={disabled} value={value} className={className} style={style}>
            {
                children
            }
        </select>
    )
}

namespace FormatSelect {
    export interface Attributes {
        children: React.ReactNode[]
        callback: any
        command: any
        className?: string
        style?: React.CSSProperties
    }
}

export default FormatSelect