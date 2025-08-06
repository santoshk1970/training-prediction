#!/usr/bin/env node

/**
 * AI MCP Demo Client
 * 
 * This demo showcases the difference between a web wrapper and real AI MCP:
 * - Natural language understanding
 * - Context-aware reasoning
 * - Intelligent responses
 * - Learning and adaptation
 */

const http = require('http');
const WebSocket = require('ws');

class AIMCPDemo {
    constructor() {
        this.serverUrl = 'http://localhost:3002';
        this.wsUrl = 'ws://localhost:3002';
    }

    async runDemo() {
        console.log('🧠 AI MCP Demo - Showcasing Real AI Capabilities');
        console.log('=' .repeat(60));

        try {
            console.log('\n🚀 Starting AI MCP Server Demo...\n');

            // Test 1: Natural Language Understanding
            await this.testNaturalLanguageUnderstanding();

            // Test 2: Context-Aware Reasoning
            await this.testContextAwareReasoning();

            // Test 3: Intelligent Conversations
            await this.testIntelligentConversations();

            // Test 4: Learning and Adaptation
            await this.testLearningCapabilities();

            // Test 5: Proactive Insights
            await this.testProactiveInsights();

            // Test 6: WebSocket AI Interaction
            await this.testWebSocketAI();

            console.log('\n✅ AI MCP Demo completed successfully!');
            console.log('\nKey Differences from Web Wrapper:');
            console.log('• 🧠 Understands natural language instead of rigid parameters');
            console.log('• 🎯 Provides context-aware reasoning and explanations');
            console.log('• 💬 Maintains conversational context and memory');
            console.log('• 📚 Learns from interactions and improves over time');
            console.log('• 💡 Offers proactive insights and recommendations');
            console.log('• 🤖 True AI-to-AI communication capabilities');

        } catch (error) {
            console.error('❌ Demo failed:', error.message);
            console.log('\n💡 Make sure the AI MCP server is running: node src/mcp/ai-server.js');
        }
    }

    async testNaturalLanguageUnderstanding() {
        console.log('🗣️  TEST 1: Natural Language Understanding');
        console.log('-'.repeat(50));

        const naturalQueries = [
            "Who should work on Machine 1 for an urgent precision job?",
            "I need someone fast for a simple task on Machine 3",
            "Find the best worker for complex work that requires high quality",
            "Who can handle a rush order on Machine 2?"
        ];

        for (const query of naturalQueries) {
            console.log(`\n🤔 Human Query: "${query}"`);
            
            try {
                const response = await this.sendAIQuery(query);
                
                if (response.error) {
                    console.log(`❌ Error: ${response.error}`);
                    console.log(`💡 Suggestion: ${response.ai_suggestion || 'Try rephrasing the query'}`);
                    continue;
                }
                
                console.log(`🎯 AI Understood: ${response.understood_intent?.primary?.type || 'unknown'} (${Math.round((response.understood_intent?.primary?.confidence || 0.5) * 100)}% confidence)`);
                console.log(`🧠 AI Reasoning: ${(response.reasoning || 'No reasoning provided').substring(0, 100)}...`);
                console.log(`💬 AI Response: ${(response.natural_response || 'No response').substring(0, 150)}...`);
            } catch (error) {
                console.log(`❌ Connection Error: ${error.message}`);
            }
        }
    }

    async testContextAwareReasoning() {
        console.log('\n\n🎯 TEST 2: Context-Aware Reasoning');
        console.log('-'.repeat(50));

        // Test with different contexts
        const contextualQueries = [
            {
                query: "Assign a worker for Machine 1",
                context: { urgency: "high", timeConstraint: "urgent" },
                description: "Urgent context"
            },
            {
                query: "Assign a worker for Machine 1", 
                context: { qualityFocus: "high", requirements: "precision" },
                description: "Quality-focused context"
            },
            {
                query: "Assign a worker for Machine 1",
                context: { workload: "heavy", availability: "limited" },
                description: "Limited availability context"
            }
        ];

        for (const test of contextualQueries) {
            console.log(`\n📋 Context: ${test.description}`);
            console.log(`🤔 Query: "${test.query}"`);
            
            const response = await this.sendAIQuery(test.query, test.context);
            
            console.log(`🧠 Context Analysis: ${JSON.stringify(response.context_analysis.environmental_factors || {}, null, 2)}`);
            console.log(`💡 AI Decision: ${response.natural_response.substring(0, 120)}...`);
        }
    }

