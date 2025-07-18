---
title: Technical Architecture - Building SANAD
description: Complete technical blueprint for SANAD's AI-powered legal platform
---

# Technical Architecture: Building for Scale

## Architecture Principles

1. **API-First**: Every feature has an API
2. **Microservices**: Loosely coupled, independently deployable
3. **Event-Driven**: Async processing for heavy tasks
4. **Multi-Tenant**: Secure isolation between law firms
5. **Cloud-Native**: But with on-premise option

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer                         │
│                    (Cloudflare / nginx)                      │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
        ┌─────────▼─────────┐   ┌────────▼────────┐
        │   Web Application │   │   Mobile Apps   │
        │   (Next.js/React) │   │  (React Native) │
        └─────────┬─────────┘   └────────┬────────┘
                  │                       │
        ┌─────────▼───────────────────────▼─────────┐
        │            API Gateway                    │
        │         (Kong / API Gateway)              │
        └─────────┬─────────────────────────────────┘
                  │
    ┌─────────────┼─────────────────────────────────┐
    │             │                                 │
┌───▼──┐    ┌─────▼──────┐    ┌──────────┐   ┌────▼─────┐
│Auth  │    │Core Service│    │AI Service│   │Analytics │
│Service    │  (FastAPI) │    │(FastAPI) │   │ Service  │
└───┬──┘    └─────┬──────┘    └────┬─────┘   └────┬─────┘
    │             │                 │               │
    └─────────────┼─────────────────┼───────────────┘
                  │                 │
         ┌────────▼────────┐   ┌────▼────┐
         │   PostgreSQL    │   │  Redis  │
         │   (Primary DB)  │   │ (Cache) │
         └─────────────────┘   └─────────┘
                  │
         ┌────────▼────────┐
         │   S3 Storage    │
         │  (Documents)    │
         └─────────────────┘
```

## Core Components

### 1. Frontend Architecture

#### Web Application (Next.js 14)
```typescript
// Tech stack
- Framework: Next.js 14 with App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS + Shadcn/ui
- State: Zustand + React Query
- Forms: React Hook Form + Zod
- Testing: Jest + React Testing Library

// Folder structure
src/
├── app/                    # App router pages
│   ├── (auth)/            # Auth layout group
│   ├── (dashboard)/       # Dashboard layout
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── features/          # Feature-specific components
│   └── layouts/           # Layout components
├── lib/
│   ├── api/               # API client functions
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

#### Key Frontend Features
```typescript
// Multilingual support (Arabic RTL)
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  const router = useRouter();
  
  const toggleLanguage = () => {
    const newLocale = i18n.language === 'ar' ? 'fr' : 'ar';
    router.push(router.pathname, router.asPath, { locale: newLocale });
    document.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };
}

// Real-time document processing
import { useWebSocket } from '@/hooks/useWebSocket';

export function DocumentProcessor() {
  const { sendMessage, lastMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL
  );
  
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      updateProgress(data.progress);
      if (data.status === 'complete') {
        showResults(data.results);
      }
    }
  }, [lastMessage]);
}
```

### 2. Backend Services

#### Core Service (FastAPI)
```python
# Tech stack
- Framework: FastAPI
- Language: Python 3.11+
- ORM: SQLAlchemy 2.0
- Validation: Pydantic v2
- Testing: pytest + pytest-asyncio

# Project structure
app/
├── api/
│   ├── v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   ├── documents.py
│   │   │   ├── analysis.py
│   │   │   └── users.py
│   │   └── router.py
├── core/
│   ├── config.py          # Settings management
│   ├── security.py        # Auth & encryption
│   └── database.py        # DB connection
├── models/
│   ├── user.py
│   ├── document.py
│   └── analysis.py
├── schemas/               # Pydantic models
├── services/              # Business logic
├── utils/                 # Helpers
└── main.py               # App entry point
```

