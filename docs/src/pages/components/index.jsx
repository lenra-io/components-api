import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import schema from '../../../../api/component.schema.json';
import {jsonData} from '../../utils';
export const json = {
    ...jsonData(schema, "docs/src/pages/components/index.jsx"),
    title: "Components"
}

export default (props) => {
    const schemas = {};
    schema.oneOf.map(async el => {
        const ref = el["$ref"];
        console.log(ref);
        schemas[ref] = require('../../../../api/' + ref);
    });
    return <>
        <h1>Components</h1>
        <nav>{schema.oneOf.map(({ "$ref": ref }) => <a href={ref.replace("components/", "").replace(".schema.json", ".html")}>{schemas[ref].title}<img src="test.jpg" /></a>)}</nav>
    </>
}