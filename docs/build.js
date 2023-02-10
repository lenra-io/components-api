import * as fs from 'fs';
import * as path from 'path';
import { bulkBuild } from '@lenra/mdx2html';

const defs = [];


// let fileMaps = argv.files.map(mdx => {
//     const basename = path.basename(mdx, path.extname(mdx))
//     let target = path.join(argv.outdir, basename + ".html")
//     return {
//         source: mdx,
//         target: target,
//         props: {}
//     }
// })


bulkBuild(listPages('src/pages'), 'build')

function listPages(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(file => {
        const inPath = path.join(dir, file.name);
        if (file.isDirectory()) return listPages(inPath);
        // TODO: list needed defs
        const outPath = inPath
            .replace(/^src[/\\]pages/, 'build')
            .replace(/\.mdx$/, '.html');
        return {
            source: inPath,
            target: outPath,
            props: {}
        }
    })
}