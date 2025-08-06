#!/usr/bin/env node

/**
 * Worker Assignment ML MCP Demo Client
 * 
 * This demo shows how to interact with the Worker Assignment ML MCP server
 * to perform various ML operations through HTTP and WebSocket APIs.
 */

const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');

class WorkerAssignmentMCPDemo {
    constructor() {
        this.serverUrl = 'http://localhost:3001';
        this.wsUrl = 'ws://localhost:3001';
        this.serverProcess = null;
        this.ws = null;
    }

    async initialize() {
        console.log('🚀 Starting Worker Assignment ML MCP Demo...\n');

        try {
            // Start the MCP server process
            console.log('Starting MCP server...');
            this.serverProcess = spawn('node', ['src/mcp/server.js'], {
                stdio: ['pipe', 'pipe', 'inherit']
            });

            // Wait for server to start
            await this.waitForServer();
            console.log('✅ Connected to Worker Assignment ML MCP Server\n');

        } catch (error) {
            console.error('❌ Failed to initialize MCP demo:', error.message);
            throw error;
        }
    }

    async waitForServer(maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                await this.makeHttpRequest('GET', '/mcp/status');
                return;
            } catch (error) {
                if (i === maxAttempts - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async makeHttpRequest(method, path, data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3001,
                path: path,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const req = http.request(options, (res) => {
                let responseData = '';
                res.on('data', chunk => responseData += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(responseData);
                        resolve(parsed);
                    } catch (error) {
                        resolve({ text: responseData });
                    }
                });
            });

            req.on('error', reject);

            if (data) {
                req.write(JSON.stringify(data));
            }
            req.end();
        });
    }

    async connectWebSocket() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.on('open', () => {
                console.log('🔌 WebSocket connected');
                resolve();
            });
            
            this.ws.on('message', (data) => {
                const message = JSON.parse(data.toString());
                if (message.type === 'welcome') {
                    console.log(`📱 ${message.message}`);
                }
            });
            
            this.ws.on('error', reject);
        });
    }

    async runDemo() {
        try {
            console.log('🎯 Running Worker Assignment ML MCP Demo\n');
            console.log('='.repeat(60));

            // Demo 1: List available tools
            await this.demoListTools();

            // Demo 2: Get system analytics
            await this.demoSystemAnalytics();

            // Demo 3: Make predictions
            await this.demoPredictions();

            // Demo 4: Add training data
            await this.demoAddTrainingData();

            // Demo 5: List and read resources
            await this.demoResources();

            // Demo 6: WebSocket interaction
            await this.demoWebSocket();

            console.log('\n🎉 Demo completed successfully!');

        } catch (error) {
            console.error('❌ Demo failed:', error.message);
        }
    }

    async demoListTools() {
        console.log('\n📋 **Demo 1: Available MCP Tools**');
        console.log('-'.repeat(40));

        const response = await this.makeHttpRequest('GET', '/mcp/tools');
        
        console.log(`Found ${response.tools.length} available tools:\n`);
        response.tools.forEach((tool, index) => {
            console.log(`${index + 1}. **${tool.name}**`);
            console.log(`   Description: ${tool.description}`);
            console.log(`   Required params: ${tool.parameters.required?.join(', ') || 'none'}\n`);
        });
    }

    async demoSystemAnalytics() {
        console.log('\n📊 **Demo 2: System Analytics**');
        console.log('-'.repeat(40));

        const response = await this.makeHttpRequest('POST', '/mcp/tools/call', {
            name: 'get_system_analytics',
            arguments: { includeModelDetails: true }
        });

        console.log(response.result.text);
    }

    async demoPredictions() {
        console.log('\n🎯 **Demo 3: Worker Assignment Predictions**');
        console.log('-'.repeat(40));

        const testCases = [
            { machineId: 1, complexity: 3, description: "Machine 1, Medium complexity" },
            { machineId: 5, complexity: 1, description: "Machine 5, Low complexity" },
            { machineId: 3, complexity: 5, description: "Machine 3, High complexity" }
        ];

        for (const testCase of testCases) {
            console.log(`\n🔍 Testing: ${testCase.description}`);
            
            const response = await this.makeHttpRequest('POST', '/mcp/tools/call', {
                name: 'predict_worker_assignment',
                arguments: {
                    machineId: testCase.machineId,
                    complexity: testCase.complexity,
                    includeAnalysis: true
                }
            });

            console.log(response.result.text);
        }
    }

    async demoAddTrainingData() {
        console.log('\n📝 **Demo 4: Adding Training Data**');
        console.log('-'.repeat(40));

        const newTrainingData = [
            {
                workerId: 'worker_demo',
                machineId: 1,
                timeMinutes: 45.5,
                qualityScore: 92.3
            },
            {
                workerId: 'worker_demo',
                machineId: 2,
                timeMinutes: 38.7,
                qualityScore: 88.9
            }
        ];

        console.log('Adding sample training data...\n');

        const response = await this.makeHttpRequest('POST', '/mcp/tools/call', {
            name: 'add_training_data',
            arguments: {
                data: newTrainingData,
                retrain: true
            }
        });

        console.log(response.result.text);

        // Now test a prediction with the new worker data
        console.log('\n🧪 Testing prediction after adding data:');
        const predictionResponse = await this.makeHttpRequest('POST', '/mcp/tools/call', {
            name: 'predict_worker_assignment',
            arguments: {
                machineId: 1,
                complexity: 3,
                includeAnalysis: false
            }
        });

        console.log(predictionResponse.result.text);
    }

    async demoResources() {
        console.log('\n📋 **Demo 5: MCP Resources**');
        console.log('-'.repeat(40));

        // List available resources
        const resourcesResponse = await this.makeHttpRequest('GET', '/mcp/resources');
        
        console.log(`Found ${resourcesResponse.resources.length} available resources:\n`);
        
        // Read each resource
        for (const resource of resourcesResponse.resources) {
            console.log(`📄 **${resource.name}**`);
            console.log(`   URI: ${resource.uri}`);
            console.log(`   Description: ${resource.description}\n`);

            try {
                const encodedUri = encodeURIComponent(resource.uri);
                const contentResponse = await this.makeHttpRequest('GET', `/mcp/resources/${encodedUri}`);

                const content = contentResponse.resource.content;
                if (typeof content === 'object') {
                    console.log(`   Content Preview: ${Object.keys(content).join(', ')}`);
                } else {
                    console.log(`   Content Type: ${typeof content}`);
                }
                console.log('');
            } catch (error) {
                console.log(`   Error reading resource: ${error.message}\n`);
            }
        }
    }

    async demoWebSocket() {
        console.log('\n🔌 **Demo 6: WebSocket Interaction**');
        console.log('-'.repeat(40));

        try {
            await this.connectWebSocket();

            // Test WebSocket tool call
            const wsPromise = new Promise((resolve) => {
                this.ws.on('message', (data) => {
                    const message = JSON.parse(data.toString());
                    if (message.type === 'tool_result') {
                        console.log('📱 WebSocket Tool Result:');
                        console.log(message.data.text);
                        resolve();
                    }
                });
            });

            this.ws.send(JSON.stringify({
                type: 'call_tool',
                name: 'get_system_analytics',
                arguments: { includeModelDetails: false }
            }));

            await wsPromise;
            this.ws.close();
            
        } catch (error) {
            console.log(`WebSocket demo failed: ${error.message}`);
        }
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up...');
        
        if (this.ws) {
            this.ws.close();
        }
        
        if (this.serverProcess) {
            this.serverProcess.kill();
        }
        
        console.log('✅ Cleanup completed');
    }
}

// Main execution
async function main() {
    const demo = new WorkerAssignmentMCPDemo();
    
    try {
        await demo.initialize();
        await demo.runDemo();
    } catch (error) {
        console.error('Demo failed:', error);
    } finally {
        await demo.cleanup();
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n🛑 Received interrupt signal, shutting down...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received termination signal, shutting down...');
    process.exit(0);
});

// Run the demo if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = WorkerAssignmentMCPDemo;
