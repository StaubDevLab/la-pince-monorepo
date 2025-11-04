declare const budgetFrequencyEnum: readonly ["weekly", "biweekly", "monthly", "quarterly", "yearly"];
type BudgetFrequency = typeof budgetFrequencyEnum[number];
export declare function getClosestFrequency(value: number): BudgetFrequency;
export {};
