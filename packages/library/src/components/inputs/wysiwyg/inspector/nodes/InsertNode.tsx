import React, {useState} from "react"
import {TreeNode} from "../../TreeNode";
import Input from "../../../input/Input";

function InsertNode(properties: InsertNode.Attributes) {

    const {payload, ast, astChange} = properties

    const [after, setAfter] = useState(true)

    const [activeChild, setActiveChild] = useState(null)

    const onCreateList = () => {
        let activeNode = ast.find((node) => node.dom === activeChild);

        let indexOf = ast.children.indexOf(activeNode)
        let ulNode = new TreeNode("ul");
        let liNode = new TreeNode("li");
        let pNode = new TreeNode("p");
        liNode.appendChild(pNode)
        ulNode.appendChild(liNode)

        ast.splice(indexOf + (after ? 1 : 0), 0, ulNode)

        astChange()
    }

    const onDeleteList = () => {
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
                    <div style={{display: "flex", gap: "12px"}}>
                        <div>
                            {
                                Array.from(element.children)
                                    .map((child, index) => (
                                        <p key={index} style={{color: child === activeChild ? "var(--color-selected)" : "var(--color-text)"}} onClick={() => setActiveChild(child)}>{child.localName}</p>
                                    ))
                            }
                        </div>
                        {
                            activeChild && (
                                <div style={{display: "flex"}}>
                                    <div>
                                        <button>new Table</button>
                                        <br/>
                                        <button>new Image</button>
                                        <br/>
                                        <button onClick={onCreateList}>new List</button>
                                    </div>
                                    <div>
                                        <label>After</label>
                                        <Input standalone={true} value={after} type={"checkbox"} onChange={(event: any) => setAfter(event)}/>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            case "ul" :
                return (
                    <div>
                        <button onClick={onDeleteList}>delete List</button>
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