# Skyflow Node.js

This repository hosts Skyflow's Node.js SDKs for integrating Skyflow into a Node.js, Deno, Bun, or Cloudflare Workers backend. It's a single npm workspace with more than one published package — pick the package that matches what you need below.

[![CI](https://img.shields.io/static/v1?label=CI&message=passing&color=green?style=plastic&logo=github)](https://github.com/skyflowapi/skyflow-node/actions)
[![GitHub release](https://badge.fury.io/js/skyflow-node.svg)](https://www.npmjs.com/package/skyflow-node)
[![License](https://img.shields.io/github/license/skyflowapi/skyflow-node)](https://github.com/skyflowapi/skyflow-node/blob/main/LICENSE)

## Which package do I want?

| Package | npm | README | Vault Type | Version line |
|---|---|---|---|---|
| **skyvault** | [`skyflow-node`](https://www.npmjs.com/package/skyflow-node) | [skyvault/README.md](skyvault/README.md) | Privacy DB | 2.x |
| **flowvault** | [`skyflow-flowvault-node`](https://www.npmjs.com/package/skyflow-flowvault-node) | [flowvault/README.md](flowvault/README.md) | Flow DB | 1.x |

`flowvault` shares auth/client setup with `skyvault` — both depend on the `common` workspace. Install exactly one of the two packages.

> **The two packages are versioned independently.** `flowvault` is a new SDK starting at `1.0.0`; its lower version number reflects a first release, not an older or lesser SDK than `skyvault` 2.x. Upgrade each on its own version line.

> Migrating from v1? See skyvault's **[Migration Guide](docs/migrate_to_v2.md)**. V1 is in maintenance mode and will reach End of Life on October 31, 2026.

## Repository layout

The root `package.json` (`private: true`) aggregates these npm workspaces:

- `common/` — shared client, credentials, config, Detect, and error-handling code used by both `skyvault` and `flowvault`
- `skyvault/` — the `skyflow-node` SDK ([README](skyvault/README.md))
- `flowvault/` — the `skyflow-flowvault-node` SDK ([README](flowvault/README.md))
- `samples/` — runnable examples for `skyvault` ([README](samples/README.md)); `flowvault` samples live in [`flowvault/samples/`](flowvault/samples/README.md)

## Documentation

- [skyvault API Reference](docs/api_reference.md) — full list of request classes, options, response classes, enums, and service-account functions
- [Detect API Reference](docs/api_reference.md#detect-api) — request, response, configuration and enum types for Detect, shared by both SDKs
- [Migrate from v1 to v2](docs/migrate_to_v2.md)
- [Advanced initialization](docs/advanced_initialization.md)
- [Authentication credentials](docs/auth_credentials.md)

## Reporting a Vulnerability

If you discover a potential security issue in this project, please reach out to us at **security@skyflow.com**. Please do not create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
