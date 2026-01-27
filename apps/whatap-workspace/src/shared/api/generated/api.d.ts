export interface paths {
  '/ws/api/v1/{enterprise}/workspace/{workspaceId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 워크스페이스 조회
     * @description 특정 워크스페이스 정보를 조회합니다.
     */
    get: operations['getWorkspace'];
    put?: never;
    /**
     * 워크스페이스 수정
     * @description 워크스페이스 정보를 수정합니다.
     */
    post: operations['updateWorkspace'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/{enterprise}/workspace/generate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 워크스페이스 생성
     * @description 기존 Enterprise에 새로운 워크스페이스를 추가 생성합니다.
     */
    post: operations['createWorkspace'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['yardApi'];
    put?: never;
    post: operations['yardPostApi'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/summary/aggregate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 요약 통계 데이터 집계
     * @description 워크스페이스의 여러 product/sysid/services 요약 통계 데이터를 집계합니다.
     *
     *     **targets 배열:**
     *     - product, sysid, services 조합으로 조회 대상 지정
     *     - sysid 생략 시 0 (전체 sysid)
     *     - services 생략 시 null (전체 services)
     *     - null 또는 빈 배열이면 모든 활성 제품/sysid/services 조회
     *
     *     **지원하는 통계 타입:**
     *     - application: 활성 에이전트 수
     *     - inactive: 비활성 에이전트 수
     *     - host: 호스트 수
     *     - cpuCore: CPU 코어 수
     *
     *     **응답 헤더:**
     *     - X-Agent-Count: 총 agent 개수
     *     - X-Sysid-Count: 총 sysid 개수
     */
    post: operations['requestSummaryAggregate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/mxql/raw': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * MXQL 쿼리 결과 Raw (병합 없음)
     * @description 워크스페이스의 여러 product/sysid/services MXQL 쿼리 결과를 병합 없이 원본 그대로 반환합니다.
     *
     *     **targets 배열:**
     *     - product, sysid, services 조합으로 조회 대상 지정
     *     - sysid 생략 시 0 (전체 sysid)
     *     - services 생략 시 null (전체 services)
     *     - null 또는 빈 배열이면 모든 활성 제품/sysid/services 조회
     *
     *     **aggregate와 차이점:**
     *     - 병합 없이 각 row를 그대로 반환
     *     - oid, oname, pcode 필드 유지
     *     - pcode는 JavaScript 호환을 위해 문자열로 반환
     *     - 개별 에이전트 데이터 확인 시 사용
     *
     *     **응답 헤더:**
     *     - X-Agent-Count: 총 agent 개수
     *     - X-Sysid-Count: 총 sysid 개수
     *     - X-Product-Count: 총 product 개수
     */
    post: operations['requestMxqlRaw'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/mxql/aggregate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * MXQL 쿼리 결과 집계
     * @description 워크스페이스의 여러 product/sysid/services MXQL 쿼리 결과를 하나의 row로 병합합니다.
     *
     *     **targets 배열:**
     *     - product, sysid, services 조합으로 조회 대상 지정
     *     - sysid 생략 시 0 (전체 sysid)
     *     - services 생략 시 null (전체 services)
     *     - null 또는 빈 배열이면 모든 활성 제품/sysid/services 조회
     *
     *     **병합 전략:**
     *     - 숫자 필드: sum 집계
     *     - 문자 필드: 첫 번째 값 사용
     *     - oid, oname, _rows_ 자동 제거
     *
     *     **응답 헤더:**
     *     - X-Agent-Count: 총 agent 개수
     *     - X-Sysid-Count: 총 sysid 개수
     *
     *     **MXQL 쿼리 작성 시 주의사항:**
     *     - oid, oname은 SELECT에서 제외
     *     - time 필드는 sum 대상에서 제외
     *     - GROUP 및 UPDATE 구문 활용
     */
    post: operations['requestMxqlAggregate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/hitmap/aggregate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Hitmap 데이터 집계
     * @description 워크스페이스의 여러 product/sysid/services 히트맵 데이터를 통합하여 집계합니다.
     *
     *     **targets 배열:**
     *     - product, sysid, services 조합으로 조회 대상 지정
     *     - sysid 생략 시 0 (전체 sysid)
     *     - services 생략 시 null (전체 services)
     *     - null 또는 빈 배열이면 모든 활성 제품/sysid/services 조회
     *
     *     **응답 헤더:**
     *     - X-Agent-Count: 총 agent 개수
     *     - X-Sysid-Count: 총 sysid 개수
     */
    post: operations['requestHitmapAggregate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/flush': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['yardApiFlushGet'];
    put?: never;
    post: operations['yardApiFlushPost'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['yardDeleteApi'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/api/flush': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Yard API Flush (단일/다중 pcode)
     * @description Yard API를 flush 방식으로 호출합니다. 단일 pcode 또는 다중 pcode(targets)를 지원합니다.
     *
     *     **단일 pcode 모드:**
     *     - wsid, product, sysid를 지정하여 단일 pcode 호출
     *
     *     **다중 pcode 모드:**
     *     - targets 배열을 지정하여 여러 pcode 병렬 호출 및 결과 병합
     *
     *     **주요 사용 사례:**
     *     - hitmap profiles 조회 (type=hitmap, path=profiles)
     *     - 대용량 트랜잭션 목록 조회
     */
    post: operations['requestFlush'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/yard/api/aggregate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Multi-Product/Sysid/Services 데이터 집계
     * @description 워크스페이스의 여러 product/sysid/services 데이터를 통합하여 집계합니다.
     *
     *     **targets 배열:**
     *     - product, sysid, services 조합으로 조회 대상 지정
     *     - sysid 생략 시 0 (전체 sysid)
     *     - services 생략 시 null (전체 services)
     *     - null 또는 빈 배열이면 모든 활성 제품/sysid/services 조회
     *
     *     **집계 방식:**
     *     - objectMerge: sum, avg, min, max
     *     - timeMerge: sum, avg, min, max
     */
    post: operations['requestAggregate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/workspace/generate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 워크스페이스 및 Enterprise 생성
     * @description 새로운 Enterprise와 워크스페이스를 함께 생성합니다.
     */
    post: operations['createWorkspaceAndEnterprise'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/maintenance/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 유지보수 계획 삭제
     * @description 유지보수 계획을 삭제합니다.
     */
    post: operations['deleteMaintenancePlan'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/maintenance/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 유지보수 계획 생성
     * @description 새로운 유지보수 계획을 생성합니다.
     */
    post: operations['createMaintenancePlan'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/auto-action/rules/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 자동 액션 규칙 수정
     * @description 기존 자동 액션 규칙을 수정합니다.
     */
    post: operations['updateAutoActionRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/auto-action/rules/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 자동 액션 규칙 삭제
     * @description 자동 액션 규칙을 삭제합니다.
     */
    post: operations['deleteAutoActionRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/auto-action/rules/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 자동 액션 규칙 생성
     * @description 새로운 자동 액션 규칙을 생성합니다.
     */
    post: operations['createAutoActionRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/rules/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 규칙 수정
     * @description 인시던트 규칙을 수정합니다.
     */
    post: operations['updateIncidentRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/rules/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 규칙 삭제
     * @description 인시던트 규칙을 삭제합니다.
     */
    post: operations['deleteIncidentRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/rules/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 규칙 생성
     * @description 새로운 인시던트 규칙을 생성합니다.
     */
    post: operations['createIncidentRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/records/status': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 상태 변경
     * @description 인시던트의 상태를 변경합니다.
     */
    post: operations['updateIncidentStatus'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/records/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 레코드 생성
     * @description 새로운 인시던트 레코드를 생성합니다.
     */
    post: operations['createIncidentRecord'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/actions/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 액션 생성
     * @description 인시던트에 새로운 액션을 추가합니다.
     */
    post: operations['createIncidentAction'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/rules/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 이벤트 규칙 수정
     * @description 기존 이벤트 규칙을 수정합니다.
     */
    post: operations['updateEventRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/rules/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 이벤트 규칙 삭제
     * @description 이벤트 규칙을 삭제합니다.
     */
    post: operations['deleteEventRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/rules/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 이벤트 규칙 생성
     * @description 새로운 이벤트 규칙을 생성합니다.
     */
    post: operations['createEventRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/incident-rules/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 전달 규칙 수정
     * @description 기존 인시던트 전달 규칙을 수정합니다.
     */
    post: operations['updateIncidentDeliveryRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/incident-rules/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 전달 규칙 삭제
     * @description 인시던트 전달 규칙을 삭제합니다.
     */
    post: operations['deleteIncidentDeliveryRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/incident-rules/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 인시던트 전달 규칙 생성
     * @description 새로운 인시던트 전달 규칙을 생성합니다.
     */
    post: operations['createIncidentDeliveryRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/event-rules/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 이벤트 전달 규칙 수정
     * @description 기존 이벤트 전달 규칙을 수정합니다.
     */
    post: operations['updateEventDeliveryRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/event-rules/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 이벤트 전달 규칙 삭제
     * @description 이벤트 전달 규칙을 삭제합니다.
     */
    post: operations['deleteEventDeliveryRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/event-rules/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 이벤트 전달 규칙 생성
     * @description 새로운 이벤트 전달 규칙을 생성합니다.
     */
    post: operations['createEventDeliveryRule'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/series': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Series 데이터 조회
     * @description Workspace 레벨에서 Multi-product/sysid Series 시계열 데이터를 조회합니다. targets로 조회할 product-sysid-services 단위를 지정하고, oids/okinds/onodes로 필터링할 수 있습니다.
     */
    post: operations['getSeries'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 보고서 템플릿 목록 조회
     * @description 워크스페이스의 보고서 템플릿 목록을 조회합니다. 사용자 계정의 모든 리전에서 템플릿을 조회하여 통합된 결과를 반환합니다.
     */
    get: operations['getPaperList'];
    put?: never;
    /**
     * 보고서 템플릿 생성
     * @description 새로운 보고서 템플릿을 생성합니다. 템플릿 이름, 설명, 제품 유형, 템플릿 내용, 파라미터 등을 설정할 수 있습니다.
     */
    post: operations['createPaper'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 보고서 템플릿 수정
     * @description 기존 보고서 템플릿을 수정합니다. 수정하려는 필드만 포함하면 해당 필드만 업데이트됩니다 (부분 업데이트 지원).
     */
    post: operations['updatePaper'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/reports/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * PDF 리포트 삭제
     * @description PDF 리포트 파일을 삭제합니다. PDF 파일과 함께 JSON 메타데이터 파일도 삭제됩니다. 삭제된 파일은 복구할 수 없습니다.
     */
    post: operations['deletePaperReport'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/execute': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 보고서 실행 요청
     * @description 보고서 PDF 생성을 요청합니다. 요청이 접수되면 WAITING 상태로 시작하여 백그라운드에서 PDF가 생성됩니다. 생성 완료 후 /reports API를 통해 다운로드할 수 있습니다.
     */
    post: operations['executePaper'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/delete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 보고서 템플릿 삭제
     * @description 보고서 템플릿을 삭제합니다. 삭제된 템플릿은 복구할 수 없으며, 관련된 실행 이력은 유지됩니다.
     */
    post: operations['deletePaper'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/pack/execute': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Pack 히스토리 데이터 실행
     * @description 워크스페이스의 Pack 히스토리 데이터를 조회합니다.
     *
     *     **Pack이란?**
     *     - WhaTap 모니터링 히스토리 데이터를 압축 저장한 Pack 형식 데이터
     *     - PackGate를 통해 Yard 디스크에서 과거 데이터를 조회합니다
     *
     *     **지원 Pack 타입:**
     *     - counter: CounterPack (성능 메트릭 - CPU, 메모리, TPS 등)
     *     - hitmap: HitMapPack (응답시간 분포)
     *     - transaction: ProfilePack (트랜잭션 프로파일)
     *     - tagcount: TagCountPack (태그 카운트)
     *
     *     **주요 파라미터:**
     *     - wsid: 워크스페이스 ID
     *     - product: 제품 코드 (101=Java, 201=Server 등, 0=자동 감지)
     *     - sysid: 리전 ID (0=모든 리전)
     *     - sysidOidMap: sysid → oids 매핑 (null이면 OpsLake에서 자동 조회)
     *     - stime/etime: 조회 시간 범위 (밀리초)
     *     - packType: Pack 타입
     *     - options: Pack 타입별 추가 옵션
     *     - timeout: 조회 타임아웃 (기본 30초)
     *     - limit: 결과 개수 제한 (기본 10000)
     *
     *     **자동 Agent 조회 (권장):**
     *     - sysidOidMap을 null로 설정하면 Redis에서 활성 에이전트를 자동 조회합니다
     *     - product=0으로 설정하면 실제 제품을 자동 감지합니다
     *
     *     **응답 데이터:**
     *     - Pack 데이터는 data 배열로 반환됩니다
     *     - 각 데이터는 Map<String, Object> 형태의 키-값 쌍입니다
     *     - limit에 도달하면 수집된 데이터까지만 반환합니다
     */
    post: operations['executePack'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/overview': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Overview 대시보드 데이터 조회
     * @description Workspace 레벨에서 CPU, Memory, 동시 사용자 데이터와 전일/전주/전월 비교 데이터를 조회합니다.
     *
     *     **조회 메트릭:**
     *     - cpu: CPU 사용률 (%)
     *     - memory: Memory 사용률 (%)
     *     - users: 동시 사용자 수
     *
     *     **비교 기간:**
     *     - current: 현재 (최근 5분 평균)
     *     - yesterday: 전일 같은 시간대
     *     - lastWeek: 전주 같은 시간대 (7일 전)
     *     - lastMonth: 전월 같은 시간대 (30일 전)
     *
     *     **변화량 계산:**
     *     - deltaDay = current - yesterday
     *     - deltaWeek = current - lastWeek
     *     - deltaMonth = current - lastMonth
     *
     *     **성능:**
     *     - Virtual Thread 기반 12개 병렬 쿼리 (3 메트릭 x 4 시간대)
     *     - 평균 응답 시간: 1-3초
     */
    post: operations['getOverview'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterprise}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Enterprise 조회
     * @description Enterprise 를 조회합니다.
     */
    get: operations['getEnterprise'];
    put?: never;
    /**
     * Enterprise 수정
     * @description Enterprise 정보를 수정합니다.
     */
    post: operations['updateEnterprise'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/role': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 역할(Role) 생성
     * @description Enterprise에 새로운 역할을 생성합니다.
     */
    post: operations['createEnterpriseRole'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/role/{roleId}/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 역할(Role) 수정
     * @description 역할의 이름 및 설명을 수정합니다.
     */
    post: operations['updateEnterpriseRole'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/role/{roleId}/remove': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 역할(Role) 삭제
     * @description 역할을 삭제합니다.
     */
    post: operations['deleteEnterpriseRole'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/role/{roleId}/permissions/remove': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 역할에서 권한 제거
     * @description 특정 역할에서 권한을 제거합니다.
     */
    post: operations['removePermissionsFromRole'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/role/{roleId}/permissions/add': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 역할에 권한 추가
     * @description 특정 역할에 권한을 추가합니다.
     */
    post: operations['addPermissionsToRole'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/remove/members': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Enterprise 멤버 제거
     * @description Enterprise에서 멤버를 제거합니다.
     */
    post: operations['removeEnterpriseMembers'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/policy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Role Policy 생성
     * @description Enterprise에 새로운 Role Policy를 생성합니다. 멤버 또는 멤버 그룹에게 역할과 워크스페이스를 할당합니다.
     */
    post: operations['createRolePolicy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/policy/{policyId}/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Role Policy 수정
     * @description Enterprise의 Role Policy를 수정합니다. name, description, principals, roles, workspaces 값을 선택적으로 변경할 수 있습니다.
     */
    post: operations['updateRolePolicy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/policy/{policyId}/remove': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Role Policy 삭제
     * @description 특정 Role Policy를 삭제합니다.
     */
    post: operations['revokeRolePolicy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/policies': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Role Policy 목록 조회
     * @description Enterprise의 Role Policy 목록을 페이지네이션하여 조회합니다. 검색 조건(workspaces)을 지원합니다.
     */
    post: operations['getAllRolePolicies'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/permission': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 권한(Permission) 생성
     * @description Enterprise에 새로운 권한을 생성합니다.
     */
    post: operations['createPermission'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/permission/{pid}/update': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 권한(Permission) 수정
     * @description 권한 정보를 수정합니다.
     */
    post: operations['updatePermission'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/permission/{pid}/remove': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 권한(Permission) 삭제
     * @description 권한을 삭제합니다.
     */
    post: operations['deletePermission'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/members': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Enterprise 멤버 목록 조회
     * @description Enterprise의 멤버 목록을 페이지네이션하여 조회합니다.
     */
    get: operations['getEnterpriseMembers'];
    put?: never;
    /**
     * Enterprise 멤버 추가
     * @description Enterprise에 새로운 멤버를 추가합니다.
     */
    post: operations['addEnterpriseMembers'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/members/status': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Enterprise 멤버 상태 변경
     * @description Enterprise 멤버의 상태를 변경합니다.
     */
    post: operations['changeEnterpriseMemberStatus'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/member/policies': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 멤버별 Role Policy 목록 조회
     * @description Enterprise의 멤버별 Role Policy 목록을 페이지네이션하여 조회합니다. 각 멤버의 이메일, 역할 정보를 포함하여 조회합니다. 검색 조건(text)을 지원합니다.
     */
    post: operations['getAllRolePoliciesWithDetail'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/member/invite/check': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Enterprise 멤버 초대 가능 여부 확인
     * @description Enterprise에 멤버를 초대하기 전 초대 가능 여부를 확인합니다. 계정 존재 여부, 이미 멤버인지, 가입 필요 여부 등을 체크합니다.
     */
    post: operations['changeEnterpriseMemberStatus_1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/generate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Enterprise 생성
     * @description Enterprise 생성 합니다.
     */
    post: operations['createEnterprise'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/dmxql/execute': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * DMXQL 쿼리 실행
     * @description Workspace 레벨에서 다중 Yard에 MXQL 쿼리를 실행하고 결과를 수집합니다
     */
    post: operations['execute'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agents/recent': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Targets 기반 최근 에이전트 목록 조회
     * @description 여러 product/sysid/services 조합(targets)을 기반으로 최근 에이전트 목록을 조회합니다. 단일 요청으로 여러 타겟의 에이전트를 효율적으로 조회할 수 있습니다.
     */
    post: operations['getRecentAgentsByTargets'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agent/action': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Agent 액션 실행
     * @description 워크스페이스의 Agent 실시간 액션을 실행합니다.
     *
     *     **Agent 액션이란?**
     *     - WhaTap 에이전트에서 실시간으로 수행하는 작업
     *     - AgentGate를 통해 Yard에서 실시간으로 데이터를 수집합니다
     *
     *     **지원 액션:**
     *     - active_tx: 활성 트랜잭션 조회
     *     - thread_dump: 쓰레드 덤프
     *     - heap_histogram: 힙 히스토그램
     *     - sql_stat: SQL 통계
     *     - httpc_stat: HTTP Call 통계
     *     - config: 에이전트 설정 조회
     *     - log_tail: 로그 실시간 조회
     *
     *     **주요 파라미터:**
     *     - wsid: 워크스페이스 ID
     *     - product: 제품 코드 (101=Java, 201=Server 등, 0=자동 감지)
     *     - sysid: 리전 ID (0=모든 리전)
     *     - sysidOidMap: sysid → oids 매핑 (null이면 OpsLake에서 자동 조회)
     *     - action: Agent 액션 (active_tx, thread_dump 등)
     *     - options: 액션별 추가 옵션
     *     - timeout: 조회 타임아웃 (기본 10초)
     *     - limit: 결과 개수 제한 (기본 1000)
     *
     *     **자동 Agent 조회 (권장):**
     *     - sysidOidMap을 null로 설정하면 Redis에서 활성 에이전트를 자동 조회합니다
     *     - product=0으로 설정하면 실제 제품을 자동 감지합니다
     *
     *     **응답 데이터:**
     *     - Agent 응답 데이터는 data 배열로 반환됩니다
     *     - 각 데이터는 Map<String, Object> 형태의 키-값 쌍입니다
     *     - limit에 도달하면 수집된 데이터까지만 반환합니다
     */
    post: operations['executeAgent'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/{enterprise}/workspace/list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 워크스페이스 목록 조회
     * @description Enterprise 의 워크스페이스 목록을 조회합니다.
     */
    get: operations['getWorkspaceList'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/maintenance/list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 유지보수 계획 목록 조회
     * @description 워크스페이스의 유지보수 계획 목록을 페이징하여 조회합니다.
     */
    get: operations['getMaintenancePlans'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/block/list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 활성 블록 목록 조회
     * @description 현재 활성화된 알림 블록 설정 목록을 조회합니다.
     */
    get: operations['getActiveBlockList'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/block/check': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 블록 상태 확인
     * @description 특정 대상의 알림 블록 상태를 확인합니다.
     */
    get: operations['checkBlocked'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/auto-action/rules': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 자동 액션 규칙 목록 조회
     * @description 특정 인시던트 규칙에 대한 자동 액션 규칙 목록을 조회합니다.
     */
    get: operations['getAutoActionRules'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/system/auto-action/results': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 자동 액션 결과 목록 조회
     * @description 특정 인시던트에 대한 자동 액션 실행 결과를 조회합니다.
     */
    get: operations['getAutoActionResults'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/rules': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 인시던트 규칙 목록 조회
     * @description 워크스페이스의 인시던트 규칙 목록을 페이징하여 조회합니다.
     */
    get: operations['getIncidentRules'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/records': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 인시던트 레코드 목록 조회
     * @description 워크스페이스의 인시던트 레코드 목록을 페이징하여 조회합니다.
     */
    get: operations['getIncidentRecords'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/incident/actions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 인시던트 액션 목록 조회
     * @description 특정 인시던트에 대한 액션 목록을 조회합니다.
     */
    get: operations['getIncidentActions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/states': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 이벤트 상태 목록 조회
     * @description 워크스페이스의 현재 이벤트 상태 목록을 페이징하여 조회합니다.
     */
    get: operations['getEventStates'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/states/by-rule': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 규칙별 이벤트 상태 조회
     * @description 특정 규칙에 해당하는 이벤트 상태를 조회합니다.
     */
    get: operations['getEventStatesByRule'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/rules': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 이벤트 규칙 목록 조회
     * @description 워크스페이스의 이벤트 규칙 목록을 페이징하여 조회합니다.
     */
    get: operations['getEventRules'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/history': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 이벤트 히스토리 조회
     * @description 워크스페이스의 이벤트 히스토리를 페이징하여 조회합니다.
     */
    get: operations['getEventHistory'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/event/history/count': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 이벤트 히스토리 카운트 조회
     * @description 기간별 이벤트 히스토리 카운트를 조회합니다.
     */
    get: operations['getEventHistoryCount'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/incident-rules': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 인시던트 전달 규칙 목록 조회
     * @description 특정 인시던트 규칙에 대한 전달 규칙 목록을 조회합니다.
     */
    get: operations['getIncidentDeliveryRules'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/incident-history': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 인시던트 전달 히스토리 조회
     * @description 특정 인시던트에 대한 전달 히스토리를 조회합니다.
     */
    get: operations['getIncidentDeliveryHistory'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/event-rules': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 이벤트 전달 규칙 목록 조회
     * @description 특정 이벤트 규칙에 대한 전달 규칙 목록을 조회합니다.
     */
    get: operations['getEventDeliveryRules'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/siren/delivery/event-history': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 이벤트 전달 히스토리 조회
     * @description 특정 이벤트 히스토리에 대한 전달 히스토리를 조회합니다.
     */
    get: operations['getEventDeliveryHistory'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/products/types': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 지원 제품 목록 조회
     * @description WhaTap에서 지원하는 전체 제품 목록을 카테고리별로 그룹화하여 조회합니다. APM, INFRA, DATABASE, K8S, RUM, INTEGRATION 카테고리로 구분됩니다.
     */
    get: operations['getProductTypes'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/products/recent/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 최근 제품 목록 조회
     * @description 워크스페이스의 최근 활동한 제품 목록을 조회합니다. 각 제품의 limit_oid_per_sysid 설정값도 함께 제공합니다.
     */
    get: operations['getRecentProducts'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/products/config': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 제품 설정값 조회
     * @description 특정 제품의 설정값을 조회합니다. product=0을 지정하면 전체 제품 기본값을 조회합니다. 제품별 설정이 없으면 자동으로 product=0의 값으로 fallback됩니다.
     */
    get: operations['getProductConfig'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/products/active/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 활성 제품 목록 조회
     * @description 워크스페이스의 활성 제품 목록을 조회합니다. 각 제품의 limit_oid_per_sysid 설정값도 함께 제공합니다.
     */
    get: operations['getActiveProducts'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/reports': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * PDF 리포트 목록 조회
     * @description 생성된 PDF 리포트 목록을 조회합니다. S3/MinIO에 저장된 PDF 파일 정보를 반환하며, 메타데이터가 있는 경우 함께 제공됩니다.
     */
    get: operations['getPaperReports'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/reports/download': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * PDF 리포트 다운로드
     * @description PDF 리포트 파일을 다운로드합니다. application/pdf 형식으로 바이너리 데이터가 반환됩니다.
     */
    get: operations['downloadPaperReport'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/executions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 보고서 실행 이력 조회
     * @description 보고서 실행 이력을 조회합니다. paperId로 특정 템플릿의 이력만 조회하거나, status로 상태별 필터링이 가능합니다. 최근 100건까지 조회됩니다.
     */
    get: operations['getPaperExecutions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/paper/{wsid}/detail': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 보고서 템플릿 상세 조회
     * @description 특정 보고서 템플릿의 상세 정보를 조회합니다. 템플릿 내용, 파라미터 설정, 타임존 등의 정보를 포함합니다.
     */
    get: operations['getPaperDetail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/workspace/{workspaceId}/policies': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 워크스페이스별 Role Policy 목록 조회
     * @description 특정 워크스페이스에 적용된 Role Policy 목록을 페이지네이션하여 조회합니다.
     */
    get: operations['getWorkspaceRolePolicies'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/workspace/{workspaceId}/permissions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 사용자의 워크스페이스 권한 조회
     * @description 현재 로그인한 사용자가 특정 워크스페이스에서 가지고 있는 모든 권한을 도메인별로 그룹화하여 조회합니다. 반환되는 권한은 사용자에게 할당된 역할(Role)에 포함된 권한(Permission)들의 집합입니다.
     */
    get: operations['getAccountWorkspacePermissions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/role/{roleId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 역할(Role) 상세 조회
     * @description 특정 역할의 상세 정보를 조회합니다.
     */
    get: operations['getRoleDetail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/role/list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 역할(Role) 목록 조회
     * @description Enterprise의 역할 목록을 페이지네이션하여 조회합니다.
     */
    get: operations['getRoleEnterpriseList'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/policy/{policyId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Role Policy 상세 조회
     * @description 특정 Role Policy의 상세 정보를 조회합니다. name, description, members, memberGroups, roles, workSpaces 정보가 포함됩니다.
     */
    get: operations['getRolePolicyDetail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/permissions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 사용자의 Enterprise 권한 조회
     * @description 현재 로그인한 사용자가 Enterprise 전체에서 가지고 있는 모든 권한을 도메인별로 그룹화하여 조회합니다. 반환되는 권한은 사용자에게 할당된 역할(Role)에 포함된 권한(Permission)들의 집합입니다.
     */
    get: operations['getAccountEnterprisePermissions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/permission/{pid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 권한(Permission) 조회
     * @description 특정 권한 정보를 조회합니다.
     */
    get: operations['getPermission'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/{enterpriseId}/permission/list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 권한(Permission) 목록 조회
     * @description Enterprise의 권한 목록을 페이지네이션하여 조회합니다.
     */
    get: operations['getAllPermissions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/regions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 워크스페이스 Region 목록 조회
     * @description 사용자 계정의 워크스페이스 Region 목록을 조회합니다.
     */
    get: operations['getWorkSpaceRegionList'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/enterprise/list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Enterprise 목록 조회
     * @description Enterprise 목록을 조회합니다.
     */
    get: operations['getEnterpriseList'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agents/services/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 서비스 목록 조회
     * @description 워크스페이스의 특정 제품 또는 모든 제품에서 활동 중인 에이전트들의 고유한 서비스 이름 목록을 조회합니다. 모든 리전을 순회하며 데이터를 수집하고 중복을 제거하여 알파벳순으로 정렬된 결과를 반환합니다. product 파라미터가 0이거나 생략된 경우 모든 제품의 서비스를 조회합니다.
     */
    get: operations['getServices'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agents/services/{wsid}/{serviceName}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Service 중심 에이전트 조회 (크로스 제품, 멀티 리전)
     * @description 특정 서비스의 에이전트를 모든 리전과 제품에서 조회하여 제품별로 그룹핑하여 반환합니다. HR 서비스가 Java, Python 등 여러 제품에 걸쳐 있는 마이크로서비스 구조에 적합합니다. 각 리전의 Gateway API를 통해 데이터를 수집하고 통합합니다. 기존 Product 중심 API 대비 API 호출 횟수를 크게 줄일 수 있습니다 (예: 5개 제품 조회 시 5번 → 1번).
     */
    get: operations['getAgentsByService'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agents/recent/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 최근 에이전트 목록 조회
     * @description 워크스페이스의 최근 에이전트 목록을 조회합니다. 활성/비활성 상태를 포함한 에이전트 정보를 제공하며, Service 필터를 지원합니다. Meta 데이터를 통해 제한값 초과 여부를 확인할 수 있습니다. 제품 카테고리 단위 조회도 지원합니다 (100=APM, 200=Infra, 300=Database).
     */
    get: operations['getRecentAgents'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agents/property/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 특정 에이전트 속성 값 조회
     * @description 모든 리전을 순회하며 에이전트의 특정 속성 키 값을 조회합니다.
     */
    get: operations['getAgentProperty'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agents/properties/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 에이전트 속성 조회
     * @description 모든 리전을 순회하며 에이전트의 전체 속성 정보를 조회합니다.
     */
    get: operations['getAgentProperties'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/ws/api/v1/agents/active/{wsid}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 활성 에이전트 목록 조회
     * @description 워크스페이스의 활성 에이전트 목록을 조회합니다. 모든 리전의 에이전트 정보를 통합하여 제공하며, Service 필터를 지원합니다. Meta 데이터를 통해 제한값 초과 여부를 확인할 수 있습니다. 제품 카테고리 단위 조회도 지원합니다 (100=APM, 200=Infra, 300=Database).
     */
    get: operations['getActiveAgents'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    WorkSpaceReq: {
      /** Format: int32 */
      wsid?: number;
      alias: string;
      name: string;
      description?: string;
      regionId?: string;
    };
    RestResponse: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: unknown;
      ok?: boolean;
    };
    EnterpriseDTO: {
      /** Format: int64 */
      eid?: number;
      alias?: string;
      name?: string;
      description?: string;
    };
    RestResponseWorkSpaceDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['WorkSpaceDTO'];
      ok?: boolean;
    };
    WorkSpaceDTO: {
      /** Format: int32 */
      wsid?: number;
      alias?: string;
      name?: string;
      description?: string;
      licenseKey?: string;
      enterprise?: components['schemas']['EnterpriseDTO'];
      gatewayName?: string;
    };
    YardApiParams: {
      type?: string;
      /** Format: int64 */
      pcode?: number;
      /** Format: int32 */
      okind?: number;
      oid?: string;
      path?: string;
      option?: string;
      params?: string;
      /** Format: int32 */
      hash?: number;
      authKey?: string;
      useCanary?: boolean;
      /** Format: int64 */
      ownerPcode?: number;
    };
    ProductSysid: {
      /** Format: int32 */
      product?: number;
      /** Format: int32 */
      sysid?: number;
      services?: string[];
    };
    SummaryRequest: {
      /** Format: int32 */
      wsid?: number;
      targets?: components['schemas']['ProductSysid'][];
    };
    /** @description MXQL 쿼리 실행 요청 */
    MxqlExecuteRequest: {
      /**
       * Format: int32
       * @description 워크스페이스 ID
       * @example 24958732
       */
      wsid: number;
      /** @description Product-Sysid-Services 조회 단위 배열 (null: 전체) */
      targets?: components['schemas']['ProductSysid'][];
      /**
       * Format: int64
       * @description 조회 시작 시간 (Unix timestamp ms)
       * @example 1759226700000
       */
      stime: number;
      /**
       * Format: int64
       * @description 조회 종료 시간 (Unix timestamp ms)
       * @example 1759227000000
       */
      etime: number;
      /**
       * @description MXQL 쿼리문
       * @example CATEGORY app_counter\nSELECT [oid, time, tps, tx_count]
       */
      mxql: string;
      /**
       * @description 주입할 변수 (INJECT 절에서 사용)
       * @example {
       *       "default": "true"
       *     }
       */
      inject?: {
        [key: string]: string;
      };
      /**
       * @description 쿼리 파라미터
       * @example {
       *       "oids": "123,124,125"
       *     }
       */
      param?: {
        [key: string]: string;
      };
      /**
       * Format: int32
       * @description 최대 조회 건수 (0: 무제한)
       * @default 0
       * @example 10000
       */
      limit: number;
    };
    AggregateRequest: {
      /** Format: int32 */
      wsid?: number;
      targets?: components['schemas']['ProductSysid'][];
      /** Format: int32 */
      oid?: number;
      /** Format: int64 */
      stime?: number;
      /** Format: int64 */
      etime?: number;
      /** Format: int32 */
      interval?: number;
    };
    YardApiParamsV2: {
      type?: string;
      /** Format: int64 */
      pcode?: number;
      oid?: string;
      path?: string;
      option?: string;
      params?: {
        [key: string]: unknown;
      };
      /** Format: int32 */
      hash?: number;
      authKey?: string;
      useCanary?: boolean;
      /** Format: int64 */
      ownerPcode?: number;
    };
    WorkspaceYardApiParamsV2: {
      /** Format: int32 */
      wsid?: number;
      type?: string;
      oid?: string;
      path?: string;
      option?: string;
      /** Format: int32 */
      hash?: number;
      authKey?: string;
      useCanary?: boolean;
      targets?: components['schemas']['ProductSysid'][];
      params?: {
        [key: string]: unknown;
      };
    };
    WorkspaceAggregateApiRequest: {
      /** Format: int32 */
      wsid?: number;
      targets?: components['schemas']['ProductSysid'][];
      type?: string;
      path?: string;
      option?: string;
      params?: {
        [key: string]: unknown;
      };
      /** Format: int32 */
      hash?: number;
      useCanary?: boolean;
      timeMerge?: string;
      objectMerge?: string;
      /** Format: int32 */
      hashValue?: number;
    };
    EnterpriseReq: {
      /** Format: int64 */
      eid?: number;
      alias?: string;
      name: string;
      description?: string;
    };
    WithEnterprise: {
      /** Format: int32 */
      wsid?: number;
      alias: string;
      name: string;
      description?: string;
      regionId?: string;
      enterprise?: components['schemas']['EnterpriseReq'];
    };
    SystemMaintPlanDeleteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      planId?: number;
    };
    RestResponseInteger: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      /** Format: int32 */
      data?: number;
      ok?: boolean;
    };
    SystemMaintPlanRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      product?: number;
      /** Format: int32 */
      sysid?: number;
      reason?: string;
      /** Format: int64 */
      startTime?: number;
      /** Format: int64 */
      endTime?: number;
    };
    AutoActionRuleRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleActionId?: number;
      /** Format: int64 */
      incidentRuleId?: number;
      triggerState?: string;
      actionType?: string;
      payload?: string;
      enabled?: boolean;
    };
    AutoActionRuleDeleteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleActionId?: number;
    };
    IncidentRuleRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
      ruleName?: string;
      /** Format: int32 */
      severity?: number;
      incidentType?: string;
      incidentCondition?: string;
      description?: string;
      enabled?: boolean;
    };
    IncidentStatusUpdateRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      incidentId?: number;
      status?: string;
      assignedTo?: string;
    };
    IncidentRecordRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
      /** Format: int64 */
      eventId?: number;
      incidentType?: string;
      title?: string;
      message?: string;
      summary?: string;
      relatedEventIds?: string;
      /** Format: int32 */
      severity?: number;
      assignedTo?: string;
    };
    IncidentActionRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      incidentId?: number;
      /** Format: int64 */
      incidentRuleId?: number;
      actorId?: string;
      actionType?: string;
      comment?: string;
      payload?: string;
    };
    EventRuleRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      product?: number;
      /** Format: int64 */
      ruleId?: number;
      ruleName?: string;
      targetSystemType?: string;
      targetSystemValue?: string;
      sourceDataType?: string;
      sourceCategory?: string;
      sourceQuery?: string;
      sourceQueryProps?: string;
      stateless?: boolean;
      /** Format: int32 */
      statelessSilentPeriod?: number;
      /** Format: int32 */
      statelessWarningPeriod?: number;
      /** Format: int32 */
      severity0?: number;
      /** Format: int32 */
      confirmCount0?: number;
      condition0?: string;
      /** Format: int32 */
      severity1?: number;
      /** Format: int32 */
      confirmCount1?: number;
      condition1?: string;
      /** Format: int32 */
      severity2?: number;
      /** Format: int32 */
      confirmCount2?: number;
      condition2?: string;
      /** Format: int32 */
      severity3?: number;
      /** Format: int32 */
      confirmCount3?: number;
      condition3?: string;
      /** Format: int32 */
      severity4?: number;
      /** Format: int32 */
      confirmCount4?: number;
      condition4?: string;
      /** Format: int32 */
      severity5?: number;
      /** Format: int32 */
      confirmCount5?: number;
      condition5?: string;
      alertTitle?: string;
      alertMessage?: string;
      enabled?: boolean;
    };
    EventRuleDeleteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
    };
    IncidentDeliveryRuleRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
      /** Format: int64 */
      incidentRuleId?: number;
      targetType?: string;
      targetId?: string;
      deliveryMedia?: string;
      enabled?: boolean;
    };
    IncidentDeliveryRuleDeleteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
    };
    EventDeliveryRuleRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      eventDeliveryRuleId?: number;
      /** Format: int64 */
      eventRuleId?: number;
      targetType?: string;
      targetId?: string;
      deliveryMedia?: string;
      enabled?: boolean;
    };
    EventDeliveryRuleDeleteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      eventDeliveryRuleId?: number;
    };
    SeriesRequest: {
      /** Format: int32 */
      wsid?: number;
      targets?: components['schemas']['ProductSysid'][];
      type?: string;
      /** Format: int64 */
      stime?: number;
      /** Format: int64 */
      etime?: number;
      /** Format: int32 */
      interval?: number;
      timeMerge?: string;
      objectMerge?: string;
      /** Format: int64 */
      timeout?: number;
      oids?: number[];
      okinds?: number[];
      onodes?: number[];
      /** Format: int64 */
      timeoutValue?: number;
      /** Format: int32 */
      intervalValue?: number;
      timeMergeValue?: string;
      objectMergeValue?: string;
    };
    ObjectSeries: {
      /** Format: int32 */
      oid?: number;
      oname?: string;
      initial?: string;
      series?: number[][];
      /** Format: double */
      lastSum?: number;
      /** Format: int32 */
      lastCount?: number;
    };
    RestResponseSeriesResponse: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['SeriesResponse'];
      ok?: boolean;
    };
    SeriesResponse: {
      /** Format: int32 */
      wsid?: number;
      targets?: components['schemas']['ProductSysid'][];
      type?: string;
      /** Format: int64 */
      stime?: number;
      /** Format: int64 */
      etime?: number;
      /** Format: int32 */
      interval?: number;
      timeMerge?: string;
      objectMerge?: string;
      /** Format: int64 */
      lastTime?: number;
      keys?: string[];
      objects?: components['schemas']['ObjectSeries'][];
      series?: number[][];
      /** Format: double */
      lastSum?: number;
      /** Format: int32 */
      lastCount?: number;
      oids?: number[];
      okinds?: number[];
      onodes?: number[];
      partialSuccess?: boolean;
      errors?: components['schemas']['TargetError'][];
      /** Format: int64 */
      queryTimeMs?: number;
      multiKeyType?: boolean;
      splitMode?: boolean;
    };
    TargetError: {
      target?: components['schemas']['ProductSysid'];
      errorCode?: string;
      errorMessage?: string;
      /** Format: int64 */
      timestamp?: number;
    };
    /** @description 보고서 생성 요청 데이터 */
    PaperCreateRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      product?: number;
      loginId?: string;
      paperName?: string;
      paperDesc?: string;
      /** Format: int32 */
      timezone?: number;
      template?: string;
      parameter?: string;
    };
    PaperMasterDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      product?: number;
      loginId?: string;
      /** Format: int64 */
      paperId?: number;
      paperName?: string;
      paperDesc?: string;
      /** Format: int32 */
      timezone?: number;
      template?: string;
      parameter?: string;
      /** Format: int64 */
      updatedAt?: number;
    };
    RestResponsePaperMasterDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PaperMasterDTO'];
      ok?: boolean;
    };
    /** @description 보고서 수정 요청 데이터 */
    PaperUpdateRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      paperId?: number;
      /** Format: int32 */
      product?: number;
      loginId?: string;
      paperName?: string;
      paperDesc?: string;
      /** Format: int32 */
      timezone?: number;
      template?: string;
      parameter?: string;
    };
    /** @description 리포트 삭제 요청 데이터 */
    PaperReportDeleteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      paperId?: number;
      reportId?: string;
    };
    RestResponsePaperReportDeleteRequest: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PaperReportDeleteRequest'];
      ok?: boolean;
    };
    /** @description 보고서 실행 요청 데이터 */
    PaperExecuteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      paperId?: number;
      paperName?: string;
      parameters?: string;
    };
    PaperExecutionDTO: {
      /** Format: int64 */
      id?: number;
      paperName?: string;
      /** Format: int64 */
      paperId?: number;
      /** Format: int32 */
      wsid?: number;
      parameters?: string;
      status?: string;
      /** Format: int64 */
      scheduledAt?: number;
      /** Format: int64 */
      startedAt?: number;
      /** Format: int64 */
      finishedAt?: number;
      resultMessage?: string;
    };
    RestResponsePaperExecutionDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PaperExecutionDTO'];
      ok?: boolean;
    };
    /** @description 보고서 삭제 요청 데이터 */
    PaperDeleteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      paperId?: number;
    };
    RestResponsePaperDeleteRequest: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PaperDeleteRequest'];
      ok?: boolean;
    };
    PackExecuteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      platform?: number;
      /** Format: int32 */
      sysid?: number;
      sysidOidMap?: {
        [key: string]: number[];
      };
      /** Format: int64 */
      stime?: number;
      /** Format: int64 */
      etime?: number;
      packType?: string;
      options?: {
        [key: string]: string;
      };
      /** Format: int64 */
      timeout?: number;
      /** Format: int32 */
      limit?: number;
    };
    PackExecuteResponse: {
      data?: {
        [key: string]: unknown;
      }[];
    };
    RestResponsePackExecuteResponse: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PackExecuteResponse'];
      ok?: boolean;
    };
    OverviewRequest: {
      /** Format: int32 */
      wsid?: number;
      targets?: components['schemas']['ProductSysid'][];
      /** Format: int64 */
      timeout?: number;
      /** Format: int64 */
      timeoutValue?: number;
    };
    MetricWithComparison: {
      /** Format: double */
      current?: number;
      /** Format: double */
      yesterday?: number;
      /** Format: double */
      lastWeek?: number;
      /** Format: double */
      lastMonth?: number;
      /** Format: double */
      deltaDay?: number;
      /** Format: double */
      deltaWeek?: number;
      /** Format: double */
      deltaMonth?: number;
    };
    OverviewResponse: {
      /** Format: int32 */
      wsid?: number;
      targets?: components['schemas']['ProductSysid'][];
      cpu?: components['schemas']['MetricWithComparison'];
      memory?: components['schemas']['MetricWithComparison'];
      users?: components['schemas']['MetricWithComparison'];
      /** Format: int64 */
      queryTimeMs?: number;
      partialSuccess?: boolean;
      errors?: string[];
    };
    /** @description Overview API 응답 */
    OverviewResponseWrapper: {
      /**
       * @description 응답 상태
       * @example success
       */
      status?: string;
      /** @description Overview 데이터 */
      data?: components['schemas']['OverviewResponse'];
    };
    RestResponseEnterpriseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EnterpriseDTO'];
      ok?: boolean;
    };
    EntRoleReq: {
      roleId: string;
      name: string;
      description?: string;
    };
    EntPermissionDTO: {
      pid?: string;
      name: string;
      description: string;
      custom?: boolean;
      domain: string;
      actions: string[];
      resources: string[];
    };
    EntPermissionsDTO: {
      permissions?: {
        [key: string]: components['schemas']['EntPermissionDTO'][];
      };
    };
    RestResponseWithPermissions: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['WithPermissions'];
      ok?: boolean;
    };
    WithPermissions: {
      rid?: string;
      name?: string;
      description?: string;
      custom?: boolean;
      permissions?: components['schemas']['EntPermissionsDTO'];
    };
    EntRoleDTO: {
      rid?: string;
      name?: string;
      description?: string;
      custom?: boolean;
    };
    RestResponseEntRoleDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EntRoleDTO'];
      ok?: boolean;
    };
    Permissions: {
      permissions: string[];
    };
    Remove: {
      wtids?: string[];
    };
    EntMemberDTO: {
      memberId?: string;
      activated?: boolean;
      /** Format: date-time */
      createdTime?: string;
      wtid?: string;
      email?: string;
      name?: string;
      name2?: string;
      company?: string;
      description?: string;
      status?: string;
      lastLogin?: components['schemas']['LastLogin'];
    };
    LastLogin: {
      /** Format: int32 */
      value?: number;
      unit?: string;
    };
    RestResponseListEntMemberDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EntMemberDTO'][];
      ok?: boolean;
    };
    Create: {
      name: string;
      description?: string;
      principals: components['schemas']['PrincipalInfo'][];
      roleIds: string[];
      workspaces?: string[];
    };
    PrincipalInfo: {
      type: string;
      id: string;
    };
    EntPolicyDTO: {
      policyId?: string;
      name?: string;
      description?: string;
    };
    RestResponseEntPolicyDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EntPolicyDTO'];
      ok?: boolean;
    };
    Update: {
      name?: string;
      description?: string;
      principals?: components['schemas']['PrincipalInfo'][];
      roleIds?: string[];
      workspaces?: string[];
    };
    Search: {
      text?: string;
    };
    PageResponseSummary: {
      content?: components['schemas']['Summary'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    Summary: {
      policyId?: string;
      name?: string;
      description?: string;
      /** Format: int32 */
      memberCount?: number;
    };
    EntPermissionReq: {
      pid: string;
      name: string;
      domain: string;
      description?: string;
      actions: string[];
      resources?: string[];
    };
    RestResponseEntPermissionDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EntPermissionDTO'];
      ok?: boolean;
    };
    RestResponseVoid: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: unknown;
      ok?: boolean;
    };
    Add: {
      wtids?: string[];
    };
    Status: {
      memberId?: string;
      activated?: boolean;
    };
    RestResponseEntMemberDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EntMemberDTO'];
      ok?: boolean;
    };
    EntMemberPolicy: {
      member?: components['schemas']['EntMemberDTO'];
      roles?: components['schemas']['EntRoleDTO'][];
    };
    PageResponseEntMemberPolicy: {
      content?: components['schemas']['EntMemberPolicy'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    Find: {
      email?: string;
    };
    DmxqlRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      product?: number;
      service?: string;
      /** Format: int64 */
      stime?: number;
      /** Format: int64 */
      etime?: number;
      mxql?: string;
      param?: {
        [key: string]: string;
      };
      /** Format: int32 */
      limit?: number;
      /** Format: int64 */
      timeout?: number;
    };
    DmxqlResponse: {
      rows?: {
        [key: string]: unknown;
      }[];
      /** Format: int32 */
      totalCount?: number;
      /** Format: int64 */
      executionTime?: number;
    };
    RestResponseDmxqlResponse: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['DmxqlResponse'];
      ok?: boolean;
    };
    /** @description Workspace 에이전트 목록 조회 요청 */
    WorkspaceAgentListRequest: {
      /**
       * Format: int32
       * @description Workspace ID
       * @example 71126763
       */
      wsid: number;
      targets?: components['schemas']['ProductSysid'][];
    };
    AgentExecuteRequest: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      platform?: number;
      /** Format: int32 */
      sysid?: number;
      sysidOidMap?: {
        [key: string]: number[];
      };
      action?: string;
      options?: {
        [key: string]: string;
      };
      /** Format: int64 */
      timeout?: number;
      /** Format: int32 */
      limit?: number;
    };
    AgentExecuteResponse: {
      data?: {
        [key: string]: unknown;
      }[];
    };
    RestResponseAgentExecuteResponse: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['AgentExecuteResponse'];
      ok?: boolean;
    };
    RestResponseListWorkSpaceDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['WorkSpaceDTO'][];
      ok?: boolean;
    };
    PageResponseSystemMaintPlanDTO: {
      content?: components['schemas']['SystemMaintPlanDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    RestResponsePageResponseSystemMaintPlanDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PageResponseSystemMaintPlanDTO'];
      ok?: boolean;
    };
    SystemMaintPlanDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      planId?: number;
      /** Format: int32 */
      product?: number;
      /** Format: int32 */
      sysid?: number;
      reason?: string;
      /** Format: int64 */
      startTime?: number;
      /** Format: int64 */
      endTime?: number;
      /** Format: int64 */
      createdAt?: number;
    };
    EventDeliveryBlockConfigDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      blockId?: number;
      /** Format: int32 */
      blockProduct?: number;
      /** Format: int32 */
      blockSysid?: number;
      /** Format: int32 */
      blockOid?: number;
      /** Format: int64 */
      blockStart?: number;
      /** Format: int64 */
      blockEnd?: number;
      reason?: string;
      enabled?: boolean;
      /** Format: int64 */
      createdAt?: number;
    };
    RestResponseListEventDeliveryBlockConfigDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EventDeliveryBlockConfigDTO'][];
      ok?: boolean;
    };
    RestResponseBoolean: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: boolean;
      ok?: boolean;
    };
    IncidentAutoActionRuleDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleActionId?: number;
      /** Format: int64 */
      incidentRuleId?: number;
      triggerState?: string;
      actionType?: string;
      payload?: string;
      enabled?: boolean;
    };
    RestResponseListIncidentAutoActionRuleDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['IncidentAutoActionRuleDTO'][];
      ok?: boolean;
    };
    IncidentAutoActionResultDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      resultId?: number;
      /** Format: int64 */
      incidentId?: number;
      /** Format: int64 */
      autoActionId?: number;
      /** Format: int64 */
      executedAt?: number;
      success?: boolean;
      errorMessage?: string;
      resultPayload?: string;
      /** Format: int64 */
      updatedAt?: number;
    };
    RestResponseListIncidentAutoActionResultDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['IncidentAutoActionResultDTO'][];
      ok?: boolean;
    };
    IncidentRuleDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
      ruleName?: string;
      /** Format: int32 */
      severity?: number;
      incidentType?: string;
      incidentCondition?: string;
      description?: string;
      enabled?: boolean;
      /** Format: int64 */
      createdAt?: number;
    };
    PageResponseIncidentRuleDTO: {
      content?: components['schemas']['IncidentRuleDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    RestResponsePageResponseIncidentRuleDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PageResponseIncidentRuleDTO'];
      ok?: boolean;
    };
    IncidentRecordDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      incidentId?: number;
      /** Format: int64 */
      ruleId?: number;
      /** Format: int64 */
      eventId?: number;
      /** Format: int64 */
      incidentTime?: number;
      incidentType?: string;
      title?: string;
      message?: string;
      summary?: string;
      relatedEventIds?: string;
      /** Format: int32 */
      severity?: number;
      status?: string;
      incidentStatus?: string;
      assignedTo?: string;
      /** Format: int64 */
      acknowledgedAt?: number;
      /** Format: int64 */
      resolvedAt?: number;
      /** Format: int64 */
      updatedAt?: number;
      /** Format: int64 */
      createdAt?: number;
    };
    PageResponseIncidentRecordDTO: {
      content?: components['schemas']['IncidentRecordDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    RestResponsePageResponseIncidentRecordDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PageResponseIncidentRecordDTO'];
      ok?: boolean;
    };
    IncidentActionDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      actionId?: number;
      /** Format: int64 */
      incidentId?: number;
      /** Format: int64 */
      incidentRuleId?: number;
      actorId?: string;
      /** Format: int64 */
      actionTime?: number;
      actionType?: string;
      comment?: string;
      payload?: string;
      /** Format: int32 */
      deliveryChecked?: number;
      deliveryMessage?: string;
      /** Format: int64 */
      updatedAt?: number;
    };
    RestResponseListIncidentActionDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['IncidentActionDTO'][];
      ok?: boolean;
    };
    EventStateDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
      /** Format: int32 */
      product?: number;
      /** Format: int32 */
      sysid?: number;
      /** Format: int32 */
      oid?: number;
      /** Format: int32 */
      severity?: number;
      /** Format: int64 */
      changedAt?: number;
      /** Format: int32 */
      changeCount?: number;
      oscillating?: boolean;
      /** Format: int64 */
      expireAt?: number;
      stateless?: boolean;
    };
    PageResponseEventStateDTO: {
      content?: components['schemas']['EventStateDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    RestResponsePageResponseEventStateDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PageResponseEventStateDTO'];
      ok?: boolean;
    };
    RestResponseListEventStateDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EventStateDTO'][];
      ok?: boolean;
    };
    EventRuleDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      product?: number;
      /** Format: int64 */
      ruleId?: number;
      ruleName?: string;
      targetSystemType?: string;
      targetSystemValue?: string;
      sourceDataType?: string;
      sourceCategory?: string;
      sourceQuery?: string;
      sourceQueryProps?: string;
      stateless?: boolean;
      /** Format: int32 */
      statelessSilentPeriod?: number;
      /** Format: int32 */
      statelessWarningPeriod?: number;
      /** Format: int32 */
      severity0?: number;
      /** Format: int32 */
      confirmCount0?: number;
      condition0?: string;
      /** Format: int32 */
      severity1?: number;
      /** Format: int32 */
      confirmCount1?: number;
      condition1?: string;
      /** Format: int32 */
      severity2?: number;
      /** Format: int32 */
      confirmCount2?: number;
      condition2?: string;
      /** Format: int32 */
      severity3?: number;
      /** Format: int32 */
      confirmCount3?: number;
      condition3?: string;
      /** Format: int32 */
      severity4?: number;
      /** Format: int32 */
      confirmCount4?: number;
      condition4?: string;
      /** Format: int32 */
      severity5?: number;
      /** Format: int32 */
      confirmCount5?: number;
      condition5?: string;
      alertTitle?: string;
      alertMessage?: string;
      enabled?: boolean;
      /** Format: int64 */
      createdAt?: number;
      /** Format: int64 */
      modifiedAt?: number;
    };
    PageResponseEventRuleDTO: {
      content?: components['schemas']['EventRuleDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    RestResponsePageResponseEventRuleDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PageResponseEventRuleDTO'];
      ok?: boolean;
    };
    EventHistoryDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int32 */
      product?: number;
      /** Format: int32 */
      sysid?: number;
      /** Format: int32 */
      oid?: number;
      /** Format: int64 */
      ruleId?: number;
      /** Format: int64 */
      eventId?: number;
      /** Format: int64 */
      eventTime?: number;
      /** Format: int32 */
      severity?: number;
      alertTitle?: string;
      alertMessage?: string;
      payload?: string;
      /** Format: int32 */
      deliveryChecked?: number;
      deliveryMessage?: string;
      /** Format: int32 */
      incidentChecked?: number;
      /** Format: int64 */
      updatedAt?: number;
    };
    PageResponseEventHistoryDTO: {
      content?: components['schemas']['EventHistoryDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    RestResponsePageResponseEventHistoryDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PageResponseEventHistoryDTO'];
      ok?: boolean;
    };
    RestResponseListMapStringObject: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: {
        [key: string]: unknown;
      }[];
      ok?: boolean;
    };
    IncidentDeliveryRuleDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      ruleId?: number;
      /** Format: int64 */
      incidentRuleId?: number;
      targetType?: string;
      targetId?: string;
      deliveryMedia?: string;
      enabled?: boolean;
      /** Format: int64 */
      createdAt?: number;
    };
    RestResponseListIncidentDeliveryRuleDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['IncidentDeliveryRuleDTO'][];
      ok?: boolean;
    };
    IncidentDeliveryHistoryDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      deliveryId?: number;
      /** Format: int64 */
      incidentId?: number;
      targetType?: string;
      targetId?: string;
      deliveryMedia?: string;
      status?: string;
      /** Format: int64 */
      sentAt?: number;
      payload?: string;
      /** Format: int64 */
      updatedAt?: number;
    };
    RestResponseListIncidentDeliveryHistoryDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['IncidentDeliveryHistoryDTO'][];
      ok?: boolean;
    };
    EventDeliveryRuleDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      eventDeliveryRuleId?: number;
      /** Format: int64 */
      eventRuleId?: number;
      targetType?: string;
      targetId?: string;
      deliveryMedia?: string;
      enabled?: boolean;
      /** Format: int64 */
      createdAt?: number;
    };
    RestResponseListEventDeliveryRuleDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EventDeliveryRuleDTO'][];
      ok?: boolean;
    };
    EventDeliveryHistoryDTO: {
      /** Format: int32 */
      wsid?: number;
      /** Format: int64 */
      deliveryId?: number;
      /** Format: int64 */
      eventHistoryId?: number;
      /** Format: int32 */
      severity?: number;
      targetType?: string;
      targetId?: string;
      deliveryMedia?: string;
      /** Format: int64 */
      sentAt?: number;
      status?: string;
      errorMessage?: string;
      /** Format: int32 */
      retryCount?: number;
      /** Format: int64 */
      updatedAt?: number;
    };
    RestResponseListEventDeliveryHistoryDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EventDeliveryHistoryDTO'][];
      ok?: boolean;
    };
    /** @description 제품 카테고리 정보 */
    CategoryInfo: {
      /**
       * @description 카테고리 이름
       * @example APM
       */
      name?: string;
      /**
       * Format: int32
       * @description 코드 베이스 (100번대 단위)
       * @example 100
       */
      codeBase?: number;
      /**
       * Format: int32
       * @description 코드 범위 시작
       * @example 101
       */
      codeRangeStart?: number;
      /**
       * Format: int32
       * @description 코드 범위 종료
       * @example 199
       */
      codeRangeEnd?: number;
    };
    /** @description 제품 타입 정보 */
    ProductInfo: {
      /**
       * Format: int32
       * @description 제품 코드
       * @example 101
       */
      code?: number;
      /**
       * @description 제품 이름
       * @example java
       */
      name?: string;
      /**
       * @description 제품 카테고리
       * @example APM
       */
      category?: string;
    };
    /** @description 제품 목록 응답 */
    ProductTypesResponseDTO: {
      /** @description 카테고리 정보 목록 (코드 범위 포함) */
      categoryInfo?: components['schemas']['CategoryInfo'][];
      /** @description 카테고리별 제품 목록 */
      categories?: {
        [key: string]: components['schemas']['ProductInfo'][];
      };
      /** @description 전체 제품 목록 */
      all?: components['schemas']['ProductInfo'][];
    };
    RestResponseProductTypesResponseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['ProductTypesResponseDTO'];
      ok?: boolean;
    };
    /** @description 최근 제품 목록 응답 */
    RecentProductResponseDTO: {
      /** @description 최근 제품 정보 목록 */
      products?: components['schemas']['ProductInfo'][];
    };
    RestResponseRecentProductResponseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['RecentProductResponseDTO'];
      ok?: boolean;
    };
    /** @description 제품 설정값 조회 응답 */
    ProductConfigResponseDTO: {
      /**
       * Format: int32
       * @description 워크스페이스 ID
       * @example 71126763
       */
      wsid?: number;
      /**
       * Format: int32
       * @description 제품 ID (0: 전체 제품 기본값)
       * @example 101
       */
      product?: number;
      /**
       * @description 설정 키
       * @example limit_oid_per_sysid
       */
      key?: string;
      /**
       * @description 설정 값
       * @example 100
       */
      value?: string;
    };
    RestResponseProductConfigResponseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['ProductConfigResponseDTO'];
      ok?: boolean;
    };
    /** @description 활성 제품 목록 응답 */
    ActiveProductResponseDTO: {
      /** @description 활성 제품 정보 목록 */
      products?: components['schemas']['ProductInfo'][];
    };
    RestResponseActiveProductResponseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['ActiveProductResponseDTO'];
      ok?: boolean;
    };
    RestResponseListPaperMasterDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PaperMasterDTO'][];
      ok?: boolean;
    };
    PaperReportDTO: {
      reportId?: string;
      objectKey?: string;
      filename?: string;
      metadata?: string;
    };
    RestResponseListPaperReportDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PaperReportDTO'][];
      ok?: boolean;
    };
    RestResponseListPaperExecutionDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['PaperExecutionDTO'][];
      ok?: boolean;
    };
    RestResponseEntPermissionsDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EntPermissionsDTO'];
      ok?: boolean;
    };
    PageResponseEntRoleDTO: {
      content?: components['schemas']['EntRoleDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    Detail: {
      policyId?: string;
      name?: string;
      description?: string;
      members?: components['schemas']['EntMemberDTO'][];
      memberGroups?: components['schemas']['EntMemberGroupDTO'][];
      roles?: components['schemas']['EntRoleDTO'][];
      workSpaces?: components['schemas']['WorkSpaceDTO'][];
    };
    EntMemberGroupDTO: {
      groupId?: string;
      name?: string;
      description?: string;
      activated?: boolean;
    };
    RestResponseDetail: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['Detail'];
      ok?: boolean;
    };
    PageResponseEntPermissionDTO: {
      content?: components['schemas']['EntPermissionDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    PageResponseEntMemberDTO: {
      content?: components['schemas']['EntMemberDTO'][];
      /** Format: int64 */
      total?: number;
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    RestResponseListWSRegionDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['WSRegionDTO'][];
      ok?: boolean;
    };
    WSRegionDTO: {
      regionId?: string;
      gatewayName?: string;
      dataAddress?: string;
      dataPort?: string;
      webPort?: string;
      csp?: string;
      geo?: string;
    };
    RestResponseListEnterpriseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['EnterpriseDTO'][];
      ok?: boolean;
    };
    /** @description 에이전트 목록 메타 데이터 */
    AgentListMetaData: {
      /**
       * Format: int32
       * @description 제품별 최대 조회 개수 (limit_oid_per_sysid)
       * @example 300
       */
      limit?: number;
      /**
       * Format: int32
       * @description 필터 적용 전 전체 개수
       * @example 500
       */
      total?: number;
      /**
       * Format: int32
       * @description 응답에 포함된 개수
       * @example 300
       */
      returned?: number;
      /**
       * @description 제한 초과 여부
       * @example true
       */
      exceeded?: boolean;
      /**
       * Format: int32
       * @description 초과된 개수 (total - limit)
       * @example 200
       */
      exceedCount?: number;
    };
    /** @description 최근 에이전트 정보 */
    RecentAgentDTO: {
      /**
       * Format: int32
       * @description 워크스페이스 ID
       * @example 24958732
       */
      wsid?: number;
      /**
       * Format: int32
       * @description 시스템 ID
       * @example 2
       */
      sysid?: number;
      /**
       * @description 활성 상태
       * @example true
       */
      active?: boolean;
      /**
       * Format: int32
       * @description 에이전트 OID
       * @example -1264536642
       */
      oid?: number;
      /**
       * Format: int32
       * @description 제품 ID
       * @example 101
       */
      product?: number;
      /**
       * @description 서비스명
       * @example API
       */
      service?: string;
      /**
       * @description 에이전트명
       * @example web-server-01
       */
      oname?: string;
      /**
       * @description 노드명
       * @example node-01
       */
      onode?: string;
    };
    /** @description 최근 에이전트 목록 응답 */
    RecentAgentResponseDTO: {
      /** @description 최근 에이전트 목록 */
      recentAgents?: components['schemas']['RecentAgentDTO'][];
      /** @description 에이전트 목록 메타 데이터 */
      meta?: components['schemas']['AgentListMetaData'];
    };
    RestResponseRecentAgentResponseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['RecentAgentResponseDTO'];
      ok?: boolean;
    };
    RestResponseMapStringObject: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: {
        [key: string]: unknown;
      };
      ok?: boolean;
    };
    /** @description 활성 에이전트 정보 */
    ActiveAgentDTO: {
      /**
       * Format: int32
       * @description 워크스페이스 ID
       * @example 24958732
       */
      wsid?: number;
      /**
       * Format: int32
       * @description 시스템 ID
       * @example 1
       */
      sysid?: number;
      /**
       * Format: int32
       * @description 에이전트 OID
       * @example -1264536642
       */
      oid?: number;
      /**
       * Format: int32
       * @description 제품 ID
       * @example 101
       */
      product?: number;
    };
    /** @description 활성 에이전트 목록 응답 */
    ActiveAgentResponseDTO: {
      /** @description 활성 에이전트 목록 */
      activeAgents?: components['schemas']['ActiveAgentDTO'][];
      /** @description 에이전트 목록 메타 데이터 */
      meta?: components['schemas']['AgentListMetaData'];
    };
    RestResponseActiveAgentResponseDTO: {
      msg?: string;
      /** Format: int32 */
      code?: number;
      data?: components['schemas']['ActiveAgentResponseDTO'];
      ok?: boolean;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  getWorkspace: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterprise: string;
        /** @description Workspace ID */
        workspaceId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWorkSpaceDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateWorkspace: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterprise: string;
        /** @description Workspace ID */
        workspaceId: string;
      };
      cookie?: never;
    };
    /** @description 워크스페이스 수정 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['WorkSpaceReq'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWorkSpaceDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createWorkspace: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterprise: string;
      };
      cookie?: never;
    };
    /** @description 워크스페이스 생성(추가) 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['WorkSpaceReq'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWorkSpaceDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  yardApi: {
    parameters: {
      query: {
        params: components['schemas']['YardApiParams'];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': string;
        };
      };
    };
  };
  yardPostApi: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['YardApiParams'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': string;
        };
      };
    };
  };
  requestSummaryAggregate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Summary 집계 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['SummaryRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  requestMxqlRaw: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description MXQL Raw 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['MxqlExecuteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': unknown;
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  requestMxqlAggregate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description MXQL 집계 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['MxqlExecuteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': unknown;
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  requestHitmapAggregate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Hitmap 집계 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['AggregateRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  yardApiFlushGet: {
    parameters: {
      query: {
        params: components['schemas']['YardApiParams'];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  yardApiFlushPost: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['YardApiParamsV2'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  yardDeleteApi: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['YardApiParams'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': string;
        };
      };
    };
  };
  requestFlush: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Yard API Flush 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['WorkspaceYardApiParamsV2'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  requestAggregate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Multi-Product/Sysid/Services 집계 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['WorkspaceAggregateApiRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createWorkspaceAndEnterprise: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description 워크스페이스 및 Enterprise 생성 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['WithEnterprise'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWorkSpaceDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deleteMaintenancePlan: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['SystemMaintPlanDeleteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createMaintenancePlan: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['SystemMaintPlanRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateAutoActionRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AutoActionRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deleteAutoActionRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AutoActionRuleDeleteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createAutoActionRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AutoActionRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateIncidentRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deleteIncidentRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createIncidentRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateIncidentStatus: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentStatusUpdateRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createIncidentRecord: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentRecordRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createIncidentAction: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentActionRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateEventRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EventRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deleteEventRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EventRuleDeleteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createEventRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EventRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateIncidentDeliveryRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentDeliveryRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deleteIncidentDeliveryRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentDeliveryRuleDeleteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createIncidentDeliveryRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['IncidentDeliveryRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateEventDeliveryRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EventDeliveryRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deleteEventDeliveryRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EventDeliveryRuleDeleteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createEventDeliveryRule: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EventDeliveryRuleRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseInteger'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getSeries: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['SeriesRequest'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['RestResponseSeriesResponse'];
        };
      };
    };
  };
  getPaperList: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListPaperMasterDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createPaper: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PaperCreateRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePaperMasterDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updatePaper: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PaperUpdateRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePaperMasterDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deletePaperReport: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PaperReportDeleteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePaperReportDeleteRequest'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  executePaper: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PaperExecuteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePaperExecutionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deletePaper: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PaperDeleteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePaperDeleteRequest'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  executePack: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Pack 실행 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['PackExecuteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['RestResponsePackExecuteResponse'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getOverview: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Overview 조회 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['OverviewRequest'];
      };
    };
    responses: {
      /** @description 조회 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['OverviewResponseWrapper'];
        };
      };
      /** @description 잘못된 요청 (targets 누락 등) */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "status": "error",
           *       "message": "targets is required",
           *       "code": 400
           *     }
           */
          'application/json': unknown;
        };
      };
      /** @description 인증 실패 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "status": "error",
           *       "message": "Unauthorized",
           *       "code": 401
           *     }
           */
          'application/json': unknown;
        };
      };
      /** @description Gateway 연결 실패 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "status": "error",
           *       "message": "Gateway unavailable",
           *       "code": 503
           *     }
           */
          'application/json': unknown;
        };
      };
    };
  };
  getEnterprise: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterprise: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEnterpriseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateEnterprise: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterprise: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EnterpriseReq'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEnterpriseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createEnterpriseRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 역할 생성 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['EntRoleReq'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWithPermissions'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateEnterpriseRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Role ID */
        roleId: string;
      };
      cookie?: never;
    };
    /** @description 역할 수정 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['EntRoleReq'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntRoleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deleteEnterpriseRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Role ID */
        roleId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntRoleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  removePermissionsFromRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Role ID */
        roleId: string;
      };
      cookie?: never;
    };
    /** @description 제거할 권한 ID 목록 */
    requestBody: {
      content: {
        'application/json': components['schemas']['Permissions'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWithPermissions'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  addPermissionsToRole: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Role ID */
        roleId: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['Permissions'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWithPermissions'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  removeEnterpriseMembers: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 멤버 제거 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['Remove'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListEntMemberDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createRolePolicy: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description Role Policy 생성 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['Create'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPolicyDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updateRolePolicy: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Policy ID */
        policyId: string;
      };
      cookie?: never;
    };
    /** @description Role Policy 수정 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['Update'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPolicyDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  revokeRolePolicy: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Policy ID */
        policyId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPolicyDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAllRolePolicies: {
    parameters: {
      query?: {
        /**
         * @description 페이지 번호 (1부터 시작)
         * @example 1
         */
        page?: number;
        /**
         * @description 페이지 크기
         * @example 20
         */
        Size?: number;
      };
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 검색 조건 (workspaces 필터 등) */
    requestBody: {
      content: {
        'application/json': components['schemas']['Search'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PageResponseSummary'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createPermission: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 권한 생성 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['EntPermissionReq'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPermissionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  updatePermission: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Permission ID */
        pid: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EntPermissionDTO'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPermissionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  deletePermission: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Permission ID */
        pid: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseVoid'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEnterpriseMembers: {
    parameters: {
      query?: {
        /**
         * @description 페이지 번호 (1부터 시작)
         * @example 1
         */
        page?: number;
        /**
         * @description 페이지 크기
         * @example 20
         */
        Size?: number;
      };
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PageResponseEntMemberDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  addEnterpriseMembers: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 멤버 추가 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['Add'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListEntMemberDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  changeEnterpriseMemberStatus: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 멤버 상태 변경 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['Status'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntMemberDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAllRolePoliciesWithDetail: {
    parameters: {
      query?: {
        /**
         * @description 페이지 번호 (1부터 시작)
         * @example 1
         */
        page?: number;
        /**
         * @description 페이지 크기
         * @example 20
         */
        Size?: number;
        /**
         * @description 정렬 기준 (기본값: createdTime,desc)
         * @example createdTime,desc
         */
        'Sort by'?: string;
      };
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 검색 조건 (멤버 이메일 또는 이름 검색) */
    requestBody: {
      content: {
        'application/json': components['schemas']['Search'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PageResponseEntMemberPolicy'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  changeEnterpriseMemberStatus_1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    /** @description 초대 대상자 정보 확인 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['Find'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  createEnterprise: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Enterprise 생성 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['EnterpriseReq'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEnterpriseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  execute: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DmxqlRequest'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['RestResponseDmxqlResponse'];
        };
      };
    };
  };
  getRecentAgentsByTargets: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description 조회 대상 정보 */
    requestBody: {
      content: {
        'application/json': components['schemas']['WorkspaceAgentListRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': unknown;
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  executeAgent: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Agent 실행 요청 */
    requestBody: {
      content: {
        'application/json': components['schemas']['AgentExecuteRequest'];
      };
    };
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['RestResponseAgentExecuteResponse'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getWorkspaceList: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterprise: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListWorkSpaceDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getMaintenancePlans: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 페이지 번호 (0부터 시작) */
        page?: number;
        /** @description 페이지 크기 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePageResponseSystemMaintPlanDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getActiveBlockList: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListEventDeliveryBlockConfigDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  checkBlocked: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 대상 타입 */
        targetType: string;
        /** @description 대상 ID */
        targetId: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseBoolean'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAutoActionRules: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Incident Rule ID */
        incidentRuleId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListIncidentAutoActionRuleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAutoActionResults: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Incident ID */
        incidentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListIncidentAutoActionResultDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getIncidentRules: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 페이지 번호 (0부터 시작) */
        page?: number;
        /** @description 페이지 크기 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePageResponseIncidentRuleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getIncidentRecords: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 페이지 번호 (0부터 시작) */
        page?: number;
        /** @description 페이지 크기 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePageResponseIncidentRecordDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getIncidentActions: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Incident ID */
        incidentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListIncidentActionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEventStates: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 페이지 번호 (0부터 시작) */
        page?: number;
        /** @description 페이지 크기 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePageResponseEventStateDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEventStatesByRule: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Rule ID */
        ruleId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListEventStateDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEventRules: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 페이지 번호 (0부터 시작) */
        page?: number;
        /** @description 페이지 크기 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePageResponseEventRuleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEventHistory: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 페이지 번호 (0부터 시작) */
        page?: number;
        /** @description 페이지 크기 */
        size?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePageResponseEventHistoryDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEventHistoryCount: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description 시작 시간 (epoch ms) */
        stime: number;
        /** @description 종료 시간 (epoch ms) */
        etime: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListMapStringObject'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getIncidentDeliveryRules: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Incident Rule ID */
        incidentRuleId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListIncidentDeliveryRuleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getIncidentDeliveryHistory: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Incident ID */
        incidentId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListIncidentDeliveryHistoryDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEventDeliveryRules: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Event Rule ID */
        eventRuleId: number;
        /** @description 활성화된 규칙만 조회 */
        enabledOnly?: boolean;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListEventDeliveryRuleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEventDeliveryHistory: {
    parameters: {
      query: {
        /** @description Workspace ID */
        wsid: number;
        /** @description Event History ID */
        eventHistoryId: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListEventDeliveryHistoryDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getProductTypes: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseProductTypesResponseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getRecentProducts: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseRecentProductResponseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getProductConfig: {
    parameters: {
      query: {
        /** @description 워크스페이스 ID */
        wsid: number;
        /** @description 제품 ID (0: 전체 제품 기본값) */
        product: number;
        /** @description 설정 키 */
        key: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseProductConfigResponseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getActiveProducts: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseActiveProductResponseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getPaperReports: {
    parameters: {
      query: {
        /** @description 보고서 템플릿 ID */
        paperId: number;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListPaperReportDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  downloadPaperReport: {
    parameters: {
      query: {
        /** @description 보고서 템플릿 ID */
        paperId: number;
        /** @description 리포트 ID (hex 형식) */
        reportId: string;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/pdf': unknown;
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 리포트를 찾을 수 없음 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': string;
        };
      };
    };
  };
  getPaperExecutions: {
    parameters: {
      query?: {
        /** @description 보고서 템플릿 ID (선택, 미지정 시 전체) */
        paperId?: number;
        /** @description 상태 필터 (선택: WAITING, RUNNING, SUCCESS, FAILED) */
        status?: string;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListPaperExecutionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getPaperDetail: {
    parameters: {
      query: {
        /** @description 보고서 템플릿 ID */
        paperId: number;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponsePaperMasterDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getWorkspaceRolePolicies: {
    parameters: {
      query?: {
        /**
         * @description 페이지 번호 (1부터 시작)
         * @example 1
         */
        page?: number;
        /**
         * @description 페이지 크기
         * @example 20
         */
        Size?: number;
      };
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description 워크스페이스 ID */
        workspaceId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PageResponseSummary'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAccountWorkspacePermissions: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Workspace ID */
        workspaceId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPermissionsDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getRoleDetail: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Role ID */
        roleId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseWithPermissions'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getRoleEnterpriseList: {
    parameters: {
      query?: {
        /**
         * @description 페이지 번호 (1부터 시작)
         * @example 1
         */
        page?: number;
        /**
         * @description 페이지 크기
         * @example 20
         */
        Size?: number;
      };
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PageResponseEntRoleDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getRolePolicyDetail: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Policy ID */
        policyId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseDetail'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAccountEnterprisePermissions: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPermissionsDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getPermission: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
        /** @description Permission ID */
        pid: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseEntPermissionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAllPermissions: {
    parameters: {
      query?: {
        /**
         * @description 페이지 번호 (1부터 시작)
         * @example 1
         */
        page?: number;
        /**
         * @description 페이지 크기
         * @example 20
         */
        Size?: number;
        /** @description 도메인 필터 */
        domain?: string;
      };
      header?: never;
      path: {
        /** @description Enterprise ID */
        enterpriseId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PageResponseEntPermissionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getWorkSpaceRegionList: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListWSRegionDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getEnterpriseList: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseListEnterpriseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getServices: {
    parameters: {
      query: {
        /** @description 제품 ID (0 또는 생략: 모든 제품, 기타: 특정 제품) */
        product: number;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': unknown;
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAgentsByService: {
    parameters: {
      query?: {
        /** @description 활성 에이전트만 조회 여부 (true: 활성만, false: 최근 포함) */
        activeOnly?: boolean;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
        /** @description 서비스 이름 (예: HR, SALES, SUPPORT) */
        serviceName: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': unknown;
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getRecentAgents: {
    parameters: {
      query?: {
        /** @description 제품 ID (0: 전체, 100: APM 카테고리, 200: Infra 카테고리, 300: Database 카테고리, 기타: 특정 제품) */
        product?: number;
        /** @description 시스템 ID (0: 전체) */
        sysid?: number;
        /** @description 서비스 필터 (ALL: 전체, None: 서비스 미지정, 기타: 특정 서비스) */
        service?: string;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseRecentAgentResponseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAgentProperty: {
    parameters: {
      query: {
        /** @description 제품 ID */
        product: number;
        /** @description 시스템 ID */
        sysid: number;
        /** @description 에이전트 OID */
        oid: number;
        /** @description 속성 키 */
        key: string;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseMapStringObject'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getAgentProperties: {
    parameters: {
      query: {
        /** @description 제품 ID */
        product: number;
        /** @description 시스템 ID */
        sysid: number;
        /** @description 에이전트 OID */
        oid: number;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseMapStringObject'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
  getActiveAgents: {
    parameters: {
      query?: {
        /** @description 제품 ID (0: 전체, 100: APM 카테고리, 200: Infra 카테고리, 300: Database 카테고리, 기타: 특정 제품) */
        product?: number;
        /** @description 시스템 ID (0: 전체) */
        sysid?: number;
        /** @description 서비스 필터 (ALL: 전체, None: 서비스 미지정, 기타: 특정 서비스) */
        service?: string;
      };
      header?: never;
      path: {
        /** @description 워크스페이스 ID */
        wsid: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 성공 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RestResponseActiveAgentResponseDTO'];
        };
      };
      /** @description 잘못된 요청 */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "msg": "BAD_REQUEST",
           *       "code": 400,
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
      /** @description 인증되지 않은 사용자 (로그인 필요) */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          /**
           * @example {
           *       "code": 401,
           *       "msg": "Unauthorized",
           *       "data": null
           *     }
           */
          'application/json': components['schemas']['RestResponse'];
        };
      };
    };
  };
}
