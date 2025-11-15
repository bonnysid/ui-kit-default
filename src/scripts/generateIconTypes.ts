import fs from 'fs';
import path from 'path';

const ICON_FOLDER_PATH = path.resolve('src', 'components', 'Icon');
const ICONS_FOLDER_PATH = path.resolve(ICON_FOLDER_PATH, 'icons');
const ICON_TYPE_NAME = 'IconTypes';
const GENERATE_FILE_PATH = `${ICON_FOLDER_PATH}/types.tsx`;

function toPascalCase(str: string) {
  return str
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

async function generate() {
  const iconFiles = fs.readdirSync(ICONS_FOLDER_PATH);

  const sortedFiles = iconFiles.sort((a, b) => a.localeCompare(b));
  const iconNames = sortedFiles.map((file) => file.replace('.svg', ''));
  const typeString = iconNames.map((name) => `'${name}'`).join(' | ');
  const arrayString = iconNames.map((name) => `'${name}'`).join(',');

  const importLines: string[] = [];
  const iconObjectLines: string[] = [];

  sortedFiles.forEach((file) => {
    const baseName = file.replace('.svg', '');
    const pascal = toPascalCase(baseName);

    importLines.push(`import ${pascal} from './icons/${file}?react';`);
    iconObjectLines.push(`  '${baseName}': ${pascal},`);
  });

  const fileContent = `/** THIS IS GENERATED FILE. DO NOT EDIT! */
${importLines.join('\n')}

export type ${ICON_TYPE_NAME} = ${typeString};
export const ICON_TYPE_NAMES = [${arrayString}];

export const ICONS = {
  ${iconObjectLines.join('\n')}
};
  `;

  fs.writeFileSync(GENERATE_FILE_PATH, fileContent);

  console.log('\x1b[32m%s\x1b[0m', 'ICON TYPES SUCCESSFULLY GENERATED!');
  console.log('\x1b[32m%s\x1b[0m', `[GENERATED FILE] ${GENERATE_FILE_PATH}`);
}

generate().catch((err) => console.error(err));
