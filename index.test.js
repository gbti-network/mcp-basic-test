import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('MCP Server', () => {
    let mcpProcess;
    let receivedMessages = [];

    beforeEach(async () => {
        mcpProcess = spawn('node', [join(__dirname, 'index.js')]);
        mcpProcess.stdout.setEncoding('utf8');
        mcpProcess.stderr.setEncoding('utf8');
        receivedMessages = [];

        mcpProcess.stdout.on('data', (data) => {
            const messages = data.split('\n').filter(msg => msg.trim());
            receivedMessages.push(...messages.map(msg => {
                try {
                    return JSON.parse(msg);
                } catch (e) {
                    console.error('Failed to parse message:', msg);
                    return null;
                }
            }).filter(msg => msg !== null));
        });

        // Wait for initialization message
        await new Promise((resolve) => {
            const checkInit = setInterval(() => {
                if (receivedMessages.some(msg => msg.type === 'initialize')) {
                    clearInterval(checkInit);
                    resolve();
                }
            }, 100);
        });
    });

    afterEach(() => {
        if (mcpProcess) {
            mcpProcess.kill();
            mcpProcess = null;
        }
    });

    test('sends initialization message on startup', () => {
        const initMessage = receivedMessages.find(msg => msg.type === 'initialize');
        expect(initMessage).toBeTruthy();
        expect(initMessage).toMatchObject({
            type: 'initialize',
            id: 'init',
            result: {
                name: 'super-secret-server',
                version: '1.0.0',
                capabilities: {
                    tools: {
                        getTheSuperSecret: {
                            description: expect.any(String),
                            parameters: expect.any(Object)
                        }
                    }
                }
            }
        });
    });

    test('handles getTheSuperSecret tool request', async () => {
        const request = {
            type: 'request',
            id: 'test-1',
            tool: 'getTheSuperSecret',
            parameters: {}
        };

        mcpProcess.stdin.write(JSON.stringify(request) + '\n');

        const response = await new Promise((resolve) => {
            const checkResponse = setInterval(() => {
                const resp = receivedMessages.find(msg => msg.id === 'test-1');
                if (resp) {
                    clearInterval(checkResponse);
                    resolve(resp);
                }
            }, 100);
        });

        expect(response).toMatchObject({
            type: 'response',
            id: 'test-1',
            result: expect.stringMatching(/^(Monday|Tuesday|Wednesday|Thursday|Friday)-(Red|Blue|Green|Yellow|Purple)$/)
        });
    });

    test('handles invalid tool request', async () => {
        const request = {
            type: 'request',
            id: 'test-2',
            tool: 'nonExistentTool',
            parameters: {}
        };

        mcpProcess.stdin.write(JSON.stringify(request) + '\n');

        const response = await new Promise((resolve) => {
            const checkResponse = setInterval(() => {
                const resp = receivedMessages.find(msg => msg.id === 'test-2');
                if (resp) {
                    clearInterval(checkResponse);
                    resolve(resp);
                }
            }, 100);
        });

        expect(response).toMatchObject({
            type: 'error',
            id: 'test-2',
            error: {
                message: expect.stringContaining('not found')
            }
        });
    });
});
