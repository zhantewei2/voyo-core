export interface CircleLoaderInterface {
  getSvg(): SVGElement;
  getSvgLoader(): SVGElement;
}

export class CircleLoader implements CircleLoaderInterface {
  svg: SVGElement;
  svgLoader: SVGElement;
  path: SVGElement;
  linear: SVGLinearGradientElement;
  strokeColor: string;
  strokeWidth = 8;
  height = 100;
  width = 100;
  radius = 30;
  svgNamespace: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";
  startAngle: number;
  startPoint: { x: number; y: number };
  maxPoint: { x: number; y: number };
  maxAngle = Math.PI * 1.99;
  centerX = 50;
  centerY = 50;
  constructor(
    strokeColor = "var(--color-primary)",
    strokeWidth = 8,
    startAngle = 0,
  ) {
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.startAngle = startAngle;
  }
  getSvg(): SVGElement {
    return this.svg;
  }
  getSvgLoader(): SVGElement {
    return this.svgLoader;
  }

  renderLoader() {
    this.svgLoader = document.createElementNS(this.svgNamespace, "svg");
    this.configSvgAttrs(this.svgLoader);
    this.svgLoader.innerHTML = `
<circle cx="${this.centerX}" cy="${this.centerY}" r="${this.radius}" stroke-width="${this.strokeWidth}" 
    fill="none" stroke-linecap="round" 
    stroke="url(#loader-linearGradient)"
 >
    <animateTransform
        keyTime="0;1"
        dur="1s"
        attributeName="transform"
        type="rotate"
        values="0 50 50;360 50 50"
        repeatCount="indefinite"
     ></animateTransform> 
</circle>
<linearGradient id="loader-linearGradient" spreadMethod="reflect">
  <stop stop-color="var(--color-primary)" offset="0"></stop>
  <stop stop-color="var(--color-primary-gentle)" offset="1"></stop>
</linearGradient>
    `;
  }
  render() {
    this.createSvg();
    this.createPath();
    this.createLinear();
    this.svg.appendChild(this.path);
    this.svg.appendChild(this.linear);
    this.startPoint = this.getPoint(this.startAngle);
    this.maxPoint = this.getPoint(this.startAngle + this.maxAngle);

    this.renderLoader();
  }
  configSvgAttrs(svg: SVGElement) {
    svg.setAttribute("width", `${this.width}`);
    svg.setAttribute("height", `${this.height}`);
    svg.setAttribute("viewBox", `0 0 ${this.height} ${this.width}`);
  }
  createLinear() {
    this.linear = document.createElementNS(this.svgNamespace, "linearGradient");
    this.linear.id = "loader-linearGradient";
    this.linear.setAttribute("spreadMethod", "reflect");
    this.linear.innerHTML = `
  <stop stop-color="var(--color-primary)" offset="0"></stop>
  <stop stop-color="var(--color-primary-gentle)" offset="1"></stop>
    `;
  }
  createSvg() {
    this.svg = document.createElementNS(this.svgNamespace, "svg");
    this.configSvgAttrs(this.svg);
  }
  createPath() {
    this.path = document.createElementNS(this.svgNamespace, "path");
    const dict: Record<string, string> = {
      "stroke-linecap": "round",
      stroke: "url(#loader-linearGradient)",
      "stroke-width": this.strokeWidth + "",
      fill: "none",
    };
    for (let i in dict) {
      this.path.setAttribute(i, dict[i]);
    }
  }
  getPoint(angle: number): { x: number; y: number } {
    return {
      x: Math.cos(angle) * this.radius + this.centerX,
      y: Math.sin(angle) * this.radius + this.centerY,
    };
  }
  drawSrcByPercent(p: number) {
    this.drawSrc(p * Math.PI * 2);
  }
  drawSrc(totalAngle: number) {
    if (!this.startPoint) this.startPoint = this.getPoint(this.startAngle);
    const endPoint = this.getPoint(this.startAngle + totalAngle);
    const d = `M${this.startPoint.x},${this.startPoint.y} 
    ${
      totalAngle < Math.PI * 2
        ? `A${this.radius},${this.radius} 0 ${totalAngle < Math.PI ? 0 : 1} 1 ${
            endPoint.x
          } ${endPoint.y}`
        : `A${this.radius},${this.radius} 0 1 1 ${this.maxPoint.x} ${this.maxPoint.y}`
    }
    `;
    this.path.setAttribute("d", d);
  }
}
