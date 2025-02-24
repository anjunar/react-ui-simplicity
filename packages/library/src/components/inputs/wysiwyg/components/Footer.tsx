import React from "react"
import Tabs from "../../../layout/tabs/Tabs";
import Tab from "../../../layout/tabs/Tab";

function Footer(properties: Footer.Attributes) {

    const {page, onPage} = properties

    return (
        <div className={"wysiwyg-footer"}>
            <Tabs page={page} onPage={onPage}>
                <Tab>
                    <span className={"material-icons"}>add</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>toc</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>widgets</span>
                </Tab>
            </Tabs>
        </div>
    )
}

namespace Footer {
    export interface Attributes {
        page : number
        onPage : (value : number) => void
    }
}

export default Footer