const fs = require('fs');
const path = require('path');

// API 타입 정의 파일 읽기
const apiTypePath = path.join(__dirname, '../src/shared/api/generated/api.d.ts');
const apiTypeContent = fs.readFileSync(apiTypePath, 'utf-8');

// 라인별로 파싱
const lines = apiTypeContent.split('\n');

const endpoints = [];
let currentPath = null;
let inPaths = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // paths 인터페이스 시작
  if (line.includes('export interface paths {')) {
    inPaths = true;
    continue;
  }

  // paths 인터페이스 종료 (export interface operations 또는 export type 발견)
  if (inPaths && (line.includes('export interface operations') || line.includes('export type'))) {
    inPaths = false;
    break;
  }

  if (!inPaths) {
    continue;
  }

  // 경로 라인 찾기 (최상위 레벨의 경로만)
  const pathMatch = line.match(/^\s{4}"(\/ws\/api\/v1\/[^"]+)":\s*\{/);
  if (pathMatch) {
    currentPath = pathMatch[1];
    continue;
  }

  // 메서드 라인 찾기
  if (currentPath) {
    const methodMatch = line.match(/^\s{8}(get|post|put|delete):\s*operations\["([^"]+)"\]/);
    if (methodMatch) {
      const method = methodMatch[1];
      const operationName = methodMatch[2];
      endpoints.push({
        path: currentPath,
        method: method.toUpperCase(),
        operationName,
      });
    }

    // 경로 블록 종료 (최상위 레벨의 }; 만)
    if (line.match(/^\s{4}\};$/)) {
      currentPath = null;
    }
  }
}

console.log(`Found ${endpoints.length} endpoints`);

// operations 인터페이스에서 파라미터 정보 추출
const operationsStartIdx = lines.findIndex((l) => l.includes('export interface operations {'));
const operationsEndIdx = lines.findIndex((l, idx) => idx > operationsStartIdx && l.match(/^export /));
const operationsLines = lines.slice(operationsStartIdx, operationsEndIdx);

// 각 operation의 파라미터 정보 추출 함수
function extractOperationParams(operationName) {
  const operationStartIdx = operationsLines.findIndex((l) => l.includes(`${operationName}: {`));
  if (operationStartIdx === -1) {
    return { hasPath: false, hasQuery: false, hasBody: false, pathParams: [] };
  }

  // operation 블록 찾기 (중괄호 매칭)
  let braceCount = 0;
  let operationEndIdx = operationStartIdx;
  for (let i = operationStartIdx; i < operationsLines.length; i++) {
    const line = operationsLines[i];
    braceCount += (line.match(/\{/g) || []).length;
    braceCount -= (line.match(/\}/g) || []).length;
    if (braceCount === 0 && i > operationStartIdx) {
      operationEndIdx = i;
      break;
    }
  }

  const operationBlock = operationsLines.slice(operationStartIdx, operationEndIdx + 1).join('\n');

  // parameters 블록 찾기
  let hasPath = false;
  let hasQuery = false;
  let pathParams = [];

  // path 파라미터 확인 (중첩된 블록 처리)
  const pathBlockRegex = /path:\s*\{([\s\S]*?)\n\s{12}\}/;
  const pathBlockMatch = operationBlock.match(pathBlockRegex);
  if (pathBlockMatch && !operationBlock.includes('path?: never') && !operationBlock.includes('path: never')) {
    hasPath = true;
    const pathContent = pathBlockMatch[1];
    // 파라미터 이름 추출 (주석 제외)
    const paramMatches = [...pathContent.matchAll(/^\s*(\w+):/gm)];
    pathParams = paramMatches.map((m) => m[1]);
  }

  // query 파라미터 확인 (optional 또는 required 둘 다)
  const queryBlockRegex = /query\??:\s*\{([\s\S]*?)\n\s{12}\}/;
  const queryBlockMatch = operationBlock.match(queryBlockRegex);
  if (queryBlockMatch && !operationBlock.includes('query?: never') && !operationBlock.includes('query: never')) {
    hasQuery = true;
  }

  // requestBody 확인
  const hasBody = operationBlock.includes('requestBody:') && !operationBlock.includes('requestBody?: never');

  return { hasPath, hasQuery, hasBody, pathParams };
}

