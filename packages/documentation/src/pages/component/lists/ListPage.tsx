import React from "react";
import info from "./ListPage.json"
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import {HighLight, List, Pageable} from "react-ui-simplicity";
import Item = List.Item;
import Props from "../../../layout/content/Props";

export default function ListPage() {

    const loader = new class extends Pageable.Loader {
        async onLoad(query: Pageable.Query, callback: Pageable.Callback) {

            const response = await fetch("/assets/materials.json")

            if (response.ok) {
                let table : any = await response.json();
                let splice = table.rows.slice(query.index, query.index + query.limit);
                callback(splice, table.size)
            }

        }
    }

    return (
        <div className={"list-page"}>
            <PageLayout>
                <Section text={"List"}>
                    The List component is a pageable list in React, designed to display a subset of items (window) from a larger dataset while providing navigation and customizable rendering for each item. It is composed of two main parts: the List wrapper and the ListRenderer
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <List loader={loader}>
                        <Item>
                            {
                                ({row}) => (
                                    <div>
                                        <span>{row.position}</span>
                                        <span>{row.name}</span>
                                        <span>{row.weight}</span>
                                        <span>{row.symbol}</span>
                                    </div>
                                )
                            }
                        </Item>
                    </List>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React from "react";
                            |import {List, Pageable} from "react-ui-simplicity";
                            |import Item = List.Item;
                            |
                            |export default function ListPage() {
                            |
                            |    const loader = new class extends Pageable.Loader {
                            |        async onLoad(query: Pageable.Query, callback: Pageable.Callback) {
                            |
                            |            const response = await fetch("/assets/materials.json")
                            |
                            |            if (response.ok) {
                            |                let rows : any[] = await response.json();
                            |                let splice = rows.slice(query.index, query.index + query.limit);
                            |                callback(splice, rows.length)
                            |            }
                            |
                            |        }
                            |    }
                            |
                            |    return (
                            |            <List loader={loader}>
                            |                <Item>
                            |                    {
                            |                        ({row}) => (
                            |                            <div>
                            |                                <span>{row.position}</span>
                            |                                <span>{row.name}</span>
                            |                                <span>{row.weight}</span>
                            |                                <span>{row.symbol}</span>
                            |                            </div>
                            |                        )
                            |                    }
                            |                </Item>
                            |            </List>
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