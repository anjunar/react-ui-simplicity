import "./Inspector.css"
import React, {CSSProperties, useContext, useEffect, useState} from "react"
import EditorContext from "../EditorContext";
import {AbstractNode} from "../core/TreeNode";

function Inspector(properties: Inspector.Attributes) {

    const {style} = properties

    const [selectedNodeId, setSelectedNodeId] = useState<string>("")

    const [hierarchicalNodes, setHierarchicalNodes] = useState<AbstractNode[]>([])

    const {providers, cursor: {currentCursor}} = useContext(EditorContext)

    useEffect(() => {

        const nodes: AbstractNode[] = []

        if (currentCursor) {
            let cursor = currentCursor.container

            while (cursor) {
                let provider = providers.find(provider => provider.type === cursor.type)

                if (provider) {
                    nodes.push(cursor)
                }

                cursor = cursor.parent
            }

            setHierarchicalNodes(nodes)

        }
    }, [currentCursor]);

    useEffect(() => {
        if (hierarchicalNodes.length > 0) {
            setSelectedNodeId(hierarchicalNodes[0].id)
        }
    }, [hierarchicalNodes]);

    function createTool() {
        if (currentCursor) {
            let selectedNode = hierarchicalNodes.find(node => node.id === selectedNodeId)
            if (selectedNode) {
                let provider = providers.find(provider => provider.type === selectedNode.type)
                return React.createElement(provider.tool, {node: selectedNode})
            }
            return <div>Select an Element</div>
        } else {
            return <div>Select an Element</div>
        }
    }

    return (
        <div className={"inspector"} onClick={event => event.stopPropagation()} style={style}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <select style={{padding: "4px"}} value={selectedNodeId} onChange={event => setSelectedNodeId(event.target.value)}>
                    {
                        hierarchicalNodes.map(node => (
                            <option key={node.id} value={node.id}>
                                {providers.find(provider => provider.type === node.type).title}
                            </option>
                            )
                        )
                    }
                </select>
                <hr style={{width: "100%"}}/>
                {
                    createTool()
                }
            </div>
        </div>
    )
}

namespace Inspector {
    export interface Attributes {
        style : CSSProperties
    }
}

export default Inspector