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

function createFirstLine(hasOther) {
    return <tr>
        <th>Attribute</th>
        <th>Description</th>
        <th>Type</th>
        {hasOther ? <th colSpan="2">Details</th> : <></>}
    </tr>;
}

function createPropertiesTable(schema) {
    let requiredProperties = schema.required;
    let properties = schema.properties;

    return <table>
        <tbody>
            {createFirstLine(schema.hasOtherAttributes)}
            {
                ...Object.keys(properties).map(key =>
                    <tr className={requiredProperties.includes(key) ? "required" : null}>
                        <td>{key}</td>
                        <td>{properties[key].description}</td>
                        <td>{properties[key].type}</td>
                        <td></td>
                        <td></td>
                    </tr>
                )
            }
        </tbody>
    </table>;
}