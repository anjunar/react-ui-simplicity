import {useState} from "react";
import {debounce} from "../components/shared/Utils";
import {arrayMembrane} from "../membrane/Membrane";
import ActiveObject from "../domain/container/ActiveObject";
import LinkContainerObject from "../domain/container/LinkContainerObject";
import ObjectDescriptor from "../domain/descriptors/ObjectDescriptor";

export function useArray<T extends ActiveObject>(object: [T[], number, LinkContainerObject, ObjectDescriptor]) : [T[], number, LinkContainerObject, ObjectDescriptor] {
    let [entity, size, links, schema] = object

    const [state, setState] = useState(() => {
        let callbacks = [debounce(() => {
            setState(arrayMembrane(entity, callbacks, undefined))
        }, 30)];
        return arrayMembrane(entity, callbacks, undefined)
    })

    return [state, size, links, schema]
}
