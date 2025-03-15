import React, {useContext, useEffect, useState} from "react"
import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode} from "../../../shared/core/TreeNode";

import {WysiwygContext} from "../../../shared/contexts/WysiwygState";
import {EditorContext} from "../../../shared/contexts/EditorState";

function ActionButton(properties: ActionButton.Attributes) {

    const {children, command} = properties

    const context = useContext(WysiwygContext)

    const editor = useContext(EditorContext)


    const [disabled, setDisabled] = useState(false)

    function onClick() {
        command.execute(context.cursor.currentCursor?.container, context, editor)
    }

    useEffect(() => {
        if (context.cursor.currentCursor || context.selection.currentSelection) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [context.cursor.currentCursor, context.selection.currentSelection]);

    return (
        <button disabled={disabled} className={"material-icons"} onClick={onClick}>{children}</button>
    )
}

namespace ActionButton {
    export interface Attributes {
        children: React.ReactNode
        command : AbstractCommand<AbstractNode>
    }
}

export default ActionButton