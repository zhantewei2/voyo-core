export declare type Position = "top" | "left" | "right" | "bottom";
export declare class RelativeFixed {
    /**
     *
     * @param space dropdown 离按钮的间距
     * @param dis 浏览器边的间距
     */
    constructor(space?: number, dis?: number);
    space: number;
    dis: number;
    relativePosition(targetEl: HTMLElement, relativeEl: HTMLElement, position?: "top" | "left" | "right" | "bottom"): {
        "top": number;
        "left": number;
    };
    /**
     *
     * @param {"top"|"left"|"right"|"bottom"} position
     * @param obj
     * @param adjust
     */
    switchPosition(position: "top" | "left" | "right" | "bottom", obj: any, adjust?: boolean): {
        "top": number;
        "left": number;
    };
}
