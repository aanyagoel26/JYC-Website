-- V57 club source rechecks captured from current public 128 evidence.
begin;
update public.jyc_content_verification
set source_url='https://in.linkedin.com/company/cypherx-jiit',
    source_type='official JIIT-128 community profile',
    notes='CypherX states it is the official cybersecurity community of JIIT-128 and lists Jaypee Institute of Information Technology Sector-128, Wish Town, Noida. Retain review status pending authenticated JYC verification.'
where entity_type='club' and entity_id='club-cypherx';
update public.jyc_content_verification
set source_url='https://www.linkedin.com/company/dronotics-jiit-128',
    source_type='official JIIT-128 community profile',
    notes='Dronotics JIIT-128 identifies itself as the Drone Society of JIIT 128. Retain review status pending authenticated JYC verification.'
where entity_type='club' and entity_id='club-dronotics';
update public.jyc_content_verification
set source_url='https://in.linkedin.com/in/abhay-kumar-640276383',
    source_type='current JIIT-128 activity corroboration',
    notes='Current JIIT student activity references a ZENCODERS cybersecurity session explicitly at JIIT Sector 128. Canonical club identity is still insufficient for automatic publication; retain review status until an official club profile is supplied.'
where entity_type='club' and entity_id='club-zencoders';
commit;