#### API Design
```python
# RESTful API with consistent patterns
from fastapi import FastAPI, Depends, HTTPException
from typing import List
import asyncio

app = FastAPI(title="SANAD API", version="1.0.0")

# Document upload endpoint
@app.post("/api/v1/documents/upload")
async def upload_document(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(400, "Invalid file format")
    
    # Store file
    file_id = await store_file(file)
    
    # Create DB record
    document = Document(
        user_id=current_user.id,
        filename=file.filename,
        file_id=file_id,
        status="processing"
    )
    db.add(document)
    db.commit()
    
    # Trigger async processing
    await process_document.delay(document.id)
    
    return {"document_id": document.id, "status": "processing"}
```

### 3. AI Service Architecture

#### AI Pipeline with LLMs + RAG
```python
# Document processing pipeline using LLMs and RAG
class DocumentPipeline:
    def __init__(self):
        self.ocr = OCRService()
        self.embeddings = OpenAIEmbeddings()
        self.vector_store = PineconeVectorStore()
        self.llm_service = LLMService()
    
    async def process(self, document_id: str):
        # 1. Extract text
        document = await self.get_document(document_id)
        text = await self.ocr.extract_text(document.file_path)
        
        # 2. Chunk document for RAG
        chunks = self.chunk_document(text, chunk_size=1000, overlap=200)
        
        # 3. Generate embeddings and store
        embeddings = await self.embeddings.create(chunks)
        await self.vector_store.upsert(
            document_id=document_id,
            chunks=chunks,
            embeddings=embeddings
        )
        
        # 4. AI analysis using LLM
        analysis = await self.llm_service.analyze_contract(
            text=text,
            document_type=document.type,
            language=document.language
        )
        
        # 5. Store results
        await self.store_analysis(document_id, analysis)
        
        return analysis
```

#### LLM Service Architecture
```python
# Using GPT-4 and Claude with RAG
class LLMService:
    def __init__(self):
        # API clients
        self.openai_client = OpenAI(api_key=OPENAI_KEY)
        self.anthropic_client = Anthropic(api_key=ANTHROPIC_KEY)
        
        # Vector store for RAG
        self.vector_store = PineconeVectorStore()
        
        # Prompt templates
        self.prompts = PromptTemplates()
    
    async def analyze_contract(self, text: str, document_type: str, language: str):
        # 1. Retrieve relevant legal context
        context = await self.vector_store.search(
            query=text[:1000],  # Use first chunk as query
            filter={"document_type": document_type, "language": language},
            top_k=5
        )
        
        # 2. Build prompt with context
        prompt = self.prompts.contract_analysis(
            contract_text=text,
            legal_context=context,
            language=language
        )
        
        # 3. Get analysis from LLM (with fallback)
        try:
            # Primary: GPT-4 for complex analysis
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": self.prompts.legal_expert_system()},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,  # Low temperature for consistency
                response_format={"type": "json_object"}
            )
            analysis = json.loads(response.choices[0].message.content)
        except Exception as e:
            # Fallback: Claude for reliability
            response = await self.anthropic_client.messages.create(
                model="claude-3-opus-20240229",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )
            analysis = self.parse_claude_response(response.content)
        
        # 4. Validate and enhance with RAG
        analysis = await self.validate_with_precedents(analysis, context)
        
        return analysis
    
    async def validate_with_precedents(self, analysis, context):
        """Validate AI output against known precedents"""
        # Check each identified risk against precedent database
        for risk in analysis.get("risks", []):
            similar_cases = await self.vector_store.search(
                query=risk["description"],
                filter={"type": "precedent"},
                top_k=3
            )
            risk["precedents"] = similar_cases
            risk["confidence"] = self.calculate_confidence(similar_cases)
        
        return analysis
```

