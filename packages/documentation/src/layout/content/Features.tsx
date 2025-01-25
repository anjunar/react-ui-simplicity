import "./Features.css"
import React from "react";

function Features(properties : Features.Attributes) {

    const {value} = properties

    return (
        <div className={"features"}>
            {
                value.map((item) => (
                    <div key={item.name}>
                        <strong>{item.name}</strong>
                        <div style={{marginLeft : "12px"}}>{item.description}</div>
                        <br/>
                    </div>
                ))
            }
        </div>
    )
}

namespace Features {
    export interface Attributes {
        value : any[]
    }
}

export default Features