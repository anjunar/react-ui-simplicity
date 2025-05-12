import "./Toolbar.css"
import React, {useContext, useRef} from "react"
import FormatButton from "./toolbar/FormatButton";
import FormatSelect from "./toolbar/FormatSelect";
import Pages from "../../../layout/pages/Pages";
import Page from "../../../layout/pages/Page";
import {MarkDownContext} from "../MarkDown";
import NewImageCommand from "../commands/NewImageCommand";
import {BoldCommand, ItalicCommand} from "../commands/FormatCommand";

const colors = [
    /*
        "--color-text",
        "--color-background-primary",
        "--color-background-secondary",
        "--color-background-tertiary",
        "--color-warning",
        "--color-error",
        "--color-selected",
    */
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

    const {page, onPage} = properties

    const inputRef = useRef<HTMLInputElement>(null);

    const {model, textAreaRef, cursor} = useContext(MarkDownContext)

    function onBlockCallback(node: any): string {
        return "p"
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <button className={"material-icons"} onClick={() => onPage(page - 1 === -1 ? 2 : page - 1)}>arrow_left</button>
            <Pages page={page}>
                <Page>
                    <div className={"editor-toolbar"}>
                        <FormatSelect callback={onBlockCallback} command={null}>
                            <option value={"h1"}>H1</option>
                            <option value={"h2"}>H2</option>
                            <option value={"h3"}>H3</option>
                            <option value={"h4"}>H4</option>
                            <option value={"h5"}>H5</option>
                            <option value={"h6"}>H6</option>
                            <option value={"p"}>Paragraph</option>
                        </FormatSelect>
                        <FormatButton command={new BoldCommand()} callback={nodes => nodes.some(token => token.type === "strong")}>format_bold</FormatButton>
                        <FormatButton command={new ItalicCommand()} callback={nodes => nodes.some(token => token.type === "emphasis")}>format_italic</FormatButton>
                        <FormatButton command={null} callback={nodes => nodes.some(token => token.type === "del")}>strikethrough_s</FormatButton>
{/*
                        <FormatButton command={null} callback={node => node.sub}>subscript</FormatButton>
                        <FormatButton command={null} callback={node => node.sup}>superscript</FormatButton>
*/}
                    </div>
                </Page>
                <Page>
                    <div className={"editor-toolbar"}>
                        <input ref={inputRef} type={"file"} style={{display : "none"}}/>
                        <button className={"material-icons"} onClick={() => new NewImageCommand(model, inputRef, textAreaRef)}>image</button>
                    </div>
                </Page>
            </Pages>
            <button className={"material-icons"} onClick={() => onPage(page + 1 === 2 ? 0 : page + 1)}>arrow_right</button>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {
        page: number
        onPage: (value: number) => void
    }
}

export default Toolbar
