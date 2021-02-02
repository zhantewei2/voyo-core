export class CircleLoader {
    constructor(strokeColor = "var(--color-primary)", strokeWidth = 8, startAngle = 0) {
        this.strokeWidth = 8;
        this.height = 100;
        this.width = 100;
        this.radius = 30;
        this.svgNamespace = "http://www.w3.org/2000/svg";
        this.maxAngle = Math.PI * 1.99;
        this.centerX = 50;
        this.centerY = 50;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.startAngle = startAngle;
    }
    getSvg() {
        return this.svg;
    }
    getSvgLoader() {
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
    configSvgAttrs(svg) {
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
        const dict = {
            "stroke-linecap": "round",
            stroke: "url(#loader-linearGradient)",
            "stroke-width": this.strokeWidth + "",
            fill: "none",
        };
        for (let i in dict) {
            this.path.setAttribute(i, dict[i]);
        }
    }
    getPoint(angle) {
        return {
            x: Math.cos(angle) * this.radius + this.centerX,
            y: Math.sin(angle) * this.radius + this.centerY,
        };
    }
    drawSrcByPercent(p) {
        this.drawSrc(p * Math.PI * 2);
    }
    drawSrc(totalAngle) {
        if (!this.startPoint)
            this.startPoint = this.getPoint(this.startAngle);
        const endPoint = this.getPoint(this.startAngle + totalAngle);
        const d = `M${this.startPoint.x},${this.startPoint.y} 
    ${totalAngle < Math.PI * 2
            ? `A${this.radius},${this.radius} 0 ${totalAngle < Math.PI ? 0 : 1} 1 ${endPoint.x} ${endPoint.y}`
            : `A${this.radius},${this.radius} 0 1 1 ${this.maxPoint.x} ${this.maxPoint.y}`}
    `;
        this.path.setAttribute("d", d);
    }
}
