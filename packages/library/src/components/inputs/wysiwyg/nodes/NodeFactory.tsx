import {NodeModel, ParagraphModel, TextNodeModel} from "../Wysiwyg";
import {findKeyByValue, groupByConsecutiveMulti} from "../Util";
import TextNode from "./TextNode";
import React from "react";
import ParagraphNode from "./ParagraphNode";

export function NodeFactory(nodes: NodeModel[]) {

    let activeObject = nodes as any

    let {groups, record} = groupByConsecutiveMulti(nodes, [node => node.type]);

    for (const group of groups) {
        let key = findKeyByValue(record, group);

        switch (key) {
            case "text" :
                return groupByConsecutiveMulti(group as TextNodeModel[], [node => node.bold, node => node.italic])
                    .groups
                    .map(segments => {
                        return (<TextNode key={segments[0].id} ast={segments}/>);
                    })
            case "p" :
                return group.map(model => <ParagraphNode key={model.id} ast={model as ParagraphModel}/>)
        }
    }

}