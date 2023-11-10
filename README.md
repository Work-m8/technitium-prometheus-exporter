# Technitium Prometheus Exporter
The Technitium Prometheus Exporter exports the Top Clients and Query information for Prometheus.

```bash
docker pull pascalwilbrink/technitium-prometheus-exporter -p 4001:4001
```

## Docker Compose

Docker-Compose.yml
```yaml
services:
  dns-server:
    container_name: dns-server
    hostname: dns-server
    image: technitium/dns-server:latest
    ports:
      - "5380:5380/tcp"
      - "53:53/udp"
      - "53:53/tcp"

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - 9090:9090
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    volumes:
      - ./prometheus:/etc/prometheus

  technitium-prometheus-exporter:
    image: pascalwilbrink/technitium-prometheus-exporter
    container_name: technitium-prometheus-exporter
    environment:
      - TECHNITIUM_HOST=http://dns-server:5380
      - TECHNITIUM_TOKEN=42e07c9302143f9e3a05bdf19193a0b750bb08db4da50487ad361f0226ccec14
    ports:
      - 4001:4001
    networks:
      - dns
      - metrics

```


Prometheus.yml
```yaml
scrape_configs:
  - job_name: dns
    scrape_interval: 5s
    metrics_path: /metrics
    static_configs:
      - targets: ['technitium-prometheus-exporter:4001']
```