import React, {useContext, useEffect, useState} from "react"
import {MarkDownContext} from "../../MarkDown";
import {AbstractCommand} from "../../commands/FormatCommand";
import { Node } from 'unist';


function FormatButton(properties: FormatButton.Attributes) {

    const {children, callback, command} = properties

    const [active, setActive] = useState(false)

    const [disabled, setDisabled] = useState(false)

    const {model, textAreaRef, cursor, updateAST} = useContext(MarkDownContext)

    function onClick() {
        command.execute(active, cursor, textAreaRef.current)

        if (active) {
            updateAST()
        }

        setActive(!active)
    }

    useEffect(() => {
        if (cursor !== null) {
            setActive(callback(cursor))
        }
    }, [cursor])

    return (
        <button disabled={disabled} className={`material-icons${active ? " active" : ""}`} onClick={onClick}>{children}</button>
    )
}

namespace FormatButton {
    export interface Attributes {
        children: React.ReactNode
        callback: (node: Node[]) => boolean
        command: AbstractCommand
    }
}

export default FormatButton