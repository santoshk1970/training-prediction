#!/usr/bin/env node

/**
 * Example: AI Client Collaborating with AI MCP Server
 * 
 * This demonstrates true AI-to-AI collaboration where both
 * the client and server are intelligent systems that can
 * reason, learn, and adapt together.
 */

class IntelligentMCPClient {
    constructor() {
        this.serverUrl = 'http://localhost:3002'; // Our AI MCP server
        this.context = {
            currentProject: 'urgent_precision_parts',
            workloadPattern: 'high_morning_rush',
            qualityThreshold: 0.95,
            learningMode: true
        };
        this.memory = [];
        this.preferences = new Map();
    }

    // AI Client reasoning about what to request
    async planWorkAssignment(requirements) {
        console.log('🤖 AI Client: Analyzing requirements and planning request...');
        
        // Client AI reasoning
        const analysis = this.analyzeRequirements(requirements);
        const strategy = this.planStrategy(analysis);
        const contextualRequest = this.buildIntelligentRequest(strategy);
        
        console.log(`🧠 Client AI decided: ${strategy.reasoning}`);
        
        return contextualRequest;
    }

    analyzeRequirements(requirements) {
        // AI analyzes what the human really needs
        const analysis = {
            urgency: this.detectUrgency(requirements),
            complexity: this.assessComplexity(requirements),
            qualityNeeds: this.determineQualityNeeds(requirements),
            contextualFactors: this.identifyContext(requirements)
        };

        return analysis;
    }

    planStrategy(analysis) {
        // AI plans the best approach
        let strategy = {
            approach: 'standard_assignment',
            reasoning: 'Standard worker assignment request',
            contextToShare: {},
            learningObjectives: []
        };

        // Intelligent decision making
        if (analysis.urgency > 0.8) {
            strategy.approach = 'urgent_optimization';
            strategy.reasoning = 'High urgency detected - will request speed-optimized assignment with backup options';
            strategy.contextToShare.timeConstraint = 'critical';
            strategy.learningObjectives.push('track_urgent_assignment_success');
        }

        if (analysis.qualityNeeds > 0.9) {
            strategy.approach = 'quality_focused';
            strategy.reasoning = 'High quality requirements - will request precision-focused assignment with quality history';
            strategy.contextToShare.qualityFocus = 'maximum';
            strategy.learningObjectives.push('monitor_quality_outcomes');
        }

        return strategy;
    }

    buildIntelligentRequest(strategy) {
        // AI constructs a contextually rich request
        return {
            query: this.generateNaturalLanguageQuery(strategy),
            context: {
                ...strategy.contextToShare,
                clientCapabilities: {
                    canAdaptToSuggestions: true,
                    learningEnabled: true,
                    feedbackProvision: true
                },
                historicalContext: this.getRelevantHistory(),
                collaborationIntent: strategy.learningObjectives
            }
        };
    }

    generateNaturalLanguageQuery(strategy) {
        // AI generates natural language that conveys intent and context
        const baseQuery = "I need a worker assignment";
        
        if (strategy.approach === 'urgent_optimization') {
            return "I have an urgent situation requiring immediate worker assignment. Speed is critical but I can't compromise on basic quality. Can you recommend someone who handles pressure well?";
        }
        
        if (strategy.approach === 'quality_focused') {
            return "I need a worker assignment for precision work where quality is paramount. This is for a critical component that cannot have any defects. Who has the best track record for flawless execution?";
        }
        
        return baseQuery;
    }

