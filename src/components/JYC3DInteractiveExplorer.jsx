import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JYC_HUB_SOURCE_REGISTRY } from '../jyc-hub-registry.js';
import { JYC_HUB_CONTENT } from '../v21-hub-content.js';
import './JYC3DInteractiveExplorer.css';

const FAMILY_STYLE = {
  Technical: { icon: '⌘', label: 'Build & explore', accent: '#aeb8e4' },
  Cultural: { icon: '✳', label: 'Perform & express', accent: '#e7d19b' },
  Creative: { icon: '✦', label: 'Create & imagine', accent: '#c8bcff' },
  Literary: { icon: 'Aa', label: 'Write & communicate', accent: '#97a9dd' },
  Sports: { icon: '↗', label: 'Play & compete', accent: '#b7c7a8' }
};

const slugHub = value => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const HUBS = JYC_HUB_SOURCE_REGISTRY
  .filter(hub => hub.publicationStatus === 'published')
  .map(hub => {
    const content = JYC_HUB_CONTENT[hub.name] || {};
    return {
      id: slugHub(hub.name),
      name: hub.name,
      family: hub.family,
      focus: content.focus || hub.family,
      summary: content.summary || `${hub.name} is part of the published JYC community directory.`,
      accent: FAMILY_STYLE[hub.family]?.accent || '#c8bcff'
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const FAMILIES = ['ALL', ...Array.from(new Set(HUBS.map(hub => hub.family))).sort()];

export function JYC3DInteractiveExplorer() {
  const navigate = useNavigate();
  const [activeFamily, setActiveFamily] = useState('ALL');
  const [query, setQuery] = useState('');

  const visibleHubs = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return HUBS.filter(hub => {
      const familyMatch = activeFamily === 'ALL' || hub.family === activeFamily;
      const searchMatch = !needle || [hub.name, hub.family, hub.focus, hub.summary]
        .some(value => String(value).toLocaleLowerCase().includes(needle));
      return familyMatch && searchMatch;
    });
  }, [activeFamily, query]);

  const familyCount = family => family === 'ALL'
    ? HUBS.length
    : HUBS.filter(hub => hub.family === family).length;

  const resetFilters = () => {
    setActiveFamily('ALL');
    setQuery('');
  };

  return (
    <section className="jyc-community-explorer" aria-labelledby="jyc-community-title">
      <div className="jyc-community-heading">
        <div className="jyc-community-heading-copy">
          <span className="jyc-community-eyebrow">
            <span className="jyc-community-eyebrow-mark" aria-hidden="true">✳</span>
            THE JYC COMMUNITY DIRECTORY
          </span>
          <h2 id="jyc-community-title">Find your <em>people.</em></h2>
          <p>
            From building technology to performing on stage, discover the published
            communities that make campus life happen. Find a space to learn, create,
            compete and belong.
          </p>
        </div>
        <div className="jyc-community-proof" aria-label={`${HUBS.length} published communities across ${FAMILIES.length - 1} families`}>
          <div><strong>{HUBS.length.toString().padStart(2, '0')}</strong><span>Published communities</span></div>
          <i aria-hidden="true" />
          <div><strong>{FAMILIES.length - 1}</strong><span>Community families</span></div>
        </div>
      </div>

      <div className="jyc-community-toolbar">
        <label className="jyc-community-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search communities, interests, or skills…"
            aria-label="Search published JYC communities"
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>
        <span className="jyc-community-result-count" aria-live="polite">
          Showing <strong>{visibleHubs.length}</strong> of {HUBS.length}
        </span>
      </div>

      <div className="jyc-community-filters" role="group" aria-label="Filter communities by family">
        {FAMILIES.map(family => {
          const active = activeFamily === family;
          const label = family === 'ALL' ? 'All communities' : family;
          return (
            <button
              key={family}
              type="button"
              className={`jyc-community-filter${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => setActiveFamily(family)}
            >
              <span>{label}</span>
              <small>{familyCount(family)}</small>
            </button>
          );
        })}
      </div>

      {visibleHubs.length ? (
        <div className="jyc-community-grid" aria-label="Published JYC communities">
          {visibleHubs.map((hub, index) => {
            const familyStyle = FAMILY_STYLE[hub.family] || FAMILY_STYLE.Technical;
            return (
              <article className="jyc-community-card" key={hub.id} style={{ '--community-accent': hub.accent }}>
                <div className="jyc-community-card-top">
                  <span className="jyc-community-monogram" aria-hidden="true">{familyStyle.icon}</span>
                  <span className="jyc-community-index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="jyc-community-card-meta">
                  <span className="jyc-community-family">{hub.family}</span>
                  <span className="jyc-community-focus">{hub.focus}</span>
                </div>
                <h3>{hub.name}</h3>
                <p>{hub.summary}</p>
                <div className="jyc-community-card-footer">
                  <button type="button" onClick={() => navigate(`/clubs/${hub.id}`)} className="jyc-community-profile-link">
                    Explore community <span aria-hidden="true">↗</span>
                  </button>
                  <span className="jyc-community-card-arrow" aria-hidden="true">→</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="jyc-community-empty" role="status">
          <span aria-hidden="true">⌕</span>
          <h3>No communities found</h3>
          <p>Try another name, interest or community family.</p>
          <button type="button" onClick={resetFilters}>Clear filters</button>
        </div>
      )}

      <div className="jyc-community-bottom-note">
        <span className="jyc-community-note-dot" aria-hidden="true" />
        <p>Only communities marked as published in the JYC hub registry appear here.</p>
        <button type="button" onClick={() => navigate('/clubs')}>View all clubs <span aria-hidden="true">↗</span></button>
      </div>
    </section>
  );
}
