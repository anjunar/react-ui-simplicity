import {findKeyByValue, groupByConsecutiveMulti} from "../Arrays";
import TextNode from "./TextNode";
import React from "react";
import ParagraphNode from "./ParagraphNode";
import RootNode from "./RootNode";
import {TreeNode} from "../TreeNode";
import UlNode from "./UlNode";
import TableNode from "./TableNode";


function NodeFactory(properties : NodeFactory.Attributes) {

    const {nodes, astChange} = properties

    let {groups, record} = groupByConsecutiveMulti(nodes, [node => node.type]);

    let result = []

    for (const group of groups) {
        let key = findKeyByValue(record, group);

        switch (key) {
            case "root" :
                result.push(...group.map(model => (<RootNode key={model.id} ast={model} astChange={astChange}/>)))
                break
            case "text" :
                result.push(...groupByConsecutiveMulti(group, [node => node.attributes.bold, node => node.attributes.italic])
                    .groups
                    .map(segments => {
                        return (<TextNode key={segments[0].id} ast={segments} astChange={astChange}/>);
                    }))
                break
            case "p" :
                result.push(...group.map(model => <ParagraphNode key={model.id} ast={model} astChange={astChange}/>))
                break
            case "ul" :
                result.push(...group.map(model => <UlNode key={model.id} ast={model} astChange={astChange}/>))
                break
            case "table" :
                result.push(...group.map(model => <TableNode key={model.id} ast={model} astChange={astChange}/>))
                break
        }
    }

    return result
}

namespace NodeFactory {
    export interface Attributes {
        nodes : TreeNode[]
        astChange : () => void
    }
}

export default NodeFactory