    async testIntelligentConversations() {
        console.log('\n\n💬 TEST 3: Intelligent Conversations');
        console.log('-'.repeat(50));

        const conversation = [
            "What's the current status of the system?",
            "Can you recommend a worker for urgent work?", 
            "What if the quality requirements are very high?",
            "How can we improve the prediction accuracy?"
        ];

        const conversationId = 'demo_conversation_' + Date.now();

        for (let i = 0; i < conversation.length; i++) {
            console.log(`\n👤 User [${i + 1}]: ${conversation[i]}`);
            
            const response = await this.sendConversationalMessage(conversation[i], conversationId);
            
            console.log(`🤖 AI [${i + 1}]: ${response.natural_response}`);
            
            if (response.suggestions && response.suggestions.length > 0) {
                console.log(`💡 Suggestions: ${response.suggestions.join(', ')}`);
            }
        }
    }

    async testLearningCapabilities() {
        console.log('\n\n📚 TEST 4: Learning and Adaptation');
        console.log('-'.repeat(50));

        // Get initial learning status
        console.log('\n📊 Initial Learning Status:');
        const initialStatus = await this.getCapabilities();
        console.log(`• Interactions: ${initialStatus.learning_status.total_interactions}`);
        console.log(`• Learned Patterns: ${initialStatus.learning_status.learned_patterns}`);

        // Send some queries to generate learning
        const learningQueries = [
            "urgent assignment for Machine 1",
            "quality work on Machine 2", 
            "fast completion needed",
            "precision requirements"
        ];

        console.log('\n🧠 Teaching AI through interactions...');
        for (const query of learningQueries) {
            await this.sendAIQuery(query);
            console.log(`✓ Processed: "${query}"`);
        }

        // Check learning progress
        console.log('\n📈 Updated Learning Status:');
        const updatedStatus = await this.getCapabilities();
        console.log(`• Interactions: ${updatedStatus.learning_status.total_interactions}`);
        console.log(`• Learned Patterns: ${updatedStatus.learning_status.learned_patterns}`);
        console.log(`• Learning Effectiveness: ${updatedStatus.learning_status.effectiveness}`);
    }

    async testProactiveInsights() {
        console.log('\n\n💡 TEST 5: Proactive Insights');
        console.log('-'.repeat(50));

        console.log('\n🔮 Requesting proactive insights...');
        const insights = await this.getProactiveInsights();

        if (insights.insights && insights.insights.length > 0) {
            insights.insights.forEach((insight, index) => {
                console.log(`\n${index + 1}. ${insight.type.toUpperCase()} (${insight.priority} priority)`);
                console.log(`   💬 ${insight.message}`);
            });
        } else {
            console.log('🤖 AI: System is running optimally. I\'ll provide insights as opportunities arise.');
        }
    }

