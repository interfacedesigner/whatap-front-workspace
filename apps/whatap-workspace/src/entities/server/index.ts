/**
 * Server Entity Public API
 * @description 서버 엔티티의 외부 노출 인터페이스
 */

// Types
export type {
  GroupOptionKey,
  GroupSummary,
  IconLabelOption,
  OSSummary,
  OSType,
  ProjectSummary,
  Server,
  ServerGroup,
  ServerStatus,
} from './model/server.types';

// Constants
export { GROUP_OPTION_LABELS, ICON_LABEL_OPTIONS, STATUS_COLORS, STATUS_TEXT_COLORS } from './model/server.types';

// Schemas
export {
  GroupOptionKeySchema,
  GroupSummarySchema,
  IconLabelOptionSchema,
  OSSummarySchema,
  OSTypeSchema,
  ProjectSummarySchema,
  ServerGroupSchema,
  ServerSchema,
  ServerStatusSchema,
} from './model/server.schema';

// Mock Hooks
export type {
  UseProjectSummaryMockDataReturn,
  UseServerMockDataOptions,
  UseServerMockDataReturn,
} from './api/server.mock';
export { useProjectSummaryMockData, useServerMockData } from './api/server.mock';

// UI Components
export { ServerIcon } from './ui/ServerIcon';
export { ServerGrid } from './ui/ServerGrid';
export { ServerGroupPanel } from './ui/ServerGroupPanel';
export { ProjectSummary as ProjectSummaryPanel } from './ui/ProjectSummary';
