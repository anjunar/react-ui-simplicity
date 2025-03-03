import "./Cursor.css"
import React, {CSSProperties, useContext} from "react"
import EditorContext from "../EditorContext";

function Cursor(properties: Cursor.Attributes) {

    const {ref} = properties

    const {cursor : {currentCursor}} = useContext(EditorContext)

    const style : CSSProperties = {position : "absolute", top : "38px", backgroundColor : "var(--color-background-primary)"};

    return (
        <div style={{display : "none"}} className={"cursor"} ref={ref}>|<span style={style}>{currentCursor?.container?.dom?.localName}</span></div>
    )
}

namespace Cursor {
    export interface Attributes {
        ref : React.RefObject<HTMLDivElement>
    }
}

export default Cursor
