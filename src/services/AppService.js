const DataService = require('./DataService');
const MLService = require('./MLService');
const DemoService = require('./DemoService');
const MCPService = require('./MCPService');

class AppService {
    constructor() {
        this.dataService = new DataService();
        this.mlService = new MLService();
        this.demoService = new DemoService(this.mlService);
        this.mcpService = new MCPService(this);
    }

    /**
     * Initialize the application
     */
    async initialize() {
        console.log('🎯 Worker Assignment ML System');
        console.log('==============================\n');

        try {
            // Load historical data
            const historicalData = await this.dataService.loadHistoricalData();
            
            // Initialize ML service
            await this.mlService.initialize(historicalData);
            
            // Initialize MCP service
            await this.mcpService.initialize();
            
            return { success: true, message: 'Application initialized successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Run the complete demo
     */
    async runDemo() {
        if (!this.mlService.isReady()) {
            throw new Error('Application not initialized. Call initialize() first.');
        }

        await this.demoService.runFullDemo();
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            status: this.mlService.isReady() ? 'Ready' : 'Initializing',
            data: this.dataService.getDataInfo(),
            model: this.mlService.getStatus(),
            mcp: this.mcpService.getStatus(),
            ready: this.mlService.isReady()
        };
    }

    /**
     * Get service instances for direct access
     */
    getServices() {
        return {
            data: this.dataService,
            ml: this.mlService,
            demo: this.demoService,
            mcp: this.mcpService
        };
    }

    /**
     * Start MCP server
     */
    async startMCPServer() {
        return await this.mcpService.startServer();
    }

    /**
     * Stop MCP server
     */
    async stopMCPServer() {
        return await this.mcpService.stopServer();
    }

    /**
     * Enhanced prediction with MCP logging
     */
    async predictWorkerWithMCP(machineId, complexity, includeAnalysis = false) {
        return await this.mcpService.predictWorkerWithLogging(machineId, complexity, includeAnalysis);
    }

    /**
     * Get analytics with MCP context
     */
    async getAnalyticsWithMCP() {
        return await this.mcpService.getAnalyticsWithMCPContext();
    }

    /**
     * Cleanup resources
     */
    async cleanup() {
        console.log('🧹 Cleaning up resources...');
        await this.mcpService.cleanup();
    }
}

module.exports = AppService;
