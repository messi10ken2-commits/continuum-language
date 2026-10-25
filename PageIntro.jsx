import React from 'react';
import {t as uiText} from './interface-runtime.mjs';
export default function PageIntro({eyebrow,title,text}){return <section className="page-intro"><span className="eyebrow">{uiText(eyebrow)}</span><h1>{uiText(title)}</h1><p>{uiText(text)}</p></section>}
