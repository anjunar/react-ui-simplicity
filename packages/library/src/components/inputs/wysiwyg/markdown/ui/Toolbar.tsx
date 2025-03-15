import React from "react"
import Pages from "../../../../layout/pages/Pages";
import Page from "../../../../layout/pages/Page";
import FormatButton from "./toolbar/FormatButton";
import {BoldCommand, ItalicCommand} from "../commands/FormatCommands";
import {TextNode} from "../../shared/core/TreeNode";

function Toolbar(properties: Toolbar.Attributes) {

    const {page, textarea} = properties

    return (
        <div>
            <Pages page={page}>
                <Page>
                    <div className={"editor-toolbar"}>
                        <FormatButton
                            command={new BoldCommand()}
                            textArea={textarea.current}
                            isActiveCallback={nodes => nodes.length > 0 && nodes.every(range =>  {
                                if (range.node instanceof TextNode) {
                                    return range.node.bold
                                }
                                return true
                            })}
                            isDisabledCallback={nodes => nodes.some(range => {
                                if (range.node instanceof TextNode) {
                                    return range.node.hasFormat(["bold"])
                                }
                                return true
                            })}
                        >format_bold</FormatButton>
                        <FormatButton
                            command={new ItalicCommand()}
                            textArea={textarea.current}
                            isActiveCallback={nodes => nodes.length > 0 && nodes.every(range =>  {
                                if (range.node instanceof TextNode) {
                                    return range.node.italic
                                }
                                return true
                            })}
                            isDisabledCallback={nodes => nodes.some(range => {
                                if (range.node instanceof TextNode) {
                                    return range.node.hasFormat(["italic"])
                                }
                                return true
                            })}
                        >format_italic</FormatButton>
                    </div>
                </Page>
                <Page>
                    <div className={"editor-toolbar"}></div>
                </Page>
            </Pages>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {
        page : number
        textarea : React.RefObject<HTMLTextAreaElement>
    }
}

export default Toolbar