    async testWebSocketAI() {
        console.log('\n\n🔌 TEST 6: Real-time WebSocket AI');
        console.log('-'.repeat(50));

        return new Promise((resolve) => {
            console.log('\n🌐 Connecting to AI WebSocket...');
            
            const ws = new WebSocket(this.wsUrl);
            let messageCount = 0;

            ws.on('open', () => {
                console.log('✅ Connected to AI WebSocket');

                // Test real-time AI queries
                const realtimeQueries = [
                    "Who's available for urgent work?",
                    "What's the system performance?",
                    "Any recommendations for improving efficiency?"
                ];

                realtimeQueries.forEach((query, index) => {
                    setTimeout(() => {
                        console.log(`\n📤 Sending: "${query}"`);
                        ws.send(JSON.stringify({
                            type: 'ai_query',
                            query: query,
                            context: { realtime: true }
                        }));
                    }, index * 2000);
                });

                // Close connection after tests
                setTimeout(() => {
                    ws.close();
                    resolve();
                }, 8000);
            });

            ws.on('message', (data) => {
                const message = JSON.parse(data.toString());
                messageCount++;

                switch (message.type) {
                    case 'ai_welcome':
                        console.log(`🤖 ${message.message}`);
                        console.log(`🎯 AI Capabilities: ${Object.keys(message.capabilities).join(', ')}`);
                        break;
                    case 'ai_response':
                        console.log(`📥 AI Response: ${message.data.natural_response.substring(0, 100)}...`);
                        console.log(`🎯 Confidence: ${Math.round(message.data.confidence * 100)}%`);
                        break;
                    case 'insights':
                        console.log(`💡 Real-time Insights: ${message.data.insights.length} insights received`);
                        break;
                }
            });

            ws.on('error', (error) => {
                console.error('🚨 WebSocket error:', error.message);
                resolve();
            });

            ws.on('close', () => {
                console.log(`✅ WebSocket connection closed. Processed ${messageCount} messages.`);
                resolve();
            });
        });
    }

    async sendAIQuery(query, context = {}) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify({ query, context });
            
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: '/ai/query',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });

            req.on('error', reject);
            req.write(postData);
            req.end();
        });
    }

    async sendConversationalMessage(message, conversationId) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify({ message, conversation_id: conversationId });
            
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: '/ai/conversation',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });

            req.on('error', reject);
            req.write(postData);
            req.end();
        });
    }

    async getCapabilities() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: '/ai/capabilities',
                method: 'GET'
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });

            req.on('error', reject);
            req.end();
        });
    }

    async getProactiveInsights() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3002,
                path: '/ai/insights',
                method: 'GET'
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });

            req.on('error', reject);
            req.end();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Show comparison between web wrapper and AI MCP
async function showComparison() {
    console.log('\n' + '='.repeat(60));
    console.log('🔄 COMPARISON: Web Wrapper vs Real AI MCP');
    console.log('='.repeat(60));

    console.log('\n📱 WEB WRAPPER APPROACH (Original server.js):');
    console.log('• Fixed API endpoints with rigid parameters');
    console.log('• Direct mapping to ML functions');
    console.log('• No understanding of context or intent');
    console.log('• Simple JSON request/response');
    console.log('• Example: POST /mcp/tools/call {"name": "predict_worker", "arguments": {"machineId": 1}}');

    console.log('\n🧠 REAL AI MCP APPROACH (ai-server.js):');
    console.log('• Natural language understanding');
    console.log('• Context-aware reasoning and decision making');
    console.log('• Conversational memory and learning');
    console.log('• Intelligent response generation');
    console.log('• Example: POST /ai/query {"query": "Who should work on urgent precision job?"}');

    console.log('\n🎯 KEY AI MCP BENEFITS:');
    console.log('• Semantic understanding replaces rigid parameter mapping');
    console.log('• Context awareness enables intelligent decision making');
    console.log('• Learning capabilities improve performance over time');
    console.log('• Natural language interface reduces integration complexity');
    console.log('• Proactive insights provide value beyond simple queries');
    console.log('• True AI-to-AI communication for collaborative workflows');
}

// Run the demo
if (require.main === module) {
    const demo = new AIMCPDemo();
    
    console.log('🚀 AI MCP Demo Client');
    console.log('Make sure AI MCP server is running on port 3002');
    console.log('Start with: node src/mcp/ai-server.js\n');

    // Show comparison first
    showComparison();

    // Wait a moment then run the demo
    setTimeout(() => {
        demo.runDemo().catch(error => {
            console.error('Demo failed:', error.message);
            console.log('\nTo run the AI MCP server:');
            console.log('node src/mcp/ai-server.js');
        });
    }, 2000);
}

module.exports = AIMCPDemo;
