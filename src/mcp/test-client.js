#!/usr/bin/env node

/**
 * Worker Assignment ML MCP Test Client
 * 
 * This test client verifies that the MCP server is working correctly
 * by testing all available tools and resources.
 */

const { Client } = require('@modelcontextprotocol/sdk/client');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio');
const { spawn } = require('child_process');
const path = require('path');

class WorkerAssignmentMCPTestClient {
    constructor() {
        this.client = null;
        this.serverProcess = null;
        this.testResults = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    async initialize() {
        console.log('🧪 Starting Worker Assignment ML MCP Test Suite...\n');

        try {
            // Start the MCP server process
            const serverPath = path.join(__dirname, 'server.js');
            this.serverProcess = spawn('node', [serverPath], {
                stdio: ['pipe', 'pipe', 'inherit']
            });

            // Give the server a moment to start
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create client and connect to the server
            this.client = new Client(
                {
                    name: "worker-assignment-test-client",
                    version: "1.0.0"
                },
                {
                    capabilities: {}
                }
            );

            const transport = new StdioClientTransport({
                stdin: this.serverProcess.stdout,
                stdout: this.serverProcess.stdin
            });

            await this.client.connect(transport);
            console.log('✅ Connected to Worker Assignment ML MCP Server\n');

        } catch (error) {
            console.error('❌ Failed to initialize MCP test client:', error.message);
            throw error;
        }
    }

    async runTest(testName, testFunction) {
        console.log(`🔍 Testing: ${testName}`);
        
        try {
            await testFunction();
            this.testResults.passed++;
            this.testResults.tests.push({ name: testName, status: 'PASSED' });
            console.log(`✅ PASSED: ${testName}\n`);
        } catch (error) {
            this.testResults.failed++;
            this.testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
            console.log(`❌ FAILED: ${testName} - ${error.message}\n`);
        }
    }

    async runAllTests() {
        console.log('🎯 Running MCP Server Test Suite\n');
        console.log('=' * 60);

        // Test 1: Tools listing
        await this.runTest('List available tools', async () => {
            const response = await this.client.request('tools/list', {});
            
            if (!response.tools || !Array.isArray(response.tools)) {
                throw new Error('Expected tools array in response');
            }
            
            const expectedTools = [
                'predict_worker_assignment',
                'get_worker_performance', 
                'get_system_analytics',
                'add_training_data',
                'retrain_model'
            ];
            
            const toolNames = response.tools.map(t => t.name);
            for (const expectedTool of expectedTools) {
                if (!toolNames.includes(expectedTool)) {
                    throw new Error(`Missing expected tool: ${expectedTool}`);
                }
            }
        });

        // Test 2: System analytics
        await this.runTest('Get system analytics', async () => {
            const response = await this.client.request('tools/call', {
                name: 'get_system_analytics',
                arguments: { includeModelDetails: true }
            });
            
            if (!response.content || !response.content[0] || !response.content[0].text) {
                throw new Error('Expected text content in response');
            }
            
            const text = response.content[0].text;
            if (!text.includes('System Analytics')) {
                throw new Error('Response does not contain expected analytics content');
            }
        });

        // Test 3: Worker prediction
        await this.runTest('Predict worker assignment', async () => {
            const response = await this.client.request('tools/call', {
                name: 'predict_worker_assignment',
                arguments: {
                    machineId: 1,
                    complexity: 3,
                    includeAnalysis: true
                }
            });
            
            if (!response.content || !response.content[0] || !response.content[0].text) {
                throw new Error('Expected text content in response');
            }
            
            const text = response.content[0].text;
            if (!text.includes('Worker Assignment Prediction')) {
                throw new Error('Response does not contain expected prediction content');
            }
        });

        // Test 4: Invalid prediction parameters
        await this.runTest('Handle invalid prediction parameters', async () => {
            try {
                await this.client.request('tools/call', {
                    name: 'predict_worker_assignment',
                    arguments: {
                        machineId: 10, // Invalid machine ID
                        complexity: 3
                    }
                });
                throw new Error('Expected error for invalid machine ID');
            } catch (error) {
                // This should fail, which is what we expect
                if (!error.message.includes('machine') && !error.message.includes('Machine')) {
                    throw new Error('Expected machine-related error message');
                }
            }
        });

        // Test 5: Add training data
        await this.runTest('Add training data', async () => {
            const testData = [
                {
                    workerId: 'test_worker',
                    machineId: 1,
                    timeMinutes: 30.5,
                    qualityScore: 95.0
                }
            ];

            const response = await this.client.request('tools/call', {
                name: 'add_training_data',
                arguments: {
                    data: testData,
                    retrain: false // Don't retrain to speed up test
                }
            });
            
            if (!response.content || !response.content[0] || !response.content[0].text) {
                throw new Error('Expected text content in response');
            }
            
            const text = response.content[0].text;
            if (!text.includes('Training Data Added')) {
                throw new Error('Response does not contain expected training data confirmation');
            }
        });

        // Test 6: Model retraining
        await this.runTest('Retrain model', async () => {
            const response = await this.client.request('tools/call', {
                name: 'retrain_model',
                arguments: { force: true }
            });
            
            if (!response.content || !response.content[0] || !response.content[0].text) {
                throw new Error('Expected text content in response');
            }
            
            const text = response.content[0].text;
            if (!text.includes('Model Retrained') && !text.includes('Model Already Trained')) {
                throw new Error('Response does not contain expected retraining confirmation');
            }
        });

        // Test 7: Resources listing
        await this.runTest('List available resources', async () => {
            const response = await this.client.request('resources/list', {});
            
            if (!response.resources || !Array.isArray(response.resources)) {
                throw new Error('Expected resources array in response');
            }
            
            const expectedResources = [
                'worker-assignment://analytics/dashboard',
                'worker-assignment://data/training-summary',
                'worker-assignment://model/status'
            ];
            
            const resourceUris = response.resources.map(r => r.uri);
            for (const expectedResource of expectedResources) {
                if (!resourceUris.includes(expectedResource)) {
                    throw new Error(`Missing expected resource: ${expectedResource}`);
                }
            }
        });

        // Test 8: Read resource
        await this.runTest('Read analytics dashboard resource', async () => {
            const response = await this.client.request('resources/read', {
                uri: 'worker-assignment://analytics/dashboard'
            });
            
            if (!response.contents || !response.contents[0]) {
                throw new Error('Expected contents in resource response');
            }
            
            const content = response.contents[0];
            if (content.mimeType !== 'application/json') {
                throw new Error('Expected JSON content type');
            }
            
            // Verify it's valid JSON
            JSON.parse(content.text);
        });

        // Test 9: Worker performance (might not have data)
        await this.runTest('Get worker performance', async () => {
            const response = await this.client.request('tools/call', {
                name: 'get_worker_performance',
                arguments: { workerId: 'test_worker' }
            });
            
            if (!response.content || !response.content[0] || !response.content[0].text) {
                throw new Error('Expected text content in response');
            }
            
            const text = response.content[0].text;
            if (!text.includes('Worker Performance Analysis')) {
                throw new Error('Response does not contain expected worker performance content');
            }
        });

        // Test 10: Invalid tool name
        await this.runTest('Handle invalid tool name', async () => {
            try {
                await this.client.request('tools/call', {
                    name: 'nonexistent_tool',
                    arguments: {}
                });
                throw new Error('Expected error for invalid tool name');
            } catch (error) {
                if (!error.message.includes('Unknown tool') && !error.message.includes('nonexistent_tool')) {
                    throw new Error('Expected unknown tool error message');
                }
            }
        });
    }

    printTestResults() {
        console.log('\n📊 **Test Results Summary**');
        console.log('=' * 50);
        console.log(`Total Tests: ${this.testResults.passed + this.testResults.failed}`);
        console.log(`✅ Passed: ${this.testResults.passed}`);
        console.log(`❌ Failed: ${this.testResults.failed}`);
        console.log(`Success Rate: ${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)}%\n`);

        if (this.testResults.failed > 0) {
            console.log('❌ **Failed Tests:**');
            this.testResults.tests
                .filter(test => test.status === 'FAILED')
                .forEach(test => {
                    console.log(`   - ${test.name}: ${test.error}`);
                });
            console.log('');
        }

        console.log('✅ **Passed Tests:**');
        this.testResults.tests
            .filter(test => test.status === 'PASSED')
            .forEach(test => {
                console.log(`   - ${test.name}`);
            });
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up test environment...');
        
        if (this.client) {
            try {
                await this.client.close();
            } catch (error) {
                console.log('Note: Client cleanup had issues (this is normal)');
            }
        }
        
        if (this.serverProcess) {
            this.serverProcess.kill();
            
            // Wait a moment for cleanup
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('✅ Test cleanup completed');
    }
}

// Main execution
async function main() {
    const testClient = new WorkerAssignmentMCPTestClient();
    
    try {
        await testClient.initialize();
        await testClient.runAllTests();
        testClient.printTestResults();
        
        // Exit with error code if tests failed
        if (testClient.testResults.failed > 0) {
            console.log('\n❌ Some tests failed. Exiting with error code 1.');
            process.exit(1);
        } else {
            console.log('\n🎉 All tests passed! MCP server is working correctly.');
        }
        
    } catch (error) {
        console.error('\n❌ Test suite failed to run:', error.message);
        process.exit(1);
    } finally {
        await testClient.cleanup();
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n🛑 Test interrupted, cleaning up...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Test terminated, cleaning up...');
    process.exit(0);
});

// Run the tests if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = WorkerAssignmentMCPTestClient;
