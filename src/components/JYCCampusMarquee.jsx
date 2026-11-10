import React from 'react';
import './JYCCampusMarquee.css';

const TRACK = [
  ['01','TECHNOLOGY'],['02','CULTURE'],['03','PERFORMANCE'],
  ['04','SPORT'],['05','LITERARY'],['06','COMMUNITY'],
  ['07','INNOVATION'],['08','CAMPUS LIFE']
];

function Track({ reverse = false, label }) {
  return <div className={`jyc-campus-marquee__track ${reverse ? 'is-reverse' : ''}`} aria-hidden="true">
    {[0,1].map(copy => <div className="jyc-campus-marquee__group" key={copy}>
      {TRACK.map(([number, name]) => <span className="jyc-campus-marquee__item" key={number}>
        <small>{number}</small><strong>{name}</strong><i aria-hidden="true">✳</i>
      </span>)}
    </div>)}
  </div>;
}

export function JYCCampusMarquee() {
  return <section className="jyc-campus-marquee" aria-label="Explore the many sides of JYC">
    <div className="jyc-campus-marquee__meta">
      <span>THE CAMPUS IS YOURS</span><span>DISCOVER · PARTICIPATE · BELONG</span>
    </div>
    <Track label="Campus communities"/>
    <Track reverse label="Student experiences"/>
  </section>;
}
