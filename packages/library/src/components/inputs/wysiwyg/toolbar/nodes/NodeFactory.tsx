import React from "react"
import ContainerNode from "./ContainerNode";
import LiNode from "./LiNode";

function NodeFactory(properties : NodeFactory.Attributes) {

    const {element} = properties

    switch (element.localName) {
        case "p" : return <ContainerNode element={element}/>
        case "ul" : return <ContainerNode element={element}/>
        case "table" : return <ContainerNode element={element}/>
        case "li" : return <LiNode element={element}/>
    }

}

namespace NodeFactory {
    export interface Attributes {

        element : HTMLElement

    }
}

export default NodeFactory