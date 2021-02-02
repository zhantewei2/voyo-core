/**
 * 杨辉三角计算
 * @param n
 * @param iv
 */
export declare const pt: (n: number, iv: number) => number;
/**
 * 多次贝塞尔
 * @param points
 */
export declare const bezier: (points: number[]) => (t: number) => number;
export declare const bezierTwice: (x0: number, x1: number, x2: number) => (t: number) => number;
export declare const bezierCube: (x0: number, x1: number, x2: number, x3: number) => (t: number) => number;
export interface BezierCoorParams {
    x: number;
    y: number;
}
export declare const bezierCoor: (points: BezierCoorParams[]) => (t: number) => BezierCoorParams;
export declare const bezierCoorTwice: ({ x: x1, y: y1 }: BezierCoorParams, { x: x2, y: y2 }: BezierCoorParams, { x: x3, y: y3 }: BezierCoorParams) => (t: number) => BezierCoorParams;
