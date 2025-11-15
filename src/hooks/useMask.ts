// useMask.ts
import { useCallback, useMemo } from 'react';

type ReplacementMap = Record<string, RegExp>;
type ReplacementArray = RegExp[];

export type UseMaskOptions = {
  mask?: string;
  replacement?: string | ReplacementMap | ReplacementArray;
  replacementPlaceholder?: string;
};

export const DEFAULT_MASK_PLACEHOLDER = '_';

type MaskToken =
  | { type: 'literal'; char: string; keep: boolean }
  | { type: 'slot'; test: (ch: string) => boolean };

function parseMask(
  mask?: string,
  replacement?: string | ReplacementMap | ReplacementArray,
  replacementPlaceholder = DEFAULT_MASK_PLACEHOLDER,
) {
  if (!mask) return [];

  const tokens: MaskToken[] = [];
  let keep = false;

  const isArray = Array.isArray(replacement);
  const isMap = typeof replacement === 'object' && replacement !== null;
  const map = (isMap ? (replacement as ReplacementMap) : undefined) || {};
  const arr = (isArray ? (replacement as ReplacementArray) : undefined) || [];
  const slotChar = typeof replacement === 'string' ? replacement : undefined;
  let slotIndex = 0;

  const asSlot = (c: string, i: number): MaskToken | null => {
    if (slotChar && c === slotChar) {
      return { type: 'slot', test: () => true };
    }

    if (map[c]) {
      return { type: 'slot', test: (ch) => map[c].test(ch) };
    }

    if (arr[i] && c === replacementPlaceholder) {
      return { type: 'slot', test: (ch) => arr[i].test(ch) };
    }

    return null;
  };

  for (let i = 0; i < mask.length; i++) {
    const ch = mask[i];
    if (ch === '[') {
      keep = true;
      continue;
    }
    if (ch === ']') {
      keep = false;
      continue;
    }
    const slot = asSlot(ch, slotIndex);

    if (slot) {
      slotIndex++;
    }

    tokens.push(slot ?? { type: 'literal', char: ch, keep });
  }

  return tokens;
}

export const useMask = ({
  mask,
  replacement = DEFAULT_MASK_PLACEHOLDER,
  replacementPlaceholder = DEFAULT_MASK_PLACEHOLDER,
}: UseMaskOptions) => {
  const tokens = useMemo(
    () => parseMask(mask, replacement, replacementPlaceholder),
    [mask, replacement, replacementPlaceholder],
  );

  const apply = useCallback(
    (value: string): string => {
      if (!mask) return value;

      let out = '';
      let valueIndex = 0;
      let tokenIndex = 0;
      let filledSlots = 0;

      for (; tokenIndex < tokens.length && valueIndex < value.length; tokenIndex++) {
        const token = tokens[tokenIndex];
        const valueChar = value[valueIndex];

        if (token.type === 'literal') {
          if (valueChar === token.char) {
            out += valueChar;
            valueIndex++;
          } else {
            out += token.char;
          }
        } else if (token.type === 'slot') {
          if (token.test(valueChar)) {
            out += valueChar;
            valueIndex++;
            filledSlots++;
          }
        }
      }

      const slotsCount = tokens.filter((t) => t.type === 'slot').length;

      if (filledSlots === slotsCount && tokenIndex < tokens.length) {
        for (let i = tokenIndex; i < tokens.length; i++) {
          const token = tokens[i];
          if (token.type === 'literal') {
            out += token.char;
          }
        }
      }

      return out;
    },
    [mask, tokens],
  );

  const clean = useCallback(
    (value: string): string => {
      if (!mask) return value;

      let out = '';
      let valueIndex = 0;

      for (let i = 0; i < tokens.length && valueIndex < value.length; i++) {
        const token = tokens[i];
        const valueChar = value[valueIndex];

        if (token.type === 'literal') {
          if (valueChar === token.char) {
            if (token.keep) {
              out += valueChar;
            }

            valueIndex++;
          } else {
          }
        } else if (token.type === 'slot') {
          if (token.test(valueChar)) {
            out += valueChar;
            valueIndex++;
          } else {
            valueIndex++;
          }
        }
      }

      return out;
    },
    [mask, tokens],
  );

  return { apply, clean };
};
