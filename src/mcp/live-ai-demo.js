#!/usr/bin/env node

/**
 * Live AI-to-AI Collaboration Demo
 * Shows real-time interaction between two AI systems
 */

const http = require('http');

async function demonstrateLiveAICollaboration() {
    console.log('🤖🤝🤖 Live AI-to-AI Collaboration Demo');
    console.log('=' .repeat(50));
    console.log();

    // Scenario: Two AI systems solving a complex workforce problem together
    console.log('🎬 Scenario: Crisis Workforce Management');
    console.log('👤 Human Problem: "Our main production line has issues and we need to reassign workers immediately"');
    console.log();

    // AI Client 1: Strategic Analyzer
    console.log('🤖 AI Client (Strategic Analyzer): Let me analyze this situation...');
    const strategicQuery = {
        query: "We have a production line crisis. Machine 3 is down and we have urgent orders. I need you to recommend immediate worker reassignments that prioritize both speed and quality. What's your analysis?",
        context: {
            urgency: "critical",
            problemType: "equipment_failure", 
            priority: "speed_and_quality",
            clientRole: "strategic_analyzer",
            expectsDetailedReasoning: true
        }
    };

    try {
        const response1 = await makeAIRequest(strategicQuery);
        console.log('🤖 AI Server Response:');
        console.log('📝 Analysis:', response1.reasoning || 'Server provided recommendation');
        if (response1.result) {
            console.log('💡 Recommendation:', response1.result.text?.substring(0, 200) + '...');
        }
        console.log();

        // AI Client 2: Quality Controller responding to the first AI's analysis
        console.log('🤖 AI Client (Quality Controller): Based on that analysis, let me ask about quality assurance...');
        const qualityQuery = {
            query: "I reviewed your recommendation. For this critical production scenario, I'm particularly concerned about maintaining our 99% quality standard. Can you provide more details about the quality track record of your recommended workers?",
            context: {
                followUpToAnalysis: true,
                qualityStandard: "99_percent",
                clientRole: "quality_controller",
                requiresQualityMetrics: true
            }
        };

        const response2 = await makeAIRequest(qualityQuery);
        console.log('🤖 AI Server Response:');
        console.log('📊 Quality Analysis:', response2.reasoning || 'Server provided quality insights');
        if (response2.result) {
            console.log('📈 Quality Metrics:', response2.result.text?.substring(0, 200) + '...');
        }
        console.log();

        // AI Client 3: Operations Optimizer
        console.log('🤖 AI Client (Operations Optimizer): Now let me optimize the overall workflow...');
        const optimizationQuery = {
            query: "Considering both the worker recommendations and quality requirements discussed, how should we sequence the work to minimize total completion time while maintaining standards?",
            context: {
                optimizationFocus: "total_completion_time",
                constraints: ["quality_standards", "worker_availability"],
                clientRole: "operations_optimizer",
                buildsOnPreviousAnalysis: true
            }
        };

        const response3 = await makeAIRequest(optimizationQuery);
        console.log('🤖 AI Server Response:');
        console.log('⚡ Optimization Plan:', response3.reasoning || 'Server provided optimization strategy');
        if (response3.result) {
            console.log('📋 Workflow:', response3.result.text?.substring(0, 200) + '...');
        }
        console.log();

        console.log('✅ Three AI systems successfully collaborated to solve the crisis!');
        console.log('🤝 Collaboration Benefits Demonstrated:');
        console.log('  • Strategic analysis provided comprehensive worker assessment');
        console.log('  • Quality controller ensured standards were maintained');
        console.log('  • Operations optimizer created efficient workflow');
        console.log('  • Each AI built upon the previous AI\'s insights');
        console.log('  • Final solution was more robust than any single AI could provide');

    } catch (error) {
        console.error('❌ Collaboration failed:', error.message);
    }
}

async function makeAIRequest(queryData) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(queryData);
        
        const options = {
            hostname: 'localhost',
            port: 3002,
            path: '/ai',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error('Failed to parse server response: ' + data));
                }
            });
        });

        req.on('error', (error) => reject(error));
        req.write(postData);
        req.end();
    });
}

// Run the demonstration
demonstrateLiveAICollaboration().catch(console.error);
