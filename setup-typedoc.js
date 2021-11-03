'use strict';

import fs from 'fs';
import yaml from 'js-yaml';

try {
  const doc = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
  const tags = doc.tags.map((tag) => tag.name);

  const additionalEntryPoints = tags.map((tag) => `./src/${tag}/${tag}.ts`);
  const entryPoints = ['./src/index.ts', ...additionalEntryPoints];

  const typeDocJSON = { entryPoints };

  fs.writeFileSync('typedoc.json', JSON.stringify(typeDocJSON), (err) => {
    throw err;
  });
} catch (e) {
  console.error(e);
}
