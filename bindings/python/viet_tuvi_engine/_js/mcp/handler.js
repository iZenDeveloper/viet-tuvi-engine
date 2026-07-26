import { compatibility } from '../analysis/compatibility.js';
import { sensitivity } from '../analysis/sensitivity.js';
import { calculateTuVi } from '../calculate.js';
import { compareChartFixture } from '../fixtures/compare.js';
import { listVietnamCities } from '../locations.js';
import { capabilities, getMethodologyManifest, methodologyResourceText } from '../methodology.js';
import { createGroundedPrompt } from '../prompts/grounded.js';
import { listMajorStars } from '../stars/major.js';
import { renderSvg } from '../svg/render.js';
import { calculateTimeline } from '../timeline/calculate.js';
import { engineErrorCode, validateInput } from '../validation.js';
import { ENGINE_NAME, ENGINE_VERSION } from '../version.js';
export function handleMcpMessage(message) {
    const m = message;
    if (m?.id === undefined && m?.method?.startsWith('notifications/'))
        return null;
    const id = m.id ?? null;
    try {
        if (m.method === 'initialize') {
            return {
                jsonrpc: '2.0',
                id,
                result: {
                    protocolVersion: '2025-06-18',
                    capabilities: {
                        tools: { listChanged: false },
                        resources: { subscribe: false, listChanged: false }
                    },
                    serverInfo: { name: ENGINE_NAME, version: ENGINE_VERSION }
                }
            };
        }
        if (m.method === 'resources/list') {
            return {
                jsonrpc: '2.0',
                id,
                result: {
                    resources: [
                        {
                            uri: 'tuvi://methodology',
                            name: 'Methodology manifest',
                            description: 'Versioned calculation rules and provenance',
                            mimeType: 'application/json'
                        },
                        {
                            uri: 'tuvi://sources/trung-chau',
                            name: 'Trung Châu research sources',
                            description: 'Public comparison and reference sources',
                            mimeType: 'text/markdown'
                        }
                    ]
                }
            };
        }
        if (m.method === 'resources/read') {
            const uri = m.params?.uri;
            if (uri === 'tuvi://methodology') {
                return {
                    jsonrpc: '2.0',
                    id,
                    result: {
                        contents: [{ uri, mimeType: 'application/json', text: methodologyResourceText() }]
                    }
                };
            }
            if (uri === 'tuvi://sources/trung-chau') {
                return {
                    jsonrpc: '2.0',
                    id,
                    result: {
                        contents: [{
                                uri,
                                mimeType: 'text/markdown',
                                text: '# Trung Châu sources\n\n- https://tuvibacphai.com/tuvi (comparison oracle)\n- https://tuvivietnam.vn/so-luoc-ve-lich-su-tu-vi-trung-hoa-noi-chung-va-trung-chau-phai-noi-rieng/ (historical reference)\n- https://tuvivietnam.vn/trung-chau-phai/ (auxiliary-star reference)\n- https://tuvitrungchau.com (school bibliography)\n\nThese are reference/comparison sources, not claims of conformance.'
                            }]
                    }
                };
            }
            return {
                jsonrpc: '2.0',
                id,
                error: { code: -32602, message: 'Unknown resource URI' }
            };
        }
        if (m.method === 'tools/list') {
            return {
                jsonrpc: '2.0',
                id,
                result: {
                    tools: [
                        { name: 'capabilities', description: 'Discover engine features and versions', inputSchema: { type: 'object', additionalProperties: false } },
                        { name: 'cities', description: 'List supported Vietnamese city locations', inputSchema: { type: 'object', additionalProperties: false } },
                        { name: 'major-stars', description: 'List stable metadata for the fourteen major stars', inputSchema: { type: 'object', additionalProperties: false } },
                        { name: 'methodology', description: 'Return versioned calculation methodology manifest', inputSchema: { type: 'object', additionalProperties: false } },
                        { name: 'validate-input', description: 'Validate calculation input without throwing', inputSchema: { type: 'object' } },
                        { name: 'calculate', description: 'Calculate a structured Tu Vi chart', inputSchema: { type: 'object', required: ['localDateTime', 'timezoneOffsetMinutes', 'gender'] } },
                        { name: 'compare-fixture', description: 'Compare a chart against stable expected fields', inputSchema: { type: 'object', required: ['input', 'expected'] } },
                        { name: 'timeline', description: 'Calculate major, minor, annual, monthly, and daily limits', inputSchema: { type: 'object', required: ['localDateTime', 'timezoneOffsetMinutes', 'gender', 'asOfYear'] } },
                        { name: 'sensitivity', description: 'Compare nearby birth-hour variants', inputSchema: { type: 'object', required: ['localDateTime', 'timezoneOffsetMinutes', 'gender'] } },
                        { name: 'compatibility', description: 'Compare two chart inputs', inputSchema: { type: 'object', required: ['a', 'b'] } },
                        { name: 'grounded-prompt', description: 'Create an evidence-grounded interpretation prompt', inputSchema: { type: 'object', required: ['chart'] } },
                        { name: 'render-svg', description: 'Render an accessible high-contrast SVG chart', inputSchema: { type: 'object', required: ['chart'] } }
                    ]
                }
            };
        }
        if (m.method === 'tools/call') {
            const name = m.params?.name;
            const args = m.params?.arguments ?? {};
            let result;
            if (name === 'capabilities')
                result = capabilities();
            else if (name === 'cities')
                result = { cities: listVietnamCities() };
            else if (name === 'major-stars')
                result = { stars: listMajorStars() };
            else if (name === 'methodology')
                result = getMethodologyManifest();
            else if (name === 'validate-input')
                result = validateInput(args);
            else if (name === 'calculate')
                result = calculateTuVi(args);
            else if (name === 'compare-fixture')
                result = compareChartFixture(args.input, args.expected);
            else if (name === 'timeline')
                result = calculateTimeline(args);
            else if (name === 'sensitivity')
                result = sensitivity(args);
            else if (name === 'compatibility')
                result = compatibility(args.a, args.b);
            else if (name === 'grounded-prompt')
                result = createGroundedPrompt(args.chart, args.locale);
            else if (name === 'render-svg')
                result = { svg: renderSvg(args.chart) };
            else {
                return {
                    jsonrpc: '2.0',
                    id,
                    error: { code: -32602, message: `Unknown tool: ${String(name)}` }
                };
            }
            return {
                jsonrpc: '2.0',
                id,
                result: {
                    content: [{ type: 'text', text: JSON.stringify(result) }],
                    structuredContent: result
                }
            };
        }
        if (m.method === 'capabilities') {
            return { jsonrpc: '2.0', id, result: capabilities() };
        }
        if (m.method === 'calculate') {
            return { jsonrpc: '2.0', id, result: calculateTuVi(m.params) };
        }
        if (m.method === 'sensitivity') {
            return { jsonrpc: '2.0', id, result: sensitivity(m.params) };
        }
        if (m.method === 'compatibility') {
            return {
                jsonrpc: '2.0',
                id,
                result: compatibility(m.params.a, m.params.b)
            };
        }
        if (m.method === 'grounded-prompt') {
            return {
                jsonrpc: '2.0',
                id,
                result: createGroundedPrompt(m.params.chart, m.params.locale)
            };
        }
        return {
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: 'Method not found' }
        };
    }
    catch (error) {
        return {
            jsonrpc: '2.0',
            id,
            error: {
                code: -32602,
                message: error instanceof Error ? error.message : 'Invalid params',
                data: { engineCode: engineErrorCode(error) }
            }
        };
    }
}
