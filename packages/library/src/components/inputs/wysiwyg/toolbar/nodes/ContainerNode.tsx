import React from "react"
import {AddListCommand} from "../../commands/AddListCommand";

function ContainerNode(properties : ContainerNode.Attributes) {

    const {element} = properties

    return (
        <div style={{display : "flex", justifyContent : "center"}}>
            <button type={"button"} className={"material-icons"} onClick={() => new AddListCommand().execute(element)}>list</button>
            <button type={"button"} className={"material-icons"}>table</button>
            <button type={"button"} className={"material-icons"}>image</button>
        </div>
    )
}

namespace ContainerNode {
    export interface Attributes {
        element : HTMLElement
    }
}

export default ContainerNode