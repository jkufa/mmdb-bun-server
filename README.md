# mmdb-bun-server
A simple Bun HTTP Server that loads a [MaxMind Database](https://github.com/maxmind/MaxMind-DB) and uses the [maxmind npm package](https://www.npmjs.com/package/maxmind) to perform ip lookups.

To install dependencies:

```bash
bun install
```

To load an MMDB file:

Create a `.env` file similar to `.env.example` and provide the path to your MMDB file

To run:

```bash
bun serve
```

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
