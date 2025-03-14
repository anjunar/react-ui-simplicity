import React, {useEffect, useState} from "react"
import Tabs from "../../../../layout/tabs/Tabs";
import Tab from "../../../../layout/tabs/Tab";

function Footer(properties: Footer.Attributes) {

    const {page, onPage, onMarkDown} = properties

    const [markDown, setMarkDown] = useState(false)

    useEffect(() => {
        onMarkDown(markDown)
    }, [markDown]);

    return (
        <div className={"editor-footer"} style={{position : "relative"}}>
            <Tabs page={page} onPage={onPage}>
                <Tab selected={true}>
                    <span className={"material-icons"}>text_format</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>format_size</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>palette</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>construction</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>widgets</span>
                </Tab>
            </Tabs>
            <button style={{position : "absolute", right : 0, top : 0}} className={markDown ? "active" : ""} >
                <span className={"material-icons"} onClick={() => setMarkDown(! markDown)}>markdown</span>
            </button>
        </div>
    )
}

namespace Footer {
    export interface Attributes {
        page : number
        onPage : (value : number) => void
        onMarkDown : (value : boolean) => void
    }
}

export default Footer