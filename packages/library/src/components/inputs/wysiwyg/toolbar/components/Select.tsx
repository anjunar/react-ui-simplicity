import React, {CSSProperties, useEffect, useLayoutEffect, useMemo, useState} from "react"
import {normalize} from "../../commands/Commands";

function Select(properties: FontSelectStyle.Attributes) {

    const {children, editableContent, command, callback, ...rest} = properties

    const [value, setValue] = useState("")

    const [disabled, setDisabled] = useState(true)

    const memo = useMemo(() => {
        return {
            range : null,
            touched : false
        }
    }, []);


    const click: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        if (memo.range) {
            let selection = window.getSelection();
            selection.removeAllRanges()
            selection.addRange(memo.range)
        }

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

    const onFocus = (event : React.FocusEvent)=> {
        if (memo.touched) {
            let selection = window.getSelection();
            if (selection?.rangeCount) {
                memo.range = selection.getRangeAt(0)
            }
            memo.touched = false
        }
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
                onFocus={onFocus}
                onMouseDown={(event) => memo.touched = true}
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