#### RAG Implementation
```python
# Retrieval Augmented Generation for legal accuracy
class LegalRAGSystem:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
        self.vector_store = PineconeVectorStore(
            index_name="sanad-legal-docs",
            dimension=3072  # For text-embedding-3-large
        )
        self.reranker = CohereRerank()  # For better relevance
    
    async def build_knowledge_base(self):
        """Index legal documents for RAG"""
        documents = [
            # Tunisian legal corpus
            {"type": "law", "content": "Tunisian Commercial Code..."},
            {"type": "precedent", "content": "Court decision..."},
            {"type": "template", "content": "Standard contract..."},
            
            # Saudi legal corpus
            {"type": "regulation", "content": "Saudi contract law..."},
            {"type": "fatwa", "content": "Sharia ruling on contracts..."},
        ]
        
        for doc in documents:
            chunks = self.chunk_document(doc["content"])
            embeddings = await self.embeddings.create(chunks)
            
            await self.vector_store.upsert(
                chunks=chunks,
                embeddings=embeddings,
                metadata={
                    "type": doc["type"],
                    "source": doc.get("source"),
                    "date": doc.get("date"),
                    "jurisdiction": doc.get("jurisdiction")
                }
            )
    
    async def retrieve_context(self, query: str, filters: dict = None):
        """Retrieve relevant legal context"""
        # 1. Initial retrieval
        results = await self.vector_store.search(
            query=query,
            filter=filters,
            top_k=20
        )
        
        # 2. Rerank for relevance
        reranked = await self.reranker.rerank(
            query=query,
            documents=results,
            top_k=5
        )
        
        # 3. Format context with citations
        context = []
        for doc in reranked:
            context.append({
                "content": doc.content,
                "source": doc.metadata.get("source", "Unknown"),
                "relevance_score": doc.score
            })
        
        return context
```

### 4. Database Design

#### PostgreSQL Schema
```sql
-- Multi-tenant architecture with row-level security
CREATE SCHEMA IF NOT EXISTS sanad;

-- Organizations (Law Firms)
CREATE TABLE sanad.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'solo', 'small', 'enterprise'
    country VARCHAR(2) NOT NULL, -- 'TN', 'SA'
    subscription_tier VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE sanad.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES sanad.organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'lawyer', 'paralegal'
    language_preference VARCHAR(2) DEFAULT 'ar',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE sanad.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES sanad.organizations(id),
    uploaded_by UUID REFERENCES sanad.users(id),
    filename VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(64) NOT NULL, -- SHA256 for deduplication
    storage_path TEXT NOT NULL,
    document_type VARCHAR(100), -- 'contract', 'agreement', etc
    language VARCHAR(2),
    status VARCHAR(50) DEFAULT 'uploaded',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_org_created (organization_id, created_at DESC)
);

-- Analyses
CREATE TABLE sanad.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES sanad.documents(id),
    version INTEGER DEFAULT 1,
    ai_model_version VARCHAR(50),
    summary TEXT,
    key_terms JSONB,
    clauses JSONB,
    risks JSONB,
    processing_time_ms INTEGER,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_document_version (document_id, version DESC)
);

-- Enable Row Level Security
ALTER TABLE sanad.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanad.analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY org_isolation_documents ON sanad.documents
    FOR ALL TO application_user
    USING (organization_id = current_setting('app.current_org_id')::UUID);

CREATE POLICY org_isolation_analyses ON sanad.analyses
    FOR ALL TO application_user
    USING (
        document_id IN (
            SELECT id FROM sanad.documents 
            WHERE organization_id = current_setting('app.current_org_id')::UUID
        )
    );
```

### 5. Infrastructure & DevOps

