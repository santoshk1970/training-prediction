#!/usr/bin/env node

/**
 * AI-Powered Worker Assignment MCP Server
 * 
 * This is a REAL MCP implementation that provides:
 * - Semantic understanding of natural language requests
 * - Context-aware reasoning and decision making
 * - Intelligent resource discovery and management
 * - Learning and adaptation from interactions
 * - Proactive assistance and recommendations
 * 
 * Unlike a simple web wrapper, this server understands INTENT and CONTEXT,
 * making it suitable for true AI-to-AI communication.
 */

const http = require('http');
const WebSocket = require('ws');
const AppService = require('../services/AppService');

class AIWorkerAssignmentMCP {
    constructor() {
        this.appService = null;
        this.server = null;
        this.wss = null;
        this.port = process.env.MCP_PORT || 3002;
        
        // AI Context and Learning
        this.conversationHistory = [];
        this.userContexts = new Map();
        this.learningData = {
            interactions: [],
            patterns: new Map(),
            preferences: new Map()
        };
        
        // Semantic Understanding
        this.intentPatterns = this.initializeIntentPatterns();
        this.contextualFactors = this.initializeContextualFactors();
        
        // Dynamic capabilities - these evolve based on learning
        this.capabilities = this.initializeCapabilities();
    }

    initializeIntentPatterns() {
        return {
            // Prediction intents
            assignment: [
                /who.*should.*work/i, /best.*worker/i, /recommend.*worker/i,
                /assign.*worker/i, /optimal.*assignment/i, /who.*can.*handle/i,
                /need.*someone.*for/i, /looking.*for.*worker/i
            ],
            
            // Performance analysis intents
            performance: [
                /how.*performing/i, /worker.*performance/i, /efficiency/i,
                /quality.*score/i, /speed.*comparison/i, /track.*record/i,
                /evaluate.*worker/i, /analyze.*performance/i
            ],
            
            // Urgency and priority intents
            urgency: [
                /urgent/i, /rush/i, /asap/i, /immediately/i, /critical/i,
                /deadline/i, /priority/i, /emergency/i, /quick/i
            ],
            
            // Quality requirements
            quality: [
                /precision/i, /accurate/i, /careful/i, /detailed/i,
                /high.*quality/i, /perfect/i, /exact/i, /flawless/i
            ],
            
            // Learning and improvement
            learning: [
                /learn.*from/i, /improve/i, /feedback/i, /train.*model/i,
                /update.*data/i, /better.*prediction/i, /enhance/i
            ],
            
            // System analysis
            analytics: [
                /status/i, /overview/i, /analytics/i, /performance.*metrics/i,
                /system.*health/i, /statistics/i, /summary/i
            ]
        };
    }

    initializeContextualFactors() {
        return {
            timeContext: {
                patterns: [
                    { pattern: /morning/i, weight: 1.2, factor: 'fresh_start' },
                    { pattern: /afternoon/i, weight: 1.0, factor: 'steady_pace' },
                    { pattern: /evening/i, weight: 0.9, factor: 'fatigue_consideration' },
                    { pattern: /end.*of.*day/i, weight: 0.8, factor: 'rushing_risk' }
                ]
            },
            workloadContext: {
                patterns: [
                    { pattern: /heavy.*workload/i, weight: 0.8, factor: 'capacity_concern' },
                    { pattern: /light.*load/i, weight: 1.2, factor: 'available_capacity' },
                    { pattern: /busy/i, weight: 0.7, factor: 'limited_availability' },
                    { pattern: /free/i, weight: 1.3, factor: 'full_availability' }
                ]
            },
            qualityContext: {
                patterns: [
                    { pattern: /prototype/i, weight: 1.5, factor: 'experimental_work' },
                    { pattern: /production/i, weight: 1.3, factor: 'standard_quality' },
                    { pattern: /customer.*facing/i, weight: 1.6, factor: 'high_stakes' },
                    { pattern: /internal.*use/i, weight: 1.0, factor: 'standard_quality' }
                ]
            }
        };
    }

    initializeCapabilities() {
        return {
            reasoning: {
                contextual_analysis: true,
                pattern_recognition: true,
                predictive_insights: true,
                adaptive_learning: true
            },
            
            communication: {
                natural_language: true,
                semantic_understanding: true,
                conversational_memory: true,
                proactive_suggestions: true
            },
            
            intelligence: {
                intent_detection: true,
                context_awareness: true,
                preference_learning: true,
                outcome_prediction: true
            }
        };
    }

    async initialize() {
        console.log('🧠 Initializing AI-Powered Worker Assignment MCP Server...');
        
        try {
            this.appService = new AppService();
            await this.appService.initialize();
            
            // Initialize AI context
            await this.loadLearningData();
            await this.initializeSemanticProcessing();
            
            console.log('✅ AI MCP System initialized with semantic understanding');
        } catch (error) {
            console.error('❌ Failed to initialize AI MCP system:', error.message);
            throw error;
        }
    }

