import schema from '../../../../api/component.schema.json';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default (props) => {
    const schemas = {};
    schema.oneOf.map(async el => {
        const ref = el["$ref"];
        console.log(ref);
        schemas[ref] = require('../../../../api/' + ref);
    });
    return <>
        <h1>Components</h1>
        <ul>{schema.oneOf.map(({ "$ref": ref }) => <li>{schemas[ref].title}<img src="test.jpg" /></li>)}</ul>
    </>
}