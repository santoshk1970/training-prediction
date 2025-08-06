#!/usr/bin/env node

/**
 * Worker Assignment ML MCP Server
 * 
 * This MCP server exposes the Worker Assignment ML system's capabilities
 * through a Model Context Protocol-inspired interface, allowing external clients to:
 * - Predict optimal worker assignments
 * - Manage training data
 * - Get system analytics and insights
 * - Monitor model performance
 * 
 * Note: This is a simplified implementation that demonstrates MCP concepts
 * while being compatible with standard Node.js without external MCP dependencies.
 */

const http = require('http');
const path = require('path');
const WebSocket = require('ws');

// Import our ML services
const AppService = require('../services/AppService');

class WorkerAssignmentMCPServer {
    constructor() {
        this.appService = null;
        this.server = null;
        this.wss = null;
        this.port = process.env.MCP_PORT || 3001;
        this.tools = this.defineTools();
        this.resources = this.defineResources();
    }

    defineTools() {
        return [
            {
                name: "predict_worker_assignment",
                description: "Predict the best worker for a specific job based on machine type and job complexity",
                parameters: {
                    type: "object",
                    properties: {
                        machineId: {
                            type: "integer",
                            description: "Machine type ID (1-5)",
                            minimum: 1,
                            maximum: 5
                        },
                        complexity: {
                            type: "integer",
                            description: "Job complexity level (1-5)",
                            minimum: 1,
                            maximum: 5
                        },
                        includeAnalysis: {
                            type: "boolean",
                            description: "Include detailed prediction analysis",
                            default: false
                        }
                    },
                    required: ["machineId", "complexity"]
                }
            },
            {
                name: "get_worker_performance",
                description: "Get performance statistics for a specific worker",
                parameters: {
                    type: "object",
                    properties: {
                        workerId: {
                            type: "string",
                            description: "Worker ID to analyze"
                        },
                        machineId: {
                            type: "integer",
                            description: "Optional: Filter by specific machine type",
                            minimum: 1,
                            maximum: 5
                        }
                    },
                    required: ["workerId"]
                }
            },
            {
                name: "get_system_analytics",
                description: "Get comprehensive analytics about the ML system and its performance",
                parameters: {
                    type: "object",
                    properties: {
                        includeModelDetails: {
                            type: "boolean",
                            description: "Include detailed model information",
                            default: true
                        }
                    }
                }
            },
            {
                name: "add_training_data",
                description: "Add new historical performance data to improve predictions",
                parameters: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            description: "Array of historical performance records",
                            items: {
                                type: "object",
                                properties: {
                                    workerId: { type: "string" },
                                    machineId: { type: "integer", minimum: 1, maximum: 5 },
                                    timeMinutes: { type: "number", minimum: 0 },
                                    qualityScore: { type: "number", minimum: 0, maximum: 100 }
                                },
                                required: ["workerId", "machineId", "timeMinutes", "qualityScore"]
                            }
                        },
                        retrain: {
                            type: "boolean",
                            description: "Whether to retrain the model after adding data",
                            default: true
                        }
                    },
                    required: ["data"]
                }
            },
            {
                name: "retrain_model",
                description: "Retrain the ML model with current data",
                parameters: {
                    type: "object",
                    properties: {
                        force: {
                            type: "boolean",
                            description: "Force retraining even if model is up to date",
                            default: false
                        }
                    }
                }
            }
        ];
    }

    defineResources() {
        return [
            {
                uri: "worker-assignment://analytics/dashboard",
                name: "System Analytics Dashboard",
                description: "Real-time analytics and performance metrics",
                mimeType: "application/json"
            },
            {
                uri: "worker-assignment://data/training-summary",
                name: "Training Data Summary",
                description: "Summary of historical training data",
                mimeType: "application/json"
            },
            {
                uri: "worker-assignment://model/status",
                name: "Model Status",
                description: "Current model training status and metadata",
                mimeType: "application/json"
            }
        ];
    }

    async initialize() {
        console.log('🚀 Initializing Worker Assignment ML MCP Server...');
        
        try {
            // Initialize our ML system
            this.appService = new AppService();
            await this.appService.initialize();
            
            console.log('✅ ML System initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize ML system:', error.message);
            throw error;
        }
    }

    async startServer() {
        // Create HTTP server for REST API
        this.server = http.createServer((req, res) => {
            this.handleHttpRequest(req, res);
        });

        // Create WebSocket server for real-time communication
        this.wss = new WebSocket.Server({ server: this.server });
        this.wss.on('connection', (ws) => {
            this.handleWebSocketConnection(ws);
        });

        return new Promise((resolve, reject) => {
            this.server.listen(this.port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`🌟 Worker Assignment ML MCP Server running on port ${this.port}`);
                    console.log(`📡 HTTP endpoint: http://localhost:${this.port}`);
                    console.log(`🔌 WebSocket endpoint: ws://localhost:${this.port}`);
                    console.log(`📊 Available tools: ${this.tools.map(t => t.name).join(', ')}`);
                    resolve();
                }
            });
        });
    }

    async handleHttpRequest(req, res) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        try {
            if (pathname === '/mcp/tools' && req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ tools: this.tools }));
                
            } else if (pathname === '/mcp/resources' && req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ resources: this.resources }));
                
            } else if (pathname === '/mcp/tools/call' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const { name, arguments: args } = JSON.parse(body);
                        const result = await this.callTool(name, args);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ result }));
                    } catch (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message }));
                    }
                });
                
            } else if (pathname.startsWith('/mcp/resources/') && req.method === 'GET') {
                const resourceUri = decodeURIComponent(pathname.substring('/mcp/resources/'.length));
                const resource = await this.getResource(resourceUri);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ resource }));
                
            } else if (pathname === '/mcp/status' && req.method === 'GET') {
                const status = await this.getServerStatus();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status }));
                
            } else if (pathname === '/' && req.method === 'GET') {
                // Serve a simple HTML dashboard
                const html = this.generateDashboardHtml();
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
                
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not found' }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }

    handleWebSocketConnection(ws) {
        console.log('📱 New WebSocket connection established');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());
                let response;

                switch (data.type) {
                    case 'list_tools':
                        response = { type: 'tools', data: this.tools };
                        break;
                    case 'list_resources':
                        response = { type: 'resources', data: this.resources };
                        break;
                    case 'call_tool':
                        const result = await this.callTool(data.name, data.arguments);
                        response = { type: 'tool_result', data: result };
                        break;
                    case 'get_resource':
                        const resource = await this.getResource(data.uri);
                        response = { type: 'resource', data: resource };
                        break;
                    case 'ping':
                        response = { type: 'pong', timestamp: Date.now() };
                        break;
                    default:
                        response = { type: 'error', message: 'Unknown message type' };
                }

                ws.send(JSON.stringify(response));
            } catch (error) {
                ws.send(JSON.stringify({ type: 'error', message: error.message }));
            }
        });

        ws.on('close', () => {
            console.log('📱 WebSocket connection closed');
        });

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'welcome',
            message: 'Connected to Worker Assignment ML MCP Server',
            tools: this.tools.length,
            resources: this.resources.length
        }));
    }

    async callTool(name, args) {
        const startTime = Date.now();
        
        try {
            let result;

            switch (name) {
                case "predict_worker_assignment":
                    result = await this.handlePredictWorkerAssignment(args);
                    break;
                case "get_worker_performance":
                    result = await this.handleGetWorkerPerformance(args);
                    break;
                case "get_system_analytics":
                    result = await this.handleGetSystemAnalytics(args);
                    break;
                case "add_training_data":
                    result = await this.handleAddTrainingData(args);
                    break;
                case "retrain_model":
                    result = await this.handleRetrainModel(args);
                    break;
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }

            const duration = Date.now() - startTime;
            console.log(`📡 Tool call: ${name} completed in ${duration}ms`);
            
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ Tool call: ${name} failed in ${duration}ms:`, error.message);
            throw error;
        }
    }

    // Tool implementations (same as before)
    async handlePredictWorkerAssignment(args) {
        const { machineId, complexity, includeAnalysis = false } = args;
        
        const mlSystem = this.appService.mlService.getMLSystem();
        const prediction = mlSystem.predictWorkerML(machineId, complexity, false);
        
        let response = `🎯 **Worker Assignment Prediction**\n\n`;
        response += `**Job Details:**\n`;
        response += `- Machine Type: ${machineId}\n`;
        response += `- Complexity Level: ${complexity}\n\n`;
        response += `**Recommended Worker:** ${prediction.recommendedWorker}\n`;
        response += `**Predicted Completion Time:** ${prediction.estimatedTime.toFixed(1)} minutes\n`;
        response += `**Confidence Score:** ${(prediction.confidence * 100).toFixed(1)}%\n`;

        if (includeAnalysis) {
            response += `\n**Detailed Analysis:**\n`;
            response += `- Machine Experience: ${prediction.jobCount || 0} jobs completed\n`;
            response += `- Average Quality Score: ${prediction.avgQuality ? prediction.avgQuality.toFixed(1) : 'N/A'}%\n`;
            response += `- Performance Rank: ${prediction.rank || 'N/A'}\n`;
        }

        return { text: response, prediction };
    }

    async handleGetWorkerPerformance(args) {
        const { workerId, machineId } = args;
        
        const mlSystem = this.appService.mlService.getMLSystem();
        
        if (!mlSystem.workers.includes(workerId)) {
            return { text: `👤 **Worker Performance Analysis: ${workerId}**\n\nWorker ${workerId} not found in the system.`, workerId };
        }

        let response = `👤 **Worker Performance Analysis: ${workerId}**\n\n`;
        response += `**Overall Statistics:**\n`;
        response += `- Status: Active Worker\n`;
        response += `- System Recognition: Trained\n`;
        response += `- Available for Assignment: Yes\n\n`;

        // Get worker's historical data
        const workerData = mlSystem.trainingData.filter(d => d.workerId === workerId);
        if (workerData.length > 0) {
            const avgTime = workerData.reduce((sum, d) => sum + d.timeMinutes, 0) / workerData.length;
            const avgQuality = workerData.reduce((sum, d) => sum + d.qualityScore, 0) / workerData.length;
            
            response += `**Performance Metrics:**\n`;
            response += `- Total Jobs Completed: ${workerData.length}\n`;
            response += `- Average Completion Time: ${avgTime.toFixed(1)} minutes\n`;
            response += `- Average Quality Score: ${avgQuality.toFixed(1)}%\n`;

            if (machineId) {
                const machineData = workerData.filter(d => d.machineId === parseInt(machineId));
                if (machineData.length > 0) {
                    const machineAvgTime = machineData.reduce((sum, d) => sum + d.timeMinutes, 0) / machineData.length;
                    const machineAvgQuality = machineData.reduce((sum, d) => sum + d.qualityScore, 0) / machineData.length;
                    
                    response += `\n**Machine ${machineId} Specialization:**\n`;
                    response += `- Jobs on Machine ${machineId}: ${machineData.length}\n`;
                    response += `- Average Time: ${machineAvgTime.toFixed(1)} minutes\n`;
                    response += `- Average Quality: ${machineAvgQuality.toFixed(1)}%\n`;
                }
            }
        }

        return { text: response, workerId };
    }

    async handleGetSystemAnalytics(args) {
        const analytics = this.appService.getStatus();
        
        let response = `📊 **Worker Assignment ML System Analytics**\n\n`;
        response += `**System Status:** ${analytics.status}\n`;
        response += `**Data Statistics:**\n`;
        response += `- Total Training Records: ${analytics.data.records || 'Unknown'}\n`;
        response += `- Data File Size: ${analytics.data.size || 'Unknown'} bytes\n`;
        response += `- Data File Exists: ${analytics.data.exists ? 'Yes' : 'No'}\n\n`;
        
        response += `**Model Information:**\n`;
        response += `- Model Status: ${analytics.model.status}\n`;
        response += `- Algorithm: ${analytics.model.algorithm}\n`;
        response += `- Is Ready: ${analytics.ready ? 'Yes' : 'No'}\n\n`;

        if (analytics.mcp) {
            response += `**MCP Integration:**\n`;
            response += `- MCP Server Running: ${analytics.mcp.isServerRunning ? 'Yes' : 'No'}\n`;
            response += `- Total Interactions: ${analytics.mcp.totalInteractions}\n`;
            response += `- Available Tools: ${analytics.mcp.capabilities.tools.length}\n`;
            response += `- Available Resources: ${analytics.mcp.capabilities.resources.length}\n`;
        }

        return { text: response, analytics };
    }

    async handleAddTrainingData(args) {
        const { data, retrain = true } = args;
        
        const mlSystem = this.appService.mlService.getMLSystem();
        mlSystem.addHistoricalData(data);
        
        let response = `✅ **Training Data Added Successfully**\n\n`;
        response += `- Records Added: ${data.length}\n`;
        response += `- Total Records: ${mlSystem.trainingData.length}\n`;

        if (retrain) {
            mlSystem.train();
            response += `- Model Retrained: Yes\n`;
        }

        return { text: response, added: data.length };
    }

    async handleRetrainModel(args) {
        const { force = false } = args;
        
        const mlSystem = this.appService.mlService.getMLSystem();
        
        if (!force && mlSystem.isModelTrained) {
            return { text: `ℹ️ **Model Already Trained**\n\nModel is up to date with ${mlSystem.trainingData.length} training records. Use force=true to retrain anyway.`, retrained: false };
        }

        mlSystem.train();
        
        const response = `🔄 **Model Retrained Successfully**\n\n` +
                       `- Training Data Size: ${mlSystem.trainingData.length} records\n` +
                       `- Algorithm: K-Nearest Neighbors (k=3)\n` +
                       `- Status: Ready for predictions\n` +
                       `- Timestamp: ${new Date().toISOString()}`;

        return { text: response, retrained: true };
    }

    async getResource(uri) {
        switch (uri) {
            case "worker-assignment://analytics/dashboard":
                return await this.getAnalyticsDashboard();
            case "worker-assignment://data/training-summary":
                return await this.getTrainingDataSummary();
            case "worker-assignment://model/status":
                return await this.getModelStatus();
            default:
                throw new Error(`Unknown resource: ${uri}`);
        }
    }

    async getAnalyticsDashboard() {
        const analytics = this.appService.getStatus();
        return {
            uri: "worker-assignment://analytics/dashboard",
            mimeType: "application/json",
            content: {
                timestamp: new Date().toISOString(),
                system: analytics,
                performance: {
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage(),
                    nodeVersion: process.version
                }
            }
        };
    }

    async getTrainingDataSummary() {
        const summary = this.appService.dataService.getDataInfo();
        return {
            uri: "worker-assignment://data/training-summary",
            mimeType: "application/json",
            content: summary
        };
    }

    async getModelStatus() {
        const status = {
            isModelTrained: this.appService.mlService.isReady(),
            workers: this.appService.mlService.getWorkers(),
            machines: [1, 2, 3, 4, 5],
            lastUpdate: new Date().toISOString()
        };

        return {
            uri: "worker-assignment://model/status",
            mimeType: "application/json",
            content: status
        };
    }

    async getServerStatus() {
        return {
            server: 'Worker Assignment ML MCP Server',
            version: '1.0.0',
            status: 'running',
            uptime: process.uptime(),
            tools: this.tools.length,
            resources: this.resources.length,
            mlSystem: this.appService.getStatus()
        };
    }

    generateDashboardHtml() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Worker Assignment ML MCP Server</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2196F3; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .tools, .resources { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .tool, .resource { border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9; }
        .tool h4, .resource h4 { margin: 0 0 10px 0; color: #333; }
        .description { color: #666; font-size: 14px; }
        .endpoint { background: #e8f5e8; padding: 10px; border-radius: 3px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Worker Assignment ML MCP Server</h1>
            <p>Model Context Protocol server for intelligent worker assignment predictions</p>
        </div>

        <div class="card">
            <h2>📡 Server Endpoints</h2>
            <div class="endpoint">HTTP API: http://localhost:${this.port}</div>
            <div class="endpoint">WebSocket: ws://localhost:${this.port}</div>
        </div>

        <div class="card">
            <h2>🛠️ Available Tools</h2>
            <div class="tools">
                ${this.tools.map(tool => `
                    <div class="tool">
                        <h4>${tool.name}</h4>
                        <div class="description">${tool.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <h2>📋 Available Resources</h2>
            <div class="resources">
                ${this.resources.map(resource => `
                    <div class="resource">
                        <h4>${resource.name}</h4>
                        <div class="description">${resource.description}</div>
                        <div style="margin-top: 10px; font-family: monospace; font-size: 12px;">${resource.uri}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <h2>🚀 Quick Start</h2>
            <p>Use the following endpoints to interact with the MCP server:</p>
            <ul>
                <li><strong>GET /mcp/tools</strong> - List available tools</li>
                <li><strong>POST /mcp/tools/call</strong> - Call a tool</li>
                <li><strong>GET /mcp/resources</strong> - List available resources</li>
                <li><strong>GET /mcp/status</strong> - Get server status</li>
            </ul>
        </div>
    </div>

    <script>
        // Add some basic interactivity
        console.log('Worker Assignment ML MCP Server Dashboard loaded');
        
        // Connect to WebSocket for real-time updates
        const ws = new WebSocket('ws://localhost:${this.port}');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message:', data);
        };
    </script>
</body>
</html>
        `;
    }

    async stop() {
        if (this.wss) {
            this.wss.close();
        }
        if (this.server) {
            this.server.close();
        }
        await this.appService.cleanup();
    }
}

// Run the server if this file is executed directly
if (require.main === module) {
    const server = new WorkerAssignmentMCPServer();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down MCP server...');
        await server.stop();
        process.exit(0);
    });
    
    server.initialize()
        .then(() => server.startServer())
        .catch(error => {
            console.error('Failed to start MCP server:', error);
            process.exit(1);
        });
}

module.exports = WorkerAssignmentMCPServer;
