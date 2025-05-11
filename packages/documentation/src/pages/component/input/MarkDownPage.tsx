import React from "react"
import {MarkDown} from "react-ui-simplicity"

function MarkDownPage(properties: MarkDownPage.Attributes) {

    const {} = properties

    return (
        <div style={{height : "100%"}} className={"markdown-page"}>
            <MarkDown style={{height : "100%"}}/>
        </div>
    )
}

namespace MarkDownPage {
    export interface Attributes {

    }
}

export default MarkDownPage