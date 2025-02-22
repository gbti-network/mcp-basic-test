# Super Secret MCP Server

A Model Context Protocol (MCP) server implementation in pure Node.js that provides a fun tool to generate random US State and signature soup combinations.

## Features

- Pure Node.js implementation
- JSON-RPC 2.0 compliant
- MCP protocol version: 2024-11-05
- Custom logging system
- Tool support with schema validation
- STDIO transport

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- MCP Inspector for testing

### Installation

1. Clone the repository:
```bash
git clone git@github.com:gbti-network/mcp-basic-test.git
cd mcp-basic-test
```

2. Install dependencies:
```bash
npm install
```

### Running the Server

Start the server with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector -- node index.js
```

The server will start and be available for connections via STDIO.

## Available Tools

### getTheSuperSecret

Returns a random combination of a US State and its signature soup. Examples include:
- New England Clam Chowder
- Louisiana Gumbo
- Texas Chili
- California Cioppino
- Michigan Cherry Soup

**Input Schema:**
```json
{
  "type": "object",
  "properties": {},
  "additionalProperties": false,
  "required": []
}
```

**Example Response:**
```json
{
  "content": [{
    "type": "text",
    "text": "New England Clam Chowder"
  }]
}
```

## Project Structure

```
.
├── index.js           # Main server implementation
├── utils/
│   └── logger.js      # Custom logging utility
├── .data/
│   ├── framework.md   # Framework documentation
│   └── knowledge.md   # Project knowledge base
└── .logs/            # Server logs directory
```

## Development

### Adding New Tools

1. Define your tool in `index.js`:
```javascript
this.tools.set('toolName', {
    name: 'toolName',
    description: 'Tool description',
    inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
        required: []
    },
    handler: async (params) => {
        // Tool implementation
        return 'result';
    }
});
```

2. Test using MCP Inspector:
   - Connect to server
   - Use "List Tools" to verify tool registration
   - Test tool execution

### Logging

The server uses a custom logging system with multiple levels:
- DEBUG: Detailed debugging information
- INFO: General operational information
- WARN: Warning messages
- ERROR: Error conditions

Logs are stored in the `.logs` directory.

## Testing

1. Start the server with MCP Inspector
2. Verify server initialization
3. Check tool listing
4. Test tool execution
5. Verify response formats

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Model Context Protocol team for the protocol specification
- MCP Inspector team for the testing tool
