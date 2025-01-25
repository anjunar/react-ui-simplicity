import React, {CSSProperties, useEffect, useState} from "react"

function FontSelectStyle(properties: FontSelectStyle.Attributes) {

    const {children, editableContent, command, callback, ...rest} = properties

    const [value, setValue] = useState("")

    const click: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        let htmlElement = event.target
        document.execCommand(command, false, htmlElement.value)
        setValue(htmlElement.value)
    }

    const handler = (event: Event) => {
        let element = event.target as HTMLDivElement
        let computedStyle = window.getComputedStyle(element)
        setValue(callback(computedStyle, element))
    }

    useEffect(() => {
        if (editableContent.current) {
            editableContent.current.addEventListener("click", handler)
        }
    }, [])

    return (
        <select value={value} onChange={click} {...rest}>
            {children}
        </select>
    )
}

namespace FontSelectStyle {
    export interface Attributes {
        children: React.ReactNode
        editableContent: any
        command: any
        style?: CSSProperties
        callback: (css: CSSStyleDeclaration, element: any) => string
    }
}

export default FontSelectStyle