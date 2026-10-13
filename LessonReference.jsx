import SentenceAudio,{SpokenText} from './SentenceAudio.jsx';
import React from 'react';
import {useBaseLanguage} from './BaseLanguageContext.jsx';
import './lesson-reference.css';
import {expressionGuidance} from './curriculum-expressions.mjs';
import {isInstructionalColumn} from './reference-schema.mjs';

function TableCell({text,header,locale}){return isInstructionalColumn(header)||text.includes('+')||text==='—'?text:<SpokenText text={text} lang={locale}/>;}

export default function LessonReference({lesson}){
 const {t,locale:baseLocale}=useBaseLanguage();
 const content=lesson.breakdown;
 if(!content&&!lesson.vocabulary&&!lesson.expressions)return null;
 return <div className="lesson-reference" lang={baseLocale}>
 {lesson.expressions&&<section className="expression-toolkit"><span className="eyebrow">{t('reference.chunks')}</span><h2>{t('reference.expressions')}</h2><p className="expression-priority">{lesson.priority}</p><p>{t('reference.expressionPractice')}</p><div className="expression-grid">{lesson.expressions.map(x=><article key={x.term}><div className="expression-tags"><span>{x.type}</span><span>{x.register}</span></div><h3 lang={lesson.locale||'es-ES'}><SpokenText text={x.term} lang={lesson.locale||'es-ES'}/></h3><p><strong>{x.meaning}</strong></p><p><b>{t('reference.when')}</b> {x.use}</p><div className="translated-example"><b lang={lesson.locale||'es-ES'}><SpokenText text={x.example} lang={lesson.locale||'es-ES'}/></b><p>{x.translation}</p></div><p className="rule-pitfall"><b>{t('reference.caution')}</b> {x.pitfall}</p><small>{x.region}</small></article>)}</div><details className="expression-level-note"><summary>{t('reference.levels')}</summary><p>{!lesson.language?expressionGuidance.note:'These are teaching priorities, not official CEFR classifications of individual expressions. Practise each expression in context and choose the register that fits your audience.'}</p><p>A collocation is a natural word combination; an idiom has a meaning that is not simply literal. Expressions include useful conversational formulas. Categories can overlap.</p><ul>{(!lesson.language?expressionGuidance.sources:[]).map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a></li>)}</ul></details></section>}
 {content&&<>
  <section><span className="eyebrow">{t('reference.rule')}</span><h2>{t('reference.form')}</h2><ol>{content.steps.map(step=><li key={step}>{step}</li>)}</ol></section>
  {content.tables.map(table=><div key={table.caption} className="conjugation-scroll" tabIndex={0} role="region" aria-label={t('reference.scroll',{caption:table.caption})}><table><caption>{table.caption}</caption><thead><tr>{table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{table.rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th key={i} scope="row"><TableCell text={cell} header={(table.sourceHeaders||table.headers)[i]} locale={lesson.locale||'es-ES'}/></th>:<td key={i} lang={isInstructionalColumn((table.sourceHeaders||table.headers)[i])?baseLocale:lesson.locale||'es-ES'}><TableCell text={cell} header={(table.sourceHeaders||table.headers)[i]} locale={lesson.locale||'es-ES'}/></td>)}</tr>)}</tbody></table></div>)}
  {!lesson.language&&<p className="reference-hint">Tables include vosotros (mainly Spain); ustedes takes the ellos/ellas form. Accent marks matter. Regional voseo forms are outside these tables.</p>}
  <section className="rule-pitfall"><h3>{t('reference.watch')}</h3><p>{content.pitfall}</p></section>
  <section><h3>{t('reference.context')}</h3>{content.examples.map(([es,en])=><div className="translated-example" key={es}><b lang={lesson.locale||'es-ES'}><SpokenText text={es} lang={lesson.locale||'es-ES'}/></b><p>{en}</p></div>)}</section>
 </>}
 {lesson.vocabulary&&<section><span className="eyebrow">{t('reference.words')}</span><h2>{t('reference.vocabulary')}</h2><p>{t('reference.practice')}</p><div className="vocabulary-grid">{lesson.vocabulary.map(w=><article key={w.term}><h3 lang={lesson.locale||'es-ES'}><SpokenText text={w.term} lang={lesson.locale||'es-ES'}/></h3><p>{w.meaning}</p><strong lang={lesson.locale||'es-ES'}><SpokenText text={w.phrase} lang={lesson.locale||'es-ES'}/></strong><div className="translated-example"><b lang={lesson.locale||'es-ES'}><SpokenText text={w.example} lang={lesson.locale||'es-ES'}/></b><p>{w.translation}</p></div></article>)}</div>{lesson.id==='food-vocabulary'&&<p className="rule-pitfall">Agua is feminine. It takes el immediately before its stressed initial a: el agua fría. Adjectives stay feminine; the plural uses las aguas.</p>}</section>}
 </div>;
}
