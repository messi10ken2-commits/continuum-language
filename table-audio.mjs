// Authored grammatical descriptions are translated labels, not speech models.
const annotations=new Set(['Polite negative','Object','Action location','Specific time','Routine time','usually no particle','Future context','nonpast verb','Group 1','Group 2','Group 1 exception to the ending clue','Irregular','Exception','Dated past','Past premise','Confirmed','Reasoned inference','Possibility','Conclusion withheld','Caution','Not automatic','Concession','Contrast','conditional','plan: eu / nós']);
export const tableAnnotation=text=>annotations.has(text);
export const descriptionColumn=h=>/^(Type|Purpose|Function|Meaning|Focus|Interpretation|Time order|Reason|Difference|Time|Strength|Appropriate interpretation|Reference|Use|Usage|English|Translation|Ending sound|Status)$/i.test(h);
