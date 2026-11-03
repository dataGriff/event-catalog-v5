# Welcome to EventCatalog

[EventCatalog](https://www.eventcatalog.dev/) is your architecture catalog for distributed systems. Use it to document, govern, and discover your services, domains, APIs, events, commands, queries, schemas, teams, and flows in one place.

## Start the Catalog

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your catalog.

Using `pnpm` or `yarn`? Run the same scripts with the package manager you chose when creating this project.

## Edit Your Catalog

Your catalog is docs-as-code. Resources live in folders with an `index.mdx` file for frontmatter metadata and Markdown content.

Good places to start:

- `domains/` - bounded contexts, business capabilities, and ownership
- `domains/<domain>/systems/` - systems and containers inside each domain
- `domains/<domain>/systems/<system>/services/` - services, APIs, and message producers or consumers
- `commands/`, `events/`, and `queries/` folders under services - the messages flowing through your system
- `teams/` and `users/` - who owns each part of the architecture

Prefer a visual workflow? Run `npm run editor` to open the [EventCatalog Editor](https://www.eventcatalog.dev/docs/editor/overview) and browse, create, or update catalog resources through a GitHub-backed UI.

## Make Your First Change

1. Add or edit a domain, service, or message.
2. Run `npm run dev` and check the generated pages and diagrams.
3. Commit the MDX and schema files to Git.

## Server Mode, MCP and Cloudflare

This catalog runs in **server mode** (`output: 'server'` in `eventcatalog.config.js`). Server mode turns on the built-in
[MCP server](https://www.eventcatalog.dev/docs/development/ask-your-architecture/mcp-server/introduction), so AI agents can
query the catalog over Streamable HTTP:

| Scope | URL |
| --- | --- |
| Whole catalog | `https://<your-host>/docs/mcp/` |
| One domain | `https://<your-host>/docs/mcp/domains/<domain-id>` |
| One system | `https://<your-host>/docs/mcp/systems/<system-id>` |

Open **Settings > MCP** in the running catalog to copy the exact URLs. A browser `GET` on the endpoint returns a JSON health
response listing the available tools. Connect from Claude Code with:

```sh
claude mcp add --transport http eventcatalog https://<your-host>/docs/mcp/
```

### Run the server locally

```sh
npm run build
npm run start
```

The catalog is served on [http://localhost:3000](http://localhost:3000) and the MCP endpoint on
[http://localhost:3000/docs/mcp/](http://localhost:3000/docs/mcp/).

### Deploy to Cloudflare

Server mode is a Node.js server, so it is deployed to [Cloudflare Containers](https://developers.cloudflare.com/containers/):

- `Dockerfile.server` builds the catalog and runs the Node server on port 3000.
- `wrangler.jsonc` declares the container and its Durable Object binding.
- `src/worker.js` is the Worker that forwards every request (including `/docs/mcp`) to the container.
- `.github/workflows/deploy-cloudflare.yml` deploys on every push to `main`.

Requirements:

1. A Cloudflare account on the **Workers Paid** plan (Containers are not on the free plan).
2. An API token with the **Edit Cloudflare Workers** template permissions, plus your account ID.
3. In the GitHub repository, add the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

Push to `main` (or run the workflow manually) and the Worker is published at
`https://eventcatalog-demo.<your-subdomain>.workers.dev`. The first deploy takes a few minutes while the image is provisioned.

To deploy from your machine instead, start Docker, then run:

```sh
npx wrangler login
npm run deploy
```

The container sleeps after 15 minutes without traffic and starts again on the next request, so the first request after idle
takes a little longer. Change `instance_type` in `wrangler.jsonc` if the catalog needs more memory or CPU.

## Keep It in Sync

Use `npm run generate` with [EventCatalog integrations](https://www.eventcatalog.dev/integrations) to import architecture data from OpenAPI, AsyncAPI, schema registries, EventBridge, GitHub, internal systems, and more.

Run generators locally while you work, or in CI so your catalog stays aligned with the systems it describes.

## Check Your Architecture

Fitness functions check your catalog against your own architecture rules, such as "every message has an owner". Each rule is a `*.fitness.ts` file in the `fitness/` folder, or in a `fitness/` folder next to a domain, system, service or message.

```sh
npm run fitness
```

It exits with an error when a rule fails, so you can run it in CI to check every change.

## Use AI with Architecture Context

EventCatalog gives AI tools structured context about your domains, services, messages, schemas, owners, and flows.

- Connect Claude, Cursor, VS Code, Windsurf, or another MCP-compatible tool with the [EventCatalog MCP Server](https://www.eventcatalog.dev/docs/development/guides/ai/using-mcp-server).
- Install [EventCatalog Skills](https://github.com/event-catalog/skills) to help agents document services, create domain models, and map business flows:

```sh
npx skills add event-catalog/skills
```

## Learn by Task

- [Create a domain](https://www.eventcatalog.dev/docs/development/guides/domains)
- [Document a service](https://www.eventcatalog.dev/docs/development/guides/services)
- [Add events, commands, and queries](https://www.eventcatalog.dev/docs/development/guides/messages/adding-messages)
- [Use the EventCatalog Editor](https://www.eventcatalog.dev/docs/editor/overview)
- [Generate from integrations](https://www.eventcatalog.dev/integrations)
- [Manage your catalog with the SDK](https://www.eventcatalog.dev/docs/development/sdk)
- [Join the community](https://discord.gg/3rjaZMmrAm)

## Found a Problem?

Open an issue on [GitHub](https://github.com/event-catalog/eventcatalog/issues).

## License

This catalog is built with [EventCatalog](https://www.eventcatalog.dev). EventCatalog 5.0.0 and later is licensed under the [Business Source License 1.1](https://github.com/event-catalog/eventcatalog/blob/main/LICENSE), which covers production use of EventCatalog itself. Your catalog's content (your documentation, schemas and configuration) is yours. See the [license FAQ](https://www.eventcatalog.dev/license-faq) for what's included.
