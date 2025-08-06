/**
 * MCP Service
 * 
 * This service manages Model Context Protocol functionality within
 * the Worker Assignment ML system, providing integration between
 * the MCP server and the existing service architecture.
 */

const WorkerAssignmentMCPServer = require('../mcp/server');
const path = require('path');
const fs = require('fs').promises;

class MCPService {
    constructor(appService) {
        this.appService = appService;
        this.mcpServer = null;
        this.isServerRunning = false;
        this.serverPort = process.env.MCP_PORT || 3001;
        this.interactions = [];
        this.maxInteractionHistory = 100;
    }

    /**
     * Initialize the MCP service
     */
    async initialize() {
        console.log('🔧 Initializing MCP Service...');
        
        try {
            // Create MCP server instance with our app service
            this.mcpServer = new WorkerAssignmentMCPServer();
            
            // Override the server's app service with our existing one
            this.mcpServer.appService = this.appService;
            this.mcpServer.dataService = this.appService.dataService;
            this.mcpServer.mlService = this.appService.mlService;
            
            console.log('✅ MCP Service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize MCP Service:', error.message);
            throw error;
        }
    }

    /**
     * Start the MCP server
     */
    async startServer() {
        if (this.isServerRunning) {
            console.log('ℹ️ MCP Server is already running');
            return;
        }

        console.log('🚀 Starting MCP Server...');
        
        try {
            // Note: The actual server startup is handled by the MCP server itself
            // This method mainly tracks the state and provides hooks for monitoring
            this.isServerRunning = true;
            
            console.log(`✅ MCP Server ready on stdio transport`);
            console.log('📡 Available MCP endpoints:');
            console.log('   - predict_worker_assignment');
            console.log('   - get_worker_performance');
            console.log('   - get_system_analytics');
            console.log('   - add_training_data');
            console.log('   - retrain_model');
            
        } catch (error) {
            console.error('❌ Failed to start MCP Server:', error.message);
            this.isServerRunning = false;
            throw error;
        }
    }

    /**
     * Stop the MCP server
     */
    async stopServer() {
        if (!this.isServerRunning) {
            console.log('ℹ️ MCP Server is not running');
            return;
        }

        console.log('🛑 Stopping MCP Server...');
        
        try {
            this.isServerRunning = false;
            console.log('✅ MCP Server stopped');
        } catch (error) {
            console.error('❌ Failed to stop MCP Server:', error.message);
            throw error;
        }
    }

    /**
     * Log an MCP interaction for monitoring and debugging
     */
    logInteraction(type, data) {
        const interaction = {
            timestamp: new Date().toISOString(),
            type, // 'tool_call', 'resource_read', etc.
            data,
            id: this.generateInteractionId()
        };

        this.interactions.push(interaction);
        
        // Keep only the most recent interactions
        if (this.interactions.length > this.maxInteractionHistory) {
            this.interactions = this.interactions.slice(-this.maxInteractionHistory);
        }

        // Log to console for debugging
        console.log(`📡 MCP ${type}:`, {
            id: interaction.id,
            timestamp: interaction.timestamp,
            ...data
        });
    }

    /**
     * Get MCP interaction history
     */
    getInteractionHistory(limit = 10) {
        return this.interactions
            .slice(-limit)
            .reverse(); // Most recent first
    }

    /**
     * Get MCP service status
     */
    getStatus() {
        return {
            isServerRunning: this.isServerRunning,
            serverPort: this.serverPort,
            totalInteractions: this.interactions.length,
            recentInteractions: this.getInteractionHistory(5),
            capabilities: {
                tools: [
                    'predict_worker_assignment',
                    'get_worker_performance', 
                    'get_system_analytics',
                    'add_training_data',
                    'retrain_model'
                ],
                resources: [
                    'worker-assignment://analytics/dashboard',
                    'worker-assignment://data/training-summary',
                    'worker-assignment://model/status'
                ]
            }
        };
    }

    /**
     * Enhanced prediction with MCP logging
     */
    async predictWorkerWithLogging(machineId, complexity, includeAnalysis = false) {
        const startTime = Date.now();
        
        try {
            // Log the request
            this.logInteraction('prediction_request', {
                machineId,
                complexity,
                includeAnalysis
            });

            // Make the prediction using our ML service
            const prediction = await this.appService.mlService.predictBestWorker(machineId, complexity);
            
            const duration = Date.now() - startTime;
            
            // Log the response
            this.logInteraction('prediction_response', {
                workerId: prediction.workerId,
                estimatedTime: prediction.estimatedTime,
                confidence: prediction.confidence,
                duration: `${duration}ms`
            });

            return prediction;
            
        } catch (error) {
            this.logInteraction('prediction_error', {
                error: error.message,
                duration: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    }

    /**
     * Enhanced analytics with MCP context
     */
    async getAnalyticsWithMCPContext() {
        const systemAnalytics = await this.appService.getStatus();
        const mcpStatus = this.getStatus();
        
        return {
            ...systemAnalytics,
            mcp: mcpStatus,
            integration: {
                mcpEnabled: true,
                protocolVersion: '1.0.0',
                lastInteraction: this.interactions.length > 0 ? 
                    this.interactions[this.interactions.length - 1].timestamp : null
            }
        };
    }

    /**
     * Create an MCP configuration for client connections
     */
    generateMCPConfig() {
        return {
            mcpServers: {
                "worker-assignment-ml": {
                    command: "node",
                    args: [path.join(__dirname, "../mcp/server.js")],
                    env: {
                        NODE_ENV: process.env.NODE_ENV || "development"
                    }
                }
            }
        };
    }

    /**
     * Save MCP configuration to file
     */
    async saveMCPConfig(configPath) {
        const config = this.generateMCPConfig();
        
        try {
            await fs.writeFile(
                configPath, 
                JSON.stringify(config, null, 2),
                'utf8'
            );
            
            console.log(`📄 MCP configuration saved to: ${configPath}`);
            return configPath;
            
        } catch (error) {
            console.error('❌ Failed to save MCP configuration:', error.message);
            throw error;
        }
    }

    /**
     * Generate a unique interaction ID
     */
    generateInteractionId() {
        return `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get performance metrics for MCP operations
     */
    getMCPMetrics() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        const recentInteractions = this.interactions.filter(
            interaction => new Date(interaction.timestamp).getTime() > oneHourAgo
        );

        const interactionsByType = recentInteractions.reduce((acc, interaction) => {
            acc[interaction.type] = (acc[interaction.type] || 0) + 1;
            return acc;
        }, {});

        return {
            totalInteractions: this.interactions.length,
            recentInteractions: recentInteractions.length,
            interactionsByType,
            averageInteractionsPerHour: recentInteractions.length,
            uptime: this.isServerRunning ? 'running' : 'stopped',
            memoryUsage: process.memoryUsage()
        };
    }

    /**
     * Cleanup MCP service resources
     */
    async cleanup() {
        console.log('🧹 Cleaning up MCP Service...');
        
        try {
            await this.stopServer();
            this.interactions = [];
            console.log('✅ MCP Service cleanup completed');
        } catch (error) {
            console.error('❌ MCP Service cleanup failed:', error.message);
        }
    }
}

module.exports = MCPService;
