import React from "react"

function HeaderTool(properties: HeaderTool.Attributes) {

    const {} = properties

    const headerFormat = ["h1", "h2", "h3", "h4", "h5", "h6"]

    return (
        <div>
            {
                headerFormat.map(format => (
                    <button key={format} className={"material-icons"}>format_{format}</button>
                ))
            }

        </div>
    )
}

namespace HeaderTool {
    export interface Attributes {

    }
}

export default HeaderTool