import React, {CSSProperties, useEffect, useMemo, useState} from "react"

function Color(properties: FontInputStyle.Attributes) {

    const {editableContent, placeholder, command, callback, list, ...rest} = properties

    const [value, setValue] = useState("")

    const [disabled, setDisabled] = useState(true)

    const memo = useMemo(() => {
        return {
            range : null,
            touched : false
        }
    }, []);


    const click: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        let htmlElement = event.target
        command.execute(htmlElement.value)
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

        if (memo.range) {
            let selection = window.getSelection();
            selection.removeAllRanges()
            selection.addRange(memo.range)
        }
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
        <div style={{display : "flex", alignItems : "center"}}>
            {placeholder}
            <input disabled={disabled}
                   onMouseDown={(event) => memo.touched = true}
                   type={"color"}
                   value={value}
                   onFocus={onFocus}
                   onChange={click}
                   {...rest}
                   list={list}/>
        </div>
    )
}

namespace FontInputStyle {
    export interface Attributes {
        editableContent: React.RefObject<HTMLDivElement>
        command: any
        style?: CSSProperties
        placeholder: string
        callback: (css: CSSStyleDeclaration, element: any) => string
        list? : string
    }
}

export default Color