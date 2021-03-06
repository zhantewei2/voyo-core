/**
 * @reset clearBack
 * @to touchMove animation
 * @touchMove touchMove move distance
 * @toIndex carousel by index
 */
export declare type MoveChangeType = "reset" | "to" | "touchMove" | "toIndex";
export interface MoveChangeParams {
    v: number;
    relativeV: number;
    type: MoveChangeType;
}
