import * as fs from 'fs';
import * as Path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const schemasCache = {};
const mainSchema = 'component.schema.json';

const checkedPath = [];

const srcDir = 'src';
const tmpDir = 'tmp';
const buildDir = 'build';

// Clean
if (fs.existsSync(tmpDir))
    fs.rmSync(tmpDir, { recursive: true });
if (fs.existsSync(buildDir))
    fs.rmSync(buildDir, { recursive: true });

// Copy sources
fs.mkdirSync(tmpDir);
fs.cpSync(srcDir, tmpDir, { recursive: true });

// Generate pages for non existing references
generateRefPages(mainSchema);

function generateRefPages(path) {
    if (checkedPath.includes(path)) return;
    checkedPath.push(path);
    const schema = getSchema(path);
    // generate page
    generateDefaultPage(path, schema);
    // get refs
    const refs = getRefs(path, schema);
    refs.forEach(ref => {
        generateRefPages(ref);
    });
}

/**
 * 
 * @param {string} path 
 * @param {*} schema 
 */
function generateDefaultPage(path, schema) {
    // check if schema needs a page
    if (schema.oneOf || schema.properties || schema.enum?.length > 20) {
        if (path.includes("#")) {
            console.log("add section", path);
            const parts = path.split("#/");
            const filePath = `tmp/pages/${parts[0].replace(".schema.json", ".mdx")}`;
            const name = schema.title || parts[1].split("/").at(-1);
            fs.appendFileSync(
                filePath,
                `
<h2 id='#${parts[1]}'>${name}</h2>

<PropertyTable schema={schema.${parts[1].replace(/\//, ".")}}/>
`
            );
        }
        else if (path != mainSchema) {
            const filePath = `tmp/pages/${path.replace(".schema.json", ".mdx")}`;
            if (!fs.existsSync(filePath)) {
                console.log("create file", path, Path.dirname(filePath));
                fs.mkdirSync(Path.dirname(filePath), { recursive: true });
                fs.writeFileSync(
                    filePath,
                    `import PropertyTable from '../../components/propertyTable';
import schema from '../../../../api/${path}';
import {jsonData} from '../../utils';
export const json = jsonData(schema, 'docs/pre-build.js');

<PropertyTable schema={schema}/>
`
                );
            }
        }
    }
}

function getRefs(initialPath, schema) {
    const refs = [];
    if (schema.properties) {
        Object.values(schema.properties).forEach(el => {
            if (el["$ref"]) {
                refs.push(mergePath(initialPath, el["$ref"]));
            }
        });
    }
    if (schema.oneOf) {
        schema.oneOf.forEach(el => {
            if (el["$ref"]) {
                refs.push(mergePath(initialPath, el["$ref"]));
            }
        });
    }
    return refs;
}

/**
 * 
 * @param {string} from 
 * @param {string} to 
 */
function mergePath(from, to) {
    if (to.startsWith("#/")) {
        return from.split("#")[0] + to;
    }
    let fromParts = from.split("/");
    if (fromParts[fromParts.length - 1].endsWith(".json")) fromParts.splice(fromParts.length - 1, 1);
    const toParts = to.split("/");
    let pos = fromParts.length;
    toParts.forEach(part => {
        switch (part) {
            case ".":
                break;
            case "..":
                fromParts.splice(--pos, 1);
                break;
            default:
                fromParts.splice(pos++, 0, part);
        }
    });
    return fromParts.join("/");
}

function getSchema(path) {
    if (!(path in schemasCache)) {
        if (path.includes('#/')) {
            const parts = path.split("#/");
            const schema = getSchema(parts[0]);
            path = parts[1];
            schemasCache[path] = path.replace('#/', "")
                .split("/")
                .reduce((o, key) => o[key], schema);
        }
        else
            schemasCache[path] = require('../api/' + path.replace("../", ""));
    }
    return schemasCache[path];
}
