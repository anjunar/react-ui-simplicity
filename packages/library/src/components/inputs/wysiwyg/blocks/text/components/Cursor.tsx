import "./Cursor.css"
import React from "react"

function Cursor(properties: Cursor.Attributes) {

    const {ref} = properties

    return (
        <div className={"cursor"} ref={ref}>|</div>
    )
}

namespace Cursor {
    export interface Attributes {
        ref : React.RefObject<HTMLDivElement>
    }
}

export default Cursor
