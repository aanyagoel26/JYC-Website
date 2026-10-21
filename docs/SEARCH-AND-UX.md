# Search and UX Architecture

## Search priority

JYC search uses a lightweight relevance scorer inspired by the principles used by open-source fuzzy-search libraries: weighted fields, token matching and typo tolerance. The implementation is dependency-free so the public bundle stays small.

Ranking order:

1. Exact title match
2. Title prefix
3. Phrase/title containment
4. All title tokens
5. Title token prefixes
6. Fuzzy title tokens
7. Supporting metadata/content
8. Intent shortcuts

This means a direct search for a club/event/page name is intentionally placed before a generic quick action.

## Keyboard behaviour

- `Ctrl/Cmd + K` opens search
- `↑` / `↓` moves selection
- `Enter` opens the selected result
- `Esc` closes search

The interaction model follows established accessible command-palette patterns: focus stays in the search field, the active item is exposed through `aria-activedescendant`, and keyboard selection is explicit.


## Public surface

Search indexes only the public experience: published pages, clubs, events, published team members and published visual records. The staff Control Center is intentionally not surfaced in public navigation or public search; its authenticated route remains reserved for future operational work.

Search metadata includes event type and date so queries such as a competition category or year can reach the correct event before generic shortcuts.
