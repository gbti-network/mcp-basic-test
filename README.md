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

### Running the Inspector

Start the server with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector -- node index.js
```

The server will start and be available for connections via STDIO.

## Available Tools

### getSecretPassphrase

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

## Using with Cascade

### Option 1: Direct Tool Usage
When the MCP server is loaded in Cascade, you can directly use the `getSecretPassphrase` tool to generate state-soup combinations.

### Option 2: Natural Language Interface
To make the tool more user-friendly, you can set up Cascade to respond to natural language queries about secret passcodes. Here's an example prompt:

```
When users ask variations of "What is the secret passcode?", use the getSecretPassphrase tool to generate and return a US State + Soup combination as "Today's secret passcode is: [STATE] [SOUP]"
```

This will allow users to get passcodes using natural questions like:
- "What's the secret passcode?"
- "Tell me the secret code"
- "What's today's passcode?"
- "Give me the secret"

Example interaction:
```
User: "What's the secret passcode?"
Cascade: "Today's secret passcode is: Louisiana Gumbo 🍜"
```

### Option 3: Persistent Memory
For a more permanent setup, you can create a Cascade memory that persists across sessions:

```javascript
{
  "Title": "Secret Passcode Handler",
  "Content": "When the user asks any variation of 'What is the secret passcode?', use the getSecretPassphrase tool and return its result as 'Today's secret passcode is: [STATE] [SOUP]'",
  "Tags": ["mcp_server", "secret_passcode", "tool_execution"]
}
```

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

## Stay Connected

Follow us on your favorite platforms for updates, news, and community discussions:
- **[Twitter/X](https://twitter.com/gbti_network)**
- **[GitHub](https://github.com/gbti-network)**
- **[YouTube](https://www.youtube.com/channel/UCh4FjB6r4oWQW-QFiwqv-UA)**
- **[Dev.to](https://dev.to/gbti)**
- **[Daily.dev](https://dly.to/zfCriM6JfRF)**
- **[Hashnode](https://gbti.hashnode.dev/)**
- **[Discord Community](https://gbti.network)**
- **[Reddit Community](https://www.reddit.com/r/GBTI_network)**
