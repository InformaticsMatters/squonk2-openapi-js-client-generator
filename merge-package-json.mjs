import fs from 'fs';

const f1 = fs.readFileSync("package.json")
const f2 = fs.readFileSync("client/package.json")

const s1 = String(f1)
const s2 = String(f2)

console.debug(s1)
console.debug(s2)

const f1json = JSON.parse(s1)
const f2json = JSON.parse(s2)

const newJSON = { ...f1json, ...f2json }

console.log(JSON.stringify(newJSON, null, 2))
