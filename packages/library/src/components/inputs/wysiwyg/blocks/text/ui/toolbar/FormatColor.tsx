import React, {useContext, useEffect, useState} from "react"
import {AbstractTreeNode, TextTreeNode} from "../../core/TreeNode";
import {AbstractCommand} from "../../commands/AbstractCommands";
import EditorContext from "../../EditorContext";

function FormatColor(properties: FormatColor.Attributes) {

    const {id, callback, command, defaultValue} = properties

    const [value, setValue] = useState(defaultValue)

    const context = useContext(EditorContext)

    function resolveVariable(value : string) {
        const rootStyles = getComputedStyle(document.documentElement);
        return rootStyles.getPropertyValue(value).trim();
    }

    function onChange(event : React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        setValue(value)

        command.execute(value, context)
    }

    useEffect(() => {
        if (context.cursor.currentCursor) {
            let result = callback(context.cursor.currentCursor?.container as TextTreeNode);
            if (result) {
                setValue(result)
            }
        }
    }, [context.ast]);

    return (
        <input list={id} type={"color"} value={value} onChange={onChange}></input>
    )
}

namespace FormatColor {
    export interface Attributes {
        id : string
        callback : (node: TextTreeNode) => string
        command : AbstractCommand<string>
        defaultValue : string
    }
}

export default FormatColor