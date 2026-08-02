import dns from "node:dns/promises";

try {
  const result = await dns.resolveSrv(
    "_mongodb._tcp.cluster0.eelqr1z.mongodb.net"
  );
  console.log("SUCCESS:", result);
} catch (err) {
  console.error("FAILED:", err);
}