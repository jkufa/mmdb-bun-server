import maxmind, { CityResponse, Reader } from 'maxmind';

const path = process.env.FILE_PATH;
if (!path) throw new Error("No file path was provided! Please specify a path in your .env file or pass it in as a parameter. https://bun.sh/docs/runtime/env");

console.log('Loading mmdb...');
let lookup: Reader<CityResponse>;
try {
  lookup = await maxmind.open<CityResponse>(path);
}
catch (e) {
  if (e instanceof Error) {
    throw new Error(e.message);
  }
  throw new Error("An error ocurred loading the file");
}

console.log('File loaded! Running server...');
Bun.serve({
  fetch(req: Request) {
    const { method, url } = req;
    const { pathname } = new URL(url);
    const pathRegexForIP = new RegExp([
      '^/(',
      '(?:\\d{1,3}\\.){3}\\d{1,3}', // Match IPv4 address
      '|',
      '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})$' // Match IPv6 address
    ].join(''));

    if (method === 'GET') {
      const match = pathname.match(pathRegexForIP);
      const ip = match && match[1];

      if (ip) {
        console.log(`Looking up ip address ${ip}...`);
        const result = lookup.get(ip);

        if (!result) {
          console.error('Lookup was null');
          return new Response('The ip address could not be located.', { status: 404 });
        }

        console.log('Location found');
        return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
      }

      console.error('Invalid ip address');
      return new Response("An invalid or unsupported ip address was given.", { status: 400 });
    }

    console.error('Ip address not found');
    return new Response("Not Found", { status: 404 });
  },
  port: 8080,
});
