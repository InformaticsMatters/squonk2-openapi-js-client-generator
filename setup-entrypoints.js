'use strict';

import fs from 'fs';
import yaml from 'js-yaml';

try {
  const doc = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
  const tags = doc.tags.map((tag) => tag.name);

  tags.forEach((tag) => {
    fs.writeFileSync(
      `./dist/${tag}/package.json`,
      `{
  "module": "./${tag}.js",
  "main": "./${tag}.cjs",
  "types": "./${tag}.d.ts",
  "sideEffects": false,
  "type": "module"
}`,
      (err) => {
        throw err;
      },
    );
  });
} catch (e) {
  console.error(e);
}
