import React from "react"
import Tabs from "../../../layout/tabs/Tabs";
import Tab from "../../../layout/tabs/Tab";

function Footer(properties : Footer.Attributes) {

    const {page, onPage} = properties

    return (
        <div className={"wysiwyg-footer"}>
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
                    <span className={"material-icons"}>format_align_justify</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>widgets</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>frame_inspect</span>
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