import fs from 'fs';

const f1 = fs.readFileSync("package.json")
const f2 = fs.readFileSync("client/package.json")

const f1json = JSON.parse(String(f1))
const f2json = JSON.parse(String(f2))

const newJSON = { ...f1json, ...f2json }

console.log(JSON.stringify(newJSON, null, 2))
