# Engineering Intelligence Engine (EIP)

## Motivation

Why AI coding assistants modify too much code.

---

## Problem

Current coding assistants receive too much repository context.

This increases:

- token usage
- hallucinations
- unnecessary edits

---

## Solution

EIP builds a deterministic repository model and retrieves only the most relevant engineering context before invoking an LLM.

---

## Architecture

Natural Language Intent

↓

Seed Retrieval

↓

Repository Graph Expansion

↓

Context Optimization

↓

Prompt Builder

↓

LLM

---

## Features

- Repository Scanner
- Entity Extraction
- Knowledge Graph
- Deterministic Seed Retrieval
- Context Optimization
- Risk Analysis
- Explain
- Evaluation
- VS Code Extension

---

## Evaluation

Evaluation measures how well retrieved repository context aligns with the files actually changed by a commit.

- Precision: how many selected files are relevant
- Recall: how many relevant files were selected
- F1: the harmonic mean of precision and recall

Files changed in commits are a proxy for relevance.

---

## Current Limitations

- Conventional naming assumed
- TypeScript only
- Deterministic retrieval (Embeddings planned)

---

## Roadmap

V2

- Hybrid Retrieval
- Embedding Signals
- Multi-language
- Git History Weighting
- Plugin SDK

---

## Demo

GIF

Screenshots

---

## Badges

- Build
- Coverage
- License
- TypeScript
- Node
- pnpm

---

## License

MIT
