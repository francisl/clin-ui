import { ArrangerEdge } from "store/graphql/models";
import { ConsequenceEntity } from "store/graphql/variants/models";

const keyNoSymbol = "noSymbol_";

/*
 * Algorithm:
 *   Input: consequences
 *   #=====#
 *   - IF consequence has NO gene (symbol) then keep it;
 *   - IF consequence has multiple symbols, then keep one consequence per symbol.
 *   - IF consequence has a symbol filter accordingly to these rules:
 *      for a given symbol,
 *        find consequence with highest score s
 *        IF multiple consequences with same score s then find the one that is canonical
 *          IF canonical does not exist then grab whatever consequence with score s.
 *   #=====#
 *   Output: filtered consequences.
 * */
export const filterThanSortConsequencesByImpact = (
  consequences: ArrangerEdge<ConsequenceEntity>[]
) => {
  if (!consequences || consequences.length === 0) {
    return [];
  }
  return consequences
    .filter((c) => c.node?.impact_score !== null)
    .map((c) => ({ ...c }))
    .sort(
      (a, b) =>
        b.node.impact_score! - a.node.impact_score! ||
        +b.node.canonical! - +a.node.canonical!
    );
};
type SymbolToConsequences = {
  [key: string]: ArrangerEdge<ConsequenceEntity>[];
};

export const generateConsequencesDataLines = (
  rawConsequences: ArrangerEdge<ConsequenceEntity>[] | null
): ArrangerEdge<ConsequenceEntity>[] => {
  if (!rawConsequences || rawConsequences.length === 0) {
    return [];
  }

  const symbolToConsequences: SymbolToConsequences =
    rawConsequences.reduce<SymbolToConsequences>(
      (
        dict: SymbolToConsequences,
        consequence: ArrangerEdge<ConsequenceEntity>
      ) => {
        const keyForCurrentConsequence =
          consequence.node?.symbol || keyNoSymbol;
        const oldConsequences = dict[keyForCurrentConsequence] || [];
        return {
          ...dict,
          [keyForCurrentConsequence]: [...oldConsequences, { ...consequence }],
        };
      },
      {}
    );

  return Object.entries(symbolToConsequences).reduce(
    (acc: ArrangerEdge<ConsequenceEntity>[], [key, consequences]) => {
      // no gene then show
      if (key === keyNoSymbol) {
        return [...acc, ...consequences];
      }

      const highestRanked =
        filterThanSortConsequencesByImpact(consequences)[0] || {};
      return [...acc, { ...highestRanked }];
    },
    []
  );
};
