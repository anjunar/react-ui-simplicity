import React, {useContext, useEffect, useState} from "react"
import {AbstractNode, TextNode} from "../../../shared/core/TreeNode";

import {AbstractCommand} from "../../commands/AbstractCommands";
import {WysiwygContext} from "../../../shared/contexts/WysiwygState";
import {EditorContext} from "../../../shared/contexts/EditorState";

function FormatButton(properties: FormatButton.Attributes) {

    const {children, callback, command} = properties

    const [active, setActive] = useState(false)

    const [disabled, setDisabled] = useState(false)

    const context = useContext(WysiwygContext)

    const editor = useContext(EditorContext)

    function onClick() {
        command.execute(! active, context, editor)
        setActive(!active)
    }

    useEffect(() => {
        if (context.cursor.currentCursor) {
            setActive(callback(context.cursor.currentCursor.container as TextNode))
        }
    }, [context.cursor.currentCursor?.container])

    useEffect(() => {
        if (context.cursor.currentCursor || context.selection.currentSelection) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [context.cursor.currentCursor, context.selection.currentSelection]);

    return (
        <button disabled={disabled} className={`material-icons${active ? " active" : ""}`} onClick={onClick}>{children}</button>
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