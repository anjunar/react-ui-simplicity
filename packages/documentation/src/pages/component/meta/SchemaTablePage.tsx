import React from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import info from "./SchemaTablePage.json"
import Features from "../../../layout/content/Features";
import {HighLight, mapTable, SchemaTable} from "react-ui-simplicity";
import Props from "../../../layout/content/Props";

export default function SchemaTablePage() {

    const loader = new class extends SchemaTable.Loader {
        async onLoad(query: SchemaTable.Query, callback: SchemaTable.Callback) {

            const response = await fetch("/assets/materials.json")

            if (response.ok) {
                let table : any = await response.json();
                let [rows, size, links, descriptor] = mapTable(table);
                callback(rows.slice(query.index, query.index + query.limit), size, descriptor)
            }

        }
    }


    return (
        <div className={"schema-table-page"}>
            <PageLayout>
                <Section text={"Schema Table"}>
                    The SchemaTable component is a schema-driven React table that dynamically adapts its structure and content based on an associated schema. It provides a streamlined mechanism to render data-rich tables by interpreting
                    ObjectDescriptor, NodeDescriptor, and CollectionDescriptor schemas. The table supports advanced features like customizable cell rendering, schema-driven filters, and dynamic content adaptation.
                    <br/>
                    <br/>
                    The SchemaTable is particularly suited for applications requiring a dynamic, schema-driven approach to table management, such as admin dashboards, reporting systems, and complex data grids. Its extensibility and seamless schema integration make it a versatile tool for handling structured data in modern web applications.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <SchemaTable loader={loader} style={{width : "100%"}}/>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React from "react";
                            |import {mapTable, SchemaTable} from "react-ui-simplicity";
                            |
                            |export default function SchemaTablePage() {
                            |
                            |    const loader = new class extends SchemaTable.Loader {
                            |        async onLoad(query: SchemaTable.Query, callback: SchemaTable.Callback) {
                            | 
                            |            const response = await fetch("/assets/materials.json")
                            |
                            |            if (response.ok) {
                            |                let table : any = await response.json();
                            |                let [rows, size, links, descriptor] = mapTable(table);
                            |                callback(rows.slice(query.index, query.index + query.limit), size, descriptor)
                            |            }
                            | 
                            |        }
                            |    }
                            |
                            |
                            |    return (
                            |            <SchemaTable loader={loader} style={{width : "100%"}}/>
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