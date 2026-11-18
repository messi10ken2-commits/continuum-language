import {Capacitor,registerPlugin} from '@capacitor/core';
import {App} from '@capacitor/app';import {Browser} from '@capacitor/browser';
import {Network} from '@capacitor/network';import {Keyboard} from '@capacitor/keyboard';
import {StatusBar,Style} from '@capacitor/status-bar';
import {Haptics,NotificationType} from '@capacitor/haptics';
import {LocalNotifications} from '@capacitor/local-notifications';
import {createNativeFetch} from './native-transport.mjs';
import './native-ios.css';
export const Native=registerPlugin('ContinuumNative');
export const isNative=()=>Capacitor.isNativePlatform();
export async function initializeNative(){
 if(!isNative())return;
 document.documentElement.classList.add('continuum-native');
 const origin=__CONTINUUM_API_ORIGIN__;
 window.fetch=createNativeFetch({origin,fetchImpl:window.fetch.bind(window),vault:Native,assetRoots:__CONTINUUM_REMOTE_ROOTS__,allowsAI:id=>!!id&&localStorage.getItem('continuumNativeAIConsent:v1:'+id)==='yes',onExpired:()=>window.dispatchEvent(new Event('continuum-session-expired'))});
 if(navigator.mediaDevices?.getUserMedia){const capture=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async constraints=>{if(constraints.audio)await Native.prepareAudio();return capture(constraints);};}
 await Native.addListener('audioInterrupted',()=>{window.dispatchEvent(new Event('pagehide'));void Native.releaseAudio().catch(()=>{});});
 // Beacon's cookie-only transport is inappropriate for Keychain bearer sessions.
 navigator.sendBeacon=(url,data)=>{if(!String(url).startsWith('/api/'))return false;void fetch(url,{method:'POST',body:data,keepalive:true}).catch(()=>{});return true;};
 const network=await Network.getStatus();document.documentElement.classList.toggle('native-offline',!network.connected);
 await Network.addListener('networkStatusChange',s=>{document.documentElement.classList.toggle('native-offline',!s.connected);window.dispatchEvent(new Event(s.connected?'online':'offline'));});
 await App.addListener('appStateChange',({isActive})=>{
  document.documentElement.classList.toggle('native-inactive',!isActive);
  window.dispatchEvent(new Event('continuum-native-visibility'));
  if(!isActive){void Native.releaseAudio().catch(()=>{});document.querySelectorAll('audio,video').forEach(e=>e.pause());window.dispatchEvent(new Event('pagehide'));}
  else{window.dispatchEvent(new Event('focus'));window.dispatchEvent(new Event('continuum-native-resume'));}
 });
 await Keyboard.addListener('keyboardWillShow',()=>document.documentElement.classList.add('native-keyboard-open'));
 await Keyboard.addListener('keyboardDidShow',()=>{
  const form=document.activeElement?.closest?.('.account-box form');
  const submit=form?.querySelector('button.primary');
  if(submit)requestAnimationFrame(()=>submit.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'}));
 });
 await Keyboard.addListener('keyboardWillHide',()=>document.documentElement.classList.remove('native-keyboard-open'));
 await LocalNotifications.addListener('localNotificationActionPerformed',event=>{const section=event.notification.extra?.section;if(section==='learn')window.dispatchEvent(new CustomEvent('continuum-native-navigation',{detail:section}));});
 await App.addListener('appUrlOpen',({url})=>{
  const value=new URL(url);if(value.protocol!=='continuum-dev:')return;
  if(value.hostname==='reset'){const token=value.searchParams.get('token');if(/^[A-Za-z0-9_-]{43}$/.test(token||''))location.href='/?reset_token='+encodeURIComponent(token);return;}
  if(value.hostname!=='open')return;
  const section=value.searchParams.get('section');if(['account','support','classes','learn'].includes(section))window.dispatchEvent(new CustomEvent('continuum-native-navigation',{detail:section}));
 });
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');if(!link)return;const url=new URL(link.href,location.href);
  if(url.protocol==='capacitor:'&&url.pathname==='/privacy-settings'){event.preventDefault();window.dispatchEvent(new Event('continuum-native-privacy'));return;}
  if(['https:','http:','mailto:','tel:'].includes(url.protocol)||['/terms','/privacy','/support','/visual-credits.html'].includes(url.pathname)){
   event.preventDefault();const address=url.protocol==='capacitor:'?origin+url.pathname:url.href;
   if(address.startsWith('https:'))void Browser.open({url:address});else if(['mailto:','tel:'].includes(url.protocol))location.href=url.href;
  }
 });
 window.addEventListener('continuum-lesson-completed',()=>void Haptics.notification({type:NotificationType.Success}));
 await StatusBar.setStyle({style:Style.Light}).catch(()=>{});
 let darkStatus=false;
 const updateStatus=()=>{const room=document.querySelector('.immersive-conversation-room'),dark=!!room&&room.getBoundingClientRect().height>0;if(dark!==darkStatus){darkStatus=dark;void StatusBar.setStyle({style:dark?Style.Dark:Style.Light}).catch(()=>{});}};
 new MutationObserver(updateStatus).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
}
