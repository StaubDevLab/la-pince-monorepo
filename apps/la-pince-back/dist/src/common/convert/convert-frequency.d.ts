import { ManipulateType } from 'dayjs';
type BudgetFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
export declare function convertFrequencyToDayjsPeriod(frequency: BudgetFrequency | number): {
    value: number;
    unit: ManipulateType;
};
export {};
