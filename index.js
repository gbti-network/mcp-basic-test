#!/usr/bin/env node

import Logger from './utils/logger.js';

class McpServer {
    constructor(config) {
        this.name = config.name;
        this.version = config.version;
        this.protocolVersion = "2024-11-05";
        this.tools = new Map();
        this.buffer = '';
        this.initialized = false;
        
        // Initialize logger
        this.logger = new Logger({
            logFile: 'mcp-server.log',
            logDir: '.logs',
            timestamp: true,
            console: false
        });
        
        // Set up stdin handling
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', this.handleInput.bind(this));
        process.stdin.resume();

        // Register tools
        this.registerTools();

        this.logger.info('Super Secret MCP server running on stdio');
    }

    writeMessage(message) {
        const messageStr = JSON.stringify(message) + '\r\n';
        process.stdout.write(messageStr);
    }

    registerTools() {
        this.tools.set('getSecretPassphrase', {
            name: 'getSecretPassphrase',
            description: 'What\s the password?',
            inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false,
                required: []
            },
            handler: async () => {
                const states = [
                    'New England', 'Louisiana', 'Texas', 'California', 'Michigan',
                    'Wisconsin', 'Maine', 'Florida', 'Washington', 'Oregon',
                    'New Mexico', 'Kentucky', 'Tennessee', 'Minnesota', 'Illinois'
                ];
                
                const soups = [
                    'Clam Chowder', 'Gumbo', 'Chili', 'Cioppino', 'Cherry Soup',
                    'Beer Cheese Soup', 'Lobster Stew', 'Conch Chowder', 'Salmon Chowder', 'Marionberry Soup',
                    'Green Chile Stew', 'Burgoo', 'Hot Chicken Soup', 'Wild Rice Soup', 'Corn Chowder'
                ];

                const randomState = states[Math.floor(Math.random() * states.length)];
                const randomSoup = soups[Math.floor(Math.random() * soups.length)];

                return `${randomState} ${randomSoup}`;
            }
        });
    }

    async handleInput(data) {
        this.buffer += data;
        
        let newlineIndex;
        while ((newlineIndex = this.buffer.indexOf('\n')) !== -1) {
            const line = this.buffer.slice(0, newlineIndex).trim();
            this.buffer = this.buffer.slice(newlineIndex + 1);
            
            if (line) {
                this.logger.debug('Received input: ' + line);
                try {
                    const request = JSON.parse(line);
                    this.logger.info('Processing request');
                    this.logger.json('DEBUG', request);
                    
                    if (request.method === 'initialize') {
                        const clientProtocolVersion = request.params.protocolVersion;
                        if (clientProtocolVersion !== this.protocolVersion) {
                            this.logger.warn(`Protocol version mismatch - client: ${clientProtocolVersion}, server: ${this.protocolVersion}`);
                        }

                        const response = {
                            jsonrpc: "2.0",
                            id: request.id,
                            result: {
                                serverInfo: {
                                    name: this.name,
                                    version: this.version
                                },
                                protocolVersion: this.protocolVersion,
                                capabilities: {
                                    tools: Object.fromEntries(Array.from(this.tools.entries()).map(([name, tool]) => [
                                        name,
                                        {
                                            name: tool.name,
                                            description: tool.description,
                                            inputSchema: tool.inputSchema
                                        }
                                    ]))
                                }
                            }
                        };
                        this.logger.info('Sending initialize response');
                        this.logger.json('DEBUG', response);
                        this.writeMessage(response);
                    } else if (request.method === 'notifications/initialized') {
                        this.logger.info('Client sent initialized notification');
                        this.initialized = true;
                    } else if (request.method === 'tools/list') {
                        if (!this.initialized) {
                            this.logger.error('Received tools/list request before initialization');
                            this.sendError(request.id, 'Server not initialized');
                            return;
                        }

                        const toolsList = {
                            tools: Array.from(this.tools.entries()).map(([name, tool]) => ({
                                name: tool.name,
                                description: tool.description,
                                inputSchema: tool.inputSchema
                            }))
                        };

                        this.logger.info('Sending tools list');
                        this.sendResponse(request.id, toolsList);
                    } else if (request.method === 'tools/call') {
                        if (!this.initialized) {
                            this.logger.error('Received tool call before initialization');
                            this.sendError(request.id, 'Server not initialized');
                            return;
                        }

                        const toolName = request.params.name;
                        const tool = this.tools.get(toolName);
                        
                        if (!tool) {
                            this.logger.error(`Tool '${toolName}' not found`);
                            this.sendError(request.id, `Tool '${toolName}' not found`);
                            return;
                        }

                        try {
                            this.logger.info(`Executing tool: ${toolName}`);
                            const result = await tool.handler(request.params.arguments);
                            this.sendResponse(request.id, {
                                content: [{
                                    type: 'text',
                                    text: result
                                }]
                            });
                        } catch (error) {
                            this.logger.error(`Tool execution failed: ${error.message}`);
                            this.sendError(request.id, error.message);
                        }
                    }
                } catch (error) {
                    this.logger.error('Failed to parse message: ' + error.message);
                }
            }
        }
    }

    sendResponse(id, result) {
        const response = {
            jsonrpc: "2.0",
            id,
            result
        };
        this.logger.info('Sending response');
        this.logger.json('DEBUG', response);
        this.writeMessage(response);
    }

    sendError(id, message) {
        const error = {
            jsonrpc: "2.0",
            id,
            error: {
                code: -32603,
                message
            }
        };
        this.logger.info('Sending error response');
        this.logger.json('DEBUG', error);
        this.writeMessage(error);
    }
}

// Create and start the server
const server = new McpServer({
    name: 'super-secret-server',
    version: '1.0.0'
});
