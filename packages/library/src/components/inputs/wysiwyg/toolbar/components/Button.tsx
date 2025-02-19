import React, {useEffect, useMemo, useState} from "react"
import {AbstractCommand} from "../../commands/AbstractCommand";
import {normalize} from "../../commands/Commands";

function Button(properties: FontStyle.Attributes) {

    const {children, editableContent, command, callback} = properties

    const [selected, setSelected] = useState(false)

    const [disabled, setDisabled] = useState(true)

    const click = () => {
        if (command instanceof AbstractCommand) {
            command.execute(! selected)
        } else {
            document.execCommand(command, false)
        }

        setSelected(! selected)
    }

    const handler = (event : Event) => {
        let element = event.target as HTMLDivElement
        let computedStyle = window.getComputedStyle(element)
        if (callback) {
            setSelected(callback(computedStyle))
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
        <button
            className={(selected ? "active " : "") + "material-icons"}
            type={"button"}
            disabled={disabled}
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