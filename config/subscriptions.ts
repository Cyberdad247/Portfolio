/**
 * Subscription Registry (L6 Governance Layer)
 * Defines the features and limits for each Digital Brain Agency tier.
 */

export interface SubscriptionTier {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    limits: {
        agents: number;
        aiGenerationsPerMonth: number;
        customReports: boolean;
    };
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
    {
        id: 'tier-basic',
        name: 'Launch Protocol',
        price: '$99/mo',
        description: 'Ideal for early-stage companies establishing their first Agentic presence.',
        features: [
            'Market Scanner Agent (Basic)',
            'Standard SEO Optimization',
            '50 Content Generations / mo',
            'Shared Dashboard'
        ],
        limits: {
            agents: 2,
            aiGenerationsPerMonth: 50,
            customReports: false
        }
    },
    {
        id: 'tier-pro',
        name: 'Scale Nexus',
        price: '$499/mo',
        description: 'Aggressive growth for established brands scaling their lead velocity.',
        features: [
            'Full Agent Fleet (8 Agents)',
            'Priority Sentiment Engine',
            '500 Content Generations / mo',
            'Private Dashboard Analytics',
            'Stripe Billing Integration'
        ],
        limits: {
            agents: 8,
            aiGenerationsPerMonth: 500,
            customReports: true
        }
    },
    {
        id: 'tier-enterprise',
        name: 'Sovereign Engine',
        price: 'Custom',
        description: 'Dedicated compute and deep semantic memory integration for market leaders.',
        features: [
            'Custom Agent Scaffolding',
            'Unlimited AI Generations',
            'Deep UKG Memory Integration',
            'Regional Data Isolation',
            '24/7 Sentinel Support'
        ],
        limits: {
            agents: -1, // Unlimited
            aiGenerationsPerMonth: -1, // Unlimited
            customReports: true
        }
    }
];
