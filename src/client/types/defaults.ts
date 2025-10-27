import { ESLintConfigAny } from 'sn-shadcn-kit/script';
import { z } from 'zod';

export const LastUpdatedSchema = z.object({
  updated: z.string(),
  initials: z.string().min(1).max(3).optional(),
  name: z.string().optional(),
  guid: z.string().optional(),
  photo: z.string().optional(),
});

export const PrettierSchema = z.object({
  semi: z.boolean(),
  singleQuote: z.boolean(),
  tabWidth: z.number(),
  trailingComma: z.enum(['none', 'es5', 'all']),
  printWidth: z.number(),
  bracketSpacing: z.boolean(),
  arrowParens: z.enum(['avoid', 'always']),
  objectWrap: z.enum(['preserve', 'collapse']),
  formatOnSave: z.boolean().optional(),
});

export const DefaultPrettierOptions: z.infer<typeof PrettierSchema> = {
  semi: true,
  singleQuote: true,
  tabWidth: 4,
  trailingComma: 'none',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'avoid',
  objectWrap: 'preserve',
  formatOnSave: false,
};

export const DefaultESLintOptions: ESLintConfigAny = {
  rules: {
    semi: ['warn', 'always'],
    'no-unused-vars': ['warn', { args: 'after-used' }],
    'no-unreachable': 'error',
    'no-redeclare': 'error',
    'no-dupe-keys': 'warn',
    'no-irregular-whitespace': 'warn',
    'valid-typeof': 'error',
    'use-isnan': 'error',
  },
  languageOptions: {
    parserOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
    },
  },
};