    // AI Client collaborates with AI Server
    async collaborateWithServer(request) {
        console.log('🤝 AI Client: Initiating collaboration with AI Server...');
        
        try {
            // Send intelligent request to AI server
            const response = await fetch(`${this.serverUrl}/ai/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            const aiResponse = await response.json();
            
            // AI Client processes AI Server's response
            const processedResponse = this.processServerResponse(aiResponse);
            
            // AI Client learns from the interaction
            this.learnFromCollaboration(request, aiResponse, processedResponse);
            
            return processedResponse;
            
        } catch (error) {
            console.error('❌ Collaboration failed:', error.message);
            return this.handleCollaborationFailure(error);
        }
    }

    processServerResponse(serverResponse) {
        console.log('🔍 AI Client: Processing server response and extracting insights...');
        
        const processed = {
            originalResponse: serverResponse,
            extractedInsights: this.extractInsights(serverResponse),
            actionableRecommendations: this.parseRecommendations(serverResponse),
            confidenceAssessment: this.assessResponseConfidence(serverResponse),
            followUpQuestions: this.generateFollowUpQuestions(serverResponse)
        };

        return processed;
    }

    extractInsights(response) {
        // AI extracts key insights from server response
        const insights = [];
        
        if (response.reasoning) {
            insights.push({
                type: 'reasoning_pattern',
                content: response.reasoning,
                confidence: response.confidence || 0.8
            });
        }

        if (response.result?.ai_enhanced?.risk_assessment) {
            insights.push({
                type: 'risk_factors',
                content: response.result.ai_enhanced.risk_assessment,
                importance: 'high'
            });
        }

        return insights;
    }

    parseRecommendations(response) {
        try {
            const recommendations = [];
            
            if (response.recommendation) {
                recommendations.push(response.recommendation);
            }
            
            if (response.result?.text) {
                const workerMatch = response.result.text.match(/Recommended Worker:\s*(\w+)/);
                if (workerMatch) {
                    recommendations.push({
                        worker: workerMatch[1],
                        source: 'ai_analysis',
                        confidence: response.result.confidence || response.confidence || 0.8
                    });
                }
            }
            
            return recommendations;
        } catch (error) {
            console.log('🔧 AI Client: Error parsing recommendations:', error.message);
            return [];
        }
    }

    assessResponseConfidence(response) {
        let confidence = 0.5; // Default moderate confidence
        
        if (response.confidence) {
            confidence = response.confidence;
        } else if (response.result?.confidence) {
            confidence = response.result.confidence;
        }
        
        return {
            level: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
            value: confidence,
            factors: this.analyzeConfidenceFactors(response)
        };
    }

    analyzeConfidenceFactors(response) {
        const factors = [];
        
        if (response.result?.ai_enhanced?.context_analysis) {
            factors.push('contextual_understanding');
        }
        
        if (response.reasoning) {
            factors.push('logical_reasoning');
        }
        
        return factors;
    }

    generateFollowUpQuestions(response) {
        // AI generates intelligent follow-up questions
        const questions = [];
        
        if (response.confidence < 0.8) {
            questions.push("The confidence seems moderate. What additional information could improve the prediction accuracy?");
        }

        if (response.result?.ai_enhanced?.alternative_workers?.length > 0) {
            questions.push("I see alternative options. What scenarios would make the alternatives preferable?");
        }

        return questions;
    }

    learnFromCollaboration(request, serverResponse, processedResponse) {
        console.log('📚 AI Client: Learning from collaboration...');
        
        // Store interaction for learning
        this.memory.push({
            timestamp: new Date().toISOString(),
            request: request,
            serverResponse: serverResponse,
            processedResponse: processedResponse,
            outcome: 'pending' // Would be updated with actual results
        });

        // Extract patterns
        if (serverResponse.confidence > 0.9) {
            this.preferences.set('high_confidence_patterns', {
                queryStyle: request.query,
                contextProvided: request.context,
                effectiveApproach: true
            });
        }

        // Adaptive learning
        this.adaptCommunicationStyle(serverResponse);
    }

    adaptCommunicationStyle(serverResponse) {
        // AI adapts its communication based on server responses
        if (serverResponse.understood_intent?.primary?.confidence > 0.9) {
            console.log('✅ AI Client: Communication style is effective, reinforcing approach');
        } else {
            console.log('🔄 AI Client: Adjusting communication style for better understanding');
            // Adjust strategy for next interaction
        }
    }

    // AI Client provides intelligent feedback to server
    async provideFeedback(actualOutcome) {
        console.log('💭 AI Client: Providing intelligent feedback to server...');
        
        const feedback = {
            type: 'outcome_feedback',
            prediction_accuracy: this.calculateAccuracy(actualOutcome),
            contextual_factors: this.identifyOutcomeFactors(actualOutcome),
            improvement_suggestions: this.generateImprovementSuggestions(actualOutcome),
            learning_data: this.extractLearningData(actualOutcome)
        };

        try {
            await fetch(`${this.serverUrl}/ai/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback)
            });
            
