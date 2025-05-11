import React, {useEffect, useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import info from "./JSONMapperPage.json"
import User from "../../../domain/control/User";
import {Button, FormSchemaFactory, HighLight, Page, Pages, SchemaForm, Tab, Tabs, useForm} from "react-ui-simplicity";

export default function JSONMapperPage({user}: { user: User }) {

    const [page, setPage] = useState(0)

    const [console, setConsole] = useState("")

    const form = useForm(user)

    useEffect(() => {
        form.$callbacks.push((property, value) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);

    return (
        <div>
            <PageLayout>
                <Section text={"JSON Mapper"}>
                    This implementation provides a robust framework for deserializing, traversing, and mapping complex object graphs in JavaScript applications. The system leverages a schema-driven approach using ObjectDescriptor and related metadata to rebuild nested object hierarchies, ensuring the integrity and structure of the data. The traverseObjectGraph function recursively processes objects and their properties, applying pattern matching to handle various data types such as collections and nested objects.
                    <br/>
                    <br/>
                    Two specialized functions, mapForm and mapTable, extend this functionality to support form and table management use cases. mapForm focuses on deserializing and processing objects tailored for dynamic forms, enabling reactivity and schema validation. mapTable, on the other hand, is designed for table structures, managing rows, size, and linked data efficiently. Both functions integrate seamlessly with the object graph traversal, ensuring consistent behavior across different data contexts.
                    <br/>
                    <br/>
                    By incorporating features like dynamic metadata access, type conversion, default value handling, and schema-driven deserialization, this framework simplifies working with complex data structures. It is particularly suited for applications that require reactive forms, nested object graphs, or table data management, providing a scalable and extensible solution for developers.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <SchemaForm value={form} onSubmit={null}>
                        <FormSchemaFactory name={"name"}/>
                        <FormSchemaFactory name={"firstName"}/>
                        <FormSchemaFactory name={"lastName"}/>
                        <FormSchemaFactory name={"address"}/>
                        <FormSchemaFactory name={"emails"}/>
                        <Button type={"submit"}>Save</Button>
                    </SchemaForm>
                    <p>Console: {console}</p>
                </Section>
                <Section text={"Source"}>
                    <Tabs page={page} onPage={(page) => setPage(page)}>
                        <Tab>User.ts</Tab>
                        <Tab>router.ts</Tab>
                        <Tab>Page.tsx</Tab>
                        <Tab>person.json</Tab>
                    </Tabs>
                    <Pages page={page} rendered={false}>
                        <Page>
                            <HighLight language={"typescript"}>
                                {
                                    `
                                    |import {AbstractEntity, Basic, Entity} from "react-ui-simplicity";
                                    |import Address from "./Address";
                                    |import Email from "./Email";
                                    |
                                    |@Entity("User")
                                    |export default class User extends AbstractEntity {
                                    |
                                    |    $type = "User"
                                    |
                                    |    @Basic()
                                    |    name: string
                                    |
                                    |    @Basic()
                                    |    firstName: string
                                    |
                                    |    @Basic()
                                    |    lastName: string
                                    |
                                    |    @Basic()
                                    |    address : Address
                                    |
                                    |    @Basic()
                                    |    emails : Email[]
                                    |}                                    
                                    `.stripMargin()
                                }
                            </HighLight>
                        </Page>
                        <Page>
                            <HighLight language={"typescript"}>
                                {
                                    `
                                    |{
                                    |    path : "/mapper",
                                    |    component : JSONMapperPage,
                                    |    loader: {
                                    |        async user(path, query) {
                                    |            const response = await fetch("./assets/person.json")
                                    | 
                                    |            if (response.ok) {
                                    |                return mapForm(await response.json())
                                    |            }
                                    | 
                                    |            throw new Error(response.status.toString())
                                    |        }
                                    |    }
                                    |}                                    
                                    `.stripMargin()
                                }
                            </HighLight>
                        </Page>
                        <Page>
                            <HighLight language={"typescript"}>
                                {
                                    `
                                    |import React, {useEffect, useState} from "react";
                                    |import User from "../../../domain/control/User";
                                    |import {Button, FormSchemaFactory, SchemaForm, useForm} from "react-ui-simplicity";
                                    |
                                    |export default function JSONMapperPage({user}: { user: User }) {
                                    |
                                    |    const [page, setPage] = useState(0)
                                    |
                                    |    const [console, setConsole] = useState("")
                                    |
                                    |    const form = useForm(user)
                                    |
                                    |    useEffect(() => {
                                    |        form.$callbacks.push((property, value) => {
                                    |            setConsole(\`[property:\${property}] [value:\${value}]\`)
                                    |        })
                                    |    }, []);
                                    |
                                    |    return (
                                    |            <div>
                                    |                <SchemaForm value={form}>
                                    |                    <FormSchemaFactory name={"name"}/>
                                    |                    <FormSchemaFactory name={"firstName"}/>
                                    |                    <FormSchemaFactory name={"lastName"}/>
                                    |                    <FormSchemaFactory name={"address"}/>
                                    |                    <FormSchemaFactory name={"emails"}/>
                                    |                    <Button type={"submit"}>Save</Button>
                                    |                </SchemaForm>
                                    |                <p>Console: {console}</p>
                                    |            </div>               
                                    |    )
                                    |}                                        
                                    `.stripMargin()
                                }
                            </HighLight>
                        </Page>
                        <Page>
                            <HighLight language={"typescript"}>
                                {
                                    `
                                    |{
                                    |  "$descriptors": {
                                    |    "$type": "ObjectDescriptor",
                                    |    "type": "User",
                                    |    "widget" : "form",
                                    |    "properties": {
                                    |      "name": {
                                    |        "$type": "NodeDescriptor",
                                    |        "title": "Name",
                                    |        "type": "String",
                                    |        "widget": "text"
                                    |      },
                                    |      "firstName": {
                                    |        "$type": "NodeDescriptor",
                                    |        "title": "First Name",
                                    |        "type": "String",
                                    |        "widget": "text",
                                    |        "writeable": true
                                    |      },
                                    |      "lastName": {
                                    |        "$type": "NodeDescriptor",
                                    |        "title": "Last Name",
                                    |        "type": "String",
                                    |        "widget": "text",
                                    |        "writeable": true
                                    |      },
                                    |      "address": {
                                    |        "$type": "ObjectDescriptor",
                                    |        "type": "Address",
                                    |        "widget" : "form",
                                    |        "properties": {
                                    |          "street": {
                                    |            "$type": "NodeDescriptor",
                                    |            "title": "Street",
                                    |            "type": "String",
                                    |            "widget": "text",
                                    |            "writeable": true
                                    |          },
                                    |          "number": {
                                    |            "$type": "NodeDescriptor",
                                    |            "title": "Number",
                                    |            "type": "String",
                                    |            "widget": "text",
                                    |            "writeable": true
                                    |          },
                                    |          "city": {
                                    |            "$type": "NodeDescriptor",
                                    |            "title": "City",
                                    |            "type": "String",
                                    |            "widget": "text",
                                    |            "writeable": true
                                    |          },
                                    |          "country": {
                                    |            "$type": "NodeDescriptor",
                                    |            "title": "Country",
                                    |            "type": "String",
                                    |            "widget": "text",
                                    |            "writeable": true
                                    |          }
                                    |        }
                                    |      },
                                    |      "emails": {
                                    |        "$type": "CollectionDescriptor",
                                    |        "widget" : "form-array",
                                    |        "items": {
                                    |          "$type": "ObjectDescriptor",
                                    |          "type": "Email",
                                    |          "properties": {
                                    |            "email": {
                                    |              "$type": "NodeDescriptor",
                                    |              "title": "Email",
                                    |              "type": "String",
                                    |              "widget": "email",
                                    |              "writeable": true
                                    |            }
                                    |          }
                                    |        }
                                    |      }
                                    |    }
                                    |  },
                                    |  "$type": "User",
                                    |  "name": "Neo",
                                    |  "firstName": "Thomas",
                                    |  "lastName": "Anderson",
                                    |  "address": {
                                    |    "$type": "Address",
                                    |    "street": "Unknown",
                                    |    "number": "Unknown",
                                    |    "city": "Los Angeles",
                                    |    "country": "USA"
                                    |  },
                                    |  "emails": [{
                                    |    "$type": "Email",
                                    |    "email": "neo@matrix.com"
                                    |  }]
                                    |}                                    
                                    `.stripMargin()
                                }
                            </HighLight>
                        </Page>
                    </Pages>
                </Section>
            </PageLayout>
        </div>
    )
}