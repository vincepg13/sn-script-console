import { z } from 'zod';
import { LucideIcon } from 'lucide-react';
import { PrettierSchema } from './defaults';
import { CmThemeValue, ESLintConfigAny } from 'sn-shadcn-kit/script';
import { PackageValueSchema, ScriptPackagesSchema } from './package';
import { UseMutationResult } from 'node_modules/@tanstack/react-query/build/modern/types';

const User = z.object({
  username: z.string(),
  guid: z.string(),
});

export const AppScopeSchema = z.object({
  value: z.string(),
  name: z.string(),
});

export const UpdateSetSchema = z.object({
  name: z.string(),
  value: z.string(),
  state: z.string().optional(),
});

export const ScopeUpdateSchema = z.object({
  scope: AppScopeSchema,
  updateSet: UpdateSetSchema,
});

export const GeneralPreferences = z.object({
  theme: z.custom<CmThemeValue>(),
  lastWidget: z.string().optional().nullable(),
  sidebarOpen: z.string().transform(val => val === 'true'),
  autoScopeSwitch: z.string().transform(val => val === 'true'),
  autoPackageAdd: z.string().transform(val => val === 'true'),
  directToWidget: z.string().transform(val => val === 'true'),
});
export const DefaultPreferences: z.infer<typeof GeneralPreferences> = {
  theme: 'atom',
  sidebarOpen: true,
  autoScopeSwitch: false,
  autoPackageAdd: false,
  directToWidget: false,
};
export type Preferences = z.infer<typeof GeneralPreferences>; 

const AppMenuLink = z.object({
  title: z.string(),
  href: z.string(),
  target: z.string().optional(),
  description: z.string(),
});
const AppMenuItem = z.object({
  label: z.string(),
  type: z.enum(['single', 'multi']),
  icon: z.string().optional(),
  items: z.array(AppMenuLink),
});

const ScriptedTable = z.object({
  table: z.string(),
  label: z.string(),
  field: z.string(),
  display: z.array(z.string()).min(1),
});

const AppPackageSchema = z.object({
    packages: ScriptPackagesSchema,
    currentPackage: z.string(),
    packageItems: PackageValueSchema,
  })

export const AppConfigSchema = z.object({
  user: User,
  scope: AppScopeSchema,
  packageData: AppPackageSchema,
  preferences: GeneralPreferences,
  updateSet: UpdateSetSchema.nullable(),
  prettierConfig: PrettierSchema.optional().nullable(),
  esLintConfig: z.custom<ESLintConfigAny>().optional().nullable(),
  menu: z.array(AppMenuItem).optional().nullable(),
  scriptTables: z.record(z.string(), ScriptedTable).optional().nullable(),
});

export type PackageData = z.infer<typeof AppPackageSchema>;
export type MenuItem = z.infer<typeof AppMenuLink>;
export type AppScope = z.infer<typeof AppScopeSchema>;
export type AppUpdateSet = z.infer<typeof UpdateSetSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type ScriptTableItems = z.infer<typeof AppConfigSchema.shape.scriptTables>;
export type PickerMenuItem = { label: string; href: string; target?: string, icon?: LucideIcon };


export type AppMutation<TData, TVariables = void, TError = unknown, TContext = unknown> = UseMutationResult<
  TData,
  TError,
  TVariables,
  TContext
>;
  