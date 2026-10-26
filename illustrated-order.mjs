// Stable presentation order; lesson/chapter identifiers and saved records stay intact.
export function finalSummaryLast(items,isSummary){return items.filter(x=>!isSummary(x)).concat(items.filter(isSummary));}
