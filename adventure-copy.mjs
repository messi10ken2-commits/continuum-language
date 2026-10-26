const rows=`Review five words or expressions|単語や表現を5つ復習|Repasa cinco palabras o expresiones|Revise cinco palavras ou expressões|复习五个单词或表达|Révisez cinq mots ou expressions
Your living world|育っていく世界|Tu mundo vivo|Seu mundo vivo|你的成长世界|Votre monde vivant
chapters restored|章が街に彩りを添えました|capítulos restaurados|capítulos restaurados|个章节已点亮|chapitres restaurés
Each completed chapter brings the world to life.|章を修了するたびに、世界に彩りが増えていきます。|Cada capítulo completado da vida al mundo.|Cada capítulo concluído dá vida ao mundo.|每完成一章，世界就增添一份生机。|Chaque chapitre terminé donne vie au monde.
Journey passport|旅のパスポート|Pasaporte de aprendizaje|Passaporte de aprendizagem|学习护照|Passeport d’apprentissage
Choose your companion|旅の仲間を選ぶ|Elige tu compañero|Escolha seu companheiro|选择旅伴|Choisissez votre compagnon
Bird|小鳥|Pájaro|Pássaro|小鸟|Oiseau
Fox|キツネ|Zorro|Raposa|狐狸|Renard
Cat|ネコ|Gato|Gato|猫|Chat
Earned through learning|学びの足あと|Ganado aprendiendo|Conquistado aprendendo|学习所得|Obtenu en apprenant
Your first stamp awaits. Complete a chapter, revisit a difficulty, or study on three days.|章の修了、苦手なレッスンの再挑戦、3日間の学習で、最初のスタンプを集めましょう。|Completa un capítulo, retoma una dificultad o estudia durante tres días para conseguir tu primer sello.|Conclua um capítulo, retome uma dificuldade ou estude em três dias para ganhar seu primeiro carimbo.|完成章节、重温难点或累计学习三天，收集第一枚印章。|Terminez un chapitre, reprenez une difficulté ou étudiez trois jours pour obtenir votre premier tampon.
One small quest|今日の小さなクエスト|Una pequeña misión|Uma pequena missão|一个小任务|Une petite quête
Choose one for today. No penalty for taking a break.|今日の目標を一つ。お休みしてもペナルティはありません。|Elige una para hoy. Descansar no tiene penalización.|Escolha uma para hoje. Descansar não tem penalidade.|为今天选一个任务，休息不会受到惩罚。|Choisissez-en une pour aujourd’hui. Les pauses ne sont pas pénalisées.
Listen and discover|聞いて発見しよう|Escucha y descubre|Ouça e descubra|聆听与发现|Écoutez et découvrez
Return to a difficult lesson|苦手なレッスンに再挑戦|Retoma una lección difícil|Retome uma lição difícil|重温有难度的课程|Reprenez une leçon difficile
Complete a class or assignment|授業や課題に取り組む|Completa una clase o tarea|Conclua uma aula ou tarefa|完成课堂或作业|Terminez un cours ou un devoir
Quest complete|クエスト達成|Misión cumplida|Missão concluída|任务完成|Quête accomplie
Could not save your journey. Please try again.|保存できませんでした。もう一度お試しください。|No se pudo guardar. Inténtalo de nuevo.|Não foi possível salvar. Tente novamente.|保存失败，请重试。|Impossible d’enregistrer. Réessayez.
A new page in your passport|パスポートに新しい思い出が増えました|Una nueva página en tu pasaporte|Uma nova página no seu passaporte|护照上又添一页回忆|Une nouvelle page dans votre passeport
Restored through learning|学びによって彩られました|Restaurado aprendiendo|Restaurado aprendendo|学习让这里焕发生机|Restauré par l’apprentissage
A brave return|勇気ある再挑戦|Un regreso valiente|Um retorno corajoso|勇敢地再次尝试|Un retour courageux
Three learning days|3日間の学習|Tres días de aprendizaje|Três dias de aprendizagem|累计学习三天|Trois jours d’apprentissage
Loading your journey…|旅の記録を読み込み中…|Cargando tu viaje…|Carregando sua jornada…|正在加载旅程…|Chargement de votre parcours…
Journey unavailable. Please refresh.|旅の記録を読み込めません。再読み込みしてください。|Viaje no disponible. Actualiza la página.|Jornada indisponível. Atualize a página.|无法加载旅程，请刷新。|Parcours indisponible. Actualisez la page.`.split('\n').map(r=>r.split('|'));
export const adventureCopy=Object.fromEntries(['ja','es','pt','zh','fr'].map((locale,i)=>[locale,Object.fromEntries(rows.map(r=>[r[0],r[i+1]]))]));
