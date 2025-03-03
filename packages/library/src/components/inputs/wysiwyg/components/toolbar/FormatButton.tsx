import React, {useContext, useEffect, useState} from "react"
import EditorContext from "../EditorContext";
import {AbstractNode, TextNode} from "../../ast/TreeNode";
import {AbstractCommand} from "../../commands/AbstractCommand";

function FormatButton(properties: FormatButton.Attributes) {

    const {children, callback, command} = properties

    const [active, setActive] = useState(false)

    const context = useContext(EditorContext)

    function onClick() {
        command.execute(! active, context)
        setActive(!active)
    }

    useEffect(() => {
        if (context.cursor.currentCursor) {
            setActive(callback(context.cursor.currentCursor.container as TextNode))
        }
    }, [context.cursor.currentCursor?.container])

    return (
        <button className={`material-icons${active ? " active" : ""}`} onClick={onClick}>{children}</button>
    )
}

namespace FormatButton {
    export interface Attributes {
        children: React.ReactNode
        callback: (node : TextNode) => boolean
        command : AbstractCommand<boolean>
    }
}

export default FormatButton