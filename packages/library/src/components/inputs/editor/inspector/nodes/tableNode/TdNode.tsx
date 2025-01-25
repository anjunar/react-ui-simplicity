import React from "react";

function TdNode(properties: TdNode.Attributes) {

    const {payload} = properties

    function onAddColumn() {
        const tr = payload
            .parentElement

        const tbody = payload
            .parentElement
            .parentElement

        const index = Array.from(tr.children).indexOf(payload)

        for (const tr of tbody.children) {
            tr.children.item(index).insertAdjacentHTML("afterend", "<td></td>")
        }
    }

    function onRemoveColumn() {
        const tr = payload
            .parentElement

        const tbody = payload
            .parentElement
            .parentElement

        const index = Array.from(tr.children).indexOf(payload)

        for (const tr of tbody.children) {
            tr.children.item(index).remove()
        }
    }

    return (
        <div>
            <button type={"button"} className={"large"} onClick={onAddColumn}>Spalte einfügen</button>
            <br/>
            <button type={"button"} className={"large"} onClick={onRemoveColumn}>Spalte entfernen</button>
        </div>
    )
}

namespace TdNode {
    export interface Attributes {
        payload: any
    }
}

export default TdNode