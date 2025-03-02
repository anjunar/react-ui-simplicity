import "./Toolbar.css"
import React from "react"
import FormatButton from "./toolbar/FormatButton";
import FormatSelect from "./toolbar/FormatSelect";
import FormatColor from "./toolbar/FormatColor";
import {AbstractTreeNode, HeadingTreeNode} from "../core/TreeNode";
import {BlockCommand} from "../commands/BlockCommands";
import {BackgroundColorCommand, BoldCommand, DeletedCommand, FontFamilyCommand, FontSizeCommand, ItalicCommand, SubCommand, SupCommand, TextColorCommand} from "../commands/FormatCommands";
import Pages from "../../../../../layout/pages/Pages";
import Page from "../../../../../layout/pages/Page";

const colors = [
    "--color-text",
    "--color-background-primary",
    "--color-background-secondary",
    "--color-background-tertiary",
    "--color-warning",
    "--color-error",
    "--color-selected",

    "--color-theme-amber",
    "--color-theme-blue",
    "--color-theme-cyan",
    "--color-theme-emerald",
    "--color-theme-fuchsia",
    "--color-theme-green",
    "--color-theme-indigo",
    "--color-theme-lime",
    "--color-theme-orange",
    "--color-theme-pink",
    "--color-theme-purple",
    "--color-theme-red",
    "--color-theme-rose",
    "--color-theme-sky",
    "--color-theme-slate",
    "--color-theme-teal",
    "--color-theme-violet",
    "--color-theme-yellow",
    "--color-theme-zinc"
]

function Toolbar(properties: Toolbar.Attributes) {

    const {page} = properties

    function onBlockCallback(node : AbstractTreeNode): string {
        if (node?.parent instanceof HeadingTreeNode) {
            return "h" + node.parent.level
        }
        return "p"
    }

    function resolveVariable(value : string) {
        const rootStyles = getComputedStyle(document.documentElement);
        return rootStyles.getPropertyValue(value).trim();
    }

    return (
        <Pages page={page}>
            <Page>
                <div className={"editor-toolbar"}>
{/*
                    <FormatSelect callback={onBlockCallback} command={new BlockCommand()}>
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
*/}
                </div>
            </Page>
            <Page>
                <div className={"editor-toolbar"}>
{/*
                    <FormatSelect command={new FontFamilyCommand()} callback={node => node.fontFamily}>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Palatino Linotype, serif">Palatino</option>
                        <option value="Arial, serif">Arial</option>
                        <option value="Comic Sans MS, serif">Comic Sans</option>
                        <option value="Helvetica, serif">Helvetica</option>
                        <option value="Impact, serif">Impact</option>
                        <option value="Lucida, serif">Lucida</option>
                        <option value="Tahoma, serif">Tahoma</option>
                        <option value="Trebuchet MS, serif">Trebuchet</option>
                        <option value="Verdana, serif">Verdana</option>
                        <option value="Courier New, serif">Couria New</option>
                        <option value="Lucida Console, serif">Lucida</option>
                    </FormatSelect>
                    <FormatSelect command={new FontSizeCommand()} callback={node => node.fontSize}>
                        <option value="xx-small">xx-small</option>
                        <option value="x-small">x-small</option>
                        <option value="small">small</option>
                        <option value="medium">medium</option>
                        <option value="large">large</option>
                        <option value="x-large">x-large</option>
                        <option value="xx-large">xx-large</option>
                    </FormatSelect>
*/}
{/*
                    <FormatSelect>
                        <option value={"justify"} className={"material-icons"}>format_align_justify</option>
                        <option value={"left"} className={"material-icons"}>format_align_left</option>
                        <option value={"right"} className={"material-icons"}>format_align_right</option>
                        <option value={"center"} className={"material-icons"}>format_align_center</option>
                    </FormatSelect>
*/}
                </div>
            </Page>
            <Page>
                <div className={"editor-toolbar"}>
                    <FormatColor id={"color"} command={new TextColorCommand()} callback={node => node.color} defaultValue={resolveVariable("--color-text")}/>
                    <datalist id="color" defaultValue={resolveVariable("--color-text")}>
                        {
                            colors.map(color => <option key={color} value={resolveVariable(color)}></option>)
                        }
                    </datalist>
                    <FormatColor id={"backgroundColor"} command={new BackgroundColorCommand()} callback={node => node.backgroundColor} defaultValue={resolveVariable("--color-background-primary")}/>
                    <datalist id="backgroundColor" defaultValue={resolveVariable("--color-background-primary")}>
                        {
                            colors.map(color => <option key={color} value={resolveVariable(color)}></option>)
                        }
                    </datalist>
                </div>
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
