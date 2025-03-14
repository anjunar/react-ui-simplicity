import "./Cursor.css"
import React, {CSSProperties, useContext} from "react"

import {EditorContext} from "../../EditorState";

function Cursor(properties: Cursor.Attributes) {

    const {ref} = properties

    return (
        <div style={{display : "none"}} className={"cursor"} ref={ref}></div>
    )
}

namespace Cursor {
    export interface Attributes {
        ref : React.RefObject<HTMLDivElement>
    }
}

export default Cursor
