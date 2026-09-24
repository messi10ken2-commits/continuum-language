// SERVER ONLY. Original Spanish diagnostic items, versioned independently of lessons.
// CEFR-inspired course placement, NOT an empirically calibrated CEFR examination.
export const assessmentVersion='es-diagnostic-1';
const tiers=['A1','A2','B1','B2','C1'];
// Each tier: a short passage, three reading items, three language-use items.
// In source tuples the first option is correct; options are rotated before use.
const forms=[[
 ['A1','Hola, soy Julia. Vivo en Lima con mi hermana. Trabajo en una tienda de lunes a viernes. Los sábados estudio español por la mañana.',[
  ['¿Con quién vive Julia?','Con su hermana','Con sus padres','Sola','Con su profesora'],
  ['¿Dónde trabaja?','En una tienda','En una escuela','En un hospital','En un hotel'],
  ['¿Cuándo estudia español?','El sábado por la mañana','Todos los viernes','El domingo por la tarde','De lunes a viernes']
 ],[
  ['Yo ___ de Japón.','soy','eres','es','son'],
  ['En la mesa ___ dos libros.','hay','es','son','está'],
  ['Mi hermano ___ veinte años.','tiene','es','está','hay']
 ]],
 ['A2','Hola, Luis: ayer fui al mercado, pero ya no quedaba pan. Mañana pasaré por la panadería antes de ir a tu casa. Llegaré sobre las diez, no a las nueve como habíamos pensado. Si necesitas leche, escríbeme esta noche.',[
  ['¿Por qué no compró pan ayer?','Porque se había acabado','Porque olvidó el dinero','Porque el mercado estaba cerrado','Porque Luis ya tenía pan'],
  ['¿Qué cambia en el plan?','La hora de llegada','La casa donde se ven','El día de la visita','La persona que irá'],
  ['¿Qué debe hacer Luis si quiere leche?','Escribir esta noche','Ir al mercado mañana','Llamar a las nueve','Esperar hasta la visita']
 ],[
  ['Ayer nosotros ___ una película en casa.','vimos','vemos','veremos','veíamos'],
  ['Esta mochila es ___ que la otra: cuesta diez euros menos.','más barata','tan cara','la más cara','menos barata'],
  ['¿Te gusta el café? Sí, ___ gusta mucho.','me','mi','yo','conmigo']
 ]],
 ['B1','El ayuntamiento probó un carril bici durante seis meses. Algunos comerciantes temían perder clientes al eliminar plazas de aparcamiento. Sin embargo, las ventas apenas cambiaron y aumentaron los desplazamientos en bicicleta. El informe aconseja mantener el carril, aunque propone mejorar las zonas de carga para las tiendas.',[
  ['¿Qué preocupaba inicialmente a los comerciantes?','Una posible caída de las ventas','La falta de bicicletas','El aumento del alquiler','La duración de las obras en sus tiendas'],
  ['¿Qué pasó con las ventas durante la prueba?','Se mantuvieron casi iguales','Cayeron mucho','Se duplicaron','No se midieron'],
  ['¿Qué recomienda el informe?','Conservar el carril con una mejora para las tiendas','Eliminar todas las zonas de carga','Quitar el carril inmediatamente','Cerrar las tiendas al tráfico peatonal']
 ],[
  ['Si mañana hace buen tiempo, ___ al parque.','iremos','fuéramos','habríamos ido','íbamos ayer'],
  ['Busco a alguien que ___ reparar esta bicicleta; no conozco a nadie.','sepa','sabe','supo','sabrá'],
  ['Llevo dos años ___ en esta empresa.','trabajando','trabajé','trabajaré','trabajado']
 ]],
 ['B2','La empresa atribuye el aumento de productividad al teletrabajo. No obstante, durante el mismo periodo también renovó sus equipos y redujo las reuniones. La encuesta recoge opiniones favorables, pero solo respondió la mitad de la plantilla. Antes de extender el modelo, convendría examinar por separado estas variables y escuchar a quienes no participaron.',[
  ['¿Por qué se cuestiona la explicación de la empresa?','Porque hubo otros cambios que pudieron influir','Porque nadie trabajó a distancia','Porque la productividad no aumentó','Porque todos rechazaron el modelo'],
  ['¿Qué limita la encuesta?','La participación incompleta de la plantilla','La ausencia total de respuestas favorables','El exceso de variables económicas publicadas','El uso exclusivo de datos de clientes'],
  ['¿Qué postura adopta el texto?','Prudencia antes de atribuir una causa y ampliar el modelo','Rechazo absoluto del teletrabajo','Apoyo sin reservas al informe','Indiferencia ante las opiniones del personal']
 ],[
  ['Si me lo hubieras dicho antes, te ___.','habría ayudado','ayudaré','ayudo','haya ayudado'],
  ['No asistió a la reunión, ___ había confirmado su presencia.','a pesar de que','por lo tanto','a fin de que','de ahí que'],
  ['El informe debe entregarse a más tardar el viernes. Esto significa que el viernes es ___.','la fecha límite','la fecha más temprana permitida','un día que no cuenta','una fecha ya cancelada']
 ]],
 ['C1','Resulta tentador celebrar la digitalización de los archivos como una democratización consumada del conocimiento. Sin embargo, poner documentos a disposición del público no equivale a hacerlos inteligibles. Si se prescinde de la mediación de especialistas y se confunde la abundancia con la accesibilidad, la promesa emancipadora corre el riesgo de convertirse en una nueva forma de exclusión, menos visible precisamente por presentarse como apertura universal.',[
  ['¿Qué supuesto pone en duda el autor?','Que disponer de documentos garantice comprenderlos','Que los archivos puedan digitalizarse','Que los especialistas lean documentos','Que existan documentos históricos'],
  ['¿Qué función tiene «precisamente» en la última frase?','Subraya la paradoja entre apertura proclamada y exclusión','Introduce una fecha exacta','Niega la posibilidad de exclusión','Resume los beneficios técnicos'],
  ['¿Qué medida sería más coherente con el argumento?','Acompañar los archivos de orientación que facilite interpretarlos','Aumentar documentos sin explicar su contexto','Reservar todos los archivos a especialistas','Sustituir la consulta por publicidad sobre la apertura']
 ],[
  ['De haber conocido las condiciones, no ___ el contrato.','habría firmado','habré firmado','haya firmado','firmaré'],
  ['El autor matiza su afirmación inicial. Es decir, ___.','introduce precisiones que limitan su alcance','la repite literalmente','la convierte en una orden','oculta por completo su postura'],
  ['Elige la formulación que presenta una conclusión con cautela académica.','Los datos apuntan a una asociación, sin que pueda inferirse causalidad.','Los datos demuestran sin duda cualquier causa imaginable.','Como era obvio, queda todo probado para siempre.','No hay datos, de modo que la hipótesis es cierta.']
 ]]
],[
 ['A1','Me llamo Pablo. Soy profesor y vivo cerca de la escuela. Voy al trabajo a pie. Los domingos como con mis amigos en un restaurante pequeño.',[
  ['¿Cuál es el trabajo de Pablo?','Profesor','Cocinero','Médico','Conductor'],
  ['¿Cómo va al trabajo?','A pie','En tren','En coche','En bicicleta'],
  ['¿Con quién come los domingos?','Con sus amigos','Con sus alumnos','Con su familia','Solo']
 ],[
  ['Nosotros ___ estudiantes.','somos','soy','eres','son'],
  ['La biblioteca ___ al lado del banco.','está','hay','tiene','son'],
  ['Quiero ___ manzana, por favor.','una','un','unos','el']
 ]],
 ['A2','Aviso: esta semana la piscina abre una hora más tarde, a las nueve, por tareas de limpieza. Las clases de la tarde no cambian. El sábado estará cerrada todo el día. Quienes tengan una reserva para el sábado pueden usarla el domingo sin pagar más.',[
  ['¿A qué hora abre la piscina esta semana?','A las nueve','A las ocho','A las diez','Solo por la tarde'],
  ['¿Qué actividad mantiene su horario?','Las clases de la tarde','La limpieza del sábado','Todas las clases de la mañana','La apertura diaria'],
  ['¿Qué puede hacer quien reservó para el sábado?','Ir el domingo sin coste adicional','Entrar el sábado por la tarde','Solicitar una clase gratis cada día','Usar la reserva solo la semana siguiente']
 ],[
  ['El verano pasado Ana ___ a Chile.','viajó','viaja','viajará','viajar'],
  ['Hoy no puedo salir porque ___ estudiar.','tengo que','estoy que','soy que','hay de'],
  ['Este tren es más rápido ___ el autobús.','que','como','de que','a']
 ]],
 ['B1','Marta dejó de ir al trabajo en coche para ahorrar dinero. Al principio el autobús le parecía incómodo porque tenía que salir antes. Después empezó a aprovechar el trayecto para leer y descubrió que llegaba menos cansada. Aun así, cuando lleva material pesado, prefiere conducir.',[
  ['¿Por qué cambió de transporte al principio?','Para gastar menos','Para leer más libros','Porque vendió el coche','Porque la empresa se mudó'],
  ['¿Cómo evolucionó su opinión sobre el autobús?','Encontró ventajas después de unas dificultades iniciales','Le gustó al principio pero acabó rechazándolo','Nunca lo consideró incómodo','Solo lo valora cuando lleva peso'],
  ['¿En qué situación usa todavía el coche?','Cuando transporta material pesado','Cada vez que quiere leer','Siempre que llega descansada','Todos los días sin excepción']
 ],[
  ['Cuando era pequeño, ___ a mis abuelos cada domingo.','visitaba','visité','visitaré','haya visitado'],
  ['Es importante que ustedes ___ a tiempo.','lleguen','llegan','llegaron','llegarán'],
  ['Este regalo es ___ mi hermana; se lo daré mañana.','para','por','desde','durante']
 ]],
 ['B2','Un museo amplió su horario para atraer a nuevos visitantes. La asistencia creció, pero sobre todo entre quienes ya acudían con frecuencia. La directora considera positivo el resultado, aunque reconoce que el objetivo inicial solo se ha cumplido parcialmente. Ahora propone colaborar con asociaciones de barrios que apenas están representados entre el público.',[
  ['¿Por qué el éxito se considera parcial?','Porque aumentaron las visitas sin diversificar mucho el público','Porque bajó la asistencia total','Porque el museo redujo su horario','Porque ningún visitante habitual volvió'],
  ['¿Qué pretende la colaboración propuesta?','Llegar a personas de barrios poco representados','Limitar la entrada de visitantes nuevos','Sustituir todas las exposiciones','Reducir la frecuencia de las visitas habituales'],
  ['¿Cómo se describe mejor la posición de la directora?','Valora el avance pero identifica una meta pendiente','Afirma que el objetivo se cumplió por completo','Niega que haya aumentado la asistencia','Considera inútil toda colaboración']
 ],[
  ['Ojalá ___ más tiempo; ahora no puedo terminarlo.','tuviera','tendré','he tenido','tengo'],
  ['Se aplazó el concierto debido a la tormenta. ¿Qué relación expresa «debido a»?','Causa','Finalidad','Concesión','Comparación'],
  ['Me dijo ayer que al día siguiente ___ el resultado.','publicaría','publico','haya publicado','publicaste']
 ]],
 ['C1','La propuesta de medir la calidad universitaria exclusivamente mediante indicadores comparables promete neutralidad, pero desplaza el debate: en lugar de discutir qué educación se desea, se discute cómo mejorar la posición en la tabla. No se trata de negar la utilidad de los datos, sino de advertir que aquello que queda fuera de la medición puede acabar fuera de las prioridades institucionales, aun cuando constituya la razón de ser de la universidad.',[
  ['¿Cuál es la objeción central?','La medición puede redefinir las prioridades en lugar de limitarse a describirlas','Los datos numéricos son siempre falsos','Todas las universidades tienen idénticos objetivos','No se pueden comparar cifras'],
  ['¿Qué aporta «No se trata de… sino de…»?','Distingue la crítica concreta de un rechazo general de los datos','Cancela la objeción anterior','Introduce dos ideas equivalentes','Afirma que las tablas carecen de toda utilidad'],
  ['¿Qué consecuencia implícita teme el autor?','Que se descuiden fines educativos difíciles de cuantificar','Que desaparezcan todos los indicadores mañana','Que aumente automáticamente la neutralidad','Que el debate educativo se vuelva innecesario']
 ],[
  ['Por convincente que ___ el argumento, necesita respaldo empírico.','parezca','parece','parecerá','pareció'],
  ['La medida no es sino un paliativo. Esto implica que ___.','alivia el problema sin resolver su causa','resuelve definitivamente el problema','crea necesariamente un problema nuevo','no tiene absolutamente ningún efecto'],
  ['Elige una objeción formal que reconozca primero el mérito de una propuesta.','Si bien la iniciativa es pertinente, su aplicación exige mayores garantías.','La idea es pésima y punto.','No he leído la propuesta, por tanto queda validada.','La iniciativa es pertinente porque no lo es.']
 ]]
]];
export function assessmentItems(form=0){
 if(!Number.isInteger(form)||form<0||form>=forms.length)throw Error('Unknown test form');
 return forms[form].flatMap(([level,passage,reading,language])=>[...reading.map(q=>({q,skill:'Reading',passage})),...language.map(q=>({q,skill:'Language use',passage:null}))].map(({q,skill,passage},i)=>{
  const [prompt,...options]=q,offset=(tiers.indexOf(level)+i+form)%4;
  return {id:`${form}-${level}-${i}`,level,skill,passage,prompt,options:[...options.slice(offset),...options.slice(0,offset)],answer:(4-offset)%4};
 }));
}
export function publicAssessment(row){
 const items=assessmentItems(row.form),index=row.answers.length;
 const item=items[index];
 return {id:row.id,kind:row.kind,version:row.version,form:row.form,startedAt:row.started_at,index,total:items.length,result:row.result,completedAt:row.completed_at,question:item?{id:item.id,skill:item.skill,passage:item.passage,prompt:item.prompt,options:item.options}:null};
}
export function gradeAssessment(form,answers){
 const items=assessmentItems(form);
 if(!Array.isArray(answers)||answers.length!==items.length||answers.some(a=>a!==null&&(!Number.isInteger(a)||a<0||a>3)))throw Error('Invalid complete assessment');
 const bands=tiers.map(level=>{const indices=items.flatMap((q,i)=>q.level===level?[i]:[]);const score=skill=>indices.filter(i=>items[i].skill===skill&&answers[i]===items[i].answer).length;return {level,correct:score('Reading')+score('Language use'),total:6,reading:score('Reading'),languageUse:score('Language use')};});
 let level='Below A1';
 for(const band of bands){if(band.correct<4||band.reading<2||band.languageUse<2)break;level=band.level;}
 const skills=['Reading','Language use'].map(name=>({name,correct:items.filter((q,i)=>q.skill===name&&answers[i]===q.answer).length,total:15}));
 return {level,courseLevel:level==='Below A1'?'A1':level,correct:bands.reduce((n,b)=>n+b.correct,0),total:items.length,skipped:answers.filter(a=>a===null).length,bands,skills,scope:'Reading and language use only',method:assessmentVersion,overallCefr:null};
}
