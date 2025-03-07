import React, {useContext} from "react"
import {ItemNode, ListNode} from "./ListNode";
import {ParagraphNode, TextNode} from "../../core/TreeNode";
import EditorContext from "../../EditorContext";
import {findParent} from "../../core/TreeNodes";

function ListTool(properties: ListTool.Attributes) {

    const {node} = properties

    let {ast: {triggerAST}, cursor: {currentCursor, triggerCursor}} = useContext(EditorContext);

    function addClick(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()

        let liNode = findParent(currentCursor.container, element => element instanceof ItemNode && element.parent === node) as ItemNode

        let parent = liNode.parent;
        let parentIndex = liNode.parentIndex;

        let textNode = new TextNode();

        let firstChild = (liNode.children[0] as ParagraphNode).children[0] as TextNode
        if (firstChild.text === "") {
            let grandParent = parent.parent;
            let grandParentIndex = parent.parentIndex;
            liNode.remove()
            grandParent.insertChild(grandParentIndex + 1, new ParagraphNode([textNode]));
        } else {
            parent.insertChild(parentIndex + 1, new ItemNode([new ParagraphNode([textNode])]));
        }

        currentCursor.container = textNode
        currentCursor.offset = 0

        triggerCursor()
        triggerAST()
    }

    function deleteClick(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()

        let liNode = findParent(currentCursor.container, element => element instanceof ItemNode && element.parent === node) as ItemNode

        let parent = liNode.parent;

        liNode.remove()

        if (parent.children.length === 0) {
            parent.remove()
        }

        triggerAST()
    }



    return (
        <div style={{display : "flex", flexDirection : "column"}}>
            <button onClick={addClick} className={"container"}><span className={"material-icons"}>add</span>Add</button>
            <button onClick={deleteClick} className={"container"}><span className={"material-icons"}>delete</span>Delete</button>
        </div>
    )
}

namespace ListTool {
    export interface Attributes {
        node : ListNode
    }
}

export default ListTool
