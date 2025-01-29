import React, {useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import {HighLight, Input, LinkContainerObject, ObjectDescriptor, useArray} from "react-ui-simplicity";
import Material from "../../../domain/control/Material";
import info from "./UseArrayHookPage.json"
import Features from "../../../layout/content/Features";

export default function UseArrayHookPage({table}: { table: [Material[], number, LinkContainerObject, ObjectDescriptor] }) {

    const [console, setConsole] = useState("")

    const [materials, size, links, descriptor] = useArray([...table, (path: string[], value: any) => {
        setConsole(`[property:${path}] [value:${value}]`)
    }])

    return (
        <div>
            <PageLayout>
                <Section text={"useArray"}>
                    The useArray hook is a custom React hook designed to work with arrays of objects that extend the ActiveObject interface. It enhances these arrays with reactive capabilities and provides tools for managing and interacting
                    with their state. The hook takes an array and metadata as input: the array of objects, its size, associated links (LinkContainerObject), and an object schema (ObjectDescriptor). It initializes and returns a reactive
                    version of the array using arrayMembrane, allowing for automatic updates via debounced state changes. This ensures efficient re-renders and seamless synchronization with the application’s state, enabling advanced use
                    cases such as managing collections in dynamic user interfaces.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <table className={"table"}>
                        <thead>
                        <tr>
                            <td>Position</td>
                            <td>Name</td>
                            <td>Weight</td>
                            <td>Symbol</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            materials.slice(0, 5).map(material => (
                                <tr key={material.id}>
                                    <td>
                                        <Input type={"number"} standalone={true}
                                               value={material.position}
                                               onChange={(value: any) => material.position = value}/>
                                    </td>
                                    <td>
                                        <Input type={"text"} standalone={true}
                                               value={material.name}
                                               onChange={(value: any) => material.name = value}/>
                                    </td>
                                    <td>
                                        <Input type={"number"} standalone={true}
                                               value={material.weight}
                                               onChange={(value: any) => material.weight = value}/>
                                    </td>
                                    <td>
                                        <Input type={"text"} standalone={true}
                                               value={material.symbol}
                                               onChange={(value: any) => material.symbol = value}/>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <p>Console: {console}</p>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React, {useState} from "react";
                            |import {Input, mapTable, useArray} from "react-ui-simplicity";
                            |import Material from "../../../domain/control/Material";
                            |
                            |export default function UseArrayHookPage({table}: { table: [Material[], number, LinkContainerObject, ObjectDescriptor] }) {
                            |    
                            |   const [console, setConsole] = useState("")
                            |    
                            |   const [materials, size, links, descriptor] = useArray([...table, (path: string[], value: any) => {
                            |       setConsole(\`[property:\${path}] [value:\${value}]\`)
                            |   }])
                            |    
                            |   return (
                            |        <table className={"table"}>
                            |            <thead>
                            |            <tr>
                            |                <td>Position</td>
                            |                <td>Name</td>
                            |                <td>Weight</td>
                            |                <td>Symbol</td>
                            |            </tr>
                            |            </thead>
                            |            <tbody>
                            |            {
                            |                materials.slice(0,5).map(material => (
                            |                    <tr key={material.name}>
                            |                        <td>
                            |                            <Input type={"number"} standalone={true}
                            |                                   value={material.position}
                            |                                   onChange={(value: any) => material.position = value}/>
                            |                        </td>
                            |                        <td>
                            |                            <Input type={"text"} standalone={true}
                            |                                   value={material.name}
                            |                                   onChange={(value: any) => material.name = value}/>
                            |                        </td>
                            |                        <td>
                            |                            <Input type={"number"} standalone={true}
                            |                                   value={material.weight}
                            |                                   onChange={(value: any) => material.weight = value}/>
                            |                        </td>
                            |                        <td>
                            |                            <Input type={"text"} standalone={true}
                            |                                   value={material.symbol}
                            |                                   onChange={(value: any) => material.symbol = value}/>
                            |                        </td>
                            |                    </tr>
                            |                ))
                            |            }
                            |            </tbody>
                            |        </table>
                            |        <p>Console: {console}</p>
                            |    )
                            |}    
                            `.stripMargin()
                        }
                    </HighLight>
                </Section>
            </PageLayout>
        </div>
    )
}