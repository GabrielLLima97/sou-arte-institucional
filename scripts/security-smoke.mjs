import assert from "node:assert/strict";
import http from "node:http";
import https from "node:https";

const base = process.env.SMOKE_BASE_URL || "http://localhost:3101";
async function request(path, host, extra = {}) {
  const url = new URL(path, base);
  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;
    const req = client.get(url, { headers: { Host: host, ...extra } }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => resolve({
        status: response.statusCode,
        text: async () => body,
        headers: { get: (name) => response.headers[name.toLowerCase()] },
      }));
    });
    req.setTimeout(20000, () => req.destroy(new Error("HTTP timeout")));
    req.on("error", reject);
  });
}

for (const host of ["souarteemcuidados.com.br", "souluzassessoria.com.br", "clinicasouluz.com.br"]) {
  const response = await request("/", host);
  assert.equal(response.status, 200, host);
  const html = await response.text();
  assert.equal(html.includes('id="hero-title"'), host === "souluzassessoria.com.br");
  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const response = await request(path, host);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(host));
  }
}
for (const path of ["/portal-admin/login", "/portal-socio/login"]) {
  assert.equal((await request(path, "souarteemcuidados.com.br")).status, 200);
  for (const host of ["souluzassessoria.com.br", "evil-souarteemcuidados.com.br"]) {
    for (const extra of [{}, { "x-middleware-subrequest": "middleware:middleware:middleware:middleware:middleware" }]) {
      const response = await request(path, host, extra);
      assert.equal(response.status, 307, `${host}: middleware must not be bypassed`);
      assert.equal(new URL(response.headers.get("location"), base).pathname, "/");
    }
  }
}
console.log("PASS: three domains, metadata, login routes, host allowlist and middleware bypass regression");
