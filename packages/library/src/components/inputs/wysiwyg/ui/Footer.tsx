import React, {useEffect, useState} from "react"
import Tabs from "../../../layout/tabs/Tabs";
import Tab from "../../../layout/tabs/Tab";

function Footer(properties: Footer.Attributes) {

    const {page, onPage} = properties

    const [bottomPadding, setBottomPadding] = useState(-8);

    useEffect(() => {
        const updatePadding = (event : any) => {
            if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const screenHeight = window.innerHeight;
                if (screenHeight === viewportHeight) {
                    setBottomPadding(screenHeight - viewportHeight - window.visualViewport.offsetTop - 8);
                } else {
                    setBottomPadding(screenHeight - viewportHeight - window.visualViewport.offsetTop - 24);
                }

            }
        };

        window.visualViewport?.addEventListener("resize", updatePadding);
        window.visualViewport?.addEventListener("scroll", updatePadding)
        return () => {
            window.visualViewport?.removeEventListener("resize", updatePadding);
            window.visualViewport?.removeEventListener("scroll", updatePadding)
        };
    }, []);

    return (
        <div className={"editor-footer"} style={{position : "absolute", left : 0, bottom : bottomPadding + "px", width : "100%"}}>
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