#### Container Architecture
```yaml
# docker-compose.yml for development
version: '3.8'

services:
  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules

  # API Gateway
  kong:
    image: kong:3.0
    ports:
      - "8000:8000"
      - "8001:8001"
    environment:
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=postgres
    depends_on:
      - postgres

  # Core API
  api:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://sanad:password@postgres/sanad
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./backend:/app
    depends_on:
      - postgres
      - redis

  # AI Service
  ai_service:
    build: ./ai_service
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - MODEL_PATH=/models
    volumes:
      - ./models:/models

  # Databases
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=sanad
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=sanad
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Kubernetes Production Setup
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sanad-production

---
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sanad-api
  namespace: sanad-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sanad-api
  template:
    metadata:
      labels:
        app: sanad-api
    spec:
      containers:
      - name: api
        image: sanad/api:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: sanad-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10

---
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sanad-api-hpa
  namespace: sanad-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sanad-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 6. Security Architecture

#### Security Layers
```python
# Multiple security layers

# 1. API Authentication (JWT + OAuth2)
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTStrategy

SECRET = os.getenv("JWT_SECRET")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=SECRET,
        lifetime_seconds=3600,
        token_audience=["sanad:auth"]
    )

# 2. Data Encryption
from cryptography.fernet import Fernet

class EncryptionService:
    def __init__(self):
        self.key = os.getenv("ENCRYPTION_KEY").encode()
        self.cipher = Fernet(self.key)
    
    def encrypt_document(self, data: bytes) -> bytes:
        return self.cipher.encrypt(data)
    
    def decrypt_document(self, encrypted_data: bytes) -> bytes:
        return self.cipher.decrypt(encrypted_data)

# 3. Rate Limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/documents/analyze")
@limiter.limit("10/minute")
async def analyze_document(request: Request):
    # Rate limited endpoint
    pass

# 4. Input Validation
from pydantic import BaseModel, validator
import bleach

class DocumentUpload(BaseModel):
    title: str
    description: str
    
    @validator('title', 'description')
    def sanitize_input(cls, v):
        return bleach.clean(v, strip=True)
```

### 7. Monitoring & Observability

#### Monitoring Stack
```yaml
# prometheus.yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'sanad-api'
    static_configs:
      - targets: ['api:8080']
    metrics_path: '/metrics'

  - job_name: 'sanad-ai'
    static_configs:
      - targets: ['ai-service:8090']

# Key metrics to track
metrics:
  - api_requests_total
  - api_request_duration_seconds
  - document_processing_duration_seconds
  - ai_model_inference_time
  - database_query_duration
  - active_users_count
  - documents_processed_total
```

#### Logging Architecture
```python
# Structured logging with context
import structlog
from pythonjsonlogger import jsonlogger

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Usage
logger.info(
    "document_processed",
    document_id=doc.id,
    user_id=user.id,
    organization_id=org.id,
    processing_time_ms=elapsed_ms,
    document_type=doc.type,
    language=doc.language
)
```

### 8. Performance Optimization

#### Caching Strategy
```python
# Multi-level caching
from redis import Redis
from functools import lru_cache
import hashlib

class CacheService:
    def __init__(self):
        self.redis = Redis.from_url(os.getenv("REDIS_URL"))
        
    # L1: In-memory cache for hot data
    @lru_cache(maxsize=1000)
    def get_user_preferences(self, user_id: str):
        return self._fetch_user_preferences(user_id)
    
    # L2: Redis cache for shared data
    async def get_document_analysis(self, doc_id: str):
        cache_key = f"analysis:{doc_id}"
        
        # Check Redis
        cached = self.redis.get(cache_key)
        if cached:
            return json.loads(cached)
        
        # Compute if not cached
        analysis = await self.compute_analysis(doc_id)
        
        # Cache for 1 hour
        self.redis.setex(
            cache_key,
            3600,
            json.dumps(analysis)
        )
        
        return analysis
    
    # L3: CDN for static assets
    def get_asset_url(self, path: str):
        return f"{CDN_URL}/{path}?v={self.get_hash(path)}"
```

#### Database Optimization
```sql
-- Optimized queries with proper indexing

-- Fast document search
CREATE INDEX idx_documents_search ON sanad.documents 
USING gin(to_tsvector('arabic', filename || ' ' || coalesce(metadata->>'content', '')));

