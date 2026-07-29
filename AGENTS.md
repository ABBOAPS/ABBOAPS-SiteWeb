# Operating Directives for AI Agents — ABBO APS NFC System

This document contains non-negotiable instructions for AI assistants and autonomous coding agents working on the ABBO APS codebase.

---

## Core Directives

1. **Public/Private Strict Separation**:
   - The public repository `ABBOAPS-SiteWeb` must contain ONLY the static web verifier (`site/`), public docs, public schemas, public keyring, public edition envelopes, and dummy test vectors.
   - NEVER create, commit, or propose adding private generator Python source code, private SQLite databases, private keys (`.pem`, `.key`, `.pkcs8`), full individual product URLs, or `.env` files into the public repository.
   - All private tools and generator components must remain strictly in local user directories (`platformdirs`) or in `.private/` (which is `.gitignore`d).

2. **Protocol Integrity**:
   - Do NOT modify the token format `AB1.<kid>.<payload_base64url>.<signature_base64url>` without explicit Architectural Decision Record (ADR).
   - Signed token content: `ASCII("AB1." + kid + "." + payload_base64url)`.
   - ECDSA ES256 signatures MUST use raw `r || s` (64 bytes), Base64URL encoded without padding.
   - Do NOT re-serialize JSON before signature verification in the browser. Always verify the signature on the original received raw Base64URL string segment first, then decode the JSON payload.

3. **Manifest Envelope Integrity**:
   - Envelope format: `{"version": 1, "kid": "...", "payload": "...", "signature": "..."}`.
   - Manifest signed content: `ASCII("ABBO-EDITION-1." + kid + "." + payload_base64url)`.
   - Item field `h` MUST match `Base64URL(SHA-256(manifest_payload_bytes))`.

4. **Security Claim Precision**:
   - Never use claim terms like "100% uncloneable" or "absolute physical authenticity" in UI or public documentation.
   - Always describe standard NFC limitations honestly: standard tags can be cloned bit-for-bit, so security relies on cryptographic signature verification + matching physical printed serial numbers + tamper-evident tag placement.

5. **Secrets & Pre-Commit Rules**:
   - Always run `python3 scripts/scan_for_secrets.py` before finalizing any turn or committing changes.
   - Dummy test vectors in `shared-public-test-vectors/` MUST use dedicated mock test keys ONLY.

6. **Static Web Compatibility**:
   - Use `import.meta.env.BASE_URL` in Vite to support both custom domain roots and GitHub Pages subdirectory paths.
   - No external CDNs, no remote fonts, no third-party trackers, no client-side eval, strictly sanitized DOM updates (`textContent`).
