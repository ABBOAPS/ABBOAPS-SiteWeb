# Graph Report - .  (2026-08-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 815 nodes · 1092 edges · 43 communities (37 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b15c9da7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SEO.tsx
- item-verifier.ts
- properties
- properties
- properties
- properties
- scripts
- App.tsx
- dependencies
- site-config.schema.json
- Tessera.tsx
- Docs.tsx
- keyring.schema.json
- tessera/main.ts
- edition-envelope.schema.json
- image
- ui
- compilerOptions
- LimitedVerificationExperience.tsx
- required
- scripts
- required
- compilerOptions
- SocialLinks.tsx
- TesseraMarkdownViewer.tsx
- generate_shared_test_vectors.py
- Footer.tsx
- main
- scan_repository
- validate-docs.mjs
- load_json
- SymmetricRevealText.tsx
- TwitchLiveWidget.tsx
- build_all.sh
- create_public_archive.sh
- App

## God Nodes (most connected - your core abstractions)
1. `SEO()` - 26 edges
2. `compilerOptions` - 16 edges
3. `required` - 15 edges
4. `verifyEditionManifest()` - 15 edges
5. `compilerOptions` - 15 edges
6. `initApp()` - 13 edges
7. `scripts` - 12 edges
8. `required` - 12 edges
9. `verifyItemToken()` - 12 edges
10. `encodeUtf8()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `LimitedVerification()` --calls--> `uint8ArrayToBase64Url()`  [EXTRACTED]
  src/pages/LimitedVerification.tsx → site/src/crypto/base64url.ts
- `LimitedVerification()` --calls--> `encodeUtf8()`  [EXTRACTED]
  src/pages/LimitedVerification.tsx → site/src/crypto/base64url.ts
- `LimitedVerification()` --calls--> `sha256Bytes()`  [EXTRACTED]
  src/pages/LimitedVerification.tsx → site/src/crypto/web-crypto.ts
- `toLimitedState()` --calls--> `stateFromVerificationError()`  [EXTRACTED]
  src/pages/LimitedVerification.tsx → site/src/ui/render.ts
- `LimitedVerification()` --calls--> `verifyEditionManifest()`  [EXTRACTED]
  src/pages/LimitedVerification.tsx → site/src/verifier/edition-verifier.ts

## Import Cycles
- None detected.

## Communities (43 total, 6 thin omitted)

### Community 0 - "SEO.tsx"
Cohesion: 0.05
Nodes (15): LegalMarkdownPage(), LegalMarkdownPageProps, LiquidGlass(), LiquidGlassProps, SEO(), SEOProps, Button, ButtonProps (+7 more)

### Community 1 - "item-verifier.ts"
Cohesion: 0.10
Nodes (52): base64UrlToUint8Array(), decodeUtf8(), encodeUtf8(), uint8ArrayToBase64Url(), importJwkPublicKey(), JwkPublicKey, sha256Bytes(), verifyEcdsaEs256() (+44 more)

### Community 2 - "properties"
Cohesion: 0.05
Nodes (42): active, compromised, crv, ext, key_ops, kty, retired, x (+34 more)

### Community 3 - "properties"
Cohesion: 0.05
Nodes (42): const, maxLength, minLength, pattern, type, format, type, maxLength (+34 more)

### Community 4 - "properties"
Cohesion: 0.05
Nodes (39): allowedHosts, audience, baseUrl, maxPayloadBytes, maxTokenLength, removeFragmentAfterRead, tokenPrefix, items (+31 more)

### Community 5 - "properties"
Cohesion: 0.05
Nodes (38): const, format, type, maxLength, pattern, type, pattern, type (+30 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (36): autoprefixer, esbuild, vite, devDependencies, autoprefixer, esbuild, tailwindcss, tsx (+28 more)

### Community 7 - "App.tsx"
Cohesion: 0.06
Nodes (33): AiTransparency, Ambassador, BalanceViewer, ChiSiamo, ConsapevolezzaDocenti, ConsapevolezzaIstituti, ConsapevolezzaRagazzi, Contatti (+25 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (33): clsx, dotenv, express, @google/genai, lucide-react, motion, dependencies, clsx (+25 more)

### Community 9 - "site-config.schema.json"
Cohesion: 0.06
Nodes (31): logo, name, organization, ui, verification, website, additionalProperties, $id (+23 more)

### Community 10 - "Tessera.tsx"
Cohesion: 0.10
Nodes (21): TesseraLegalDisclaimer(), TesseraLegalDisclaimerProps, Articolo, dataNews, newsFiles, Home(), formatItalianDate(), NewsDetail() (+13 more)

### Community 11 - "Docs.tsx"
Cohesion: 0.09
Nodes (16): all, categoryOrder, dev, docBySlug, DocMode, DocPage, DocRole, docs (+8 more)

### Community 12 - "keyring.schema.json"
Cohesion: 0.07
Nodes (29): alg, jwk, keys, status, additionalProperties, pattern, type, $defs (+21 more)

### Community 13 - "tessera/main.ts"
Cohesion: 0.16
Nodes (22): MembershipCardInfo, MembershipMember, MembershipResultState, MembershipValidity, TesseraApiResponse, validateApiResponse(), verifyMembershipToken(), VerifyOptions (+14 more)

### Community 14 - "edition-envelope.schema.json"
Cohesion: 0.08
Nodes (25): format, payload, signature, additionalProperties, const, $id, kid, maxLength (+17 more)

### Community 15 - "image"
Cohesion: 0.09
Nodes (19): alt, path, sha256, maxLength, minLength, type, additionalProperties, properties (+11 more)

### Community 16 - "ui"
Cohesion: 0.09
Nodes (22): locale, officialSiteLabel, showPhysicalSerialReminder, verifiedLabel, pattern, type, maxLength, minLength (+14 more)

### Community 17 - "compilerOptions"
Cohesion: 0.09
Nodes (21): src, compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleResolution, noEmit (+13 more)

### Community 18 - "LimitedVerificationExperience.tsx"
Cohesion: 0.17
Nodes (16): EditionCounter(), EditionCounterProps, formatEditionNumber(), useReducedMotion(), LimitedVerificationData, LimitedVerificationState, LimitedVerificationExperience(), LimitedVerificationExperienceProps (+8 more)

### Community 19 - "required"
Cohesion: 0.10
Nodes (20): code, description, image, physicalSerialRequired, releaseDate, title, additionalProperties, $id (+12 more)

### Community 20 - "scripts"
Cohesion: 0.10
Nodes (20): devDependencies, terser, typescript, vite, vitest, typescript, vite, name (+12 more)

### Community 21 - "required"
Cohesion: 0.11
Nodes (18): d, h, i, s, additionalProperties, allOf, $id, aud (+10 more)

### Community 22 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 23 - "SocialLinks.tsx"
Cohesion: 0.21
Nodes (8): LimitedLinks(), SocialIconProps, SocialLinks(), csvFiles, Topbar(), OFFICIAL_SOCIALS, SOCIAL_LINKS, SocialPlatform

### Community 25 - "generate_shared_test_vectors.py"
Cohesion: 0.43
Nodes (6): EllipticCurvePublicKey, b64url_encode(), canonical_json_bytes(), der_to_raw_rs(), main(), public_key_to_jwk()

### Community 26 - "Footer.tsx"
Cohesion: 0.50
Nodes (3): Footer(), NewsletterForm(), NewsletterFormProps

### Community 27 - "main"
Cohesion: 0.83
Nodes (3): main(), Path, run_cmd()

### Community 28 - "scan_repository"
Cohesion: 0.67
Nodes (3): is_allowlisted_for_tokens(), Path, scan_repository()

### Community 29 - "validate-docs.mjs"
Cohesion: 0.50
Nodes (3): errors, root, slugs

### Community 30 - "load_json"
Cohesion: 0.83
Nodes (3): load_json(), Path, verify_public_files()

## Knowledge Gaps
- **397 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+392 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SocialLinks()` connect `SocialLinks.tsx` to `Footer.tsx`, `Tessera.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `SEO()` connect `SEO.tsx` to `TesseraMarkdownViewer.tsx`, `Tessera.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `properties` connect `properties` to `required`, `image`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _397 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SEO.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05034965034965035 - nodes in this community are weakly interconnected._
- **Should `item-verifier.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10069444444444445 - nodes in this community are weakly interconnected._
- **Should `properties` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._