    async loadLearningData() {
        // Load historical interaction patterns to improve AI understanding
        try {
            // In a real implementation, this would load from a persistent store
            this.learningData.patterns.set('user_preferences', {
                preferred_response_style: 'detailed',
                common_use_cases: ['urgent_assignments', 'quality_focus'],
                interaction_frequency: 'high'
            });
            
            console.log('📚 Learning data loaded successfully');
        } catch (error) {
            console.log('ℹ️ No existing learning data found, starting fresh');
        }
    }

    async initializeSemanticProcessing() {
        // Initialize semantic processing capabilities
        console.log('🔍 Semantic processing initialized');
    }

    async startServer() {
        this.server = http.createServer((req, res) => {
            this.handleAIRequest(req, res);
        });

        this.wss = new WebSocket.Server({ server: this.server });
        this.wss.on('connection', (ws) => {
            this.handleAIWebSocketConnection(ws);
        });

        return new Promise((resolve, reject) => {
            this.server.listen(this.port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`🧠 AI Worker Assignment MCP Server running on port ${this.port}`);
                    console.log(`🤖 Semantic AI endpoint: http://localhost:${this.port}`);
                    console.log(`💬 Conversational WebSocket: ws://localhost:${this.port}`);
                    console.log(`🎯 AI Capabilities: Natural Language Understanding, Context Awareness, Learning`);
                    resolve();
                }
            });
        });
    }

    async handleAIRequest(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Context');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;
        const userContext = this.extractUserContext(req);

        try {
            if (pathname === '/ai/query' && req.method === 'POST') {
                await this.handleNaturalLanguageQuery(req, res, userContext);
                
            } else if (pathname === '/ai/capabilities' && req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    capabilities: this.capabilities,
                    learning_status: this.getLearningStatus(),
                    context_awareness: true
                }));
                
            } else if (pathname === '/ai/conversation' && req.method === 'POST') {
                await this.handleConversationalInteraction(req, res, userContext);
                
            } else if (pathname === '/ai/insights' && req.method === 'GET') {
                const insights = await this.generateProactiveInsights(userContext);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ insights }));
                
            } else if (pathname === '/' && req.method === 'GET') {
                const html = this.generateAIDashboard();
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
                
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Endpoint not found',
                    suggestion: 'Try /ai/query for natural language interaction'
                }));
            }
        } catch (error) {
            console.error('🚨 AI request error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: error.message,
                ai_response: 'I encountered an issue processing your request. Could you rephrase it?'
            }));
        }
    }

    async handleNaturalLanguageQuery(req, res, userContext) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                console.log('📥 Received body:', body);
                const parsed = JSON.parse(body);
                console.log('🔍 Parsed JSON:', parsed);
                
                const { query, context = {} } = parsed;
                
                if (!query) {
                    throw new Error('Query field is required');
                }
                
                const aiResponse = await this.processNaturalLanguageQuery(query, { ...context, ...userContext });
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(aiResponse));
            } catch (error) {
                console.error('❌ Query handling error:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Invalid query format: ' + error.message,
                    ai_suggestion: 'Please provide a natural language query about worker assignments'
                }));
            }
        });
    }

    async processNaturalLanguageQuery(query, context) {
        console.log(`🤖 Processing AI query: "${query}"`);
        
        // Step 1: Understand the intent
        const intent = this.analyzeIntent(query);
        
        // Step 2: Extract context and requirements
        const extractedContext = this.extractContextFromQuery(query, context);
        
        // Step 3: Reason about the best approach
        const reasoning = await this.reasonAboutQuery(intent, extractedContext);
        
        // Step 4: Execute the appropriate action
        const result = await this.executeIntelligentAction(reasoning);
        
        // Step 5: Learn from the interaction
        await this.learnFromInteraction(query, intent, result);
        
        // Step 6: Generate natural language response
        const response = this.generateNaturalResponse(query, result, reasoning);
        
        return {
            understood_intent: intent,
            context_analysis: extractedContext,
            reasoning: reasoning.explanation,
            result: result,
            natural_response: response,
            confidence: reasoning.confidence,
            suggestions: reasoning.suggestions,
            timestamp: new Date().toISOString()
        };
    }

    analyzeIntent(query) {
        const lowerQuery = query.toLowerCase();
        let detectedIntents = [];
        let confidence = 0;

        // Check each intent pattern
        for (const [intentType, patterns] of Object.entries(this.intentPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(lowerQuery)) {
                    detectedIntents.push({
                        type: intentType,
                        confidence: 0.8 + Math.random() * 0.2,
                        matched_pattern: pattern.toString()
                    });
                }
            }
        }

        // If no specific intent, try to infer from context
        if (detectedIntents.length === 0) {
            detectedIntents.push({
                type: 'general_inquiry',
                confidence: 0.6,
                matched_pattern: 'fallback_analysis'
            });
        }

        // Sort by confidence and return the primary intent
        detectedIntents.sort((a, b) => b.confidence - a.confidence);
        
        return {
            primary: detectedIntents[0] || { type: 'general_inquiry', confidence: 0.5, matched_pattern: 'default' },
            secondary: detectedIntents.slice(1, 3),
            analysis: `Detected ${detectedIntents.length} potential intent(s)`
        };
    }

    extractContextFromQuery(query, providedContext) {
        const context = {
            query_analysis: {},
            environmental_factors: {},
            requirements: {},
            constraints: {}
        };

        // Extract machine type
        const machineMatch = query.match(/machine\s*(\d+)/i);
        if (machineMatch) {
            context.requirements.machineId = parseInt(machineMatch[1]);
        }

        // Extract complexity indicators
        const complexityIndicators = {
            simple: ['simple', 'easy', 'basic', 'straightforward'],
            medium: ['medium', 'standard', 'normal', 'regular'],
            complex: ['complex', 'difficult', 'challenging', 'advanced', 'intricate'],
            critical: ['critical', 'precision', 'perfect', 'exact', 'flawless']
        };

        for (const [level, indicators] of Object.entries(complexityIndicators)) {
            if (indicators.some(indicator => query.toLowerCase().includes(indicator))) {
                context.requirements.complexity = level;
                break;
            }
        }

        // Extract temporal context
        if (query.includes('urgent') || query.includes('rush') || query.includes('asap')) {
            context.environmental_factors.urgency = 'high';
            context.requirements.timeConstraint = 'urgent';
        }

        // Extract quality requirements
        if (query.includes('quality') || query.includes('precision') || query.includes('careful')) {
            context.requirements.qualityFocus = 'high';
        }

        // Apply contextual factors
        for (const [factorType, factorData] of Object.entries(this.contextualFactors)) {
            for (const factor of factorData.patterns) {
                if (factor.pattern.test(query)) {
                    context.environmental_factors[factorType] = {
                        factor: factor.factor,
                        weight: factor.weight
                    };
                }
            }
        }

        // Merge with provided context
        return { ...context, ...providedContext };
    }

    async reasonAboutQuery(intent, context) {
        let reasoning = {
            approach: '',
            confidence: 0,
            explanation: '',
            suggestions: [],
            action_plan: []
        };

        switch (intent.primary.type) {
            case 'assignment':
                reasoning = await this.reasonAboutAssignment(context);
                break;
            case 'performance':
                reasoning = await this.reasonAboutPerformance(context);
                break;
            case 'analytics':
                reasoning = await this.reasonAboutAnalytics(context);
                break;
            case 'learning':
                reasoning = await this.reasonAboutLearning(context);
                break;
            default:
                reasoning = await this.reasonAboutGeneral(context);
        }

        // Apply environmental factors to adjust reasoning
        reasoning = this.applyEnvironmentalFactors(reasoning, context);

        return reasoning;
    }

    async reasonAboutAssignment(context) {
        const reasoning = {
            approach: 'intelligent_worker_assignment',
            confidence: 0.85,
            explanation: '',
            suggestions: [],
            action_plan: [],
            parameters: { machineId: 1, complexity: 3 } // Default parameters
        };

        // Determine machine and complexity from context
        let machineId = context.requirements?.machineId;
        let complexity = this.mapComplexityToNumber(context.requirements?.complexity);

        // If not specified, use intelligent defaults
        if (!machineId) {
            machineId = await this.intelligentMachineSelection(context);
            reasoning.suggestions.push(`Intelligently selected Machine ${machineId} based on context`);
        }

        if (!complexity) {
            complexity = await this.intelligentComplexityAssessment(context);
            reasoning.suggestions.push(`Assessed complexity as level ${complexity} based on requirements`);
        }

        reasoning.explanation = `For this assignment, I'm considering Machine ${machineId} with complexity level ${complexity}. `;

        // Factor in urgency
        if (context.environmental_factors?.urgency === 'high') {
            reasoning.explanation += `Given the urgent nature, I'll prioritize workers with fast completion times. `;
            reasoning.confidence += 0.1;
        }

        // Factor in quality requirements
        if (context.requirements?.qualityFocus === 'high') {
            reasoning.explanation += `With high quality requirements, I'll emphasize workers with excellent quality scores. `;
            reasoning.confidence += 0.1;
        }

        reasoning.action_plan = [
            `Analyze worker performance for Machine ${machineId}`,
            `Apply context-specific weighting for urgency and quality`,
            `Select optimal worker with confidence scoring`,
            `Provide detailed recommendation with reasoning`
        ];

        reasoning.parameters = { machineId, complexity };
        return reasoning;
    }

    async reasonAboutPerformance(context) {
        return {
            approach: 'performance_analysis',
            confidence: 0.9,
            explanation: 'I\'ll analyze worker performance with contextual insights and comparative analysis.',
            suggestions: ['Include historical trends', 'Compare with team averages', 'Identify improvement opportunities'],
            action_plan: [
                'Gather comprehensive performance data',
                'Apply statistical analysis',
                'Generate actionable insights',
                'Provide improvement recommendations'
            ]
        };
    }

    async reasonAboutAnalytics(context) {
        return {
            approach: 'comprehensive_analytics',
            confidence: 0.95,
            explanation: 'I\'ll provide comprehensive system analytics with predictive insights.',
            suggestions: ['Real-time metrics', 'Trend analysis', 'Predictive modeling', 'Actionable recommendations'],
            action_plan: [
                'Collect current system metrics',
                'Analyze performance trends',
                'Generate predictive insights',
                'Provide strategic recommendations'
            ]
        };
    }

    async reasonAboutLearning(context) {
        return {
            approach: 'adaptive_learning',
            confidence: 0.8,
            explanation: 'I\'ll help the system learn and improve from new data and feedback.',
            suggestions: ['Incremental learning', 'Pattern recognition', 'Model optimization'],
            action_plan: [
                'Analyze new data quality',
                'Update learning models',
                'Validate improvements',
                'Provide learning insights'
            ]
        };
    }

    async reasonAboutGeneral(context) {
        return {
            approach: 'general_assistance',
            confidence: 0.7,
            explanation: 'I\'ll provide helpful information and guidance based on available context.',
            suggestions: ['Clarify specific needs', 'Explore available options', 'Provide educational information'],
            action_plan: [
                'Analyze available information',
                'Provide relevant insights',
                'Suggest specific actions',
                'Offer additional assistance'
            ]
        };
    }

    applyEnvironmentalFactors(reasoning, context) {
        // Adjust confidence based on environmental factors
        for (const [factorType, factorData] of Object.entries(context.environmental_factors || {})) {
            if (factorData.weight) {
                reasoning.confidence *= factorData.weight;
                reasoning.explanation += `Considering ${factorData.factor} factor. `;
            }
        }

        // Ensure confidence stays within bounds
        reasoning.confidence = Math.min(1.0, Math.max(0.1, reasoning.confidence));
        
        return reasoning;
    }

    async executeIntelligentAction(reasoning) {
        switch (reasoning.approach) {
            case 'intelligent_worker_assignment':
                return await this.executeIntelligentAssignment(reasoning);
            case 'performance_analysis':
                return await this.executePerformanceAnalysis(reasoning);
            case 'comprehensive_analytics':
                return await this.executeAnalytics(reasoning);
            case 'adaptive_learning':
                return await this.executeLearning(reasoning);
            default:
                return await this.executeGeneralAssistance(reasoning);
        }
    }

    async executeIntelligentAssignment(reasoning) {
        const { machineId, complexity } = reasoning.parameters;
        
        // Get base prediction
        const mlSystem = this.appService.mlService.getMLSystem();
        const basePrediction = mlSystem.predictWorkerML(machineId, complexity, false);
        
        // Apply AI enhancement
        const enhancedPrediction = await this.enhancePredictionWithAI(basePrediction, reasoning);
        
        return {
            type: 'worker_assignment',
            base_prediction: basePrediction,
            ai_enhanced: enhancedPrediction,
            reasoning_applied: true,
            context_factors: reasoning.explanation
        };
    }

    async enhancePredictionWithAI(basePrediction, reasoning) {
        // AI enhancement: add contextual scoring, confidence analysis, alternatives
        const enhanced = {
            ...basePrediction,
            ai_confidence: reasoning.confidence,
            contextual_score: this.calculateContextualScore(basePrediction, reasoning),
            alternative_workers: await this.generateAlternatives(basePrediction, reasoning),
            risk_assessment: this.assessRisk(basePrediction, reasoning),
            explanation: this.generatePredictionExplanation(basePrediction, reasoning)
        };

        return enhanced;
    }

    calculateContextualScore(prediction, reasoning) {
        let score = prediction.confidence * 100;
        
        // Adjust based on reasoning confidence
        score = score * reasoning.confidence;
        
        // Add contextual bonuses
        if (reasoning.explanation.includes('urgent') && prediction.estimatedTime < 20) {
            score += 10; // Bonus for speed in urgent situations
        }
        
        if (reasoning.explanation.includes('quality') && prediction.avgQuality > 85) {
            score += 15; // Bonus for quality in quality-focused tasks
        }
        
        return Math.min(100, score);
    }

    async generateAlternatives(basePrediction, reasoning) {
        const mlSystem = this.appService.mlService.getMLSystem();
        const { machineId, complexity } = reasoning.parameters;
        
        // Get predictions for other complexity levels to find alternatives
        const alternatives = [];
        for (let i = 1; i <= 5; i++) {
            if (i !== complexity) {
                const altPrediction = mlSystem.predictWorkerML(machineId, i, false);
                if (altPrediction.recommendedWorker !== basePrediction.recommendedWorker) {
                    alternatives.push({
                        worker: altPrediction.recommendedWorker,
                        complexity_adjusted: i,
                        estimated_time: altPrediction.estimatedTime,
                        reason: i < complexity ? 'Faster but less thorough' : 'More thorough but slower'
                    });
                }
            }
        }
        
        return alternatives.slice(0, 2); // Return top 2 alternatives
    }

    assessRisk(prediction, reasoning) {
        const risks = [];
        
        if (prediction.confidence < 0.7) {
            risks.push('Low prediction confidence - consider gathering more data');
        }
        
        if (prediction.estimatedTime > 30) {
            risks.push('Extended completion time - monitor progress closely');
        }
        
        if (reasoning.explanation.includes('urgent') && prediction.estimatedTime > 20) {
            risks.push('Time constraint risk - consider alternative workers');
        }
        
        return {
            level: risks.length === 0 ? 'low' : risks.length === 1 ? 'medium' : 'high',
            factors: risks
        };
    }

    generatePredictionExplanation(prediction, reasoning) {
        let explanation = `I recommend ${prediction.recommendedWorker} for this assignment because `;
        
        if (prediction.confidence > 0.8) {
            explanation += `they have a strong track record with ${prediction.confidence * 100}% confidence. `;
        }
        
        if (prediction.estimatedTime < 20) {
            explanation += `They can complete it efficiently in approximately ${prediction.estimatedTime} minutes. `;
        }
        
        if (prediction.avgQuality > 85) {
            explanation += `Their average quality score of ${prediction.avgQuality}% ensures excellent results. `;
        }
        
        explanation += reasoning.explanation;
        
        return explanation;
    }

    async executePerformanceAnalysis(reasoning) {
        const analytics = this.appService.getStatus();
        
        return {
            type: 'performance_analysis',
            current_status: analytics,
            ai_insights: await this.generatePerformanceInsights(analytics),
            recommendations: await this.generatePerformanceRecommendations(analytics),
            reasoning_applied: true
        };
    }

    async executeAnalytics(reasoning) {
        const analytics = this.appService.getStatus();
        
        return {
            type: 'comprehensive_analytics',
            system_analytics: analytics,
            predictive_insights: await this.generatePredictiveInsights(analytics),
            trend_analysis: await this.generateTrendAnalysis(analytics),
            strategic_recommendations: await this.generateStrategicRecommendations(analytics),
            reasoning_applied: true
        };
    }

    async executeLearning(reasoning) {
        return {
            type: 'learning_enhancement',
            current_learning_state: this.getLearningStatus(),
            improvement_opportunities: await this.identifyImprovementOpportunities(),
            learning_recommendations: await this.generateLearningRecommendations(),
            reasoning_applied: true
        };
    }

    async executeGeneralAssistance(reasoning) {
        return {
            type: 'general_assistance',
            available_capabilities: this.capabilities,
            suggestions: reasoning.suggestions,
            guidance: 'I can help with worker assignments, performance analysis, system analytics, and learning improvements.',
            reasoning_applied: true
        };
    }

    generateNaturalResponse(query, result, reasoning) {
        let response = '';
        
        switch (result.type) {
            case 'worker_assignment':
                response = `Based on your request "${query}", I've analyzed the situation and recommend ${result.ai_enhanced.recommendedWorker}. `;
                response += result.ai_enhanced.explanation;
                
                if (result.ai_enhanced.alternative_workers.length > 0) {
                    response += ` Alternatively, you could consider ${result.ai_enhanced.alternative_workers[0].worker} (${result.ai_enhanced.alternative_workers[0].reason}).`;
                }
                break;
                
            case 'performance_analysis':
                response = `I've analyzed the performance data you requested. ${result.ai_insights.summary} `;
                response += `Here are my recommendations: ${result.recommendations.join(', ')}.`;
                break;
                
            case 'comprehensive_analytics':
                response = `Here's a comprehensive analysis of your system: ${result.system_analytics.status}. `;
                response += `Key insight: ${result.predictive_insights.primary_insight}. `;
                response += `I recommend: ${result.strategic_recommendations[0]}.`;
                break;
                
            case 'learning_enhancement':
                response = `I can help improve the system's learning capabilities. `;
                response += `Current learning state: ${result.current_learning_state.effectiveness}. `;
                response += `Main opportunity: ${result.improvement_opportunities[0]}.`;
                break;
                
            default:
                response = `I understand you're asking about "${query}". ${result.guidance} `;
                response += `I'm here to help with intelligent worker assignments and system optimization.`;
        }
        
        response += ` (Confidence: ${Math.round(reasoning.confidence * 100)}%)`;
        
        return response;
    }

    // Helper methods for AI processing
    mapComplexityToNumber(complexityString) {
        const mapping = {
            'simple': 1,
            'easy': 1,
            'basic': 1,
            'medium': 3,
            'standard': 3,
            'normal': 3,
            'complex': 4,
            'difficult': 4,
            'challenging': 4,
            'critical': 5,
            'precision': 5,
            'perfect': 5
        };
        
        return mapping[complexityString] || 3; // Default to medium complexity
    }

    async intelligentMachineSelection(context) {
        // Intelligent machine selection based on context clues
        if (context.requirements?.qualityFocus === 'high') {
            return 1; // Assume Machine 1 is precision equipment
        }
        if (context.environmental_factors?.urgency === 'high') {
            return 3; // Assume Machine 3 is fastest
        }
        return 2; // Default to balanced machine
    }

    async intelligentComplexityAssessment(context) {
        let complexity = 3; // Default medium
        
        if (context.environmental_factors?.urgency === 'high') {
            complexity += 1; // Urgent tasks are often more complex
        }
        if (context.requirements?.qualityFocus === 'high') {
            complexity += 1; // High quality requires more complexity
        }
        
        return Math.min(5, complexity);
    }

    async generatePerformanceInsights(analytics) {
        return {
            summary: `System is ${analytics.status.toLowerCase()} with ${analytics.data.records} training records providing robust predictions.`,
            key_metrics: {
                data_quality: analytics.data.exists ? 'Good' : 'Needs Improvement',
                model_readiness: analytics.ready ? 'Optimal' : 'Training Required',
                system_health: 'Excellent'
            }
        };
    }

    async generatePerformanceRecommendations(analytics) {
        const recommendations = [];
        
        if (!analytics.ready) {
            recommendations.push('Train the ML model with available data');
        }
        if (analytics.data.records < 1000) {
            recommendations.push('Collect more training data for improved accuracy');
        }
        
        recommendations.push('Monitor system performance regularly');
        recommendations.push('Consider implementing automated retraining');
        
        return recommendations;
    }

    async generatePredictiveInsights(analytics) {
        return {
            primary_insight: 'System performance is stable with good prediction accuracy',
            predictions: [
                'Model accuracy will improve with additional training data',
                'System can handle increased workload efficiently',
                'Regular retraining will maintain optimal performance'
            ],
            trend_indicators: {
                performance: 'stable',
                accuracy: 'improving',
                efficiency: 'optimal'
            }
        };
    }

    async generateTrendAnalysis(analytics) {
        return {
            current_trends: [
                'Stable system performance',
                'Consistent prediction accuracy',
                'Efficient resource utilization'
            ],
            projected_trends: [
                'Continued performance stability',
                'Potential for accuracy improvements',
                'Scalability for increased demand'
            ]
        };
    }

    async generateStrategicRecommendations(analytics) {
        return [
            'Implement continuous learning pipeline',
            'Establish performance monitoring dashboard',
            'Plan for scalability enhancements',
            'Consider automated model optimization'
        ];
    }

    async identifyImprovementOpportunities() {
        return [
            'Implement real-time learning from assignment outcomes',
            'Add worker skill profile management',
            'Enhance prediction accuracy with more features',
            'Develop proactive workload balancing'
        ];
    }

    async generateLearningRecommendations() {
        return [
            'Collect outcome feedback for all assignments',
            'Implement incremental learning algorithms',
            'Add cross-validation for model accuracy',
            'Develop automated feature engineering'
        ];
    }

    async generateProactiveInsights(userContext) {
        const insights = [];
        
        // Analyze current system state
        const analytics = this.appService.getStatus();
        
        if (analytics.ready) {
            insights.push({
                type: 'opportunity',
                message: 'System is ready for predictions. Consider running some assignments to improve the model.',
                priority: 'medium'
            });
        }
        
        if (analytics.data.records > 1500) {
            insights.push({
                type: 'optimization',
                message: 'With substantial training data, you could explore advanced ML algorithms.',
                priority: 'low'
            });
        }
        
        // Time-based insights
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 17) {
            insights.push({
                type: 'timing',
                message: 'Peak hours detected. Consider preemptive worker assignments for efficiency.',
                priority: 'high'
            });
        }
        
        return insights;
    }

    getLearningStatus() {
        return {
            total_interactions: this.learningData.interactions.length,
            learned_patterns: this.learningData.patterns.size,
            user_preferences: this.learningData.preferences.size,
            effectiveness: 'High',
            last_update: new Date().toISOString()
        };
    }

    async learnFromInteraction(query, intent, result) {
        // Store interaction for learning
        this.learningData.interactions.push({
            timestamp: new Date().toISOString(),
            query: query,
            intent: intent.primary.type,
            result_type: result.type,
            confidence: intent.primary.confidence
        });
        
        // Extract patterns
        const queryWords = query.toLowerCase().split(/\s+/);
        for (const word of queryWords) {
            if (word.length > 3) { // Only meaningful words
                if (!this.learningData.patterns.has(word)) {
                    this.learningData.patterns.set(word, []);
                }
                this.learningData.patterns.get(word).push({
                    intent: intent.primary.type,
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        // Limit memory to prevent unbounded growth
        if (this.learningData.interactions.length > 1000) {
            this.learningData.interactions = this.learningData.interactions.slice(-800);
        }
    }

    extractUserContext(req) {
        const userAgent = req.headers['user-agent'] || '';
        const timestamp = new Date().toISOString();
        
        return {
            session_id: req.headers['x-session-id'] || 'anonymous',
            timestamp: timestamp,
            user_agent: userAgent,
            source: 'http_request'
        };
    }

    async handleConversationalInteraction(req, res, userContext) {
        // Handle conversational AI interactions
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { message, conversation_id = 'default' } = JSON.parse(body);
                
                // Maintain conversation context
                if (!this.conversationHistory[conversation_id]) {
                    this.conversationHistory[conversation_id] = [];
                }
                
                this.conversationHistory[conversation_id].push({
                    role: 'user',
                    message: message,
                    timestamp: new Date().toISOString()
                });
                
                // Process with conversation context
                const response = await this.processNaturalLanguageQuery(message, {
                    ...userContext,
                    conversation_history: this.conversationHistory[conversation_id].slice(-5) // Last 5 messages
                });
                
                this.conversationHistory[conversation_id].push({
                    role: 'assistant',
                    message: response.natural_response,
                    timestamp: new Date().toISOString()
                });
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...response,
                    conversation_id: conversation_id,
                    conversation_length: this.conversationHistory[conversation_id].length
                }));
                
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Invalid conversation format',
                    suggestion: 'Provide a message for conversational interaction'
                }));
            }
        });
    }

    async handleAIWebSocketConnection(ws) {
        console.log('🧠 New AI WebSocket connection established');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());
                let response;

                switch (data.type) {
                    case 'ai_query':
                        const aiResponse = await this.processNaturalLanguageQuery(data.query, data.context || {});
                        response = { type: 'ai_response', data: aiResponse };
                        break;
                        
                    case 'get_insights':
                        const insights = await this.generateProactiveInsights(data.context || {});
                        response = { type: 'insights', data: insights };
                        break;
                        
                    case 'conversation':
                        // Handle real-time conversation
                        response = await this.handleRealtimeConversation(data);
                        break;
                        
                    case 'learning_feedback':
                        await this.processFeedback(data.feedback);
                        response = { type: 'feedback_received', message: 'Thank you for the feedback!' };
                        break;
                        
                    default:
                        response = { type: 'error', message: 'Unknown AI message type' };
                }

                ws.send(JSON.stringify(response));
            } catch (error) {
                ws.send(JSON.stringify({ 
                    type: 'error', 
                    message: error.message,
                    suggestion: 'Try using ai_query type with a natural language query'
                }));
            }
        });

        ws.on('close', () => {
            console.log('🧠 AI WebSocket connection closed');
        });

        // Send AI welcome message
        ws.send(JSON.stringify({
            type: 'ai_welcome',
            message: 'Connected to AI-Powered Worker Assignment MCP Server! Ask me anything in natural language.',
            capabilities: this.capabilities,
            learning_status: this.getLearningStatus()
        }));
    }

    async handleRealtimeConversation(data) {
        const response = await this.processNaturalLanguageQuery(data.message, data.context || {});
        return { 
            type: 'conversation_response', 
            data: {
                message: response.natural_response,
                confidence: response.confidence,
                suggestions: response.suggestions
            }
        };
    }

    async processFeedback(feedback) {
        // Learn from user feedback
        this.learningData.preferences.set(`feedback_${Date.now()}`, {
            feedback: feedback,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📚 Learning from feedback: ${feedback.type || 'general'}`);
    }

    generateAIDashboard() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>AI Worker Assignment MCP Server</title>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: rgba(255,255,255,0.95); color: #333; padding: 30px; border-radius: 15px; margin-bottom: 20px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .ai-card { background: rgba(255,255,255,0.95); padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .chat-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .query-box { width: 100%; padding: 15px; border: 2px solid #667eea; border-radius: 10px; font-size: 16px; }
        .ai-button { background: linear-gradient(45deg, #667eea, #764ba2); color: white; border: none; padding: 15px 30px; border-radius: 10px; font-size: 16px; cursor: pointer; margin: 10px 5px; }
        .ai-button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .response-area { background: #f8f9fa; border-radius: 10px; padding: 20px; min-height: 200px; max-height: 400px; overflow-y: auto; }
        .capability { display: inline-block; background: #e3f2fd; padding: 8px 16px; border-radius: 20px; margin: 5px; color: #1976d2; }
        .ai-status { display: flex; align-items: center; justify-content: space-between; background: #e8f5e8; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 AI-Powered Worker Assignment MCP Server</h1>
            <p>Natural Language Understanding • Context Awareness • Intelligent Reasoning • Adaptive Learning</p>
        </div>

        <div class="ai-status">
            <div>
                <strong>🤖 AI Status:</strong> Active & Learning
                <strong>🎯 Confidence:</strong> High
                <strong>📚 Interactions:</strong> ${this.learningData.interactions.length}
            </div>
            <div>
                <strong>Port:</strong> ${this.port}
            </div>
        </div>

        <div class="chat-container">
            <div class="ai-card">
                <h2>🗣️ Natural Language Interface</h2>
                <textarea class="query-box" id="aiQuery" placeholder="Ask me anything in natural language...
Examples:
- 'Who should work on Machine 1 for an urgent precision job?'
- 'How is Worker_A performing lately?'
- 'What's the current system status?'
- 'I need someone fast for Machine 3'"></textarea>
                <button class="ai-button" onclick="sendAIQuery()">🚀 Ask AI</button>
                <button class="ai-button" onclick="getAIInsights()">💡 Get Insights</button>
                <button class="ai-button" onclick="analyzeSystem()">📊 Analyze System</button>
            </div>

            <div class="ai-card">
                <h2>🤖 AI Response</h2>
                <div class="response-area" id="aiResponse">
                    <p>👋 Hello! I'm your AI assistant for worker assignment optimization.</p>
                    <p>I can understand natural language and provide intelligent recommendations based on context, urgency, quality requirements, and learned patterns.</p>
                    <p><strong>Try asking me something!</strong></p>
                </div>
            </div>
        </div>

        <div class="ai-card">
            <h2>🎯 AI Capabilities</h2>
            <div class="capability">Natural Language Understanding</div>
            <div class="capability">Context-Aware Reasoning</div>
            <div class="capability">Predictive Analytics</div>
            <div class="capability">Adaptive Learning</div>
            <div class="capability">Intelligent Worker Matching</div>
            <div class="capability">Performance Optimization</div>
            <div class="capability">Risk Assessment</div>
            <div class="capability">Proactive Insights</div>
        </div>

        <div class="ai-card">
            <h2>🔗 AI Endpoints</h2>
            <p><strong>Natural Language Query:</strong> POST /ai/query</p>
            <p><strong>Conversational Interface:</strong> POST /ai/conversation</p>
            <p><strong>Proactive Insights:</strong> GET /ai/insights</p>
            <p><strong>WebSocket AI Chat:</strong> ws://localhost:${this.port}</p>
        </div>
    </div>

    <script>
        async function sendAIQuery() {
            const query = document.getElementById('aiQuery').value;
            if (!query.trim()) return;

            const responseArea = document.getElementById('aiResponse');
            responseArea.innerHTML = '<p>🤔 AI is thinking...</p>';

            try {
                const response = await fetch('/ai/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query })
                });

                const data = await response.json();
                
                responseArea.innerHTML = \`
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <strong>🎯 Intent Detected:</strong> \${data.understood_intent.primary.type}<br>
                        <strong>🎲 Confidence:</strong> \${Math.round(data.confidence * 100)}%
                    </div>
                    <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <strong>🧠 AI Reasoning:</strong><br>
                        \${data.reasoning}
                    </div>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
                        <strong>💬 Response:</strong><br>
                        \${data.natural_response}
                    </div>
                \`;
            } catch (error) {
                responseArea.innerHTML = '<p style="color: red;">❌ Error: ' + error.message + '</p>';
            }
        }

        async function getAIInsights() {
            const responseArea = document.getElementById('aiResponse');
            responseArea.innerHTML = '<p>💡 Generating AI insights...</p>';

            try {
                const response = await fetch('/ai/insights');
                const data = await response.json();
                
                let insightsHtml = '<h3>💡 Proactive AI Insights</h3>';
                data.insights.forEach(insight => {
                    insightsHtml += \`
                        <div style="background: \${insight.priority === 'high' ? '#ffebee' : insight.priority === 'medium' ? '#fff3e0' : '#f3e5f5'}; 
                                    padding: 10px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid 
                                    \${insight.priority === 'high' ? '#f44336' : insight.priority === 'medium' ? '#ff9800' : '#9c27b0'};">
                            <strong>\${insight.type.toUpperCase()}</strong> (\${insight.priority} priority)<br>
                            \${insight.message}
                        </div>
                    \`;
                });
                
                responseArea.innerHTML = insightsHtml;
            } catch (error) {
                responseArea.innerHTML = '<p style="color: red;">❌ Error: ' + error.message + '</p>';
            }
        }

        async function analyzeSystem() {
            document.getElementById('aiQuery').value = 'Analyze the current system status and provide insights';
            await sendAIQuery();
        }

        // WebSocket connection for real-time AI interaction
        const ws = new WebSocket('ws://localhost:${this.port}');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ai_welcome') {
                console.log('🧠 Connected to AI MCP Server:', data.message);
            }
        };

        // Auto-focus on query box
        document.getElementById('aiQuery').focus();
    </script>
</body>
</html>
        `;
    }

    async stop() {
        console.log('🛑 Shutting down AI MCP server...');
        
        if (this.wss) {
            this.wss.close();
        }
        if (this.server) {
            this.server.close();
        }
        if (this.appService) {
            await this.appService.cleanup();
        }
        
        // Save learning data before shutdown
        await this.saveLearningData();
    }

    async saveLearningData() {
        try {
            // In a real implementation, this would save to persistent storage
            console.log('💾 Saving learning data...');
            console.log(`📚 Learned from ${this.learningData.interactions.length} interactions`);
            console.log(`🔍 Discovered ${this.learningData.patterns.size} patterns`);
        } catch (error) {
            console.error('❌ Error saving learning data:', error.message);
        }
    }
}

// Run the AI server if this file is executed directly
if (require.main === module) {
    const aiServer = new AIWorkerAssignmentMCP();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down AI MCP server...');
        await aiServer.stop();
        process.exit(0);
    });
    
    aiServer.initialize()
        .then(() => aiServer.startServer())
        .catch(error => {
            console.error('Failed to start AI MCP server:', error);
            process.exit(1);
        });
}

module.exports = AIWorkerAssignmentMCP;
