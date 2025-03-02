import "./Toolbar.css"
import React from "react"
import FormatButton from "./toolbar/FormatButton";
import {BoldCommand} from "../commands/BoldCommand";
import {ItalicCommand} from "../commands/ItalicCommand";
import {DeletedCommand} from "../commands/DeletedCommand";
import {SubCommand} from "../commands/SubCommand";
import {SupCommand} from "../commands/SupCommand";

function Toolbar(properties: Toolbar.Attributes) {

    const {} = properties

    return (
        <div className={"editor-toolbar"}>
            <FormatButton command={new BoldCommand()} callback={node => node.bold}>format_bold</FormatButton>
            <FormatButton command={new ItalicCommand()} callback={node => node.bold}>format_italic</FormatButton>
            <FormatButton command={new DeletedCommand()} callback={node => node.bold}>strikethrough_s</FormatButton>
            <FormatButton command={new SubCommand()} callback={node => node.bold}>subscript</FormatButton>
            <FormatButton command={new SupCommand()} callback={node => node.bold}>superscript</FormatButton>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {

    }
}

export default Toolbar
