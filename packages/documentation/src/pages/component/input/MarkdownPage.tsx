import React from "react"
import {Markdown} from "react-ui-simplicity";

function MarkdownPage(properties: MarkdownPage.Attributes) {

    const {} = properties

    return (
        <div style={{height : "100%"}}>
            <Markdown/>
        </div>
    )
}

namespace MarkdownPage {
    export interface Attributes {

    }
}

export default MarkdownPage