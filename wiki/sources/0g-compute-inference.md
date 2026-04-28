# Source: 0G Compute Inference Docs

Status: active  
Updated: 2026-04-25  
Source URL: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference

## Key Points

0G Compute provides decentralized AI inference services for chatbot, image, and speech use cases. The docs list a CLI and SDK flow around `@0glabs/0g-serving-broker`, provider metadata, request headers, OpenAI-style chat completion calls, and optional response verification.

Current docs mention:

- Node.js >= 22 for the developer path.
- CLI install with `pnpm add @0glabs/0g-serving-broker -g`.
- Testnet chatbot service such as `qwen-2.5-7b-instruct`.
- Mainnet chatbot services such as `GLM-5-FP8`, `gpt-oss-120b`, `deepseek-chat-v3-0324`, and `qwen3.6-plus`.
- TEE verification modes: TeeML and TeeTLS.
- Optional response processing with a response key/header to verify provider signatures.

## Relevance To OpenGap

Use 0G Compute for:

- answering developer questions
- reflection over failed interactions
- doc patch generation
- example generation
- critique/review pass
- clustering repeated gaps

## Open Questions

- Which services are available to hackathon participants on testnet during the event?
- Is the cheapest reliable path to use testnet `qwen-2.5-7b-instruct`, mainnet models, or a fallback local/mock adapter?
- What response verification data can we show cleanly in the demo?

