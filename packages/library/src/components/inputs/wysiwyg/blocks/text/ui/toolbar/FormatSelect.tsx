import React, {useContext, useEffect, useState} from "react"
import {AbstractTreeNode, ParagraphTreeNode, TextTreeNode} from "../../core/TreeNode";
import EditorContext, {Context} from "../../EditorContext";
import {AbstractCommand} from "../../commands/AbstractCommands";

function FormatSelect(properties: FormatSelect.Attributes) {

    const {children, callback, command, context} = properties

    const [value, setValue] = useState("p")

    function onChange(event : React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value
        setValue(value)

        command.execute(value, context)
    }

    useEffect(() => {
        setValue(callback(context.cursor.currentCursor?.container as TextTreeNode))
    }, [context.cursor.currentCursor]);

    return (
        <select value={value} onChange={onChange}>
            {
                children
            }
        </select>
    )
}

namespace FormatSelect {
    export interface Attributes {
        children : React.ReactNode[]
        callback : (node: TextTreeNode) => string
        command : AbstractCommand<string>
        context : Context
    }
}

export default FormatSelect