export interface CircleLoaderInterface {
    getSvg(): SVGElement;
    getSvgLoader(): SVGElement;
}
export declare class CircleLoader implements CircleLoaderInterface {
    svg: SVGElement;
    svgLoader: SVGElement;
    path: SVGElement;
    linear: SVGLinearGradientElement;
    strokeColor: string;
    strokeWidth: number;
    height: number;
    width: number;
    radius: number;
    svgNamespace: "http://www.w3.org/2000/svg";
    startAngle: number;
    startPoint: {
        x: number;
        y: number;
    };
    maxPoint: {
        x: number;
        y: number;
    };
    maxAngle: number;
    centerX: number;
    centerY: number;
    constructor(strokeColor?: string, strokeWidth?: number, startAngle?: number);
    getSvg(): SVGElement;
    getSvgLoader(): SVGElement;
    renderLoader(): void;
    render(): void;
    configSvgAttrs(svg: SVGElement): void;
    createLinear(): void;
    createSvg(): void;
    createPath(): void;
    getPoint(angle: number): {
        x: number;
        y: number;
    };
    drawSrcByPercent(p: number): void;
    drawSrc(totalAngle: number): void;
}
