### Fireblocks REST Authentication (JWT)

When calling Fireblocks REST APIs directly (e.g. via Postman or curl),
the JWT `uri` claim must exactly match the request target.

Rules:
- Include `/v1`
- Include query string if present
- Exclude domain
- Exclude headers
- Match byte-for-byte (no trailing slashes)

Example:

Request:
GET /v1/vault/accounts_paged?limit=50

JWT payload:
{
  "uri": "/v1/vault/accounts_paged?limit=50",
  "sub": "<API_KEY>",
  "nonce": <number>,
  "iat": <unix>,
  "exp": <unix>
}
