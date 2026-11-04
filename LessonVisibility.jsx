import {createContext,useContext} from 'react';
export const LessonVisibility=createContext(true);
export const useLessonVisible=()=>useContext(LessonVisibility);
