// Authored sentences mark the exact teaching chunk in [brackets]. Alternatives
// are authored explicitly, never manufactured by changing a word's ending.
export function examples(text){return text.trim().split('\n').map(line=>{const [text,meaning,alternatives,gloss]=line.split('~'),wrong=alternatives?.split(';');if(!text?.includes('[')||!meaning||wrong?.length!==2||wrong.some(x=>!x))throw Error('Incomplete authored example: '+line);return {text,meaning,wrong,...(gloss?{gloss}:{})};});}
export const u=(title,rule,pitfall,models,transfer)=>({title,rule,pitfall,models:examples(models),transfer:examples(transfer)});
