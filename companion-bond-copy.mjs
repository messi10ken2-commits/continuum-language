const rows=`Original sound design|オリジナル効果音|Diseño sonoro original|Design de som original|原创音效|Création sonore originale
15 chapters|15章修了|15 capítulos|15 capítulos|完成15章|15 chapitres
30 chapters|30章修了|30 capítulos|30 capítulos|完成30章|30 chapitres
Complete every C1 lesson and pass the final summary test|C1の全レッスンを修了し最終テストに合格|Completa todas las lecciones C1 y aprueba la prueba final|Conclua todas as lições C1 e passe no teste final|完成所有C1课程并通过最终测试|Terminez toutes les leçons C1 et réussissez le test final
Your profile avatar|プロフィールアイコン|Tu avatar de perfil|Seu avatar de perfil|你的头像|Votre avatar
Initials|イニシャル|Iniciales|Iniciais|姓名缩写|Initiales
Earn a companion avatar in your journey passport.|旅のパスポートで仲間のアイコンを獲得しましょう。|Consigue un avatar en tu pasaporte.|Conquiste um avatar no seu passaporte.|在旅程护照中获得旅伴头像。|Gagnez un avatar dans votre passeport.
Companion profile avatar|仲間のプロフィールアイコン|Avatar de tu compañero|Avatar do companheiro|旅伴头像|Avatar du compagnon
learning days|学習日|días de aprendizaje|dias de estudo|学习天数|jours d’apprentissage
Use as my avatar|アイコンに設定|Usar como avatar|Usar como avatar|设为头像|Utiliser comme avatar
Keep learning to unlock|学習を続けて解放|Sigue aprendiendo para desbloquear|Continue estudando para desbloquear|继续学习以解锁|Continuez pour débloquer
Once earned, your avatar stays yours after Premium ends.|獲得したアイコンはPremium終了後も使えます。|Una vez ganado, conservas tu avatar al finalizar Premium.|Após conquistar, seu avatar continua disponível sem Premium.|获得后，即使Premium结束也能保留头像。|Votre avatar reste acquis après la fin de Premium.
Capybara|カピバラ|Capibara|Capivara|水豚|Capybara
Guinea pig|モルモット|Cobaya|Porquinho-da-índia|豚鼠|Cochon d’Inde
Quokka|クオッカ|Cuoca|Quokka|短尾矮袋鼠|Quokka
Panda|パンダ|Panda|Panda|熊猫|Panda
Original stylized companion sound, not a wildlife recording|オリジナルのキャラクター効果音（野生動物の録音ではありません）|Sonido original del personaje, no grabación de fauna|Som original do personagem, não gravação de animal|原创角色音效，并非野生动物录音|Son original du personnage, pas un enregistrement animalier
Your bond|仲間との親密度|Tu vínculo|Seu vínculo|你们的亲密度|Votre lien
chapters together|一緒に修了した章|capítulos juntos|capítulos juntos|个共同完成的章节|chapitres ensemble
Bond progress|親密度の進捗|Progreso del vínculo|Progresso do vínculo|亲密度进度|Progression du lien
{0} more chapters to your next bond reward|あと{0}章で次の特典を解放|{0} capítulos más para la próxima recompensa|Mais {0} capítulos para a próxima recompensa|再完成{0}章即可解锁下一奖励|Encore {0} chapitres avant la prochaine récompense
All chapter bond rewards unlocked|章の修了による特典をすべて解放しました|Todas las recompensas de capítulos desbloqueadas|Todas as recompensas de capítulos desbloqueadas|章节亲密度奖励已全部解锁|Toutes les récompenses de chapitres sont débloquées
Your bond stays safe when you take a break.|お休みしても親密度は下がりません。|Tu vínculo se conserva durante los descansos.|Seu vínculo se mantém durante as pausas.|休息不会降低亲密度。|Votre lien se conserve pendant les pauses.
Happy greeting|うれしいごあいさつ|Saludo alegre|Saudação alegre|开心的问候|Un joyeux bonjour
2 chapters|2章修了|2 capítulos|2 capítulos|完成2章|2 chapitres
5 chapters|5章修了|5 capítulos|5 capítulos|完成5章|5 chapitres
10 chapters|10章修了|10 capítulos|10 capítulos|完成10章|10 chapitres
Hear their call|鳴き声を聞く|Escuchar su llamada|Ouvir seu chamado|听听它的叫声|Écouter son cri
Stop sound|再生を止める|Detener sonido|Parar som|停止播放|Arrêter le son
Delighted reaction|とびきりの喜び|Reacción de alegría|Reação de alegria|喜悦的反应|Une réaction enchantée
Our journey celebration|旅の達成をお祝い|Celebrar nuestro viaje|Celebrar nossa jornada|庆祝我们的旅程|Célébrer notre parcours
Pass the Learn C1 final summary test|LearnのC1最終サマリーテストに合格|Aprueba la prueba final de C1 en Aprender|Passe no teste final de C1 em Aprender|通过“学习”的C1最终总结测试|Réussissez le test final C1 dans Apprendre
A whole journey, together|一緒に、ここまで来たね|Todo un viaje juntos|Uma jornada inteira juntos|一路同行，终于抵达|Tout un parcours ensemble
Happy to learn with you|一緒に学べてうれしいな|Me alegra aprender contigo|Feliz em aprender com você|很高兴与你一起学习|Heureux d’apprendre avec vous
Animal recording credits|鳴き声の録音クレジット|Créditos de las grabaciones|Créditos das gravações|动物录音署名|Crédits des enregistrements
Original recording|元の録音|Grabación original|Gravação original|原始录音|Enregistrement original
The sound could not play. Please try again.|再生できませんでした。もう一度お試しください。|No se pudo reproducir. Inténtalo de nuevo.|Não foi possível reproduzir. Tente novamente.|无法播放，请重试。|Lecture impossible. Réessayez.
Excerpt, mono AAC conversion and loudness adjustment|一部抜粋・モノラルAAC変換・音量調整|Extracto, conversión AAC mono y ajuste de volumen|Trecho, conversão AAC mono e ajuste de volume|节选、单声道AAC转换及音量调整|Extrait, conversion AAC mono et réglage du volume`.split('\n').map(r=>r.split('|'));
export const companionBondCopy=Object.fromEntries(['ja','es','pt','zh','fr'].map((l,i)=>[l,Object.fromEntries(rows.map(r=>[r[0],r[i+1]]))]));
