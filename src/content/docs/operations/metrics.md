---
title: Metrics & KPIs - Measuring What Matters
description: The complete guide to tracking, analyzing, and optimizing your startup metrics
---

# Metrics & KPIs: Your Startup Dashboard

## The SANAD Metrics Framework

### North Star Metric
**Documents Processed Per Active User Per Week**

Why this matters:
- Shows real usage (not vanity metrics)
- Indicates value delivery
- Predicts retention
- Drives revenue

Target Evolution:
- Month 1: 5 docs/user/week
- Month 6: 20 docs/user/week  
- Year 1: 50 docs/user/week

## Metrics Hierarchy

### Level 1: Board Metrics (Monthly)
Focus: Business health and growth

### Level 2: Leadership Metrics (Weekly)
Focus: Operational performance

### Level 3: Team Metrics (Daily)
Focus: Execution and quality

## The Essential Metrics

### 1. Growth Metrics

#### Customer Acquisition
```
Monthly Active Law Firms
├── New Signups: ___ (Target: 10/month)
├── Trial Starts: ___ (Target: 20/month)
├── Trial → Paid: ___% (Target: 30%)
├── Activation Rate: ___% (Target: 80%)
└── Time to Value: ___ hours (Target: <24)

Customer Acquisition Cost (CAC)
├── Paid Marketing CAC: $___ 
├── Sales CAC: $___
├── Blended CAC: $___ (Target: <$500)
└── Payback Period: ___ months (Target: <6)
```

#### Revenue Growth
```
Monthly Recurring Revenue (MRR)
├── New MRR: $___
├── Expansion MRR: $___
├── Churned MRR: $___
├── Net New MRR: $___
└── MRR Growth Rate: ___% (Target: 20%/month)

Annual Recurring Revenue (ARR)
├── Current ARR: $___
├── YoY Growth: ___%
├── Logo ARR: $___ (# customers)
└── Per-Seat ARR: $___
```

### 2. Product Metrics

#### Usage Analytics
```python
# Key usage metrics to track
usage_metrics = {
    "daily_active_users": {
        "definition": "Unique users who process ≥1 document",
        "target": "80% of total users",
        "query": """
            SELECT COUNT(DISTINCT user_id) 
            FROM events 
            WHERE event_type = 'document_processed' 
            AND date = CURRENT_DATE
        """
    },
    
    "feature_adoption": {
        "definition": "% users using each feature weekly",
        "targets": {
            "document_upload": "100%",
            "ai_analysis": "80%",
            "export_function": "60%",
            "collaboration": "40%"
        }
    },
    
    "processing_volume": {
        "documents_per_day": "___",
        "pages_analyzed": "___",
        "ai_queries": "___",
        "exports_generated": "___"
    }
}
```

#### Product Quality
```
Performance Metrics
├── Page Load Time: ___ ms (Target: <3s)
├── API Response Time: ___ ms (Target: <500ms)
├── AI Processing Time: ___ s/doc (Target: <30s)
├── Uptime: ___% (Target: 99.9%)
└── Error Rate: ___% (Target: <0.1%)

AI Accuracy Metrics  
├── Extraction Accuracy: ___% (Target: >95%)
├── Classification Accuracy: ___% (Target: >90%)
├── False Positive Rate: ___% (Target: <5%)
└── User Corrections: ___/week (Track trend)
```

### 3. Customer Success Metrics

#### Retention & Churn
```
Cohort Retention (Monthly Cohorts)
Month 0: 100%
Month 1: ___% (Target: >90%)
Month 3: ___% (Target: >80%)
Month 6: ___% (Target: >75%)
Month 12: ___% (Target: >70%)

Churn Analysis
├── Gross Logo Churn: ___% (Target: <3%)
├── Gross Revenue Churn: ___% (Target: <2%)
├── Net Revenue Retention: ___% (Target: >110%)
└── Churn Reasons:
    ├── Price: ___%
    ├── Features: ___%
    ├── Support: ___%
    └── Other: ___%
```

#### Customer Satisfaction
```
Net Promoter Score (NPS)
├── Score: ___ (Target: >50)
├── Promoters: ___%
├── Passives: ___%
├── Detractors: ___%
└── Response Rate: ___% (Target: >30%)

Customer Effort Score (CES)
"How easy was it to complete your task?"
├── Score: ___/5 (Target: >4.5)
└── By Feature:
    ├── Upload: ___/5
    ├── Analysis: ___/5
    └── Export: ___/5
```

### 4. Financial Metrics

