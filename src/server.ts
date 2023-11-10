import { config } from "dotenv";

config();

import express, { Application } from "express";
import { register, Gauge, Summary } from "prom-client";
import { Stats, TechnitiumClient } from "./lib/technitium-client";

const client: TechnitiumClient = new TechnitiumClient(
  process.env.TECHNITIUM_HOST!,
  process.env.TECHNITIUM_TOKEN!
);

const app: Application = express();

const totalQueries: Gauge = new Gauge({
  name: "technitium_total_queries",
  help: "technitium",
  labelNames: ["a", "b"],
});

totalQueries.set(10);

const totalNoError: Gauge = new Gauge({
  name: "technitium_total_no_error",
  help: "technitium",
});

const totalServerFailure: Gauge = new Gauge({
  name: "technitium_total_server_failure",
  help: "technitium",
});

const totalRefused: Gauge = new Gauge({
  name: "technitium_total_refused",
  help: "technitium",
});

const totalAuthoritative: Gauge = new Gauge({
  name: "technitium_total_authoritative",
  help: "technitium",
});

const totalRecursive: Gauge = new Gauge({
  name: "technitium_total_recursive",
  help: "technitium",
});

const totalCached: Gauge = new Gauge({
  name: "technitium_total_cached",
  help: "technitium",
});

const totalBlocked: Gauge = new Gauge({
  name: "technitium_total_blocked",
  help: "technitium",
});

const totalClients: Gauge = new Gauge({
  name: "technitium_total_clients",
  help: "technitium",
});

const topDomains: Gauge = new Gauge({
  name: "technitium_top_domains",
  help: "technitium",
  labelNames: ["name"],
});

const topClients: Gauge = new Gauge({
  name: "technitium_top_clients",
  help: "technitium",
  labelNames: ["name"],
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
