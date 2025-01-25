import React, {useState} from "react";
import InputContainer from "../../../container/InputContainer";
import Input from "../../../input/Input";
import TdNode from "./tableNode/TdNode";
import TrNode from "./tableNode/TrNode";

function TableNode(properties: TableNode.Attributes) {

    const {payload} = properties

    const [rows, setRows] = useState(2)
    const [columns, setColumns] = useState(2)

    function generateTable(xLength: number, yLength: number) {
        let table: HTMLTableElement = document.createElement("table")
        table.className = "editable"
        for (let x = 0; x < xLength; x++) {
            let resultY: HTMLTableRowElement = document.createElement("tr")
            table.appendChild(resultY)
            for (let y = 0; y < yLength; y++) {
                resultY.appendChild(document.createElement("td"))
            }

        }
        return table
    }

    function onInsert() {
        payload.appendChild(generateTable(columns, rows))
    }

    function tableNode() {
        switch (payload.localName) {
            case "td" :
                return <TdNode payload={payload}/>
            case "tr" :
                return <TrNode payload={payload}/>
            default :
                return <div></div>
        }
    }

    return (
        <div style={{display: "flex"}}>
            <div style={{flex: 1}}>
                <p>Tabelle einfügen</p>
                <br/>
                <InputContainer placeholder={"Reihen"} style={{width: "100px"}}>
                    <Input type={"number"} value={rows} onChange={(value: any) => setRows(value)} standalone={true}/>
                </InputContainer>
                <InputContainer placeholder={"Spalten"} style={{width: "100px"}}>
                    <Input type={"number"} value={columns} onChange={(value: any) => setColumns(value)}
                           standalone={true}/>
                </InputContainer>
                <button type={"button"} onClick={() => onInsert()}>Einfügen</button>
            </div>
            <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                <p>Tabelle ändern</p>
                <br/>
                <div style={{flex: 1}}>
                    {
                        tableNode()
                    }
                </div>
            </div>
        </div>

    )
}

namespace TableNode {
    export interface Attributes {
        payload: HTMLElement
    }
}

export default TableNode