# Static serve benchmark

## Installation

this step for Ubuntu only

```sh
git clone https://github.com/nanoexpress/static-serve-benchmark.git ~/Downloads/ssb
cd ~/Downloads/ssb
npm install
sudo apt install nginx -y
```

## Prepare

First change username to yours from `nginx/static.conf` and run

```sh
sudo cp nginx/static.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Running

```sh
node src/stream.js
node src/fsread.js
node src/fscache.js
```

## Environment

- OS: Ubuntu 22.04.1 LTS x86_64
- CPU: i9-9900K (4-core dedicated VM)
- RAM: 8GB DDR4
- Disk: SSD NVMe 64GB

## Common bug-fixes

### nginx 403 Forbidden

```sh
sudo usermod -a -G $USER www-data
sudo chown -R :www-data ~/Downloads/ssb/static
```

## Benchmark

Benchmark command: `wrk https://localhost:{PORT} -d3 -c10 -t1`

> All requests was encrypted via TLSv1.3

| Port   | Caller           | Result          | RAM usage |
| ------ | ---------------- | --------------- | --------- |
| `4000` | `src/stream.js`  | 6,867 req/sec   | 5 MB      |
| `4100` | `src/fsread.js`  | 8,580 req/sec   | 6 MB      |
| `4200` | `src/fscache.js` | 113,280 req/sec | 15 MB     |
| `4300` | nginx/v1.18      | 68,731 req/sec  | ~4 MB     |
| `4400` | `src/bun.js`     | -               | -         |
| `4500` | binserve         | 80,300 req/sec  | ~2 MB     |
