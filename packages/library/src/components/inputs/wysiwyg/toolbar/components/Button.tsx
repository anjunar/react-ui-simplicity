import React, {useEffect, useState} from "react"
import {AbstractCommand} from "../../commands/AbstractCommand";
import {normalize} from "../../commands/Commands";

function Button(properties: FontStyle.Attributes) {

    const {children, editableContent, command, callback} = properties

    const [selected, setSelected] = useState(false)

    const click = () => {
        if (command instanceof AbstractCommand) {
            command.execute(! selected)
            normalize(editableContent.current)
        } else {
            document.execCommand(command, false)
        }

        let selection = document.getSelection()
        if (selection) {
            let anchorNode = selection.anchorNode
            if (anchorNode?.parentElement) {
                if (callback) {
                    let computedStyle = window.getComputedStyle(anchorNode.parentElement)
                    let selected = callback(computedStyle);
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
        <button
            className={(selected ? "active " : "") + "material-icons"}
            type={"button"}
            onClick={() => click()}
        >
            {children}
        </button>
    )
}

namespace FontStyle {
    export interface Attributes {
        children: React.ReactNode
        editableContent: React.RefObject<HTMLDivElement>
        command: any
        callback?: (css : CSSStyleDeclaration) => boolean
    }
}

export default Button