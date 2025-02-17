import React, {CSSProperties, useEffect, useLayoutEffect, useMemo, useState} from "react"
import {normalize} from "../../commands/Commands";

function Select(properties: FontSelectStyle.Attributes) {

    const {children, editableContent, command, callback, ...rest} = properties

    const [value, setValue] = useState("")

    const [disabled, setDisabled] = useState(true)

    const click: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        let htmlElement = event.target
        setValue(htmlElement.value)
        command.execute(htmlElement.value)
        normalize(editableContent.current)
    }

    const handler = (event: Event) => {
        let element = event.target as HTMLDivElement
        let computedStyle = window.getComputedStyle(element)
        let s = callback(computedStyle, element);
        setValue(s)
    }

    useEffect(() => {
        let listener = () => {
            let selection = window.getSelection();
            if (selection?.rangeCount && editableContent.current.contains(selection.anchorNode)) {
                setDisabled(false)
            } else {
                setDisabled(true)
            }
        };

        document.addEventListener("selectionchange", listener)
        if (editableContent.current) {
            editableContent.current.addEventListener("click", handler)
        }
        return () => {
            document.removeEventListener("selectionchange", listener)
            if (editableContent.current) {
                editableContent.current.removeEventListener("click", handler)
            }

        }
    }, [])

    return (
        <select disabled={disabled}
                value={value}
                onChange={click}
                {...rest}>
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