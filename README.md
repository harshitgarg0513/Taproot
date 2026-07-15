# EIP

EIP is a TypeScript monorepo for analyzing repository structure, building knowledge graphs, and answering repository-level queries.

## Packages

- analyzer: parses source files and extracts components, symbols, and classification signals
- core: builds repository models and provides query, risk, and knowledge APIs
- observer: detects framework and repository characteristics
- shared: shared utilities, result helpers, and matching logic
- config: configuration loading and defaults
- cli: command-line interface for local inspection and analysis

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

## Notes

The project is organized as a Turbo monorepo with package-level builds and tests.
