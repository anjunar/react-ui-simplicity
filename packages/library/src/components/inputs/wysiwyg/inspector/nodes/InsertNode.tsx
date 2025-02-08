import React, {useState} from "react"
import {TreeNode} from "../../TreeNode";
import Input from "../../../input/Input";

function InsertNode(properties: InsertNode.Attributes) {

    const {payload, ast, astChange} = properties

    const [after, setAfter] = useState(true)

    const onCreateTable = () => {
        function newTd() {
            let tdHead = new TreeNode("td");
            tdHead.appendChild(new TreeNode("p"))
            return tdHead;
        }


        let activeNode = ast.find((node) => node.dom === payload);
        let parent = activeNode.parent
        let indexOf = parent.children.indexOf(activeNode)

        let root = new TreeNode("p")
        let tableNode = new TreeNode("table")
        root.appendChild(tableNode)
        let tbody = new TreeNode("tbody")
        tableNode.appendChild(tbody)

        let trBody = new TreeNode("tr");
        tbody.appendChild(trBody)
        trBody.appendChild(newTd())
        trBody.appendChild(newTd())

        parent.splice(indexOf + (after ? 1 : 0), 0, root)

        astChange()

    }

    const onCreateList = () => {
        let activeNode = ast.find((node) => node.dom === payload);

        let parent = activeNode.parent
        let indexOf = parent.children.indexOf(activeNode)
        let root = new TreeNode("p")
        let ulNode = new TreeNode("ul");
        root.appendChild(ulNode)
        let liNode = new TreeNode("li");
        ulNode.appendChild(liNode)
        let pNode = new TreeNode("p");
        liNode.appendChild(pNode)

        parent.splice(indexOf + (after ? 1 : 0), 0, root)

        astChange()
    }

    const onCreateParagraph = () => {
        let activeNode = ast.find((node) => node.dom === payload);

        let parent = activeNode.parent
        let indexOf = parent.children.indexOf(activeNode)
        let pNode = new TreeNode("p");
        parent.splice(indexOf + (after ? 1 : 0), 0, pNode)

        astChange()
    }

    const onDeleteSelected = () => {
        let activeNode = ast.find((node) => node.dom === payload);
        activeNode.remove()
        astChange()
    }

    const onAddColumn = () => {
        let activeNode = ast.find((node) => node.dom === payload);
        let parent = activeNode.parent
        let indexOf = parent.children.indexOf(activeNode)

        for (const child of parent.parent.children) {
            let tdNode = new TreeNode("td");
            tdNode.appendChild(new TreeNode("p"))
            child.splice(indexOf + (after ? 1 : 0), 0, tdNode)
        }

        astChange()
    }

    const onDeleteColumn = () => {
        let activeNode = ast.find((node) => node.dom === payload);
        let parent = activeNode.parent
        let indexOf = parent.children.indexOf(activeNode)

        for (const child of parent.parent.children) {
            child.children[indexOf].remove()
        }

        astChange()
    }

    const onAddRow = () => {
        let activeNode = ast.find((node) => node.dom === payload);
        let parent = activeNode.parent
        let indexOf = parent.children.indexOf(activeNode)

        let trNode = new TreeNode("tr")

        for (let i = 0; i < ast.children.length; i++) {
            let tdNode = new TreeNode("td");
            tdNode.appendChild(new TreeNode("p"))
            trNode.appendChild(tdNode)
        }

        parent.splice(indexOf + (after ? 1 : 0), 0, trNode)

        astChange()
    }

    const onAddItem = () => {
        let activeNode = ast.find((node) => node.dom === payload);

        let liNode = new TreeNode("li")
        let pNode = new TreeNode("p")
        liNode.appendChild(pNode)
        activeNode.insertAfter(liNode)

        astChange()
    }

    const render = (element: HTMLElement) => {
        switch (element.localName) {
            case "span" :
                return <div>{payload.textContent}</div>
            case "div" : {
                let activeNode = ast.find((node) => node.dom === payload);

                if (activeNode.type === "root") {
                    return (
                        <div>Root Node cannot be changed</div>
                    )
                } else {
                    return (
                        <div style={{display: "flex", gap : "12px"}}>
                            <div style={{display : "flex", alignItems : "center", gap : "12px"}}>
                                <label>After</label>
                                <Input standalone={true} value={after} type={"checkbox"} onChange={(event: any) => setAfter(event)}/>
                            </div>

                            <div>
                                <button onClick={onCreateParagraph}>new Paragraph</button>
                                <br/>
                                <button onClick={onCreateTable}>new Table</button>
                                <br/>
                                <button>new Image</button>
                                <br/>
                                <button onClick={onCreateList}>new List</button>
                            </div>
                        </div>
                    )
                }
            }
            case "ul" :
                return (
                    <div>
                        <button onClick={onDeleteSelected}>delete List</button>
                    </div>
                )
            case "li" :
                return (
                    <div>
                        <button onClick={onAddItem}>add Item</button>
                        <button onClick={onDeleteSelected}>delete Item</button>
                    </div>
                )
            case "td" :
                return (
                    <div>
                        <button onClick={onAddColumn}>add Column</button>
                        <button onClick={onDeleteColumn}>delete Column</button>
                    </div>
                )
            case "tr" :
                return (
                    <div>
                        <button onClick={onAddRow}>add Row</button>
                        <button onClick={onDeleteSelected}>delete Row</button>
                    </div>
                )
            default : return (
                <div>No Action</div>
            )
        }
    }

    return (
        <div>
            {render(payload)}
        </div>
    )
}

namespace InsertNode {
    export interface Attributes {
        payload: HTMLElement
        ast: TreeNode
        astChange: () => void
    }
}

export default InsertNode