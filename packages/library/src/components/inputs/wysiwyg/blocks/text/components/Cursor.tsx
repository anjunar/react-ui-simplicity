import "./Cursor.css"
import React, {CSSProperties, useContext} from "react"
import EditorContext from "./EditorContext";

function Cursor(properties: Cursor.Attributes) {

    const {ref} = properties

    const {cursor : {current : {container}}} = useContext(EditorContext)

    const style : CSSProperties = {position : "absolute", top : "24px", backgroundColor : "var(--color-background-primary)"};

    return (
        <div className={"cursor"} ref={ref}>|<span style={style}>{container?.dom?.localName}</span></div>
    )
}

namespace Cursor {
    export interface Attributes {
        ref : React.RefObject<HTMLDivElement>
    }
}

export default Cursor
