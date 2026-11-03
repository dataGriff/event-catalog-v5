import { Container, getContainer } from '@cloudflare/containers';

/**
 * Runs the EventCatalog SSR server (built from Dockerfile.server) as a Cloudflare Container.
 * Because EventCatalog is in `output: 'server'` mode, the built-in MCP server is served
 * by the same process at /docs/mcp.
 */
export class EventCatalogContainer extends Container {
  // Port the EventCatalog server listens on inside the container (see Dockerfile.server).
  defaultPort = 3000;
  // Stop the container after 15 minutes without requests. The next request starts it again.
  sleepAfter = '15m';
  envVars = {
    HOST: '0.0.0.0',
    PORT: '3000',
    NODE_ENV: 'production',
  };
}

export default {
  async fetch(request, env) {
    // One long-lived catalog instance serves all traffic.
    const catalog = getContainer(env.EVENTCATALOG, 'eventcatalog');
    return catalog.fetch(request);
  },
};
