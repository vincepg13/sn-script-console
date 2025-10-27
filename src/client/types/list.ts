import { z } from 'zod';

const FieldHeaderSchema = z.object({
  name: z.string(),
  label: z.string(),
});

const FieldValueSchema = z.record(
  z.string(),
  z.object({
    value: z.string(),
    display_value: z.string(),
  })
);

const tableConfigSchema = z.object({
  tableLabel: z.string(),
  displayField: z.string(),
  hasTextIndex: z.boolean(),
});

export const ListRecordsSchema = z.object({
  totalCount: z.number(),
  config: tableConfigSchema,
  fields: z.array(FieldHeaderSchema),
  records: z.array(FieldValueSchema),
});

export type TableConfig = z.infer<typeof tableConfigSchema>;
export type FieldHeader = z.infer<typeof FieldHeaderSchema>;
export type FieldValue = z.infer<typeof FieldValueSchema>;
  export type ListData = z.infer<typeof ListRecordsSchema>;

const listRecordField = z.object({
  value: z.string(),
  display_value: z.string(),
});

export const ListRecord = z.record(z.string(), listRecordField);
export const ListRecords = z.array(ListRecord);
export type ListRecord = z.infer<typeof ListRecord>;