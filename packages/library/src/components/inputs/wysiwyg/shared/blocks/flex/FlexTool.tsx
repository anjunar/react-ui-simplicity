import React, {useContext, useEffect, useState} from "react"
import {FlexNode} from "./FlexNode";
import {WysiwygContext} from "../../contexts/WysiwygState";
import {EditorContext} from "../../contexts/EditorState";

function FlexTool(properties: FlexTool.Attributes) {

    const {node} = properties

    const {ast : {triggerAST}} = useContext(EditorContext)

    const [justifyContent, setJustifyContent] = useState("flex-start")

    const [alignItems, setAlignItems] = useState("flex-start")

    useEffect(() => {
        node.justifyContent = justifyContent

        triggerAST()
    }, [justifyContent]);

    useEffect(() => {
        node.alignItems = alignItems

        triggerAST()
    }, [alignItems]);

    return (
        <div>
            <select style={{width : "150px", padding : "4px"}}
                    value={justifyContent}
                    onClick={event => event.stopPropagation()}
                    onChange={event => setJustifyContent(event.target.value)}>
                <option value={"flex-start"}>Flex Start</option>
                <option value={"flex-end"}>Flex End</option>
                <option value={"center"}>Center</option>
                <option value={"space-between"}>Space Between</option>
                <option value={"space-around"}>Space Around</option>
                <option value={"space-evenly"}>Space Evenly</option>
            </select>

            <br/>

            <select style={{width : "150px", padding : "4px"}}
                    value={alignItems}
                    onClick={event => event.stopPropagation()}
                    onChange={event => setAlignItems(event.target.value)}>
            <option value={"flex-start"}>Flex Start</option>
                <option value={"flex-end"}>Flex End</option>
                <option value={"center"}>Center</option>
                <option value={"stretch"}>Stretch</option>
                <option value={"baseline"}>Baseline</option>
            </select>
        </div>
    )
}

namespace FlexTool {
    export interface Attributes {
        node : FlexNode
    }
}

export default FlexTool