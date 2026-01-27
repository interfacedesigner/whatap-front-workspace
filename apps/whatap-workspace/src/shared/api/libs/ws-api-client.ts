import { createWsApiClient } from './create-ws-api-client';

/**
 * 기본 WS API 클라이언트 싱글톤 인스턴스
 *
 * @example
 * ```typescript
 * import apiClient from '@shared/api/libs/ws-api-client';
 *
 * const { data, error } = await apiClient.GET('/ws/api/v1/{enterprise}/workspace/{workspaceId}', {
 *   params: {
 *     path: { enterprise: 'whatap', workspaceId: '123' },
 *   },
 * });
 * ```
 */
const apiClient = createWsApiClient();

export default apiClient;
