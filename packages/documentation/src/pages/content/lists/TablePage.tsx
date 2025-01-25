import React from "react";
import info from "./TablePage.json"
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import {HighLight, Pageable, Table} from "react-ui-simplicity";
import Props from "../../../layout/content/Props";

export default function TablePage() {

    const loader = new class extends Pageable.Loader {
        async onLoad(query: Pageable.Query, callback: Pageable.Callback) {

            const response = await fetch("/assets/materials.json")

            if (response.ok) {
                let rows : any[] = await response.json();
                let splice = rows.slice(query.index, query.index + query.limit);
                callback(splice, rows.length)
            }

        }
    }

    return (
        <div className={"table-page"}>
            <PageLayout>
                <Section text={"Table"}>
                    This Table component provides a highly flexible and customizable structure for displaying tabular data with features like pagination, sorting, filtering, and row selection. It’s particularly useful when dealing with
                    large datasets and dynamic content.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <Table loader={loader} className={"table"} style={{width : "100%"}}>
                        <Table.Head>
                            <Table.Head.Cell property={"position"}>Position</Table.Head.Cell>
                            <Table.Head.Cell property={"name"}>Name</Table.Head.Cell>
                            <Table.Head.Cell property={"weight"}>Weight</Table.Head.Cell>
                            <Table.Head.Cell property={"symbol"}>Symbol</Table.Head.Cell>
                        </Table.Head>
                        <Table.Body>
                            <Table.Body.Cell>
                                {
                                    ({row}) => (<span>{row.position}</span>)
                                }
                            </Table.Body.Cell>
                            <Table.Body.Cell>
                                {
                                    ({row}) => (<span>{row.name}</span>)
                                }
                            </Table.Body.Cell>
                            <Table.Body.Cell>
                                {
                                    ({row}) => (<span>{row.weight}</span>)
                                }
                            </Table.Body.Cell>
                            <Table.Body.Cell>
                                {
                                    ({row}) => (<span>{row.symbol}</span>)
                                }
                            </Table.Body.Cell>
                        </Table.Body>
                    </Table>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React from "react";
                            |import {Pageable, Table} from "react-ui-simplicity";
                            |
                            |export default function TablePage() {
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
                            |            <Table loader={loader} className={"table"} style={{width : "100%"}}>
                            |                <Table.Head>
                            |                    <Table.Head.Cell property={"position"}>Position</Table.Head.Cell>
                            |                    <Table.Head.Cell property={"name"}>Name</Table.Head.Cell>
                            |                    <Table.Head.Cell property={"weight"}>Weight</Table.Head.Cell>
                            |                    <Table.Head.Cell property={"symbol"}>Symbol</Table.Head.Cell>
                            |                </Table.Head>
                            |                <Table.Body>
                            |                    <Table.Body.Cell>
                            |                        {
                            |                            ({row}) => (<span>{row.position}</span>)
                            |                        }
                            |                    </Table.Body.Cell>
                            |                    <Table.Body.Cell>
                            |                        {
                            |                            ({row}) => (<span>{row.name}</span>)
                            |                        }
                            |                    </Table.Body.Cell>
                            |                    <Table.Body.Cell>
                            |                        {
                            |                            ({row}) => (<span>{row.weight}</span>)
                            |                        }
                            |                    </Table.Body.Cell>
                            |                    <Table.Body.Cell>
                            |                        {
                            |                            ({row}) => (<span>{row.symbol}</span>)
                            |                        }
                            |                    </Table.Body.Cell>
                            |                </Table.Body>
                            |            </Table>
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