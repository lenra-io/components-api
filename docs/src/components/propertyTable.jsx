export default (props) => {
    let requiredProperties = props.schema.required;
    let properties = props.schema.properties;

    return <table>
        <tbody>
            <tr>
                <th>Attribute</th>
                <th>Description</th>
                <th>Type</th>
                <th colSpan="2">Details</th>
            </tr>
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