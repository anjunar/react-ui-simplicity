import React, {useContext} from "react"
import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode} from "../../core/TreeNode";
import EditorContext from "../../EditorContext";

function ActionButton(properties: ActionButton.Attributes) {

    const {children, command} = properties

    const context = useContext(EditorContext)

    function onClick() {
        command.execute(context.cursor.currentCursor?.container, context)
    }

    return (
        <button className={"material-icons"} onClick={onClick}>{children}</button>
    )
}

namespace ActionButton {
    export interface Attributes {
        children: React.ReactNode
        command : AbstractCommand<AbstractNode>
    }
}

export default ActionButton