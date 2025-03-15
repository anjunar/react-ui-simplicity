import React from "react"
import Pages from "../../../../layout/pages/Pages";
import Page from "../../../../layout/pages/Page";
import FormatButton from "./toolbar/FormatButton";
import {BoldCommand} from "../commands/FormatCommands";

function Toolbar(properties: Toolbar.Attributes) {

    const {page, textarea} = properties

    return (
        <div>
            <Pages page={page}>
                <Page>
                    <div className={"editor-toolbar"}>
                        <FormatButton command={new BoldCommand()} textArea={textarea.current}>format_bold</FormatButton>
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
