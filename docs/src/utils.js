const githubBasPath = "https://github.com/lenra-io/components-api/blob/beta/";

export function jsonData(schema, sourceFile) {
    let json = {};
    if (schema) {
        json = {
            title: schema?.title,
            description: schema?.description,
            sourceSchema: `${githubBasPath}api/${schema["$id"]}`,
            sourceFile: `${githubBasPath}docs/src/pages/${schema["$id"].replace(".schema.json", ".mdx")}`
        }
    }
    if (sourceFile) json.sourceFile = `${githubBasPath}${sourceFile}`;
    return json;
}