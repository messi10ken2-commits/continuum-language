import catalog from './catalog.json' with {type:'json'};
import {immersiveStageTitle} from './labels.mjs';
import {immersiveTopics,immersiveStages} from './topics.mjs';
// UI metadata is distinct from target-language passages and dialogue.
const extra={
 id:[
 ['Pasar yang cocok untuk semua','Ikuti usulan warga, bandingkan kebutuhan praktis, dan sepakati uji coba kecil.'],
 ['Perpustakaan malam untuk lingkungan kita','Pahami perubahan layanan dan pengumuman terbaru, lalu sepakati rencana yang mudah diakses.'],
 ['Wisatawan dan warga setempat','Bandingkan artikel dan wawancara, pertimbangkan manfaat serta biaya, lalu rundingkan rencana wisata yang adil.'],
 ['Uji coba kerja fleksibel yang adil','Tinjau uji coba di tempat kerja, bedakan hasil dari asumsi, dan rundingkan pengaturan tim yang dapat diterapkan.'],
 ['Makanan lezat, lebih sedikit sisa','Tinjau proyek penyaluran makanan berlebih, tafsirkan jumlah dengan cermat, dan sepakati rencana pengambilan yang andal.'],
 ['Menyejukkan kota dengan mempertimbangkan konsekuensinya','Padukan artikel kebijakan dan wawancara, bedakan pengukuran dari pengalaman warga, dan rundingkan uji coba yang adil.'],
 ['Sejarah siapa yang terlihat dalam arsip digital?','Tinjau usulan digitalisasi, bedakan kemudahan pencarian dari kelengkapan, dan rundingkan akses publik yang bertanggung jawab.'],
 ['Bukti, pendanaan, dan kesimpulan yang dapat kita buat','Bandingkan ringkasan riset dan wawancara secara kritis, identifikasi penjelasan alternatif, dan rundingkan studi lanjutan yang sepadan.'],
 ['Warisan siapa, dan siapa yang memutuskan?','Bandingkan pandangan tentang restorasi, bedakan pelestarian fisik dari partisipasi budaya, dan rundingkan kesepakatan yang dapat ditinjau.']],
 ru:[
 ['Рынок, удобный для всех','Рассмотрите предложение жителей, сопоставьте практические потребности и согласуйте небольшой пробный проект.'],
 ['Вечерняя библиотека для жителей района','Разберитесь в изменении услуг и обновлённом объявлении и согласуйте доступный план.'],
 ['Туристы и местные жители','Сопоставьте статью и интервью, взвесьте выгоды и издержки и согласуйте справедливый туристический план.'],
 ['Справедливый эксперимент с гибким графиком','Проанализируйте рабочий эксперимент, отделите результаты от предположений и согласуйте осуществимый порядок работы команды.'],
 ['Хорошая еда без лишних остатков','Изучите проект передачи излишков еды, внимательно интерпретируйте количества и согласуйте надёжный план сбора.'],
 ['Как охладить город, учитывая компромиссы','Обобщите статью и интервью, различите измерения и повседневный опыт жары и согласуйте справедливый пробный проект.'],
 ['Чья история видна в цифровом архиве?','Изучите план оцифровки, различите удобство поиска и полноту материалов и согласуйте ответственный публичный доступ.'],
 ['Доказательства, финансирование и обоснованные выводы','Критически сопоставьте исследование и интервью, найдите альтернативные объяснения и согласуйте соразмерное дальнейшее исследование.'],
 ['Чьё наследие и кто решает?','Сопоставьте взгляды на реставрацию, различите физическое сохранение и культурное участие и согласуйте пересматриваемое соглашение.']]
};
const stages={id:['Membaca','Menyimak','Percakapan imersif','Evaluasi bab'],ru:['Чтение','Аудирование','Иммерсивный разговор','Проверка по главе']};
const locales=['en','ja','es','pt','zh','fr','ko','id','ru','ar'];
export const immersiveHeadingCopy={};
for(const [i,topic] of immersiveTopics.entries()){
 const translated=Object.fromEntries(locales.map(locale=>[locale,extra[locale]?{title:extra[locale][i][0],goal:extra[locale][i][1]}:catalog[locale][topic.key]]));
 for(const [language,units] of Object.entries(catalog)){
  const original=units[topic.key];
  for(const field of ['title','goal'])immersiveHeadingCopy[original[field]]=Object.fromEntries(locales.map(l=>[l,translated[l][field]]));
  for(const [index,stage]of immersiveStages.entries())immersiveHeadingCopy[original.title+' · '+immersiveStageTitle(language,stage)]=Object.fromEntries(locales.map(l=>[l,translated[l].title+' · '+(stages[l]?.[index]||immersiveStageTitle(l,stage))]));
 }
}
export const immersiveHeadingTranslation=(text,locale)=>immersiveHeadingCopy[text]?.[locale];
