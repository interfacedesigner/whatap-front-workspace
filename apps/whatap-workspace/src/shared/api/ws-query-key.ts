import * as Api from './generated/ws-api';
import { convertToQueryKeys } from './libs/convert-to-query-keys';

const PREFIX = 'ws_api';
export const workspaceQueryKeys = convertToQueryKeys(PREFIX, Api);
