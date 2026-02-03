/**
 * Server Entity Zod Schemas
 * @description 서버 인벤토리 맵 엔티티의 런타임 검증 스키마
 */
import { z } from 'zod';

// =============================================================================
// Enum Schemas
// =============================================================================

export const ServerStatusSchema = z.enum(['ok', 'warning', 'critical', 'inactive']);

export const OSTypeSchema = z.enum(['Linux', 'Windows', 'AIX', 'HP-UX', 'Solaris', 'Unknown']);

export const GroupOptionKeySchema = z.enum([
  'defaultGroup',
  'serverType',
  'OSType',
  'OSVersion',
  'model',
  'hwSerial',
  'csp',
  'cloudInstanceType',
  'cloudRegion',
]);

export const IconLabelOptionSchema = z.enum(['hostname', 'ip', 'status']).nullable();

// =============================================================================
// Entity Schemas
// =============================================================================

export const ServerSchema = z.object({
  oid: z.number().int().positive(),
  hostname: z.string().min(1).max(255),
  ip: z.string().min(1), // IP validation simplified
  status: ServerStatusSchema,
  osType: OSTypeSchema,
  serverType: z.string(),
  cores: z.number().int().positive(),
  defaultGroup: z.string().optional(),
  OSVersion: z.string().optional(),
  cloudRegion: z.string().optional(),
  model: z.string().optional(),
  hwSerial: z.string().optional(),
  csp: z.string().optional(),
  cloudInstanceType: z.string().optional(),
});

export const GroupSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  warning: z.number().int().nonnegative(),
  critical: z.number().int().nonnegative(),
  warningEventCount: z.number().int().nonnegative(),
  criticalEventCount: z.number().int().nonnegative(),
});

// Note: ServerGroup has recursive structure (groups contains ServerGroup[])
// For runtime validation, we define a non-recursive base schema
export const ServerGroupBaseSchema = z.object({
  key: z.string(),
  name: z.string(),
  servers: z.array(ServerSchema),
  groups: z.array(z.unknown()), // Recursive validation would need z.lazy
  summary: GroupSummarySchema,
});

// For type-safe usage, prefer the TypeScript types from server.types.ts
export const ServerGroupSchema = ServerGroupBaseSchema;

export const OSSummarySchema = z.object({
  label: OSTypeSchema,
  active: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  totalCore: z.number().int().nonnegative(),
});

export const ProjectSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  totalCore: z.number().int().nonnegative(),
  byOS: z.array(OSSummarySchema),
});

// =============================================================================
// Type Exports (inferred from schemas)
// =============================================================================

export type ServerSchemaType = z.infer<typeof ServerSchema>;
export type GroupSummarySchemaType = z.infer<typeof GroupSummarySchema>;
export type OSSummarySchemaType = z.infer<typeof OSSummarySchema>;
export type ProjectSummarySchemaType = z.infer<typeof ProjectSummarySchema>;
