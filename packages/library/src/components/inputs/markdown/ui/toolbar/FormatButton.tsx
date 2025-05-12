import React, {useContext, useEffect, useState} from "react"
import {MarkDownContext} from "../../MarkDown";
import {Token} from "marked";
import AbstractCommand from "../../commands/FormatCommand";

function FormatButton(properties: FormatButton.Attributes) {

    const {children, callback, command} = properties

    const [active, setActive] = useState(false)

    const [disabled, setDisabled] = useState(false)

    const {model, textAreaRef, cursor} = useContext(MarkDownContext)

    function onClick() {
        command.execute(textAreaRef.current)
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
        callback: (node: Token[]) => boolean
        command: AbstractCommand
    }
}

export default FormatButton