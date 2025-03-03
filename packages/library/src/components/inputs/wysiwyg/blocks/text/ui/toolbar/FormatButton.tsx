import React, {useContext, useEffect, useState} from "react"
import EditorContext, {Context} from "../../EditorContext";
import {AbstractTreeNode, TextTreeNode} from "../../core/TreeNode";

import {AbstractCommand} from "../../commands/AbstractCommands";

function FormatButton(properties: FormatButton.Attributes) {

    const {children, callback, command, context} = properties

    const [active, setActive] = useState(false)

    function onClick() {
        command.execute(! active, context)
        setActive(!active)
    }

    useEffect(() => {
        if (context.cursor.currentCursor) {
            setActive(callback(context.cursor.currentCursor.container as TextTreeNode))
        }
    }, [context.cursor.currentCursor?.container])

    return (
        <button className={`material-icons${active ? " active" : ""}`} onClick={onClick}>{children}</button>
    )
}

namespace FormatButton {
    export interface Attributes {
        children: React.ReactNode
        callback: (node : TextTreeNode) => boolean
        command : AbstractCommand<boolean>
        context : Context
    }
}

export default FormatButton