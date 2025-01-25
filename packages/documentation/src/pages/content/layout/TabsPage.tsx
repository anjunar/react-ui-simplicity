import React, {useState} from "react";
import info from "./TabsPage.json"
import Features from "../../../layout/content/Features";
import Section from "../../../layout/content/Section";
import {HighLight, Page, Pages, Tab, Tabs} from "react-ui-simplicity";
import PageLayout from "../../../layout/content/PageLayout";
import Props from "../../../layout/content/Props";

export default function TabsPage() {

    const [page, setPage] = useState(0)

    return (
        <div className={"tabs-and-pages-page"}>
            <PageLayout>
                <Section text={"Tabs and Pages"}>
                    The Tabs component provides an intuitive and dynamic way to manage paginated content. It supports seamless navigation between multiple views using tabs and is designed to handle custom behavior with minimal setup. With
                    stateful
                    tab management, built-in event handling, and customizable props, the Tabs component is suitable for creating highly interactive and responsive user interfaces.
                    <br/>
                    <br/>
                    <h3>Tabs</h3>
                    <br/>
                    <Features value={info.Tabs.features}/>
                    <br/>
                    <br/>
                    <h3>Tab</h3>
                    <br/>
                    <Features value={info.Tab.features}/>
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
                    <h3>Tabs</h3>
                    <Props value={info.Tabs.props}/>
                    <h3>Tab</h3>
                    <Props value={info.Tab.props}/>
                </Section>
            </PageLayout>
        </div>
    )
}