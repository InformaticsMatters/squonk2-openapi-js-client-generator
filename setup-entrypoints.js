'use strict';

import fs from 'fs';
import yaml from 'js-yaml';

const doc = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
const tags = doc.tags.map((tag) => tag.name);

console.log(tags);

tags.forEach((tag) => {
  try {
    fs.writeFileSync(
      `./dist/${tag}/package.json`,
      `{
    "module": "./${tag}.js",
    "main": "./${tag}.cjs",
    "types": "./${tag}.d.ts",
    "sideEffects": false,
    "type": "module"
  }`,
    );
  } catch (err) {
    console.log(
      `Not created a package.json for ${tag}. The folder might not have been created by orval. This is usually ok.`,
    );
    console.error(err);
  }
});