// 함수 이름 생성 (operation 이름을 camelCase로 변환)
function generateFunctionName(operationName, method) {
  // operation 이름이 이미 적절한 경우 그대로 사용
  // 아니면 메서드 prefix 추가
  const camelName = operationName.charAt(0).toLowerCase() + operationName.slice(1);

  return camelName;
}

// 함수 코드 생성
function generateFunctionCode(endpoint) {
  const { path, method, operationName } = endpoint;
  const params = extractOperationParams(operationName);
  const functionName = generateFunctionName(operationName, method);

  const apiMethod = method;
  const methodLower = method.toLowerCase();

  // 파라미터 타입 구성
  let paramParts = [];
  let paramUsage = [];

  // path와 query 파라미터가 있으면 params 추가 (SimplifyParams 사용)
  if (params.hasPath || params.hasQuery) {
    paramParts.push(`params: SimplifyParams<paths['${path}']['${methodLower}']['parameters']>`);
    paramUsage.push('params');
  }

  // body가 있으면 추가
  if (params.hasBody) {
    paramParts.push(`body: paths['${path}']['${methodLower}']['requestBody']['content']['application/json']`);
    paramUsage.push('body');
  }

  if (paramParts.length === 0) {
    // 파라미터가 없는 경우
    return `export async function ${functionName}() {
  const { data, error } = await apiClient.${apiMethod}('${path}');

  if (error) {
    return { type: 'FAILURE' as const, ...error };
  }

  return { type: 'SUCCESS' as const, ...data };
}`;
  }

  // options 객체 구성
  const optionsType = `{ ${paramParts.join('; ')} }`;

  // params를 path와 query로 분리하는 로직 생성
  let paramsProcessing = '';
  let apiCallParts = [];

  if (params.hasPath || params.hasQuery) {
    const pathFields = params.pathParams || [];

    if (params.hasPath && params.hasQuery) {
      // path와 query 둘 다 있는 경우
      paramsProcessing = `  const { ${pathFields.join(', ')}, ...query } = options.params;`;
      apiCallParts.push(`    params: {\n      path: { ${pathFields.join(', ')} },\n      query,\n    }`);
    } else if (params.hasPath) {
      // path만 있는 경우
      paramsProcessing = '';
      apiCallParts.push(`    params: {\n      path: options.params,\n    }`);
    } else {
      // query만 있는 경우
      paramsProcessing = '';
      apiCallParts.push(`    params: {\n      query: options.params,\n    }`);
    }
  }

  if (params.hasBody) {
    apiCallParts.push(`    body: options.body`);
  }

  const optionsUsage = apiCallParts.join(',\n');

  // 함수 본문 생성
  const functionBody = paramsProcessing
    ? `${paramsProcessing}
  const { data, error } = await apiClient.${apiMethod}('${path}', {
${optionsUsage},
  });`
    : `  const { data, error } = await apiClient.${apiMethod}('${path}', {
${optionsUsage},
  });`;

  return `export async function ${functionName}(options: ${optionsType}) {
${functionBody}

  if (error) {
    return { type: 'FAILURE' as const, ...error };
  }

  return { type: 'SUCCESS' as const, ...data };
}`;
}

// 모든 함수 생성
const functions = endpoints.map(generateFunctionCode);

// 파일에 저장
const outputPath = path.join(__dirname, '../src/fsd/workspace/6_shared/api/generated/ws-api.ts');
const outputContent = `// Generated API functions
// Auto-generated by scripts/generate-ws-api-functions.cjs
// DO NOT EDIT MANUALLY

import type { paths } from '@fsd/workspace/6_shared/api/generated/api.d.ts';
import apiClient from '@fsd/workspace/6_shared/api/libs/ws-api-client';

// Utility type to simplify params by merging path and query into a single object
type SimplifyParams<T> = T extends { path: infer P; query?: infer Q }
  ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    P & ([Q] extends [never] ? {} : Q extends undefined ? {} : Q)
  : T extends { path: infer P }
    ? P
    : never;

${functions.join('\n\n')}
`;

fs.writeFileSync(outputPath, outputContent, 'utf-8');
console.log(`Generated ${functions.length} functions to ${outputPath}`);

// 요약 출력
const methodCounts = endpoints.reduce((acc, e) => {
  acc[e.method] = (acc[e.method] || 0) + 1;
  return acc;
}, {});
console.log('Method counts:', methodCounts);
