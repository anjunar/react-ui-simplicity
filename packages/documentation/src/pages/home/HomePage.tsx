import React from "react"

function HomePage(properties : Home.Attributes) {
    return (
        <div className={"center"}>
            <div style={{fontSize : "9vw"}}>
                <h1 style={{fontSize : "1em"}}>React UI Simplicity</h1>
                <h1 style={{fontSize : "0.5em"}}>Component Framework v1.1.5</h1>
            </div>
        </div>
    )
}

namespace Home {
    export interface Attributes {

    }
}

export default HomePage