import "./Cursor.css"
import React, {useContext} from "react"
import EditorContext from "./EditorContext";

function Cursor(properties: Cursor.Attributes) {

    const {ref} = properties

    const {cursor : {current : {container}}} = useContext(EditorContext)

    return (
        <div className={"cursor"} ref={ref}>|{container?.dom?.localName}</div>
    )
}

namespace Cursor {
    export interface Attributes {
        ref : React.RefObject<HTMLDivElement>
    }
}

export default Cursor
