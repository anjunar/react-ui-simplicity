import React from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import info from "./LinkPage.json"
import Features from "../../../layout/content/Features";
import {HighLight, Link} from "react-ui-simplicity";
import Props from "../../../layout/content/Props";

export default function LinkPage() {
    return (
        <div className={"link-page"}>
            <PageLayout>
                <Section text={"Link"}>
                    This code defines a Link component in React that handles navigation and link rendering with active state management. The component uses useState and useLayoutEffect to track the current URL and dynamically apply an "active" class to the link when the URL matches the link's value. It also provides custom link handling through the onClick event, which prevents the default anchor behavior and uses a navigate function for routing. The Link component is flexible and can render children as either symbols (using icons) or descriptions, depending on the use case. The Link utility functions (onLink, renderWithSymbol, renderWithDescription) help generate links from container objects, making the component adaptable for various link structures in the application.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <Link value={"/meta/table"}>Meta Table</Link>
                    <br/>
                    <br/>
                    <Link value={"/meta/form"}>Meta Form</Link>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React from "react";
                            |import {Link} from "react-ui-simplicity";
                            |
                            |export default function LinkPage() {
                            |    return (
                            |        <div>                                
                            |            <Link value={"/meta/table"}>Meta Table</Link>
                            |            <br/>
                            |            <br/>
                            |            <Link value={"/meta/form"}>Meta Form</Link>
                            |        </div>
                            |    )
                            |}                                
                            `.stripMargin()
                        }
                    </HighLight>
                </Section>
                <Section text={"API"}>
                    <Props value={info.props}/>
                </Section>
            </PageLayout>
        </div>
    )
}