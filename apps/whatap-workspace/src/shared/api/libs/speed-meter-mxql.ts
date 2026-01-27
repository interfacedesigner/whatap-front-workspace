/**
 * SpeedMeter 데이터 조회를 위한 MXQL 쿼리 생성
 */
export function getSpeedMeterMxql(agentOids?: number[]): string {
  const oidFilter = agentOids && agentOids.length > 0 ? `OID [${agentOids.join(',')}]\n` : '';

  return (
    `CATEGORY app_counter\n` +
    `${oidFilter}TAGLOAD {backward:true}\n` +
    `INJECT default\n` +
    `SELECT [oid,time,oid, active_tx_0, active_tx_3, active_tx_8, active_tx_count, tx_count,apdex_total, apdex_satisfied, apdex_tolerated, arrival_rate, tps]\n` +
    `FIRST-ONLY {key:oid}\n` +
    `GROUP {timeunit:5s, last:[oid], merge:[ active_tx_0, active_tx_3, active_tx_8, active_tx_count, tx_count, apdex_total, apdex_satisfied, apdex_tolerated, arrival_rate, tps] }\n` +
    `UPDATE {key:[ active_tx_0, active_tx_3, active_tx_8, active_tx_count, tx_count, apdex_total, apdex_satisfied, apdex_tolerated, arrival_rate, tps], value:sum}\n` +
    `FIRST-ONLY {key:oid}`
  );
}
