// @ts-nocheck
import type { SpeedMeterData } from 'chart-components/SpeedMeter';

import { requestMxqlAggregate } from '../generated/ws-api';
import { getSpeedMeterMxql } from './speed-meter-mxql';

type MxqlRow = {
  active_tx_0?: number;
  active_tx_3?: number;
  active_tx_8?: number;
  active_tx_count?: number;
  tx_count?: number;
  tps?: number;
  arrival_rate?: number;
  apdex_total?: number;
  apdex_satisfied?: number;
  apdex_tolerated?: number;
};

/**
 * 워크스페이스의 실시간 SpeedMeter 데이터 조회
 */
export async function getWorkspaceSpeedMeter(options: {
  wsid: number;
  agentOids?: number[];
}): Promise<{ type: 'SUCCESS'; data: SpeedMeterData | null } | { type: 'FAILURE'; msg: string; code: number }> {
  const { wsid, agentOids } = options;

  try {
    const etime = Date.now();
    const stime = etime - 10000; // 10초 전
    const mxql = getSpeedMeterMxql(agentOids);

    const result = await requestMxqlAggregate({
      body: {
        wsid,
        platform: 0, // 0: 전체
        sysid: 0, // 0: 전체 (리전 단위)
        stime,
        etime,
        mxql,
        inject: {},
        param: {},
        limit: 10000,
      },
    });

    if (result.type === 'FAILURE') {
      return { type: 'FAILURE', msg: result.msg ?? 'Unknown error', code: result.code ?? 500 };
    }

    const rows = result.data?.rows;
    if (!rows || rows.length === 0) {
      return { type: 'SUCCESS', data: null };
    }

    const row = rows[0] as MxqlRow;

    // SpeedMeterData 형식으로 변환
    const speedMeterData: SpeedMeterData = {
      act: row.active_tx_count ?? 0,
      act0: row.active_tx_0 ?? 0,
      act3: row.active_tx_3 ?? 0,
      act8: row.active_tx_8 ?? 0,
      tps: row.tps ?? 0,
      rps: row.arrival_rate ?? 0,
      start: row.tx_count ?? 0,
      end0: row.apdex_satisfied ?? 0,
      end3: row.apdex_tolerated ?? 0,
      end8: Math.max(0, (row.apdex_total ?? 0) - (row.apdex_satisfied ?? 0) - (row.apdex_tolerated ?? 0)),
      _rows_: 0,
    };

    // end 계산
    speedMeterData.end = speedMeterData.end0 + speedMeterData.end3 + speedMeterData.end8;

    return { type: 'SUCCESS', data: speedMeterData };
  } catch (error) {
    return {
      type: 'FAILURE',
      msg: error instanceof Error ? error.message : 'Unknown error',
      code: 500,
    };
  }
}
