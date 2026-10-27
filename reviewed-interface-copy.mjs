import interfaceAuditCopy from './interface-audit-copy.json' with {type:'json'};
import {interfaceAuditSeed} from './interface-audit-seed.mjs';
import additionalDisplayCopy from './additional-display-copy.json' with {type:'json'};
import {displayLanguageSeed} from './display-language-seed.mjs';
import {companionBondCopy} from './companion-bond-copy.mjs';
import {adventureCopy} from './adventure-copy.mjs';
import {approvedDesignCopy} from './approved-design-copy.mjs';
import {lessonClarityCopy} from './lesson-clarity-copy.mjs';
import {journeyReviewedCopy} from './journey-copy.mjs';
import {reviewedComprehensionOptions} from './reviewed-comprehension-options.mjs';
import {reviewedExerciseInstructions} from './reviewed-exercise-instructions.mjs';
import {reviewedCourseTitles} from './reviewed-course-titles.mjs';
import {multilingualReviewedCopy} from './multilingual-reviewed-copy.mjs';
// Editorial translations override generated caches. Keys remain the authored English.
const jaRows=`
A CLEARER STARTING POINT|自分に合ったレベルから始めよう
Your level, tested.|今の語学レベルを確認しよう
Learning progress shows what you have completed. An assessment gives separate evidence for where to begin next.|学習の進捗では、取り組んだ内容を確認できます。レベル診断では今の力を確かめ、次に学ぶレベルの目安を知ることができます。
45 scored questions + 2 response tasks|採点対象の45問＋ライティング・スピーキングの2課題
About 35–50 minutes · untimed|所要時間の目安：35〜50分・制限時間なし
· A1–C1 tasks|・A1〜C1レベルの問題
Teachers are on their way|講師の公開を準備中です
Approved profiles will appear here. Meanwhile, you can keep learning with the self-study courses.|審査で承認された講師のプロフィールがここに表示されます。公開までの間も、自主学習コースをご利用いただけます。
TEACHER ACCESS|講師との情報共有
Teacher access|講師との情報共有
Choose what teachers can see|講師に共有する情報を選ぶ
Choose the languages you study with each teacher. Only those languages’ class notes are shared. The switch below also controls access to self-study results in those languages.|各講師と学ぶ言語を選んでください。授業ノートは、選んだ言語のものだけが共有されます。その言語の自主学習の結果も共有する場合は、下のスイッチをオンにしてください。
Share self-study activity|自主学習の記録を共有する
Share self-study activity with connected teachers|連携中の講師に自主学習の記録を共有する
Teachers can see lesson activity and assessment results only in their assigned languages.|各講師が確認できるのは、共有する言語に指定したレッスンの学習記録と診断結果だけです。
This setting does not delete your progress and does not disconnect your teachers. You can change it at any time.|この設定を変えても、学習記録や講師との連携は削除されません。いつでも変更できます。
Language to share with a new teacher|新しく連携する講師と学ぶ言語
Generate sharing code|共有コードを作成する
Connected teachers|連携中の講師
Share only languages you study with this teacher.|この講師と学ぶ言語だけを共有対象にしてください。
No language selected — learning records and class notes are hidden.|共有する言語が選ばれていないため、学習記録と授業ノートは講師に表示されません。
Remove access|共有を解除する
No teachers connected yet.|まだ講師と連携していません。
Your self-study activity is now hidden from connected teachers.|連携中の講師への自主学習記録の共有をオフにしました。
Connected teachers can now see self-study activity in their assigned languages.|各講師が、共有対象の言語の自主学習記録を確認できるようになりました。
Lesson activity and assessment results are hidden from teachers.|レッスンの学習記録と診断結果は講師に共有されていません。
Self-study activity is private|自主学習記録は非公開です
Assessment is private|診断結果は非公開です
Language access has not been set|共有する言語が未設定です
No language shared|共有中の言語なし
Shared lesson language|共有対象の言語
The learner controls sharing in Account.|共有範囲は、学習者がアカウント設定で変更できます。
Only this language’s learning records are shown.|この言語の学習記録だけを表示しています。
LEARN WITH A TEACHER|講師と一緒に学ぶ
Find your next learning partner|自分に合った講師を見つけよう
Explore reviewed profiles and save teachers you’d like to learn with. Saving a teacher never shares your learning history.|審査済みのプロフィールを見て、気になる講師をお気に入りに登録しましょう。お気に入りに登録するだけでは、学習履歴は共有されません。
Teaching language|教える言語
All languages|すべての言語
Save teacher|お気に入りに登録
Saved teacher|お気に入りに登録済み
Saved teachers|お気に入りの講師
Show all teachers|すべての講師を表示
No saved teachers in this language yet|この言語の講師はまだお気に入りに登録されていません
Explore the directory and use Save teacher to build your shortlist.|講師一覧から気になる講師を選び、「お気に入りに登録」を押してください。
Bookings and payments are not available yet. Already working with a teacher? Connect privately using a sharing code in Account.|予約・決済機能はまだ利用できません。すでに受講中の講師とは、アカウント画面の共有コードを使って連携できます。
Open account & sharing settings|アカウント・共有設定を開く
Loading teachers…|講師一覧を読み込んでいます…
Find a teacher|講師を探す
Browse teachers|講師一覧を見る
About this teacher|講師について
Lesson approach|授業の進め方
Education & qualifications|学歴・資格
Watch introduction video ↗|自己紹介動画を見る ↗
Name or headline|名前・プロフィールの見出し
Profile unavailable|プロフィールを表示できません
A LITTLE REVIEW GOES A LONG WAY|少しずつ復習して、しっかり身につけよう
A little review, lasting progress.|復習を重ねて、使える知識に。
Your pool is clear|復習が必要な単語・表現はありません
YOUR WORDS & EXPRESSIONS|復習する単語・表現
Your review|あなたの復習
Your sound studio|発音トレーニング
Build clear pronunciation|相手に伝わる発音を身につけよう
Character studio|文字の練習
Your memory travels|学習記録を、次の学びへ
Your evidence, over time|学習記録で振り返る成長
Your evidence timeline|学習記録のタイムライン
Evidence timeline|学習記録のタイムライン
Evidence in your record|学習記録の詳細
Evidence from your memory|学習履歴から分かること
Evidence in this record|この記録の詳細
Saved evidence|保存済みの学習記録
Practice evidence|練習の結果
Class evidence|授業の記録
LESSON EVIDENCE|レッスンの学習結果
Selected lesson evidence|選択したレッスンの学習結果
Practice attempts|練習履歴
Review learner responses|学習者の回答を確認する
Your full proficiency report|スキル別の詳しいレポート
Full report|詳しいレポート
Explore your skills|スキル別の学習状況を確認する
See your memory|学習記録を見る
Explore your learning memory|学習記録を振り返ろう
Recurring patterns|繰り返しつまずくポイント
Recurring pattern|繰り返しつまずくポイント
RECURRING PATTERNS|繰り返しつまずくポイント
Spot repeated difficulties, see the evidence, and choose what to practise next.|繰り返しつまずく箇所を学習記録から確認し、次に練習する内容を選びましょう。
One result is a starting point; more attempts will show whether this difficulty repeats.|今回の結果を手がかりにしましょう。練習を重ねると、同じ箇所で繰り返しつまずいているかが分かります。
Recent results are strong. Use a new context to check that the skill transfers.|最近の練習ではよい結果が出ています。別の場面でも使えるか試してみましょう。
No evidence yet. Complete a lesson or add a class observation to start building your patterns.|まだ分析できる記録がありません。レッスンを完了するか授業メモを追加すると、つまずきの傾向を確認できます。
Learning focus|重点的に学ぶこと
Next focus|次に取り組むこと
Primary focus|特に取り組みたいこと
Best next action|次におすすめの取り組み
Recommended class move|授業でのおすすめの取り組み
What to work on|これから取り組むこと
What to revisit|復習したいポイント
What worked well|よくできていたこと
What your teacher noticed|講師からの気づき
No clear lesson match yet. Ask your teacher to name the specific grammar, expression or lesson to practise.|課題に合うレッスンがまだ見つかりません。練習する文法・表現・レッスン名を講師に具体的に指定してもらってください。
Your teacher’s observation is saved below. AI can help interpret the next step.|講師のメモを下に保存しました。AIを使って、次に取り組む内容を検討できます。
See where you are, what is improving, and what to practise next.|今の学習状況、できるようになったこと、次に練習する内容を確認しましょう。
A SCENE TO UNDERSTAND|場面を理解しよう
SCENE & COMPREHENSION|場面を見て理解しよう
SEE IT. UNDERSTAND IT. USE IT.|見て、理解して、使ってみよう。
WORD → PHRASE → SENTENCE|単語からフレーズ、そして文へ
CHUNKS → CONTEXT → YOUR OWN WORDS|まとまりで覚えて、場面に合わせて使ってみよう
LOOK → LISTEN → RECALL|見て、聞いて、思い出そう
LISTEN → SHAPE → REPEAT → COMPARE|聞く・口の形を確認する・繰り返す・比べる
A visual setting for this lesson. Use the question and audio to choose your answer.|レッスンの場面をイメージするための画像です。問題文と音声をもとに答えてください。
Say the phrase, cover the translation, then make your own sentence.|フレーズを声に出し、訳を隠して、自分で文を作ってみましょう。
Learn each phrase as a unit. Notice its register, cover the translation, then use it in a new situation of your own.|フレーズをひとまとまりで覚えましょう。丁寧さや使う場面に注意して、訳を隠し、別の場面で使ってみてください。
New situations · mixed questions|さまざまな場面・形式で練習
Explanation + guided practice|解説と練習
Read a short explanation and example.|解説と例文を読んで理解しましょう。
Practise with immediate feedback.|一問ずつ解説を確認しながら練習しましょう。
Review mistakes and revisit a checkpoint.|間違えた箇所を復習して、確認テストにもう一度挑戦しましょう。
Learn. Try. Remember.|理解して、使って、身につけよう。
Your next chapter starts here|次のチャプターに進もう
LESSON MASTERED|レッスンの目標を達成しました
LEVEL COMPLETED|このレベルの学習を完了しました
LEVEL REVIEW SAVED|レベル確認テストの結果を保存しました
100% achieved|全問正解
Review complete|復習が終わりました
Needs practice|要練習
Not assessed|未評価
Insufficient evidence|判断するための記録が不足しています
Not enough evidence to score|採点に必要な内容が不足しています
Provisional task band|課題から見た暫定レベル
Task difficulty · not a proficiency rating|課題の難易度です。習熟度の評価ではありません
AI estimate|AIによる推定
Assessment needed|診断が必要です
READY WHEN YOU ARE|いつでも再開できます
CHECK YOUR PROGRESS|今の実力を確かめよう
FIRST-TIME PLACEMENT|初めてのレベル診断
Resume your saved test|中断した診断を再開する
Take a reassessment|もう一度レベル診断を受ける
Take your placement test|レベル診断を受ける
Start placement test|レベル診断を始める
Start reassessment|再診断を始める
Resume test|診断を再開する
Pause test|診断を中断する
Finish test & update placement|診断を終了して開始レベルを更新する
Course placement from A1 to C1|A1〜C1から学習の開始レベルを判定
Language use|文法・語彙の運用
I don’t know / skip|分からない・スキップ
Your first completed test sets your placement; later completed tests update it. An unfinished test never changes your previous result.|初めて完了した診断で開始レベルが決まり、再診断を完了すると更新されます。途中で中断した場合、前回の結果は変わりません。
Work independently, without a dictionary, translator or outside help.|辞書や翻訳ツールを使わず、ほかの人の助けを借りずに取り組んでください。
Choose “I don’t know” instead of guessing when possible.|分からない問題は、当てずっぽうで答えず「分からない」を選んでください。
Results follow “Share self-study activity” in Account. Turning it off hides test results from connected teachers too.|診断結果の共有には、アカウント画面の「自主学習の記録を共有する」の設定が適用されます。オフにすると、連携中の講師にも診断結果は表示されません。
I understand this is a provisional diagnostic with separate skill evidence, not an overall CEFR certification.|この診断は各スキルの学習状況を把握するための暫定的なものであり、総合的なCEFRレベルを認定するものではないと理解しました。
Course progress and test results are separate. A full CEFR profile requires evidence across communication skills.|コースの進捗と診断結果は別のものです。総合的なCEFRレベルを判断するには、各コミュニケーションスキルの評価が必要です。
How this result is calculated|判定方法
How your level changed|レベルの変化
Skill scores stay separate, so you can see where to focus.|スキルごとに結果を表示するので、重点的に学ぶ分野が分かります。
Your band reflects consecutive difficulty bands meeting the test threshold. The score below retains all your answers across A1–C1.|A1から順に基準を満たしたレベルをもとに、開始レベルを判定します。下の得点には、A1〜C1のすべての回答が含まれます。
Teacher score|講師による評価
Teacher assessment|講師による評価
Teacher visibility follows “Share self-study activity” in Account.|講師への共有には、アカウント画面の「自主学習の記録を共有する」の設定が適用されます。
No completed assessment yet|まだ完了した診断がありません
Your first result will appear here|初回の結果がここに表示されます
A focus for today|今日取り組むこと
One continuous record—across self-study and every class.|自主学習と授業の記録を、ひとつにつなげます。
Your practice, feedback and class observations, connected in one place.|練習の結果、フィードバック、授業での気づきをまとめて確認できます。
Your saved exercises and class observations, together in one record.|練習の結果と授業メモをまとめた学習記録です。
Your learning memory moves with you, so a new teacher can continue without making you start again.|これまでの学習記録を引き継げるので、講師が変わっても一から説明し直す必要はありません。
Your learning timeline will grow with your activity.|学習を続けると、ここに記録が増えていきます。
No completed lessons yet. Your results will appear here after practice.|まだ完了したレッスンがありません。練習を終えると、ここに結果が表示されます。
Complete a lesson to start your learning record.|レッスンを完了すると、学習記録が残ります。
Practise the words and expressions you missed, in context. Correct answers schedule the next review in 1, 3, then 7 days.|間違えた単語や表現を、文脈の中で復習しましょう。正解を重ねると、次の復習までの間隔が1日、3日、7日と延びます。
Mistakes are added when you continue after an answer. Review them here in context.|不正解のあとに「次へ」を押すと、復習する項目に追加されます。ここで文脈と一緒に復習しましょう。
Vocabulary and expression mistakes will appear here automatically as you save lesson answers. Older mistakes are included where detailed answers were saved.|レッスンの回答を保存すると、間違えた単語・表現が自動で追加されます。過去の間違いも、回答の詳細が保存されているものは対象になります。
One more try · Recall the answer without the model. Your score keeps your first response.|もう一度挑戦しましょう。正解を見ずに思い出してください。得点には最初の回答が反映されます。
This score checks listening knowledge; it is separate from your recording.|この得点は聞き取り問題の結果です。録音した発音の評価ではありません。
Automatic matching is unavailable in this browser. You can still replay and compare your recording.|このブラウザでは音声認識による照合は利用できません。録音を再生して、お手本と聞き比べることはできます。
No speech was recognized. Try again closer to the microphone.|音声を認識できませんでした。マイクに近づいて、もう一度試してください。
Every model word was recognized in sequence.|お手本のすべての単語が、順番どおりに認識されました。
Browser heard:|音声認識の結果：
Browser transcript:|音声認識で文字にした内容：
Human recording|人の声による録音
AI studio voice|AI合成音声
Device voice · quality varies|端末の読み上げ音声（品質は端末によって異なります）
Use device voice instead|端末の読み上げ音声を使う
Capture a learning insight from class|授業で気づいたことを記録する
Turn this observation into practice|この授業メモから練習を作る
Create practice plan|練習プランを作成する
CREATE PRACTICE PLAN|練習プランの作成
Use as class-plan draft|授業プランの下書きに使う
Class note saved to this learner’s account.|授業メモを学習者のアカウントに保存しました。
Practice plan saved. The learner can read it in their class notes.|練習プランを保存しました。学習者は授業ノートから確認できます。
Awaiting review|審査待ち
Changes requested|修正が必要です
Approve & publish|承認して公開する
Request changes|修正を依頼する
Unpublish & request changes|非公開にして修正を依頼する
Correct profile text|プロフィールの文章を修正する
Review applications, manage publication and keep a record of every decision. This area is available only to authorised accounts.|講師の申請審査や公開状況の管理を行い、判断の履歴を保存します。この画面は管理権限のあるアカウントだけが利用できます。
`;
export const reviewedInterfaceCopy={ja:Object.fromEntries(jaRows.trim().split('\n').map(line=>{const i=line.indexOf('|');return [line.slice(0,i),line.slice(i+1)]})),es:{},pt:{},zh:{},fr:{}};
export const reviewedTranslation=(text,locale)=>reviewedInterfaceCopy[locale]?.[text];
export const translationRevision='context-v2';
// These headings are easy to mistranslate without their product context.
const multilingualRows=[
 ['Your level, tested.','Descubre tu nivel actual','Descubra seu nível atual','测一测你现在的语言水平','Faites le point sur votre niveau'],
 ['A CLEARER STARTING POINT','ENCUENTRA TU PUNTO DE PARTIDA','ENCONTRE SEU PONTO DE PARTIDA','找到适合你的学习起点','TROUVEZ VOTRE POINT DE DÉPART'],
 ['Teachers are on their way','Próximamente encontrarás profesores aquí','Em breve, você encontrará professores aqui','教师资料即将上线','Des profils de professeurs seront bientôt disponibles'],
 ['Choose what teachers can see','Elige qué información compartes con tus profesores','Escolha o que compartilhar com seus professores','选择与教师共享的信息','Choisissez les informations à partager avec vos professeurs'],
 ['Connected teachers','Profesores vinculados','Professores conectados à sua conta','已关联的教师','Professeurs associés à votre compte'],
 ['Language to share with a new teacher','Idioma que estudiarás con el nuevo profesor','Idioma que você estudará com o novo professor','与新教师学习的语言','Langue étudiée avec le nouveau professeur'],
 ['45 scored questions + 2 response tasks','45 preguntas puntuadas + 2 tareas de expresión','45 questões pontuadas + 2 tarefas de produção','45道计分题＋2项表达任务','45 questions notées + 2 tâches d’expression'],
 ['About 35–50 minutes · untimed','Unos 35–50 minutos · sin límite de tiempo','Cerca de 35–50 minutos · sem limite de tempo','预计35–50分钟・不限时','Environ 35 à 50 minutes · sans limite de temps']
];
for(const [source,...values] of multilingualRows)['es','pt','zh','fr'].forEach((locale,i)=>{reviewedInterfaceCopy[locale][source]=values[i]});

