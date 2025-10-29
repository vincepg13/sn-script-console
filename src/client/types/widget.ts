import { z } from 'zod';
import { ScopeUpdateSchema } from './app';
import { PackageValueSchema } from './package';
import { LastUpdatedSchema } from './defaults';
import { ESVersion } from 'sn-shadcn-kit/script';
import { optionSections, optionTypes } from '@/lib/config';

//Widget List Definitions
const WidgetListItem = z.object({
  name: z.string(),
  scope: z.string(),
  guid: z.string(),
  id: z.string().nullable(),
  updater: LastUpdatedSchema,
});

export const WidgetListSchema = z.array(WidgetListItem);
export type WidgetCardItem = z.infer<typeof WidgetListItem>;
export type WidgetListRes = z.infer<typeof WidgetListSchema>;

//Single Widget Definitions
const FieldSchema = z.object({
  label: z.string(),
  name: z.string(),
  value: z.string().nullable(),
  display_value: z.string().nullable(),
  type: z.string(),
  canWrite: z.boolean(),
});

const ToggleButtonSchema = z.object({
  label: z.string(),
  field: z.string(),
  parser: z.string().optional(),
  visible: z.boolean(),
});

export const DependencyCountSchema = z.object({
  dependencies: z.number(),
  providers: z.number(),
  templates: z.number(),
});

const WidgetFields = z.record(z.string(), FieldSchema);
export const WidgetSchema = z.object({
  guid: z.string(),
  jsVersion: z.string(),
  esVersion: z.custom<ESVersion>(),
  fields: WidgetFields,
  toggleButtons: z.array(ToggleButtonSchema),
  scopeChange: ScopeUpdateSchema.optional().nullable(),
  packageValue: PackageValueSchema.optional().nullable(),
  security: z.object({
    canWrite: z.boolean(),
    canDelete: z.boolean(),
  }),
  dependencyCounts: DependencyCountSchema,
});

export type ToggleBtn = z.infer<typeof ToggleButtonSchema>;
export type WidgetFields = z.infer<typeof WidgetFields>;
export type WidgetRes = z.infer<typeof WidgetSchema>;
export type DependencyCounts = z.infer<typeof DependencyCountSchema>;

//Dependency Definitions
export const DependencySchema = z.object({
  depId: z.string(),
  name: z.string(),
  value: z.string(),
  created: z.string(),
  linkTable: z.string(),
});

export type Dependency = z.infer<typeof DependencySchema>;
export type DependencyList = z.infer<typeof DependencyListSchema>;

export const DependencyListSchema = z.array(DependencySchema);
export const NewDependencyResponse = z.object({
  success: z.boolean(),
  dependencies: DependencyListSchema,
});

//API Related
export const SaveWidgetSchema = z.object({
  guid: z.string(),
  success: z.boolean(),
});

export type SaveWidgetRes = z.infer<typeof SaveWidgetSchema>;
export type NewWidget = {
  name: string;
  id?: string;
  description?: string;
};

//Options Schema
const ChoiceItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const ChoicesSchema = z
  .union([
    z.array(ChoiceItemSchema),
    z.string().transform(s =>
      s
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => ({ label: line, value: line }))
    ),
  ])
  .optional();

export const OptionSchema = z.object({
  name: z.string(),
  label: z.string(),
  localId: z.string().optional(),
  type: z.enum(optionTypes),
  section: z.enum(optionSections),
  default_value: z.string().optional(),
  displayValue: z.string().optional(),
  value: z.string().optional(),
  choices: ChoicesSchema,
  ed: z
    .object({
      reference: z.string().optional(),
    })
    .optional(),
});

export const OptionsSchema = z.array(OptionSchema);
export type Option = z.infer<typeof OptionSchema>;
export type Options = z.infer<typeof OptionsSchema>;
