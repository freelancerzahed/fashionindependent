export type Gender = 'male' | 'female' | 'all';

export interface ReconciliationRule {
  target: string;
  gender: Gender;
  condition: string | ((values: Record<string, number>) => boolean);
  outcome: string | ((values: Record<string, number>) => Partial<Record<string, number>>);
  description?: string;  // Documentation of what the rule does
}

export interface ParsedOutcome {
  type: 'min' | 'max' | 'value';
  value: number;
}