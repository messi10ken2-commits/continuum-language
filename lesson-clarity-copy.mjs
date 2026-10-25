const rows=[
 ['Complete the sentence.','空欄を埋めてください。','Completa la frase.','Complete a frase.','请补全句子。','Complétez la phrase.'],
 ['Complete the model.','例文の空欄を埋めてください。','Completa el modelo.','Complete o modelo.','请补全例句。','Complétez le modèle.'],
 ['Use this lesson’s wording.','このレッスンで学んだ語句を使ってください。','Usa las palabras de esta lección.','Use as palavras desta lição.','请使用本课所学的词语。','Utilisez les mots de cette leçon.'],
 ['Complete the missing form.','指定された形で空欄を埋めてください。','Escribe la forma que falta.','Escreva a forma que falta.','请填写所缺的形式。','Écrivez la forme manquante.'],
 ['Choose the meaning.','意味を選んでください。','Elige el significado.','Escolha o significado.','请选择含义。','Choisissez le sens.'],
 ['Put the words in order.','語句を正しい順番に並べてください。','Ordena las palabras.','Coloque as palavras em ordem.','请将词语按正确顺序排列。','Remettez les mots dans l’ordre.'],
 ['Write the word or phrase.','当てはまる語句を入力してください。','Escribe la palabra o expresión.','Escreva a palavra ou expressão.','请填写对应的单词或短语。','Écrivez le mot ou l’expression.'],
 ['What does this mean?','どのような意味ですか？','¿Qué significa?','O que significa?','这是什么意思？','Que signifie cette expression ?'],
 ['Example','例文','Ejemplo','Exemplo','例句','Exemple'],
 ['Notice','表現に注目','Observa','Observe','观察表达','Observez'],
 ['Understand','意味を確認','Comprende','Entenda','理解含义','Comprenez'],
 ['Use it','使ってみよう','Ponlo en práctica','Pratique','试着运用','Mettez en pratique'],
 ['Shape → sound','文字と音','Letra → sonido','Letra → som','字形 → 发音','Signe → son'],
 ['Word → phrase','単語からフレーズへ','Palabra → frase','Palavra → frase','单词 → 短语','Mot → expression'],
 ['Meaning → use','意味と使い方','Significado → uso','Significado → uso','含义 → 用法','Sens → emploi'],
 ['Notice the form','形に注目','Observa la forma','Observe a forma','观察形式','Observez la forme'],
 ['Connect the meaning','意味を確認','Comprende el significado','Entenda o significado','理解含义','Comprenez le sens'],
 ['Apply the rule','使い方を確認','Comprueba el uso','Confira o uso','了解用法','Vérifiez l’emploi'],
 ['Listen & compare','聞き比べる','Escucha y compara','Ouça e compare','听音并比较','Écoutez et comparez'],
 ['Show more','さらに表示','Mostrar más','Mostrar mais','显示更多','Afficher plus'],
 ['Illustrated learning scene · Continuum','学習用イラスト・Continuum','Escena de aprendizaje ilustrada · Continuum','Cena de aprendizagem ilustrada · Continuum','学习场景插画 · Continuum','Scène d’apprentissage illustrée · Continuum']
];
export const lessonClarityCopy=Object.fromEntries(['ja','es','pt','zh','fr'].map((locale,i)=>[locale,Object.fromEntries(rows.map(([source,...values])=>[source,values[i]]))]));
