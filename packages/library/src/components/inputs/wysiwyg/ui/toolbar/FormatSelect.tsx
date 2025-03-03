import React, {useContext, useEffect, useState} from "react"
import {AbstractNode, ParagraphNode, TextNode} from "../../core/TreeNode";
import EditorContext from "../../EditorContext";
import {AbstractCommand} from "../../commands/AbstractCommands";

function FormatSelect(properties: FormatSelect.Attributes) {

    const {children, callback, command} = properties

    const [value, setValue] = useState("p")

    const context = useContext(EditorContext)

    function onChange(event : React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value
        setValue(value)

        command.execute(value, context)
    }

    useEffect(() => {
        setValue(callback(context.cursor.currentCursor?.container as TextNode))
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
        callback : (node: TextNode) => string
        command : AbstractCommand<string>
    }
}

export default FormatSelect