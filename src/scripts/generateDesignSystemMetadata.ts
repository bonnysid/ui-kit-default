import fs from 'fs';
import path from 'path';

const VARIABLES_PATH = path.resolve('src', 'assets', 'variables.scss');
const OUTPUT_PATH = path.resolve('src', 'stories', 'design-system.metadata.ts');

function parseVariables() {
  const content = fs.readFileSync(VARIABLES_PATH, 'utf-8');

  const colors: Record<string, string[]> = {};
  const typography: Record<string, { name: string; var: string }[]> = {};

  // Extract colors
  const colorRegions = [
    { label: 'Text', region: 'Colors Light', prefix: '--color-text-' },
    { label: 'Icons', region: 'Colors Light', prefix: '--color-icon-' },
    { label: 'Backgrounds', region: 'Colors Light', prefix: '--color-bg-' },
    { label: 'Borders & Dividers', region: 'Colors Light', prefixes: ['--color-divider-', '--color-border-'] },
    { label: 'Buttons', region: 'Colors Light', prefix: '--color-button-' },
  ];

  colorRegions.forEach(reg => {
    const regionContent = extractRegion(content, reg.region);
    const prefixes = reg.prefixes || [reg.prefix!];

    const vars = regionContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('--'))
      .map(line => line.split(':')[0])
      .filter(v => prefixes.some(p => v.startsWith(p)))
      // Remove '-light' suffix to get the base variable name used in data-theme
      .map(v => v.replace('-light', ''));

    colors[reg.label] = [...new Set(vars)];
  });

  // Extract typography
  const typoRegions = [
    { label: 'Headings', prefix: '--font-heading-' },
    { label: 'Body', prefix: '--font-body-' },
    { label: 'Title', prefix: '--font-title-' },
    { label: 'Numbers', prefix: '--font-numbers-' },
  ];

  const fontsRegion = extractRegion(content, 'Fonts');
  typoRegions.forEach(reg => {
    const vars = fontsRegion
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith(reg.prefix))
      .map(line => {
        const varName = line.split(':')[0];
        // Generate a readable name from the variable
        // e.g. --font-heading-sb-24 -> Heading Sb 24
        const name = varName
          .replace('--font-', '')
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        return { name, var: varName };
      });

    typography[reg.label] = vars;
  });

  const fileContent = `/** THIS IS GENERATED FILE. DO NOT EDIT! */
export const COLOR_METADATA = ${JSON.stringify(colors, null, 2)};

export const TYPOGRAPHY_METADATA = ${JSON.stringify(typography, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, fileContent);
  console.log('\x1b[32m%s\x1b[0m', 'DESIGN SYSTEM METADATA SUCCESSFULLY GENERATED!');
  console.log('\x1b[32m%s\x1b[0m', `[GENERATED FILE] ${OUTPUT_PATH}`);
}

function extractRegion(content: string, regionName: string): string {
  const startMarker = `//#region ${regionName}`;
  const endMarker = `//#endregion`;

  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return '';

  const contentAfterStart = content.slice(startIndex + startMarker.length);
  const endIndex = contentAfterStart.indexOf(endMarker);

  if (endIndex === -1) return contentAfterStart;

  return contentAfterStart.slice(0, endIndex);
}

parseVariables();
