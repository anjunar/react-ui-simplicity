import React from "react"
import {AddListCommand} from "../../commands/AddListCommand";
import {AddLiCommand} from "../../commands/AddLiCommand";
import {RemoveElementCommand} from "../../commands/RemoveElementCommand";

function LiNode(properties : LiNode.Attributes) {

    const {element} = properties

    return (
        <div>
            <button type={"button"} className={"material-icons"} onClick={() => new AddLiCommand().execute(element)}>add</button>
            <button type={"button"} className={"material-icons"} onClick={() => new RemoveElementCommand().execute(element)}>delete</button>
        </div>
    )
}

namespace LiNode {
    export interface Attributes {
        element : HTMLElement
    }
}

export default LiNode