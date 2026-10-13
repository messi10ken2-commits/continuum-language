// Only explanatory columns may be translated. Conjugated forms, pronouns and
// examples are target-language learning material and remain unchanged.
export const isInstructionalColumn=header=>/^(Type|Purpose|Function|Meaning|Focus|Interpretation|Time order|Reason|Difference|Time|Strength|Appropriate interpretation|Reference|Use|Usage|English|Translation|Ending sound)$/i.test(header);
