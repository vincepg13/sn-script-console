import { z } from 'zod';

const PackageDropdownSchema = z.object({
  id: z.string(),
  name: z.string(),
  guid: z.string(),
});
export const ScriptPackagesSchema = z.array(PackageDropdownSchema);

export const PackageCreateRes = z.object({
  preferenceId: z.string(),
  packages: ScriptPackagesSchema,
});

export const PackageItemSchema = z.object({
  label: z.string(),
  path: z.string()
});

export const PackageTableSchema = z.object({
  label: z.string(),
  isActive: z.boolean().optional(),
  items: z.array(PackageItemSchema)
});

export const PackageValueSchema = z.record(z.string(), PackageTableSchema);

export const PackageUpdateSchema = z.object({
  updated: z.string(),
  packageValue: PackageValueSchema
});

export type PackageValue = z.infer<typeof PackageValueSchema>;
export type ScriptPackageItem = z.infer<typeof PackageDropdownSchema>;
export type ScriptPackages = z.infer<typeof ScriptPackagesSchema>;