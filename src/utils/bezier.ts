/**
 * 杨辉三角计算
 * @param n
 * @param iv
 */
// @ts-ignore
export const pt = (n: number, iv: number): number => {
  if (n <= 0) return 0;
  const arr = new Array(n + 1);
  arr[0] = [1];
  let preRow;
  let currentRow;
  for (let i = 1; i <= n; i++) {
    preRow = arr[i - 1];
    currentRow = arr[i] = new Array(i + 1);
    if (n !== i) {
      for (let j = 0; j <= i; j++) {
        currentRow[j] = (preRow[j - 1] || 0) + (preRow[j] || 0);
      }
    } else {
      return (preRow[iv - 1] || 0) + (preRow[iv] || 0);
    }
  }
};
/**
 * 多次贝塞尔
 * @param points
 */
export const bezier = (points: number[]) => (t: number): number => {
  let result = 0;
  const n = points.length - 1;
  points.forEach((p, index) => {
    result +=
      pt(n, index) *
      points[index] *
      Math.pow(1 - t, n - index) *
      Math.pow(t, index);
  });
  return result;
};
// 1=>t>=0
export const bezierTwice = (x0: number, x1: number, x2: number) => (
  t: number,
): number => {
  return (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * x1 + t * t * x2;
};
export const bezierCube = (x0: number, x1: number, x2: number, x3: number) => (
  t: number,
): number => {
  return (
    Math.pow(1 - t, 3) * x0 +
    3 * x1 * t * Math.pow(1 - t, 2) +
    3 * t * t * x2 * (1 - t) +
    x3 * t * t * t
  );
};

export interface BezierCoorParams {
  x: number;
  y: number;
}

export const bezierCoor = (points: BezierCoorParams[]) => {
  const xList: number[] = [];
  const yList: number[] = [];
  points.forEach(({ x, y }) => {
    xList.push(x);
    yList.push(y);
  });
  const xBezier = bezier(xList);
  const yBezier = bezier(yList);

  return (t: number): BezierCoorParams => {
    return {
      x: xBezier(t),
      y: yBezier(t),
    };
  };
};

export const bezierCoorTwice = (
  { x: x1, y: y1 }: BezierCoorParams,
  { x: x2, y: y2 }: BezierCoorParams,
  { x: x3, y: y3 }: BezierCoorParams,
) => {
  const xBezierTwice = bezierTwice(x1, x2, x3);
  const yBezierTwice = bezierTwice(y1, y2, y3);
  return (t: number): BezierCoorParams => {
    return {
      x: xBezierTwice(t),
      y: yBezierTwice(t),
    };
  };
};
