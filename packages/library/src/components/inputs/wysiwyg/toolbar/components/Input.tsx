import React, {CSSProperties, useEffect, useMemo, useRef, useState} from "react"
import {normalize} from "../../commands/Commands";

function Input(properties: FontInputStyle.Attributes) {

    const {editableContent, placeholder, command, callback, ...rest} = properties

    const [state, setState] = useState("")

    const memo = useMemo(() => {
        return {
            range : null,
            touched : false
        }
    }, []);

    const inputRef = useRef<HTMLInputElement>(null)

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (memo.range) {
            let selection = window.getSelection();
            selection.removeAllRanges()
            selection.addRange(memo.range)
        }

        let htmlElement = event.target
        command.execute(event.target.valueAsNumber + "px")
        normalize(editableContent.current)
        setState(htmlElement.value)

        let selection = window.getSelection();
        if (selection?.rangeCount) {
            memo.range = selection.getRangeAt(0)
        }

        inputRef.current.focus()
    }

    const clickHandler = (event: Event) => {
        let element = event.target as HTMLDivElement
        let computedStyle = window.getComputedStyle(element)
        let result = callback(computedStyle, element);
        setState(result);
    }

    const onFocus = (event : React.FocusEvent<HTMLInputElement>)=> {
        if (memo.touched) {
            let selection = window.getSelection();
            if (selection?.rangeCount) {
                memo.range = selection.getRangeAt(0)
            }
            memo.touched = false
        }
    }

    useEffect(() => {
        if (editableContent.current) {
            editableContent.current.addEventListener("click", clickHandler)
        }
        return () => {
            if (editableContent.current) {
                editableContent.current.removeEventListener("click", clickHandler)
            }
        }
    }, [])

    return (
        <div style={{display : "flex", alignItems : "center"}}>
            <input ref={inputRef}
                   onMouseDown={() => memo.touched = true}
                   onFocus={onFocus} style={{width : "50px"}}
                   type={"number"}
                   value={state}
                   onChange={onChange}/><span>px</span>
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
    }
}

export default Input