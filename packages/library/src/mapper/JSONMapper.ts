import JSONDeserializer from "./JSONDeserializer";
import ActiveObject from "../domain/container/ActiveObject";
import LinkContainerObject from "../domain/container/LinkContainerObject";
import TableObject from "../domain/container/TableObject";
import {match} from "../pattern-match/PatternMatching";
import {findSchemaProperties} from "./Registry";
import ObjectDescriptor from "../domain/descriptors/ObjectDescriptor";
import CollectionDescriptor from "../domain/descriptors/CollectionDescriptor";

export function traverseObjectGraph(object : any, schema : ObjectDescriptor, buildObjectGraph : boolean = true) {

    object.$meta = (name : string) => {
        let property = schema.properties[name];

        if (property) {
            return property
        }

        return schema.oneOf.find(one => one.type === object.$type).properties[name]
    }

    let schemaProperties = findSchemaProperties(object.constructor)

    for (const schemaProperty of schemaProperties) {
        schema.properties[schemaProperty.name] = JSONDeserializer(schemaProperty.configuration.schema, buildObjectGraph)
    }

    Object.entries(object).filter(([key, value]) => value).forEach(([key, value]) => {
        let node = schema.properties[key];

        if (! node) {
            let find = schema.oneOf?.find(one => one.type === object.$type);
            if (find) {
                node = find.properties[key]
            } else {
                if (value instanceof ActiveObject) {
                    // delete object[key]
                }
            }
        }

        match(node)
            .with(CollectionDescriptor, (array) => (value as any[]).forEach(row => { traverseObjectGraph(row, array.items as ObjectDescriptor, buildObjectGraph) }))
            .with(ObjectDescriptor, (jsonObject) => traverseObjectGraph(value, jsonObject, buildObjectGraph))
            .nonExhaustive()
    })

}

export function mapForm<T extends ActiveObject>(object : any, buildObjectGraph : boolean = false) : T {
    let entity : T = JSONDeserializer(object, buildObjectGraph);

    traverseObjectGraph(entity, entity.$descriptors, buildObjectGraph)

    return entity
}

export function mapTable<T extends ActiveObject>(object : any, buildObjectGraph : boolean = false) : [T[], number, LinkContainerObject, ObjectDescriptor] {
    let entity : TableObject<T> = JSONDeserializer(object, buildObjectGraph);

    traverseObjectGraph(entity, entity.$descriptors, buildObjectGraph)

    return [entity.rows || [], entity.size, entity.$links, entity.$descriptors]
}