import fs from 'node:fs';
import openapiTS, { astToString } from 'openapi-typescript';

const ast = await openapiTS(new URL(`http://15.164.90.207:8080/swagger-api/docs/11-workspace`, import.meta.url));
const contents = astToString(ast);

const filePath = `./src/shared/api/generated`;
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, { recursive: true });
}
fs.writeFileSync(`${filePath}/api.d.ts`, contents);
