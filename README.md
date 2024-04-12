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

Macbook Pro M1 2020 16GB/512GB running on machine without any Docker or other containers

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
| `4000` | `src/stream.js`  | 12,692 req/sec  | ~26.3 MB  |
| `4100` | `src/fsread.js`  | 34,779 req/sec  | ~39.9 MB  |
| `4200` | `src/fscache.js` | 114,951 req/sec | ~23.9 MB  |
| `4300` | nginx/v1.18      | 68,731 req/sec  | ~4 MB     |
| `4400` | `src/bun.js`     | 77,181 req/sec  | ~18.7 MB  |
| `4500` | binserve         | 107,526 req/sec | ~5.7 MB   |
| `4600` | caddy            | 9,918 req/sec   | ~23 MB    |
| `4700` | `src/zccache.js` | 115,000 req/sec | ~24.4 MB  |
