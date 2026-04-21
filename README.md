# Clinical Tray Setup Agent

An AI-powered operatory readiness system for dental practices. Browser-based, mobile-first, no installation required.

## Features

- **Interactive Tray Checklist** — procedure-specific instrument lists with real-time progress tracking, critical item flagging, and clinical notes
- **Voice Callout Engine** — hands-free tray verification using browser speech synthesis, with visual fallback for unsupported browsers
- **Pre-Documentation Templates** — CDT code-aligned clinical note templates with one-tap copy to clipboard

## Procedure Coverage

16 procedures across 8 clinical categories:

| Category | Procedures |
|----------|-----------|
| Diagnostic & Preventive | Comprehensive Exam (D0150), Adult Prophy (D1110), Child Prophy (D1120), Sealants (D1351) |
| Restorative | Composite Restoration (D2391-D2394), Amalgam Restoration (D2140-D2161), Crown Prep (D2740/D2750) |
| Endodontics | Root Canal Therapy (D3310-D3330), Pulpotomy (D3220) |
| Oral Surgery | Simple Extraction (D7140), Surgical Extraction (D7210) |
| Periodontics | Scaling & Root Planing (D4341/D4342) |
| Prosthodontics | Complete Denture Impression (D5110/D5120), Bridge Prep (D6740/D6750) |
| Pediatric Dentistry | Stainless Steel Crown (D2930) |
| Implants | Implant Placement (D6010) |

## Local Development

```bash
npm install
npm run dev       # starts dev server at http://localhost:5173
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

## Testing

```bash
npm test          # run unit tests (Vitest)
npm run typecheck # TypeScript type check
```

## Deployment

This is a static single-page application with no backend. The `dist/` folder after `npm run build` can be deployed to any static host (Netlify, Vercel, GitHub Pages, S3, etc.).

## Clinical Content Note

Fields marked `[CLINICAL REVIEW REQUIRED]` in documentation templates and instrument lists indicate content that was not fully specified in the source documentation and requires review by a licensed dental professional before use in a clinical setting.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Web Speech API (voice callout)
- Vitest + Testing Library (tests)