-- Efficient pagination
CREATE INDEX idx_documents_pagination ON sanad.documents(organization_id, created_at DESC, id);

-- Query example with optimization
EXPLAIN ANALYZE
SELECT 
    d.id,
    d.filename,
    d.created_at,
    a.summary,
    a.confidence_score
FROM sanad.documents d
LEFT JOIN LATERAL (
    SELECT summary, confidence_score
    FROM sanad.analyses
    WHERE document_id = d.id
    ORDER BY version DESC
    LIMIT 1
) a ON true
WHERE d.organization_id = $1
    AND d.created_at >= $2
ORDER BY d.created_at DESC
LIMIT 20 OFFSET 0;
```

### 9. Deployment Pipeline

#### CI/CD with GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit
          
      - name: Run security scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'sanad/api:${{ github.sha }}'
          
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        run: |
          echo "$KUBE_CONFIG" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig
          kubectl set image deployment/sanad-api api=sanad/api:${{ github.sha }} -n sanad-production
          kubectl rollout status deployment/sanad-api -n sanad-production
```

## Tech Stack Summary

### Core Technologies
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, PostgreSQL
- **AI/ML**: PyTorch, Transformers, LangChain
- **Infrastructure**: Kubernetes, Docker, GitHub Actions
- **Monitoring**: Prometheus, Grafana, Sentry

### Key Libraries
```json
{
  "frontend": {
    "next": "14.0.0",
    "react": "18.2.0",
    "typescript": "5.0.0",
    "tailwindcss": "3.3.0",
    "@tanstack/react-query": "5.0.0",
    "zustand": "4.4.0"
  },
  "backend": {
    "fastapi": "0.104.0",
    "sqlalchemy": "2.0.0",
    "pydantic": "2.5.0",
    "celery": "5.3.0",
    "redis": "5.0.0"
  },
  "ai": {
    "langchain": "0.1.0",
    "openai": "1.12.0",
    "anthropic": "0.18.0",
    "pinecone-client": "2.0.0",
    "cohere": "4.47.0"
  }
}
```

### API Cost Estimates (Monthly)
```
OpenAI GPT-4 Turbo:
- Input: $10/1M tokens (~500 docs @ 10k tokens = $50)
- Output: $30/1M tokens (~500 docs @ 2k tokens = $30)
- Embeddings: $0.13/1M tokens (~$20/month)

Claude 3 Opus (Fallback):
- $15/$75 per 1M tokens (input/output)
- ~20% of traffic = $50/month

Pinecone Vector DB:
- Starter plan: $70/month
- 100k vectors, 5 indexes

Total AI Costs: ~$220/month for 500 documents
Scale: ~$2,000/month for 5,000 documents
```

## Architecture Decisions Record (ADR)

### ADR-001: Microservices over Monolith
**Status**: Accepted
**Context**: Need to scale AI processing independently
**Decision**: Separate AI service from core API
**Consequences**: More complex deployment, better scalability

### ADR-002: PostgreSQL over MongoDB  
**Status**: Accepted
**Context**: Need ACID compliance for legal documents
**Decision**: PostgreSQL with JSONB for flexibility
**Consequences**: Better consistency, slightly less flexibility

### ADR-003: On-Premise Option Required
**Status**: Accepted
**Context**: Enterprise law firms require data sovereignty
**Decision**: Kubernetes-based deployment for both cloud and on-prem
**Consequences**: More complex architecture, broader market reach

### ADR-004: LLMs + RAG over Custom Models
**Status**: Accepted
**Context**: Need fast time-to-market with high accuracy
**Decision**: Use GPT-4/Claude APIs with RAG instead of training custom models
**Consequences**: 
- Pros: 6-month faster deployment, $500K+ savings, better accuracy, easier updates
- Cons: Ongoing API costs, dependency on providers, need robust fallbacks

---

**Next Step**: [AI Features Deep Dive →](/product/ai-features/)