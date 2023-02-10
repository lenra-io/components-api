import * as Path from 'path'
import * as fs from 'fs'

export default (props) => {
    if (props.schema['$id']?.endsWith('/iconData.schema.json')) {
        return displayIcon(props.schema);
    } else {
        if (props.schema.properties) {
            return <>
                <h2>Properties</h2>
                {createPropertiesTable(props.schema)}
            </>;
        }
    }
}

function displayIcon(schema) {
    return <>
        <h2>Values</h2>
        <ul>
            {schema.type.values.map(value => <li>{value}</li>)}
        </ul>
    </>;
}

function displayType(schema, property) {
    if (property.type) {
        // Handle property has "type" case
        if (property.default || property.enum) {
            return <> { property.type } (
                { property.default ? <strong>{ property.default }</strong> : '' }
                { property.enum ? property.enum.filter((value) => property.default != value).join(', ') : '' }
            ) </>
        } else {
            return <>{ property.type }</>
        }
    } else if (property["$ref"]) {
        // Handle property has "$ref" case
        const api_path = Path.join('../api/', property['$ref'])
        const src_path = Path.join('./src/pages/', property['$ref']).replace(".schema.json", ".mdx")
        console.log(src_path)
        if (!src_path.includes('/#/') && !fs.existsSync(src_path)) {
            const name = Path.basename(api_path, '.schema.json')
//             fs.writeFileSync(src_path, `
// import PropertyTable from '../../components/propertyTable';
// import ${name} from '../../../${api_path}';

// # ${name[0].toUpperCase() + name.substring(1)}

// <PropertyTable schema={${name}}/>
// `)
        }
        return <>
            <a href={"/" + property['$ref'].replace(".schema.json", ".html")}>{property['$ref']}</a>
        </>
    }
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
    return <tr className={requiredProperties?.includes(key) ? "required" : null}>
        <td>{key}</td>
        <td>{schema.properties[key].description}</td>
        <td>{displayType(schema, schema.properties[key])}</td>
    </tr>;
}

function createPropertiesTable(schema) {
    let properties = schema.properties;

    return <table>
        <tbody>
            {createFirstLine()}
            {
                ...Object.keys(properties).map(key =>
                    createPropertyLine(schema, key)
                )
            }
        </tbody>
    </table>;
}
