import * as Path from 'path'
import * as fs from 'fs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const schemasCache = {};

export default (props) => {
    if (props.schema['$id']?.endsWith('/iconName.schema.json')) {
        return displayIcon(props.schema);
    } else {
        if (props.schema.properties) {
            return createPropertiesTable(props.schema);
        }
    }
}

function displayIcon(schema) {
    return <>
        <h2>Values</h2>
        <ul>
            {schema.enum.map(value => <li>{value}</li>)}
        </ul>
    </>;
}

function getSortedPropertyKeys(schema) {
    const required = schema.required || [];
    return Object.keys(schema.properties)
        .sort((prop1, prop2) => {
            if (prop1 == "type") return -1;
            if (prop2 == "type") return 1;
            if (schema.properties[prop1].deprecated && !schema.properties[prop2].deprecated) return 1;
            if (!schema.properties[prop1].deprecated && schema.properties[prop2].deprecated) return -1;
            if (required.includes(prop1) && !required.includes(prop2)) return -1;
            if (!required.includes(prop1) && required.includes(prop2)) return 1;
            return prop1.localeCompare(prop2);
        })
}

function createPropertiesTable(schema) {
    return <table className="properties">
        <thead>
            {createFirstLine()}
        </thead>
        <tbody>
            {
                ...getSortedPropertyKeys(schema).map(key =>
                    createPropertyLine(schema, key)
                )
            }
        </tbody>
    </table>;
}

function createFirstLine() {
    return <tr>
        <th>Attribute</th>
        <th>Description</th>
        <th>Type</th>
    </tr>;
}

function createPropertyLine(schema, key) {
    let requiredProperties = schema.required;
    // get ref description if not in property
    const property = schema.properties[key];
    let description = property.description;
    if (!description && property["$ref"]) {
        const refSchema = getSchema(schema, property['$ref']);
        description = refSchema.description;
    }
    const classList = [];
    if (requiredProperties?.includes(key)) classList.push("required");
    if (property.deprecated) classList.push("deprecated");
    return <tr className={classList.join(" ")}>
        <td>{key}</td>
        <td>{description}</td>
        <td>{displayType(schema, property)}</td>
    </tr>;
}

function displayType(schema, property) {
    if (property.oneOf) {
        console.error("oneOf is not managed yet", property.title);
        return;
    }
    if (property.type || property.enum) {
        // Handle property has "type" case
        if (property.default || property.enum) {
            if (property.enum?.length > 20) return;
            const notDefaultPropertyEnum = property.enum?.filter((value) => property.default != value) || [];
            return <>
                {property.type}
                <ul className='values'>
                    {property.default ? <li className='default'>{property.default}</li> : ''}
                    {notDefaultPropertyEnum.length > 0 ? notDefaultPropertyEnum.map(val => <li>{val}</li>) : ''}
                </ul>
            </>
        } else {
            return <>{property.type}</>
        }
    } else if (property["$ref"]) {
        // Handle property has "$ref" case
        const refSchema = getSchema(schema, property['$ref']);
        if (!(refSchema.oneOf || refSchema.properties || refSchema.enum?.length > 20)) {
            const type = displayType(schema, refSchema);
            if (type) return type;
        }
        const name = refSchema.title || property['$ref'].split('/').at(-1);
        return <>
            <a href={getRefHref(property['$ref'])}>{name}</a>
        </>
    }
    else {
        console.error("Not managed type", property);
        throw new Error(`Not managed type: ${JSON.stringify(property)}`);
    }
}

/**
 * 
 * @param {*} schema 
 * @param {string} ref 
 * @returns 
 */
function getSchema(schema, ref) {
    if (!(ref in schemasCache)) {
        if (ref.includes('#/')) {
            schemasCache[ref] = ref.replace('#/', "")
                .split("/")
                .reduce((o, key) => o[key], schema);
        }
        else
            schemasCache[ref] = require('../../../../api/' + ref.replace("../", ""));
    }
    return schemasCache[ref];
}

function getRefHref(ref) {
    if (ref.endsWith("component.schema.json")) return ref.replace("component.schema.json", "components/")
    return ref.includes('#/') ? ref.replace('#/', "#") : ref.replace(".schema.json", ".html");
}
