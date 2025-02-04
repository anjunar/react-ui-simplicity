import ImageUpload from "../../../upload/image/ImageUpload";
import React, {useState} from "react";
import InputContainer from "../../../container/InputContainer";
import Input from "../../../input/Input";
import {Temporal, TemporalAmount} from "@js-joda/core";

function ImageNode(properties: ImageNode.Attributes) {

    const {payload} = properties

    const [state, setState] = useState(() => ({image: null, width: 100, height: 100}))

    function onImageChange(event: any) {
        state.image = event
        setState({...state})
    }

    const encodeBase64 = (type: string, subType: string, data: string) => {
        if (type && subType && data) {
            return `data:${type}/${subType};base64,${data}`
        }
        return ""
    }

    function onWidthChange(value: Temporal | TemporalAmount | string | number | boolean) {
        if (typeof value === "number") {
            state.width = value
            setState({...state})
        }
    }

    function onHeightChange(value: Temporal | TemporalAmount | string | number | boolean) {
        if (typeof value === "number") {
            state.width = value
            setState({...state})
        }
    }

    function addImage() {
        let img = document.createElement("img");
        img.src = encodeBase64(state.image.type, state.image.subType, state.image.data)
        payload.appendChild(img)
    }

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div>
                <ImageUpload style={{width: "320px", height: "160px"}} value={state.image} onChange={onImageChange} standalone={true}/>
                <div style={{display: "flex", width: "320px"}}>
                    <InputContainer placeholder={"Breite"}>
                        <Input type={"number"} value={state.width} onChange={onWidthChange} standalone={true}/>
                    </InputContainer>
                    <InputContainer placeholder={"Höhe"}>
                        <Input type={"number"} value={state.height} onChange={onHeightChange} standalone={true}/>
                    </InputContainer>
                    <button type={"button"} onClick={() => addImage()}>
                        Einfügen
                    </button>
                </div>
            </div>
        </div>
    )
}

namespace ImageNode {
    export interface Attributes {
        payload: HTMLElement
    }
}

export default ImageNode