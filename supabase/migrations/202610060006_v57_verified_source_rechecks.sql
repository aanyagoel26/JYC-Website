begin;
update public.jyc_content_verification
set campus_id='sector-128',
    source_url='https://www.dronotics.in/',
    source_type='official-event-site + JIIT-128 club source',
    notes='Re-verified against the official DRONO-O-WAR site: May 2–3, 2026 at JIIT Sector 128, Noida. Dronotics JIIT-128 is identified as the Drone Society of JIIT 128. Status remains review until an authenticated JYC verifier signs off.'
where entity_type='event' and entity_id='38c0de5b-d993-4575-93c6-108fe78c2354';

update public.jyc_content_verification
set campus_id='sector-128',
    source_url='https://www.innovationjiit.in/',
    source_type='official JIIT Innovation site + official JIIT-128 event listing',
    notes='Re-verified against current JIIT Innovation and JIIT event listings: RIDE Hack 26 final presentation is 1 Nov 2026 and venue is JIIT Wish Town Campus, Sector 128, Noida. Status remains review until an authenticated JYC verifier signs off.'
where entity_type='event' and entity_id='473a47e8-1ccc-4ff9-a08e-28aa0e6bab8e';

update public.jyc_content_verification
set campus_id='sector-128',
    source_url='https://www.jiityouthclub128.in/',
    source_type='official JYC 128 event site + JYC 128 LinkedIn',
    notes='Re-verified against the current JAI 2026 official site and JIIT Youth Club Wish Town Campus profile: JAI 2026 is 30–31 Oct 2026 at JIIT Sector 128, Wish Town, Noida. Status remains review until an authenticated JYC verifier signs off.'
where entity_type='event' and entity_id='jai-2026-jaypee-agentic-ai-hackathon';

update public.jyc_content_verification
set campus_id='sector-128',
    source_url='https://www.jiityouthclub128.in/',
    source_type='official JYC 128 event site',
    notes='JAI 2026 official visual identity is sourced from the live JYC 128 event site. Retain official-site provenance and do not substitute legacy JYC social assets.'
where entity_type='gallery' and entity_id='g-jai-summit';

update public.jyc_content_verification
set campus_id='sector-128',
    source_url='https://www.cicr.in/',
    source_type='official JIIT-128 hub site + official JIIT-128 social source',
    notes='CICR and Dronotics sources corroborate DRONO-O-WAR 1.0 as a JIIT Sector 128 event. Gallery item remains review-gated until image-level provenance/rights approval.'
where entity_type='gallery' and entity_id in ('g-dronowar-1','g-dronowar-2');

commit;