#### Unit Economics
```python
# Unit economics calculator
def calculate_unit_economics(metrics):
    # Revenue metrics
    arpu = metrics['mrr'] / metrics['customers']  # Average Revenue Per User
    
    # Cost metrics
    cogs = metrics['hosting_costs'] + metrics['ai_costs']
    gross_margin = (metrics['mrr'] - cogs) / metrics['mrr']
    
    # CAC and LTV
    cac = metrics['sales_marketing_costs'] / metrics['new_customers']
    monthly_churn = metrics['churned_customers'] / metrics['total_customers']
    ltv = arpu / monthly_churn if monthly_churn > 0 else 0
    
    return {
        'arpu': arpu,
        'gross_margin': gross_margin,
        'cac': cac,
        'ltv': ltv,
        'ltv_cac_ratio': ltv / cac if cac > 0 else 0,
        'payback_months': cac / (arpu * gross_margin) if arpu > 0 else 0
    }

# Target unit economics
targets = {
    'gross_margin': 0.80,      # 80%+ gross margins
    'ltv_cac_ratio': 3.0,      # 3:1 minimum
    'payback_months': 12,      # <12 months
    'magic_number': 0.7        # >0.7 for efficient growth
}
```

#### Burn & Runway
```
Cash Management
├── Monthly Burn Rate: $___
├── Net Burn Rate: $___ (after revenue)
├── Runway: ___ months
├── Default Alive Date: ___
└── Cash Balance: $___

Efficiency Metrics
├── Burn Multiple: ___ (Net Burn / Net New ARR)
├── Magic Number: ___ (QoQ ARR Growth / Prior Q S&M)
├── CAC Ratio: ___ (New ARR / S&M Spend)
└── Rule of 40: ___% (Growth Rate + Profit Margin)
```

## Operational Metrics

### Sales Metrics
```
Sales Pipeline
├── Leads Generated: ___/month
├── MQLs: ___ (Marketing Qualified Leads)
├── SQLs: ___ (Sales Qualified Leads)
├── Opportunities: ___
└── Closed Won: ___

Conversion Funnel
├── Visitor → Lead: ___%
├── Lead → MQL: ___%
├── MQL → SQL: ___%
├── SQL → Opportunity: ___%
├── Opportunity → Customer: ___%
└── Overall: ___% (Target: >2%)

Sales Efficiency
├── Average Deal Size: $___
├── Sales Cycle Length: ___ days
├── Win Rate: ___%
├── Quota Attainment: ___%
└── Pipeline Coverage: ___x
```

### Marketing Metrics
```
Channel Performance
├── Organic Search
│   ├── Traffic: ___/month
│   ├── Conversions: ___
│   └── CAC: $___
├── LinkedIn
│   ├── Impressions: ___
│   ├── Clicks: ___
│   └── CAC: $___
├── Content Marketing
│   ├── Blog Views: ___
│   ├── Downloads: ___
│   └── Attributed Revenue: $___
└── Referrals
    ├── Volume: ___
    └── Conversion: ___%

Content Metrics
├── Blog Posts Published: ___/month
├── Average Time on Page: ___ min
├── Email Subscribers: ___
├── Open Rate: ___%
└── Click Rate: ___%
```

### Engineering Metrics
```
Development Velocity
├── Story Points Completed: ___/sprint
├── Bugs Fixed: ___
├── Features Shipped: ___
├── Code Coverage: ___%
└── Technical Debt Ratio: ___%

Infrastructure Health
├── API Availability: ___%
├── Database Performance: ___ ms
├── Storage Utilization: ___%
├── Cost per Transaction: $___
└── Security Incidents: ___
```

## Metrics Infrastructure

### Data Collection Architecture
```python
# Event tracking schema
event_schema = {
    "event_id": "uuid",
    "user_id": "string",
    "organization_id": "string",
    "event_type": "string",
    "event_properties": "json",
    "timestamp": "timestamp",
    "session_id": "string",
    "platform": "string",
    "version": "string"
}

# Key events to track
key_events = [
    "user_signup",
    "trial_started",
    "document_uploaded",
    "analysis_completed",
    "export_generated",
    "feature_used",
    "payment_processed",
    "user_churned"
]

# Implementation with Mixpanel
import mixpanel

mp = mixpanel.Mixpanel(MIXPANEL_TOKEN)

def track_event(user_id, event_type, properties={}):
    mp.track(user_id, event_type, {
        **properties,
        'organization_id': get_org_id(user_id),
        'platform': 'web',
        'version': APP_VERSION
    })
```

### Analytics Stack
```yaml
# Modern data stack for SANAD
data_sources:
  - application_database: PostgreSQL
  - event_tracking: Mixpanel
  - customer_data: Intercom
  - payment_data: Stripe

data_pipeline:
  - ingestion: Fivetran / Airbyte
  - warehouse: BigQuery / Snowflake
  - transformation: dbt
  - orchestration: Airflow

analytics_layer:
  - bi_tool: Metabase / Looker
  - product_analytics: Mixpanel
  - revenue_analytics: ChartMogul
  - custom_dashboards: Retool
```

