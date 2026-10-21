# JYC NEXT — Master Implementation Specification — 2026-10-04

This document consolidates the earlier JYC future-plan research with the current production V55 codebase and the newly supplied image archives.

## KEEP

- Beige / paper / ink / muted-gold identity.
- Compact, centered, editorial composition.
- Photography as the primary source of emotional colour.
- JYC Now / live updates.
- Five-family hub model: Cultural, Technical, Creative, Literary, Sports.
- Rich hub detail pages.
- Event lifecycle: upcoming / ongoing / completed.
- Visual archive and event history.
- Source provenance and verification.
- Search / Ctrl+K.
- Source-grounded JYC Assistant.
- Fixed mobile navigation.
- Contextual JYC bot.
- Supabase-backed publishing and role boundaries.
- Reduced-motion support.
- Production QA and source-integrity checks.

## MODIFY

### Homepage
Move from a sequence of generic sections toward:
1. Hero
2. JYC ecosystem
3. Choose Your Route
4. JYC Now / live
5. Photo Story
6. Communities
7. Events
8. JYC Stories / Archive
9. People
10. Join / explore

The first implementation of this plan is now wired through the JYC Next Experience module.

### Bot
- Keep the fixed, non-rotating model.
- Make its label/context change with the current page.
- Keep it above the mobile bottom dock.
- Use the Assistant as the actual contextual guide.
- Never turn the bot into a second navigation bar.

### Hubs
Treat each hub as a small ecosystem:
- purpose
- focus
- activities
- signature experiences
- people
- events
- gallery
- official connections
- related communities

The current ClubDetail architecture already supports most of this.

### Photography
Use a story model rather than a thumbnail dump:
- event/context
- sequence
- large image
- caption
- provenance
- related hub/event
- archive year

The new Photo Story component provides the homepage storytelling layer; the existing Gallery remains the full archive.

## REMOVE / AVOID

- orbit rings
- constant 3D rotation
- decorative WebGL for its own sake
- neon AI styling
- random gradients
- glass-heavy dashboards
- fake statistics
- unnecessary popups
- competing navigation systems
- synthetic/stock imagery
- treating every supplied graphic as a photograph
- unverified current club/team/event claims

## NEW

- Choose Your Route: BUILD / CREATE / COMPETE / CONNECT.
- Homepage Photo Story.
- Hub Signal Rail.
- Context-aware bot label.
- Context-aware Assistant quick routes.
- Source-media archive ingest contract.
- Exact-hash deduplication audit.
- Media-role classification.
- Control Center labels for the new homepage sections.
- Dedicated V54 QA contract.

## Content truth

The supplied 2026–27 orientation PDF supports the five-family JYC ecosystem and the named hub material. Current operational facts still require current verification before publication.

The five supplied image ZIPs contain 872 images. They are an archive to curate, not a license to publish everything. Exact duplicates and non-photo artwork must be separated before production ingestion.

## Definition of done

- production Supabase active and secure
- required Edge Function secrets configured
- Vercel production connected and verified
- current content source-verified
- all important supplied media classified and deduplicated
- homepage route/photo-story experience browser-tested
- hub/event/archive loop browser-tested
- mobile 320/360/390/430 tested
- reduced motion tested
- Lighthouse/performance checked on real deployment
- GitHub, Supabase and Vercel aligned to one release
