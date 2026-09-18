# Graph Report - /home/alessiobellan/Documenti/progetti/ABBO/ABBOAPS-SiteWeb  (2026-09-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 898 nodes · 1154 edges · 63 communities (52 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `055eef3e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SEO.tsx
- FestivalAbbiamoContent.tsx
- item-verifier.ts
- properties
- properties
- LimitedVerificationExperience.tsx
- properties
- App.tsx
- Tessera.tsx
- scripts
- dependencies
- Docs.tsx
- keyring.schema.json
- tessera/main.ts
- edition-envelope.schema.json
- compilerOptions
- required
- scripts
- required
- compilerOptions
- SocialLinks.tsx
- properties
- properties
- LegalMarkdownPage.tsx
- properties
- properties
- generate_shared_test_vectors.py
- organization
- image
- site-config.schema.json
- ui
- required
- path
- code
- verification-flow.integration.test.ts
- EditionCounter.tsx
- AbboHub.tsx
- description
- e
- n
- r
- title
- verifiedLabel
- main
- scan_repository
- validate-docs.mjs
- load_json
- releaseDate
- check-festival-seo.mjs
- SymmetricRevealText.tsx
- TesseraLegalDisclaimer.tsx
- TwitchLiveWidget.tsx
- types.ts
- build_all.sh
- create_public_archive.sh

