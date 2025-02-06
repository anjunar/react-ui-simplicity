import React, {useState} from "react"
import {TreeNode} from "../../TreeNode";
import Input from "../../../input/Input";

function InsertNode(properties: InsertNode.Attributes) {

    const {payload, ast, astChange} = properties

    const [after, setAfter] = useState(true)

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

    const onAddItem = () => {
        let activeNode = ast.find((node) => node.dom === payload);

        let liNode = new TreeNode("li")
        let pNode = new TreeNode("p")
        liNode.appendChild(pNode)
        activeNode.insertAfter(liNode)

        astChange()
    }

    const onDeleteItem = () => {
        let activeNode = ast.find((node) => node.dom === payload);

        if (activeNode.parent.children.length <= 1) {
            activeNode.parent.remove()
        } else {
            activeNode.remove()

        }

        astChange()
    }

    const render = (element: HTMLElement) => {
        switch (element.localName) {
            case "span" :
                return <div>{payload.textContent}</div>
            case "div" :
                return (
                    <div style={{display: "flex", gap : "12px"}}>
                        <div>
                            <button onClick={onCreateParagraph}>new Paragraph</button>
                            <br/>
                            <button>new Table</button>
                            <br/>
                            <button>new Image</button>
                            <br/>
                            <button onClick={onCreateList}>new List</button>
                        </div>
                        <div style={{display : "flex", alignItems : "center", gap : "12px"}}>
                            <label>After</label>
                            <Input standalone={true} value={after} type={"checkbox"} onChange={(event: any) => setAfter(event)}/>
                        </div>
                    </div>
                )
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
                        <button onClick={onDeleteItem}>delete Item</button>
                    </div>
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