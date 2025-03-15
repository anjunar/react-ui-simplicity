import React, {useContext, useEffect, useState} from "react"
import {AbstractNode, TextNode} from "../../../shared/core/TreeNode";
import {AbstractCommand} from "../../commands/AbstractCommands";

import {WysiwygContext} from "../../../shared/contexts/WysiwygState";
import {EditorContext} from "../../../shared/contexts/EditorState";

function FormatColor(properties: FormatColor.Attributes) {

    const {id, callback, command, defaultValue} = properties

    const [value, setValue] = useState(defaultValue)

    const [disabled, setDisabled] = useState(false)

    const context = useContext(WysiwygContext)

    const editor = useContext(EditorContext)

    function resolveVariable(value : string) {
        const rootStyles = getComputedStyle(document.documentElement);
        return rootStyles.getPropertyValue(value).trim();
    }

    function onChange(event : React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        setValue(value)

        command.execute(value, context, editor)
    }

    useEffect(() => {
        if (context.cursor.currentCursor || context.selection.currentSelection) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [context.cursor.currentCursor, context.selection.currentSelection]);

    useEffect(() => {
        if (context.cursor.currentCursor) {
            let result = callback(context.cursor.currentCursor?.container as TextNode);
            if (result) {
                setValue(result)
            }
        }
    }, [editor.ast]);

    return (
        <input disabled={disabled} list={id} type={"color"} value={value} onChange={onChange}></input>
    )
}

namespace FormatColor {
    export interface Attributes {
        id : string
        callback : (node: TextNode) => string
        command : AbstractCommand<string>
        defaultValue : string
    }
}

export default FormatColor