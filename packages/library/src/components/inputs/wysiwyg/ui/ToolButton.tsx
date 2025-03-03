import React, {useEffect, useState} from "react"
import {AbstractCommand} from "../commands/AbstractCommand";

function ToolButton(properties: ToolButton.Attributes) {

    const {children, editableContent, command, callback} = properties

    const [selected, setSelected] = useState(false)

    const click = () => {
        command.execute(! selected)
        let selection = document.getSelection()
        if (selection) {
            let anchorNode = selection.anchorNode
            if (anchorNode?.parentElement) {
                if (callback) {
                    let computedStyle = window.getComputedStyle(anchorNode.parentElement)
                    let selected = callback(computedStyle)
                    if (selected) {
                        setSelected(false)
                    } else {
                        setSelected(selected)
                    }
                }
            }
        }
    }
    const handler = (event : Event) => {
        let element = event.target as HTMLDivElement
        let computedStyle = window.getComputedStyle(element)
        if (callback) {
            setSelected(callback(computedStyle))
        }
    }

    useEffect(() => {
        if (editableContent) {
            editableContent.addEventListener("click", handler)
        }
        return () => {
            if (editableContent) {
                editableContent.removeEventListener("click", handler)
            }

        }
    }, [])

    return (
        <button
            className={(selected ? "active " : "") + "material-icons"}
            type={"button"}
            onClick={() => click()}
        >
            {children}
        </button>
    )
}

namespace ToolButton {
    export interface Attributes {
        children: React.ReactNode
        editableContent: HTMLElement
        command: AbstractCommand<boolean>
        callback?: (css : CSSStyleDeclaration) => boolean
    }
}

export default ToolButton