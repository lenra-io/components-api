export default (props) => {
    console.log(props);

    if (props.schema['$id'].endsWith('/iconData.schema.json')) {
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
    let res = "";
    if (property.type) {
        // Handle property has "type" case
        res += property.type;
        if (property.default || property.enum) {
            res += "(";
            if (property.default) {
                res += `<strong>"${property.default}"</strong>`;
            }
            if (property.enum) {
                property.enum.forEach((value) => {
                    if (property.default != value) {
                        res += `, "${value}"`;
                    }
                });
            }
            res += ")";
        }
    } else if (property["$ref"]) {
        // Handle property has "$ref" case
        res = <a href={"/components-api/" + property['$ref'].replace("json", "html")}>{property['$ref']}</a>;
    }
    return res;
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
    return <tr className={requiredProperties.includes(key) ? "required" : null}>
        <td>{key}</td>
        <td>{schema.properties[key].description}</td>
        <td>{displayType(schema, schema.properties[key])}</td>
        <td></td>
        <td></td>
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