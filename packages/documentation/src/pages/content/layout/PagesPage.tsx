import React, {useState} from "react";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import info from "./PagesPage.json"
import Props from "../../../layout/content/Props";
import {HighLight, Page, Pages, Tab, Tabs} from "react-ui-simplicity";
import PageLayout from "../../../layout/content/PageLayout";

export default function PagesPage() {

    const [page, setPage] = useState(0)

    return (
        <div className={"pages-page"}>
            <PageLayout>
                <Section text={"Pages"}>
                    The Pages component is a React component that displays one page from an array of child elements, with options for either rendering only the active page or rendering all pages but hiding inactive ones
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <div>
                        <Tabs page={page} onPage={(value) => setPage(value)}>
                            <Tab>Life</Tab>
                            <Tab>Consciousness</Tab>
                            <Tab>Death</Tab>
                        </Tabs>
                        <Pages page={page}>
                            <Page>
                                <div className={"center"} style={{height: "500px"}}>A happy Tree</div>
                            </Page>
                            <Page>
                                <div className={"center"} style={{height: "500px"}}>The Eternal</div>
                            </Page>
                            <Page>
                                <div className={"center"} style={{height: "500px"}}>Timelessness</div>
                            </Page>
                        </Pages>
                    </div>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                        |import React, {useState} from "react";
                        |import {Page, Pages, Tab, Tabs} from "react-ui-simplicity";
                        |
                        |export default function TabsAndPagesPage() {
                        |
                        |    const [page, setPage] = useState(0)
                        |
                        |    return (
                        |            <div>
                        |                <Tabs page={page} onPage={(value) => setPage(value)}>
                        |                    <Tab>Life</Tab>
                        |                    <Tab>Consciousness</Tab>
                        |                    <Tab>Death</Tab>
                        |                </Tabs>
                        |                <Pages page={page}>
                        |                    <Page><div className={"center"} style={{height : "500px"}}>A happy Tree</div></Page>
                        |                    <Page><div className={"center"} style={{height : "500px"}}>The Eternal</div></Page>
                        |                    <Page><div className={"center"} style={{height : "500px"}}>Timelessness</div></Page>
                        |                </Pages>
                        |            </div>
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