## Metrics Reviews

### Daily Standup Metrics (5 min)
```
Yesterday's Performance
├── New Signups: ___
├── Documents Processed: ___
├── Revenue: $___
├── Support Tickets: ___
└── System Health: 🟢/🟡/🔴
```

### Weekly Leadership Review (1 hour)
```
Week-over-Week Changes
├── MRR Growth: ___% (vs last week)
├── Active Users: ___% change
├── Feature Adoption: ___% change
├── Sales Pipeline: $___ added
└── Burn Rate: $___ 

Action Items:
1. _________________
2. _________________
3. _________________
```

### Monthly Board Metrics (2 hours)
```
Executive Dashboard
├── Financial Performance
│   ├── MRR: $___ (___% vs plan)
│   ├── Burn: $___ (___% vs plan)
│   └── Runway: ___ months
├── Growth Metrics
│   ├── Customers: ___ (___% growth)
│   ├── Logo Retention: ___%
│   └── NRR: ___%
├── Product Metrics
│   ├── Usage: ___ docs/user
│   ├── NPS: ___
│   └── Uptime: ___%
└── Team Metrics
    ├── Headcount: ___
    ├── Velocity: ___ points
    └── eNPS: ___
```

## Metrics-Driven Decisions

### When to Pivot
Red flags in metrics:
- CAC > 3x ACV
- Monthly churn > 5%
- NPS < 30
- Feature adoption < 20%
- Sales cycle increasing

### When to Double Down
Green flags in metrics:
- NRR > 130%
- Organic growth > 50%
- CAC payback < 6 months
- NPS > 70
- Magic number > 1.0

## Benchmarking

### SaaS Benchmarks for Legal Tech
```
Good | Great | Exceptional
-----|-------|-------------
Growth Rate: 100% | 200% | 300%+ YoY
Gross Margin: 70% | 80% | 90%+
CAC Payback: 18mo | 12mo | <6mo
NRR: 100% | 120% | 140%+
Logo Churn: 10% | 5% | <2% annual
NPS: 30 | 50 | 70+
```

## Common Metrics Mistakes

### 1. Vanity Metrics
❌ Total signups (include free/inactive)
✅ Paying active users

❌ Total documents (include tests)
✅ Documents by paying users

❌ Feature releases
✅ Feature adoption rate

### 2. Missing Context
Always show:
- Absolute number AND percentage
- Current period AND comparison
- Metric AND target

### 3. Over-Measuring
Focus on 5-7 key metrics per team
Review cycles match decision cycles
Automate before adding new metrics

## Metrics Tools

### Essential Stack
1. **Mixpanel**: Product analytics ($0-1000/mo)
2. **ChartMogul**: Revenue analytics ($100-500/mo)
3. **Metabase**: BI/Dashboards ($0-500/mo)
4. **Sentry**: Error tracking ($0-100/mo)

### SQL Queries Library
```sql
-- Daily Active Users
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as dau
FROM events
WHERE event_type = 'document_processed'
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Cohort Retention
WITH cohort_users AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', first_active_date) as cohort_month
    FROM users
),
user_activities AS (
    SELECT
        user_id,
        DATE_TRUNC('month', activity_date) as activity_month
    FROM events
    WHERE event_type = 'document_processed'
)
SELECT 
    c.cohort_month,
    DATEDIFF('month', c.cohort_month, a.activity_month) as months_since_signup,
    COUNT(DISTINCT c.user_id) as cohort_size,
    COUNT(DISTINCT a.user_id) as retained_users,
    COUNT(DISTINCT a.user_id)::FLOAT / COUNT(DISTINCT c.user_id) as retention_rate
FROM cohort_users c
LEFT JOIN user_activities a ON c.user_id = a.user_id
GROUP BY 1, 2
ORDER BY 1, 2;
```

## Action Plan

### Week 1: Foundation
- [ ] Set up Mixpanel
- [ ] Define key events
- [ ] Create first dashboard
- [ ] Train team on metrics

### Month 1: Baseline
- [ ] Establish baselines
- [ ] Set realistic targets  
- [ ] Automate reporting
- [ ] Weekly reviews started

### Quarter 1: Optimization
- [ ] A/B testing framework
- [ ] Cohort analysis
- [ ] Predictive metrics
- [ ] Board dashboard

Remember: Metrics are for making decisions, not just reporting. Every metric should have an owner and an action plan.

---

**Next Step**: [Team Building Guide →](/operations/team-building/)