            console.log('✅ AI Client: Feedback provided to server for mutual learning');
        } catch (error) {
            console.error('❌ Failed to provide feedback:', error.message);
        }
    }

    // Helper methods for AI reasoning
    detectUrgency(requirements) {
        const urgencyWords = ['urgent', 'rush', 'asap', 'emergency', 'critical', 'immediate'];
        const text = JSON.stringify(requirements).toLowerCase();
        return urgencyWords.some(word => text.includes(word)) ? 0.9 : 0.3;
    }

    assessComplexity(requirements) {
        const complexityWords = ['complex', 'difficult', 'precision', 'detailed', 'intricate'];
        const text = JSON.stringify(requirements).toLowerCase();
        return complexityWords.some(word => text.includes(word)) ? 0.8 : 0.5;
    }

    determineQualityNeeds(requirements) {
        const qualityWords = ['quality', 'perfect', 'flawless', 'precision', 'accurate'];
        const text = JSON.stringify(requirements).toLowerCase();
        return qualityWords.some(word => text.includes(word)) ? 0.95 : 0.7;
    }

    identifyContext(requirements) {
        return {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            recentWorkload: this.assessRecentWorkload()
        };
    }

    assessRecentWorkload() {
        return this.memory.length > 5 ? 'high' : 'normal';
    }

    getRelevantHistory() {
        return this.memory.slice(-3).map(m => ({
            query_type: m.request.query,
            success_level: m.outcome
        }));
    }

    calculateAccuracy(outcome) {
        // Compare predicted vs actual outcomes
        return 0.85; // Simplified for demo
    }

    identifyOutcomeFactors(outcome) {
        return {
            worker_performed_as_expected: outcome.success,
            time_accuracy: outcome.timeAccuracy,
            quality_accuracy: outcome.qualityAccuracy
        };
    }

    generateImprovementSuggestions(outcome) {
        const suggestions = [];
        if (outcome.timeAccuracy < 0.8) {
            suggestions.push('Consider factoring in worker current workload for time predictions');
        }
        return suggestions;
    }

    extractLearningData(outcome) {
        return {
            successful_patterns: outcome.success ? 'current_approach' : null,
            areas_for_improvement: outcome.challenges || []
        };
    }

    handleCollaborationFailure(error) {
        console.log('🔄 AI Client: Adapting to collaboration failure...');
        return {
            fallback_strategy: 'use_cached_recommendations',
            error_context: error.message,
            learning_note: 'server_unavailable_pattern'
        };
    }
}

// Demo: AI-to-AI Collaboration
async function demonstrateAICollaboration() {
    console.log('🤖🤝🤖 AI-to-AI MCP Collaboration Demo');
    console.log('=' .repeat(50));

    const aiClient = new IntelligentMCPClient();

    // Scenario: Human request comes in
    const humanRequest = {
        description: "We have an urgent order for precision parts that needs to be completed by 3 PM",
        requirements: ["high quality", "urgent timeline", "precision work"],
        context: "customer is waiting, critical for production line"
    };

    console.log('\n👤 Human Request:', humanRequest.description);

    // 1. AI Client analyzes and plans
    const intelligentRequest = await aiClient.planWorkAssignment(humanRequest);
    console.log('\n📋 AI Client planned request:');
    console.log('Query:', intelligentRequest.query);
    console.log('Context shared:', JSON.stringify(intelligentRequest.context, null, 2));

    // 2. AI Client collaborates with AI Server  
    console.log('\n🤝 Initiating AI-to-AI collaboration...');
    const collaboration = await aiClient.collaborateWithServer(intelligentRequest);
    
    if (collaboration.extractedInsights) {
        console.log('\n🔍 AI Client extracted insights:');
        collaboration.extractedInsights.forEach((insight, i) => {
            console.log(`${i + 1}. ${insight.type}: ${JSON.stringify(insight.content)}`);
        });
    }

    if (collaboration.followUpQuestions.length > 0) {
        console.log('\n❓ AI Client generated follow-up questions:');
        collaboration.followUpQuestions.forEach((q, i) => {
            console.log(`${i + 1}. ${q}`);
        });
    }

    // 3. Simulate work completion and feedback
    setTimeout(async () => {
        console.log('\n⏰ Work completed - AI Client providing feedback...');
        const outcome = {
            success: true,
            timeAccuracy: 0.92,
            qualityAccuracy: 0.98,
            challenges: ['worker_needed_extra_break']
        };
        
        await aiClient.provideFeedback(outcome);
        console.log('✅ AI-to-AI collaboration cycle completed with mutual learning!');
    }, 2000);
}

// Export for use
module.exports = { IntelligentMCPClient, demonstrateAICollaboration };

// Run demo if executed directly
if (require.main === module) {
    demonstrateAICollaboration().catch(console.error);
}
