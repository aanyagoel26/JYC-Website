# JYC UI & product references

This document records reference patterns used for the maintained JYC website. References inform information architecture, accessibility and interaction quality; JYC does not copy their visual identity.

## Open-source interaction references

- React Bits — selective micro-interaction ideas.
- shadcn/ui — accessible, composable UI patterns.
- Motion — principles for restrained state transitions.
- Foundation Motion UI — reduced-motion-friendly animation patterns.

## JIIT / 128-campus references

- JIIT official 2026 admission material — current club/community naming and JYC 128 context.
- JIIT Innovation — event/archive, registration, team, project and gallery patterns.
- CICR — focused 128-campus club architecture: mission, capabilities, projects, events, community and contact.
- Current JYC 128 public activity — major event experiences such as Converge and JAI.

## Comparable student-activity references

- BMU Nexus — club discovery, event discovery and participation-oriented information architecture.
- ISI Bangalore Student Activities — searchable club directory, representatives, events, “get listed” and correction workflows.

## What JYC should retain

- relevance-first global search
- editorial card hierarchy
- strong club/event identity without visual fragmentation
- keyboard-first interaction
- semantic controls and visible focus states
- gallery/lightbox accessibility
- calendar integration
- mobile-first admin navigation
- reduced-motion support
- Phoenix as a restrained signature identity

## What the maintained experience deliberately avoids

- custom cursor as a primary interaction
- persistent decorative flight effects
- excessive orbit systems
- animation-heavy first viewport
- generic AI-dashboard aesthetics
- synthetic content presented as official JYC records

## Accessibility rule

Motion must remain subordinate to content and is reduced under `prefers-reduced-motion: reduce`. Native pointer, keyboard and touch interaction must remain complete without decorative interaction layers.
