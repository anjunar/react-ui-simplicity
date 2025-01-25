import React from "react";

function TrNode(properties: TrNode.Attributes) {

    const {payload} = properties

    function addRow() {
        let columns = payload.childElementCount;

        payload.insertAdjacentHTML("afterend", `<tr>${"<td></td>".repeat(columns)}</tr>`)
    }

    function removeRow() {
        payload.remove()
    }

    return (
        <div>
            <button type={"button"} className={"large"} onClick={addRow}>Reihe einfügen</button>
            <br/>
            <button type={"button"} className={"large"} onClick={removeRow}>Reihe entfernen</button>
        </div>
    )
}

namespace TrNode {
    export interface Attributes {
        payload: any
    }
}

export default TrNode