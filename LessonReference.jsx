import React from 'react';
import './lesson-reference.css';

export default function LessonReference({lesson}){
 const content=lesson.breakdown;
 if(!content&&!lesson.vocabulary)return null;
 return <div className="lesson-reference">
 {content&&<>
  <section><span className="eyebrow">BUILD THE RULE</span><h2>How the form works</h2><ol>{content.steps.map(step=><li key={step}>{step}</li>)}</ol></section>
  {content.tables.map(t=><div key={t.caption} className="conjugation-scroll" tabIndex={0} role="region" aria-label={t.caption+' — scroll horizontally if needed'}><table><caption>{t.caption}</caption><thead><tr>{t.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{t.rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th key={i} scope="row">{cell}</th>:<td key={i} lang="es">{cell}</td>)}</tr>)}</tbody></table></div>)}
  <p className="reference-hint">Tables include vosotros (mainly Spain); ustedes takes the ellos/ellas form. Accent marks matter. Regional voseo forms are outside these tables.</p>
  <section className="rule-pitfall"><h3>Watch out for this</h3><p>{content.pitfall}</p></section>
  <section><h3>See the meaning in context</h3>{content.examples.map(([es,en])=><div className="translated-example" key={es}><b lang="es">{es}</b><p>{en}</p></div>)}</section>
 </>}
 {lesson.vocabulary&&<section><span className="eyebrow">WORD → PHRASE → SENTENCE</span><h2>Your vocabulary toolkit</h2><p>Learn the article with the noun. Say the phrase, cover the translation, then make your own sentence.</p><div className="vocabulary-grid">{lesson.vocabulary.map(w=><article key={w.term}><h3 lang="es">{w.term}</h3><p>{w.meaning}</p><strong lang="es">{w.phrase}</strong><div className="translated-example"><b lang="es">{w.example}</b><p>{w.translation}</p></div></article>)}</div>{lesson.id==='food-vocabulary'&&<p className="rule-pitfall">Agua is feminine. It takes el immediately before its stressed initial a: el agua fría. Adjectives stay feminine; the plural uses las aguas.</p>}</section>}
 </div>;
}
