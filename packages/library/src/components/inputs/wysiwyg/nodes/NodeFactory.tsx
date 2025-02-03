import {NodeModel, ParagraphModel, TextNodeModel} from "../Wysiwyg";
import {findKeyByValue, groupByConsecutiveMulti} from "../Util";
import TextNode from "./TextNode";
import React from "react";
import ParagraphNode from "./ParagraphNode";
import {arrayMembrane} from "../../../../membrane/Membrane";

export function NodeFactory(nodes: NodeModel[], textClickCallback : (node : TextNodeModel) => void) {

    let activeObject = nodes as any

    let {groups, record} = groupByConsecutiveMulti(nodes, [node => node.type]);

    for (const group of groups) {
        let key = findKeyByValue(record, group);

        switch (key) {
            case "text" :
                return groupByConsecutiveMulti(group as TextNodeModel[], [node => node.bold, node => node.italic])
                    .groups
                    .map(segments => {
                        let callback = (property : string[], value :any) => {
                            // let index = nodes.findIndex(node => node.id === value.id);
                            // nodes.splice(index, 1)
                        }
                        let membrane = arrayMembrane(segments, [...activeObject.$callbacks, callback], activeObject.$path);
                        return (<TextNode key={segments[0].id} ast={membrane} onClickCallback={textClickCallback}/>);
                    })
            case "p" :
                return group.map(model => <ParagraphNode key={model.id} ast={model as ParagraphModel} textClickCallback={textClickCallback}/>)
        }
    }

}