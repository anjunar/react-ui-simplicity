import React, {useContext, useState} from "react"
import {AbstractNode, ParagraphNode} from "../../ast/TreeNode";
import {AbstractCommand} from "../../commands/AbstractCommand";
import EditorContext from "../EditorContext";

function FormatSelect(properties: FormatSelect.Attributes) {

    const {children, callback, command} = properties

    const [value, setValue] = useState("p")

    const context = useContext(EditorContext)

    function onChange(event : React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value
        setValue(value)

        command.execute(value, context)
    }

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
        callback : (node: AbstractNode) => string
        command : AbstractCommand<string>
    }
}

export default FormatSelect