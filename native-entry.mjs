import {initializeNative} from './native-runtime.mjs';
import {SplashScreen} from '@capacitor/splash-screen';
try{await initializeNative();await import('./main.jsx');}
catch(error){
 console.error('Continuum native startup failed:',error?.name,error?.message);
 const copy={en:['Unable to start the app.','Try again'],ja:['アプリを起動できません。','もう一度試す'],es:['No se puede iniciar la app.','Reintentar'],pt:['Não foi possível iniciar o aplicativo.','Tentar novamente'],zh:['无法启动应用。','重试'],fr:['Impossible de démarrer l’application.','Réessayer'],ko:['앱을 시작할 수 없습니다.','다시 시도'],id:['Aplikasi tidak dapat dimulai.','Coba lagi'],ru:['Не удалось запустить приложение.','Повторить'],ar:['تعذّر تشغيل التطبيق.','المحاولة مجددًا']};
 const text=copy[localStorage.getItem('continuumInterfaceLanguage')]||copy.en,root=document.getElementById('root'),message=document.createElement('p'),retry=document.createElement('button');message.textContent=text[0];retry.textContent=text[1];retry.onclick=()=>location.reload();root.replaceChildren(message,retry);
}
finally{await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));await SplashScreen.hide().catch(()=>{});}
