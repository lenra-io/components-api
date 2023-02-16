# Documentation

This project documentation generates HTML files to include it into the [doc website](https://docs.lenra.io).

The doc pages are discribed using MDX (or JSX) files in [src/pages](src/pages/).

Some of the pages are generated at runtime when there is no corresponding page file for a JSON Shema by the [pre-build script](pre-build.js).

Run the next commands to generate the doc locally:

```bash
npm i
npm run build
```
