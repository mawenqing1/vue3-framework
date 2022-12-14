const args = require("minimist")(process.argv.slice(2));
const path = require("path");
const { build } = require("esbuild");

const target = args._[0] || "reactivity";
const format = args.f || "global";
const entry = path.resolve(__dirname, `../packages/${target}/src/index.ts`);
const outfile = path.resolve(
    __dirname,
    `../packages/${target}/dist/${target}.${format}.js`
);
const packageName = require(path.resolve(
    __dirname,
    `../packages/${target}/package.json`
)).buildOptions?.name;

const outputFormat = format.startsWith("global")
    ? "iife"
    : format === "cjs"
    ? "cjs"
    : "esm";

build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    globalName: packageName,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {
        onRebuild(err) {
            if(!err) {
                console.log('rebuild');
            }
        }
    }
}).then(() => {
    console.log('watching');
})
