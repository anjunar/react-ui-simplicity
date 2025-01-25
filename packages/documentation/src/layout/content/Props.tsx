import "./Props.css"
import React, {useState} from "react";


function Props(properties: Props.Attributes) {

    const {value} = properties

    const [open, setOpen] = useState(false)

    const [property, setProperty] = useState(null)

    function onPropClick(value : any) {
        setProperty(value)
        setOpen(! open)
    }

    return (
        <div className={"props"}>
            {
                open && (
                    <Props.Prop prop={property} open={true}/>
                )
            }
            <br/>
            <div className={"container"}>
                {
                    value.map((prop: any) => (
                        <div key={prop.name} style={{minWidth: "180px"}} onClick={() => onPropClick(prop)}>
                            <Props.Prop prop={prop} open={false}/>
                            <br/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

namespace Props {
    export interface Attributes {
        value: any
    }

    export function Prop({prop, open}) {
        return (
            <div>
                <strong>{prop.name}</strong>
                <div style={{display: open ? "block" : "none"}}>
                    <table className={"properties"}>
                        <tbody>
                        {
                            Object
                                .entries(prop)
                                .filter(([key, value]: [string, any]) => key !== "name")
                                .map(([key, value]: [string, any]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Props