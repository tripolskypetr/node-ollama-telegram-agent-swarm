import { globSync } from "glob";
import { basename } from "path";
import { sync as rimraf } from "rimraf";
import touch from "touch";
import fs from "fs";

const createCopy = (prefix = "modules") => {
    for (const modulePath of globSync(`./${prefix}/*`, { onlyDirectories: true })) {
        const moduleName = basename(modulePath);
        const destinationPath = `./build/${prefix}/${moduleName}`; 
        if (fs.existsSync(`${modulePath}/build`)) {
            fs.cpSync(`${modulePath}/build`, `${destinationPath}/build`, { recursive: true });
        }
        if (fs.existsSync(`${modulePath}/package.json`)) {
            fs.copyFileSync(`${modulePath}/package.json`, `${destinationPath}/package.json`);
        }
        if (fs.existsSync(`${modulePath}/types.d.ts`)) {
            fs.copyFileSync(`${modulePath}/types.d.ts`, `${destinationPath}/types.d.ts`);
        }
    }
};

rimraf("build");
fs.mkdirSync("build");
touch("./build/.gitkeep");

createCopy("packages")

fs.copyFileSync(`./package.json`, `./build/package.json`);
fs.copyFileSync(`./config/ecosystem.config.js`, `./build/ecosystem.config.js`);
