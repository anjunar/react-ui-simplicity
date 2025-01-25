import "./SchemaFactory.css"
import React, {CSSProperties, useContext} from "react"
import SchemaLazySelect from "../inputs/SchemaLazySelect"
import SchemaSelect from "../inputs/SchemaSelect"
import SchemaImage from "../inputs/SchemaImage"
import SchemaInput from "../inputs/SchemaInput"
import SchemaSubForm from "./SchemaSubForm"
import SchemaFormArray from "./SchemaFormArray"
import SubForm from "../../inputs/form/SubForm"
import {SchemaFormContext} from "./SchemaForm"
import Editor from "../../inputs/editor/Editor";
import {FormContext} from "../../inputs/form/Form";
import {findClass} from "../../../mapper/Registry";
import {Validator} from "../../shared/Model";
import CollectionDescriptor from "../../../domain/descriptors/CollectionDescriptor";
import ObjectDescriptor from "../../../domain/descriptors/ObjectDescriptor";
import Validable from "../../../domain/descriptors/Validable";

function SchemaFactory(properties: SchemaFactory.Attributes) {

    const {name, validators, disabled, ...rest} = properties

    const schemaContext = useContext(SchemaFormContext)

    const formContext = useContext(FormContext)

    const schema = schemaContext(name)

    if (!schema) {
        throw ("Schema not found for: " + name)
    }

    switch (schema.widget) {
        case "form": {
            let jsonObject = schema as ObjectDescriptor & Validable

            let fields = Object.keys(jsonObject.properties || {}).map(key => (
                <SchemaFactory key={key} name={key}/>
            ))

            if (jsonObject.oneOf) {
                let find = jsonObject.oneOf.find(one => {
                    return formContext.value[name].constructor === findClass(one.type)
                });

                if (find) {
                    let subFields = Object.keys(find.properties || {}).map(key => (
                        <SchemaFactory key={key} name={key}/>
                    ))
                    return <SchemaSubForm name={name} subType={find.type}>{fields.concat(subFields)}</SchemaSubForm>
                }
            }

            return <SchemaSubForm name={name} {...rest}>{fields}</SchemaSubForm>
        }
        case "form-array": {

            let jsonArray = schema as CollectionDescriptor

            let fields = Object.keys(jsonArray.items.properties || {}).map(key => (
                <SchemaFactory key={key} name={key} style={{flex : 1}}/>
            ))
            return (
                <SchemaFormArray name={name}>
                    {({elements, form}: { elements: any[], form: any }) =>
                        elements.map((element, index) => (
                            <SubForm key={element.id} index={index}>
                                <div style={{display : "flex", width : "100%"}}>
                                    {fields}
                                    <button type={"button"} className={"material-icons"}
                                            onClick={() => elements.splice(elements.indexOf(element), 1)}>
                                        delete
                                    </button>
                                </div>
                            </SubForm>
                        ))
                    }
                </SchemaFormArray>
            )
        }
        case "editor" : {
            return (
                <Editor name={name} style={{height: "calc(100% - 48px)", width: "100%"}}/>
            )
        }
        case "image":
            return (
                <SchemaImage style={{width: "100px", height: "100px"}} disabled={schema.readOnly} name={name} {...rest}/>
            )
        case "select":
            return (
                <SchemaSelect disabled={schema.readOnly || disabled} name={name} {...rest}/>
            )
        case "lazy-multi-select":
            return (
                <SchemaLazySelect validators={validators} disabled={schema.readOnly || disabled} name={name} {...rest}
                                  multiSelect={true}/>
            )
        case "lazy-select":
            return (
                <SchemaLazySelect disabled={schema.readOnly || disabled} name={name} validators={validators} {...rest}/>
            )
        default:
            return (
                <SchemaInput disabled={schema.readOnly || disabled} name={name} validators={validators} {...rest}/>
            )
    }
}

namespace SchemaFactory {
    export interface Attributes {
        name: string
        style?: CSSProperties,
        validators?: Validator[],
        disabled?: boolean
    }
}

export default SchemaFactory