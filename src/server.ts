import express, { Application } from "express";
import { register, Gauge, Summary } from "prom-client";
import { Stats, TechnitiumClient } from "./lib/technitium-client";

const client: TechnitiumClient = new TechnitiumClient(
  process.env.TECHNITIUM_HOST!,
  process.env.TECHNITIUM_TOKEN!
);

const app: Application = express();

const TECHNITIUM_PREFIX = "technitium";
const NAME = "name";

const totalQueries: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_queries`,
  help: TECHNITIUM_PREFIX,
});

const totalNoError: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_no_error`,
  help: TECHNITIUM_PREFIX,
});

const totalServerFailure: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_server_failure`,
  help: TECHNITIUM_PREFIX,
});

const totalRefused: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_refused`,
  help: TECHNITIUM_PREFIX,
});

const totalAuthoritative: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_authoritative`,
  help: TECHNITIUM_PREFIX,
});

const totalRecursive: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_recursive`,
  help: TECHNITIUM_PREFIX,
});

const totalCached: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_cached`,
  help: TECHNITIUM_PREFIX,
});

const totalBlocked: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_blocked`,
  help: TECHNITIUM_PREFIX,
});

const totalClients: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_total_clients`,
  help: TECHNITIUM_PREFIX,
});

const topDomains: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_top_domains`,
  help: TECHNITIUM_PREFIX,
  labelNames: [NAME],
});

const topClients: Gauge = new Gauge({
  name: `${TECHNITIUM_PREFIX}_top_clients`,
  help: TECHNITIUM_PREFIX,
  labelNames: [NAME],
});

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/metrics", async (_req, res) => {
  try {
    const stats: Stats = await client.getStats();

    totalRecursive.set(stats.response.stats.totalRecursive);
    totalRefused.set(stats.response.stats.totalRefused);
    totalServerFailure.set(stats.response.stats.totalServerFailure);
    totalClients.set(stats.response.stats.totalClients);
    totalBlocked.set(stats.response.stats.totalBlocked);
    totalAuthoritative.set(stats.response.stats.totalAuthoritative);
    totalCached.set(stats.response.stats.totalCached);
    totalNoError.set(stats.response.stats.totalNoError);
    totalQueries.set(stats.response.stats.totalQueries);

    stats.response.topDomains.forEach((domain) => {
      topDomains.set({ name: domain.name }, domain.hits);
    });

    stats.response.topClients.forEach((client) => {
      topClients.set({ name: client.name }, client.hits);
    });

    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

const port: number = Number(process.env.PORT) || 4001;

app.listen(port, () => {
  console.log(`Now listening on *:${port}`);
});