for(const locale of ['es','pt','zh','fr'])Object.assign(reviewedInterfaceCopy[locale],multilingualReviewedCopy[locale]);

for(const locale of ['ja','es','pt','zh','fr'])Object.assign(reviewedInterfaceCopy[locale],reviewedCourseTitles[locale]);

for(const locale of Object.keys(reviewedExerciseInstructions))Object.assign(reviewedInterfaceCopy[locale],reviewedExerciseInstructions[locale]);

for(const locale of Object.keys(reviewedComprehensionOptions))Object.assign(reviewedInterfaceCopy[locale],reviewedComprehensionOptions[locale]);

for(const locale of Object.keys(journeyReviewedCopy))Object.assign(reviewedInterfaceCopy[locale],journeyReviewedCopy[locale]);

for(const locale of Object.keys(lessonClarityCopy))Object.assign(reviewedInterfaceCopy[locale],lessonClarityCopy[locale]);

for(const locale of Object.keys(approvedDesignCopy))Object.assign(reviewedInterfaceCopy[locale],approvedDesignCopy[locale]);

for(const locale of Object.keys(adventureCopy))Object.assign(reviewedInterfaceCopy[locale],adventureCopy[locale]);

for(const locale of Object.keys(companionBondCopy))Object.assign(reviewedInterfaceCopy[locale],companionBondCopy[locale]);

for(const locale of ['ko','id','ru','ar']){reviewedInterfaceCopy[locale]={};for(const [source,translations] of Object.entries(additionalDisplayCopy))if(translations[locale]){reviewedInterfaceCopy[locale][source]=translations[locale];reviewedInterfaceCopy[locale][source.trim()]??=translations[locale].trim();}for(const [source,translations] of Object.entries(displayLanguageSeed))if(translations[locale])reviewedInterfaceCopy[locale][source]=translations[locale];}

for(const [source,translations] of Object.entries(interfaceAuditCopy))for(const [locale,value] of Object.entries(translations)){const copy=reviewedInterfaceCopy[locale]??={};copy[source]??=value;copy[source.trim()]??=value.trim();}
for(const [source,translations] of Object.entries(interfaceAuditSeed))for(const [locale,value] of Object.entries(translations))(reviewedInterfaceCopy[locale]??={})[source]=value;
