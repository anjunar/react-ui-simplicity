import React, {CSSProperties, useEffect, useState} from "react"

function FontInputStyle(properties: FontInputStyle.Attributes) {

    const {editableContent, placeholder, command, callback, ...rest} = properties

    const [value, setValue] = useState("")

    const click: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        let htmlElement = event.target
        document.execCommand(command, false, htmlElement.value)
        setValue(htmlElement.value)
    }

    const handler = (event: Event) => {
        let element = event.target as HTMLDivElement

        function extracted(element: HTMLElement) {
            let computedStyle = window.getComputedStyle(element)
            let hex = callback(computedStyle, element);
            if (hex === "transparent") {
                return extracted(element.parentElement)
            }
            return hex;
        }

        let hex = extracted(element);
        if (hex !== "transparent" && hex !== "-1") {
            setValue(hex)
        }
    }

    useEffect(() => {
        if (editableContent.current) {
            editableContent.current.addEventListener("click", handler)
        }

    }, [])

    return (
        <div className={"flex align-middle"}>
            {placeholder}
            <input type={"color"} value={value} onChange={click} {...rest}/>
        </div>
    )
}

namespace FontInputStyle {
    export interface Attributes {
        editableContent: any
        command: any
        style?: CSSProperties
        placeholder: string
        callback: (css: CSSStyleDeclaration, element: any) => string
    }
}

export default FontInputStyle