## God Nodes (most connected - your core abstractions)
1. `SEO()` - 26 edges
2. `compilerOptions` - 16 edges
3. `required` - 15 edges
4. `compilerOptions` - 15 edges
5. `scripts` - 14 edges
6. `required` - 12 edges
7. `verifyEditionManifest()` - 11 edges
8. `Button` - 10 edges
9. `required` - 8 edges
10. `validateEditionPayload()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `LimitedVerification()` --calls--> `fingerprintToken()`  [EXTRACTED]
  src/pages/LimitedVerification.tsx → site/src/crypto/fingerprint.ts
- `toLimitedState()` --calls--> `stateFromVerificationError()`  [EXTRACTED]
  src/pages/LimitedVerification.tsx → site/src/ui/render.ts
- `downloadAbbiamoCalendar()` --calls--> `buildAbbiamoIcs()`  [EXTRACTED]
  src/components/abbiamo/FestivalAbbiamoContent.tsx → src/data/abbiamo.ts
- `verifyEditionManifest()` --calls--> `base64UrlToUint8Array()`  [EXTRACTED]
  site/src/verifier/edition-verifier.ts → site/src/crypto/base64url.ts
- `verifyItemToken()` --calls--> `base64UrlToUint8Array()`  [EXTRACTED]
  site/src/verifier/item-verifier.ts → site/src/crypto/base64url.ts

## Import Cycles
- None detected.

## Communities (63 total, 11 thin omitted)

### Community 0 - "SEO.tsx"
Cohesion: 0.06
Nodes (15): LiquidGlass(), LiquidGlassProps, SEO(), SEOProps, TesseraMarkdownViewer(), TesseraMarkdownViewerProps, Button, ButtonProps (+7 more)

### Community 1 - "FestivalAbbiamoContent.tsx"
Cohesion: 0.06
Nodes (33): ics, content, html, schema, StaticNewsArticleData, CalendarChooser(), downloadAbbiamoCalendar(), FestivalAbbiamoContent() (+25 more)

### Community 2 - "item-verifier.ts"
Cohesion: 0.11
Nodes (41): base64UrlToUint8Array(), decodeUtf8(), encodeUtf8(), uint8ArrayToBase64Url(), importJwkPublicKey(), JwkPublicKey, sha256Bytes(), verifyEcdsaEs256() (+33 more)

### Community 3 - "properties"
Cohesion: 0.05
Nodes (42): active, compromised, crv, ext, key_ops, kty, retired, x (+34 more)

### Community 4 - "properties"
Cohesion: 0.05
Nodes (39): allowedHosts, audience, baseUrl, maxPayloadBytes, maxTokenLength, removeFragmentAfterRead, tokenPrefix, items (+31 more)

### Community 5 - "LimitedVerificationExperience.tsx"
Cohesion: 0.11
Nodes (28): fingerprintToken(), initApp(), createElement(), removeUrlFragment(), RenderOptions, renderUi(), stateFromVerificationError(), UiState (+20 more)

### Community 6 - "properties"
Cohesion: 0.05
Nodes (38): const, format, type, maxLength, pattern, type, pattern, type (+30 more)

### Community 7 - "App.tsx"
Cohesion: 0.05
Nodes (36): Abbiamo, AbboHub, AiTransparency, Ambassador, App(), BalanceViewer, ChiSiamo, ConsapevolezzaDocenti (+28 more)

### Community 8 - "Tessera.tsx"
Cohesion: 0.09
Nodes (23): CopyableValue(), CopyableValueProps, Footer(), LimitedSupport(), organization, Articolo, dataNews, newsFiles (+15 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (35): autoprefixer, esbuild, devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express (+27 more)

### Community 10 - "dependencies"
Cohesion: 0.06
Nodes (36): clsx, dotenv, express, @google/genai, lucide-react, motion, dependencies, clsx (+28 more)

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

### Community 15 - "compilerOptions"
Cohesion: 0.09
Nodes (21): src, compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleResolution, noEmit (+13 more)

### Community 16 - "required"
Cohesion: 0.10
Nodes (20): code, description, image, physicalSerialRequired, releaseDate, title, additionalProperties, $id (+12 more)

### Community 17 - "scripts"
Cohesion: 0.10
Nodes (20): devDependencies, terser, typescript, vite, vitest, typescript, vite, name (+12 more)

### Community 18 - "required"
Cohesion: 0.11
Nodes (18): d, h, i, s, additionalProperties, allOf, $id, aud (+10 more)

### Community 19 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 20 - "SocialLinks.tsx"
Cohesion: 0.17
Nodes (8): NewsletterForm(), NewsletterFormProps, SocialIconProps, SocialLinks(), csvFiles, OFFICIAL_SOCIALS, SOCIAL_LINKS, SocialPlatform

### Community 21 - "properties"
Cohesion: 0.14
Nodes (14): const, format, type, const, type, properties, aud, createdAt (+6 more)

### Community 22 - "properties"
Cohesion: 0.17
Nodes (12): maxLength, minLength, type, properties, maxLength, pattern, type, alt (+4 more)

### Community 24 - "properties"
Cohesion: 0.18
Nodes (11): maxLength, minLength, type, const, properties, logo, name, website (+3 more)

### Community 25 - "properties"
Cohesion: 0.20
Nodes (10): pattern, type, maxLength, minLength, type, locale, officialSiteLabel, showPhysicalSerialReminder (+2 more)

### Community 26 - "generate_shared_test_vectors.py"
Cohesion: 0.43
Nodes (6): EllipticCurvePublicKey, b64url_encode(), canonical_json_bytes(), der_to_raw_rs(), main(), public_key_to_jwk()

### Community 27 - "organization"
Cohesion: 0.29
Nodes (7): logo, name, website, additionalProperties, required, type, organization

### Community 28 - "image"
Cohesion: 0.33
Nodes (6): alt, sha256, additionalProperties, required, type, image

### Community 29 - "site-config.schema.json"
Cohesion: 0.22
Nodes (8): additionalProperties, $id, properties, schemaVersion, $schema, const, title, type

### Community 31 - "ui"
Cohesion: 0.25
Nodes (8): locale, officialSiteLabel, showPhysicalSerialReminder, verifiedLabel, ui, additionalProperties, required, type

### Community 32 - "required"
Cohesion: 0.40
Nodes (5): organization, ui, verification, schemaVersion, required

### Community 34 - "code"
Cohesion: 0.40
Nodes (5): maxLength, minLength, pattern, type, code

### Community 36 - "EditionCounter.tsx"
Cohesion: 0.60
Nodes (4): EditionCounter(), EditionCounterProps, formatEditionNumber(), useReducedMotion()

### Community 38 - "description"
Cohesion: 0.50
Nodes (4): maxLength, minLength, type, description

### Community 39 - "e"
Cohesion: 0.50
Nodes (4): maxLength, pattern, type, e

### Community 40 - "n"
Cohesion: 0.50
Nodes (4): maximum, minimum, type, n

### Community 41 - "r"
Cohesion: 0.50
Nodes (4): r, maximum, minimum, type

### Community 42 - "title"
Cohesion: 0.50
Nodes (4): title, maxLength, minLength, type

### Community 43 - "verifiedLabel"
Cohesion: 0.50
Nodes (4): verifiedLabel, maxLength, minLength, type

### Community 44 - "main"
Cohesion: 0.83
Nodes (3): main(), Path, run_cmd()

### Community 45 - "scan_repository"
Cohesion: 0.67
Nodes (3): is_allowlisted_for_tokens(), Path, scan_repository()

### Community 46 - "validate-docs.mjs"
Cohesion: 0.50
Nodes (3): errors, root, slugs

### Community 47 - "load_json"
Cohesion: 0.83
Nodes (3): load_json(), Path, verify_public_files()

### Community 48 - "releaseDate"
Cohesion: 0.67
Nodes (3): releaseDate, format, type

## Knowledge Gaps
- **424 isolated node(s):** `$schema`, `$id`, `title`, `type`, `additionalProperties` (+419 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SEO()` connect `SEO.tsx` to `Tessera.tsx`, `SocialLinks.tsx`, `LegalMarkdownPage.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `PressMentions()` connect `FestivalAbbiamoContent.tsx` to `Tessera.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `$id`, `title` to the rest of the system?**
  _424 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SEO.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05573770491803279 - nodes in this community are weakly interconnected._
- **Should `FestivalAbbiamoContent.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.062040816326530614 - nodes in this community are weakly interconnected._
- **Should `item-verifier.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1054421768707483 - nodes in this community are weakly interconnected._
- **Should `properties` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._