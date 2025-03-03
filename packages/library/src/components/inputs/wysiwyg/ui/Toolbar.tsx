import "./Toolbar.css"
import React from "react"
import FormatButton from "./toolbar/FormatButton";
import FormatSelect from "./toolbar/FormatSelect";
import {AbstractNode, HeadingNode} from "../core/TreeNode";
import {BlockCommand} from "../commands/BlockCommands";
import {AbstractBlockCommand} from "../commands/Command";
import {BoldCommand, DeletedCommand, ItalicCommand, SubCommand, SupCommand} from "../commands/FormatCommands";
import Pages from "../../../layout/pages/Pages";
import Page from "../../../layout/pages/Page";

function Toolbar(properties: Toolbar.Attributes) {

    const {page} = properties

    function onCallback(node : AbstractNode): string {
        if (node instanceof HeadingNode) {
            return "h" + node.level
        }
        return "p"
    }

    return (
        <Pages page={page}>
            <Page>
                <div className={"editor-toolbar"}>
                    <FormatSelect callback={onCallback} command={new BlockCommand()}>
                        <option value={"h1"}>H1</option>
                        <option value={"h2"}>H2</option>
                        <option value={"h3"}>H3</option>
                        <option value={"h4"}>H4</option>
                        <option value={"h5"}>H5</option>
                        <option value={"h6"}>H6</option>
                        <option value={"p"}>Paragraph</option>
                    </FormatSelect>
                    <FormatButton command={new BoldCommand()} callback={node => node.bold}>format_bold</FormatButton>
                    <FormatButton command={new ItalicCommand()} callback={node => node.italic}>format_italic</FormatButton>
                    <FormatButton command={new DeletedCommand()} callback={node => node.deleted}>strikethrough_s</FormatButton>
                    <FormatButton command={new SubCommand()} callback={node => node.sub}>subscript</FormatButton>
                    <FormatButton command={new SupCommand()} callback={node => node.sup}>superscript</FormatButton>
                </div>
            </Page>
            <Page>
                <div></div>
            </Page>
        </Pages>
    )
}

namespace Toolbar {
    export interface Attributes {
        page : number
    }
}

export default Toolbar
