import React, {useContext} from "react"
import {WysiwygContext} from "../../context/WysiwygContext";
import FormatButton from "../text/ui/toolbar/FormatButton";
import {BoldCommand, DeletedCommand, ItalicCommand, SubCommand, SupCommand} from "../text/commands/FormatCommands";

function TextTool(properties: TextTool.Attributes) {

    const {} = properties

    const {ast, providers, trigger} = useContext(WysiwygContext)

    const node = ast.blocks.find(node => node.selected)

    return (
        <div className={"editor-toolbar"}>
            <FormatButton context={node.data.context} command={new BoldCommand()} callback={node => node.bold}>format_bold</FormatButton>
            <FormatButton context={node.data.context} command={new ItalicCommand()} callback={node => node.italic}>format_italic</FormatButton>
            <FormatButton context={node.data.context} command={new DeletedCommand()} callback={node => node.deleted}>strikethrough_s</FormatButton>
            <FormatButton context={node.data.context} command={new SubCommand()} callback={node => node.sub}>subscript</FormatButton>
            <FormatButton context={node.data.context} command={new SupCommand()} callback={node => node.sup}>superscript</FormatButton>
        </div>
    )
}

namespace TextTool {
    export interface Attributes {

    }
}

export default TextTool
