import React, {useContext} from "react"
import {AbstractCommand} from "../../commands/AbstractCommand";
import {EditorContext} from "../../../EditorState";

function FormatButton(properties: FormatButton.Attributes) {

    const {children, command, textArea} = properties

    const {ast : {triggerAST}, markdown} = useContext(EditorContext)

    function onClick() {
        command.execute(textArea, markdown);
        markdown.triggerMarkdown()
    }

    return (
        <button className={"material-icons"} onClick={onClick}>{children}</button>
    )
}

namespace FormatButton {
    export interface Attributes {
        children : React.ReactNode
        command : AbstractCommand
        textArea : HTMLTextAreaElement
    }
}

export default FormatButton