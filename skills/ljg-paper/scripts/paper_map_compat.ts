// Compatibility shim for research records written before format version 3.
//
// The original edition carried a long alias table that renamed the fields of
// version 1 and 2 records onto their current names. Those legacy records only
// ever existed in the original edition, so this English edition starts at
// format version 3 and has nothing to rename.
//
// The export is kept so the validator's import stays stable, and so a real
// migration can be added here later if version 4 ever needs one.
export function normalizeLegacyMap(content: string): string {
  return content;
}
