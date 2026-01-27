#!/usr/bin/env node

/**
 * Figma MCP get_design_context 응답 가공 스크립트
 *
 * 기능:
 * 1. React 코드가 아닌 문구 제거 (SUPER CRITICAL, IMPORTANT 등)
 * 2. CSS variable의 fallback 값 제거 (var(--token, fallback) → var(--token))
 *
 * 사용법:
 *   node tuning-get-design-context.mjs <input-file> [--destination <output-file>]
 *
 * 예제:
 *   node tuning-get-design-context.mjs figma-mcp-result/get_design_context.txt
 *   node tuning-get-design-context.mjs figma-mcp-result/get_design_context.txt --destination result.txt
 */

import { readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';

// 제거할 비-React 문구 패턴들
const NON_REACT_PATTERNS = [
  // SUPER CRITICAL 블록
  /SUPER CRITICAL:[\s\S]*?DO NOT install any Tailwind as a dependency unless the user instructs you to do so\.\n?/g,
  // Node ids 설명 (e.g. 포함)
  /Node ids have been added to the code as data attributes.*?`data-node-id="[^"]*"`\.?\n?/g,
  // These styles are contained 블록
  /These styles are contained in the design:[\s\S]*?(?=Image assets are stored|IMPORTANT|$)/g,
  // Image assets 설명
  /Image assets are stored on a localhost server\.[\s\S]*?so you can use the same approach for both types of assets\.\n?/g,
  // IMPORTANT 블록
  /IMPORTANT:[\s\S]*$/g,
];

// CSS variable fallback 제거 패턴
// var(--token, fallback) → var(--token)
// var(--color-spacing_xs,8px) → var(--color-spacing_xs)
const FALLBACK_PATTERN = /var\(([^,)]+),\s*[^)]+\)/g;

/**
 * CSS variable에서 fallback 값 제거
 * @param {string} content
 * @returns {string}
 */
function removeFallbacks(content) {
  return content.replace(FALLBACK_PATTERN, 'var($1)');
}

/**
 * 비-React 문구 제거
 * @param {string} content
 * @returns {string}
 */
function removeNonReactContent(content) {
  let result = content;

  for (const pattern of NON_REACT_PATTERNS) {
    result = result.replace(pattern, '');
  }

  // 연속된 빈 줄 정리 (3개 이상 → 2개)
  result = result.replace(/\n{3,}/g, '\n\n');

  // 파일 끝 공백 정리
  result = result.trim() + '\n';

  return result;
}

/**
 * 메인 처리 함수
 * @param {string} inputPath
 * @param {string} outputPath
 */
function processFile(inputPath, outputPath) {
  console.log(`📖 Reading: ${inputPath}`);

  const content = readFileSync(inputPath, 'utf-8');
  const originalSize = content.length;

  // 1. 비-React 문구 제거
  let processed = removeNonReactContent(content);

  // 2. Fallback 값 제거
  processed = removeFallbacks(processed);

  const processedSize = processed.length;
  const reduction = originalSize === 0
    ? '0.0'
    : ((originalSize - processedSize) / originalSize * 100).toFixed(1);

  // 결과 저장
  writeFileSync(outputPath, processed, 'utf-8');

  console.log(`✅ Saved: ${outputPath}`);
  console.log(`📊 Size: ${originalSize} → ${processedSize} bytes (${reduction}% reduced)`);
}

/**
 * CLI 인자 파싱
 * @param {string[]} args
 * @returns {{ inputPath: string, outputPath: string | null }}
 */
function parseArgs(args) {
  let inputPath = null;
  let outputPath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--destination' || args[i] === '-d') {
      outputPath = args[++i];
    } else if (!inputPath) {
      inputPath = args[i];
    }
  }

  return { inputPath, outputPath };
}

// CLI 실행
const args = process.argv.slice(2);
const { inputPath, outputPath: destPath } = parseArgs(args);

if (!inputPath) {
  console.log(`
Usage: node tuning-get-design-context.mjs <input-file> [--destination <output-file>]

Examples:
  node tuning-get-design-context.mjs figma-mcp-result/get_design_context.txt
  node tuning-get-design-context.mjs figma-mcp-result/get_design_context.txt --destination result.txt
  node tuning-get-design-context.mjs figma-mcp-result/get_design_context.txt -d result.txt

Options:
  input-file              Path to the get_design_context output file
  --destination, -d       (Optional) Output path. Defaults to <input>_tuned.txt
`);
  process.exit(1);
}

const outputPath = destPath || join(
  dirname(inputPath),
  basename(inputPath, '.txt') + '_tuned.txt'
);

try {
  processFile(inputPath, outputPath);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
