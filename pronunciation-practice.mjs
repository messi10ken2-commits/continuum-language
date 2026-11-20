// Short listening applications: target-language audio and plausible sound contrasts.
const rows={
 en:[
 ['Please take a seat.','Please take a seat.','Please take a sit.','Seat has /iː/; sit has /ɪ/. In this request, listen for the higher, tenser vowel in seat.'],
 ['Turn right here.','Turn right here.','Turn light here.','Right starts with /r/, without the tongue-tip contact used for /l/ in light.'],
 ['I bought a banana.','banana','computer','The recording contains banana: the middle syllable carries the main stress. Computer is a different word and is not in this recording.'],
 ['She wanted a ticket.','wanted','walked','Wanted has an extra /ɪd/ syllable after /t/. Walked ends with /t/ and has no extra syllable.']
 ],
 es:[
 ['La mesa está aquí.','mesa','misa','Mesa has /e/ in the first syllable; misa has /i/. Listen for the steady e vowel, without an English-style glide.'],
 ['El perro corre.','El perro corre.','El pero corre.','Perro has a trill between the vowels and means dog. Pero has a single tap and means but.'],
 ['Mi papá llegó.','papá','papa','Papá stresses the last syllable. Papa stresses the first. The accent mark records the stress difference.'],
 ['Los amigos están en un hotel.','hotel','papel','The word is hotel. Its h is silent; listen for the vowel at the beginning and final stressed -tel. Papel begins with /p/.']
 ],
 pt:[
 ['Quero pão, por favor.','Quero pão, por favor.','Quero pau, por favor.','Pão has the nasal diphthong ão and means bread. Pau has an oral diphthong and means stick or wood; nasal resonance distinguishes them.'],
 ['Meu avô chegou.','avô','avó','Avô has closed ô /o/ and means grandfather; avó has open ó /ɔ/ and means grandmother. Both stress the final syllable.'],
 ['O carro está aqui.','O carro está aqui.','O caro está aqui.','Carro means car and has a strong r sound between vowels. Caro means expensive and has a single tap. The exact strong-r sound varies by region.'],
 ['Os amigos chegaram ao Brasil.','Brasil','brisa','Listen for Bra-sil, with stress on the final syllable. Brisa stresses the first syllable. Final l in Brasil often sounds vowel-like in Brazilian Portuguese.']
 ],
 ja:[
 ['おばあさんがきました。','おばあさんがきました。','おばさんがきました。','おばあさん means grandmother and has five morae: お・ば・あ・さ・ん. おばさん means aunt and has four. Keep the extra あ beat.'],
 ['きってをください。','きってをください。','きてください。','きって contains a consonant hold: き・っ・て, three morae. きて has two morae; きてください means please come, not a request for stamps.'],
 ['びょういんにいきます。','びょういんにいきます。','びよういんにいきます。','びょういん means hospital: びょ・う・い・ん, four morae. びよういん means beauty salon: び・よ・う・い・ん, five. Small ょ combines with び.'],
 ['そうですか。','そうですか。','そうです。','The recording includes the final か. In this context it makes a question; そうです is a statement without that final mora.']
 ]};
export function pronunciationApplication(language,index){
 const [audio,right,wrong,note]=rows[language][index];
 const locale={en:'en-US',es:'es-ES',pt:'pt-BR',ja:'ja-JP'}[language];
 return {prompt:right.includes(' ' )||language==='ja'?'Listen to the short phrase. Which version do you hear?':'Listen to the phrase. Which word is spoken?',options:[right,wrong],answer:0,note,audio,audioLocale:locale,optionsLang:locale,mode:'listening-application',mistakeFeedback:{[wrong]:note}};
}
