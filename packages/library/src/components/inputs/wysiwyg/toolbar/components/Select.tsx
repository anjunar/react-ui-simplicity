import React, {CSSProperties, useEffect, useLayoutEffect, useState} from "react"
import {normalize} from "../../commands/Commands";

function Select(properties: FontSelectStyle.Attributes) {

    const {children, editableContent, command, callback, ...rest} = properties

    const [value, setValue] = useState("")

    const click: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        let htmlElement = event.target
        setValue(htmlElement.value)
        command.execute(htmlElement.value)
        normalize(editableContent.current)
    }

    const handler = (event: Event) => {
        let element = event.target as HTMLDivElement
        let computedStyle = window.getComputedStyle(element)
        setValue(callback(computedStyle, element))
    }

    useLayoutEffect(() => {
        if (editableContent.current) {
            editableContent.current.addEventListener("click", handler)
        }
        return () => {
            if (editableContent.current) {
                editableContent.current.removeEventListener("click", handler)
            }
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
        editableContent: React.RefObject<HTMLDivElement>
        command: any
        style?: CSSProperties
        callback: (css: CSSStyleDeclaration, element: any) => string
    }
}

export default Select