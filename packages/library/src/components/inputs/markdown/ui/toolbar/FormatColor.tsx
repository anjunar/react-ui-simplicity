import React, {useContext, useEffect, useState} from "react"

function FormatColor(properties: FormatColor.Attributes) {

    const {id, callback, command, defaultValue} = properties

    const [value, setValue] = useState(defaultValue)

    const [disabled, setDisabled] = useState(false)

    function resolveVariable(value: string) {
        const rootStyles = getComputedStyle(document.documentElement);
        return rootStyles.getPropertyValue(value).trim();
    }

    return (
        <input disabled={disabled} list={id} type={"color"} value={value}></input>
    )
}

namespace FormatColor {
    export interface Attributes {
        id: string
        callback: any
        command: any
        defaultValue: string
    }
}

export default FormatColor