import React, { useEffect, useRef } from 'react';

export interface VoronoiIslandProps {
  width?: number;
  height?: number;
  points?: number;
  interactive?: boolean;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;
const DEFAULT_POINTS = 30;

export default function VoronoiIsland({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  points = DEFAULT_POINTS,
  interactive = true,
}: VoronoiIslandProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    let d3: any, Delaunay: any;
    let svg: any;

    // Helper to load a script from CDN
    function loadScript(src: string) {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    }

    async function loadD3() {
      await loadScript('https://unpkg.com/d3@5.12.0/dist/d3.min.js');
      await loadScript('https://unpkg.com/d3-delaunay@5.3.0/dist/d3-delaunay.min.js');
      d3 = (window as any).d3;
      Delaunay = (window as any).d3.Delaunay;
    }

    function drawVoronoi() {
      if (!isMounted || !containerRef.current || !d3 || !Delaunay) return;
      // Clear previous SVG
      containerRef.current.innerHTML = '';

      const w = width;
      const h = height;
      const n = points;
      const circles = d3.range(n).map(() => [Math.random() * w, Math.random() * h]);
      const delaunay = Delaunay.from(circles);
      const voronoi = delaunay.voronoi([0, 0, w, h]);

      svg = d3.select(containerRef.current)
        .append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`)
        .attr('width', w)
        .attr('height', h)
        .style('display', 'block');

      // Theme-aware colors using Tailwind classes
      const strokeClass = 'stroke-gray-300 dark:stroke-gray-700';
      const pointClass = 'fill-black dark:fill-white';
      const highlightClass = 'fill-red-600 dark:fill-red-500';
      const neighborClass = 'fill-blue-600 dark:fill-blue-400';

      svg.append('path')
        .attr('class', `fill-none ${strokeClass}`)
        .attr('stroke-width', 5)
        .attr('d', voronoi.render());

      svg.append('path')
        .attr('class', `fill-none ${strokeClass}`)
        .attr('stroke-width', 5)
        .attr('d', voronoi.renderBounds());

      svg.append('path')
        .attr('class', `${pointClass} ${strokeClass}`)
        .attr('stroke-width', 2)
        .attr('d', delaunay.renderPoints());

      // Interactivity
      if (interactive) {
        svg.on('click', function (this: any) {
          const coords = d3.mouse(this);
          // Remove all cell highlights
          svg.selectAll("[class^='cell-']").remove();
          const ans = delaunay.find(coords[0], coords[1]);
          // Highlight selected cell
          svg.append('path')
            .attr('class', `cell-${ans} ${highlightClass} ${strokeClass}`)
            .attr('stroke-width', 1)
            .attr('d', voronoi.renderCell(ans));
          // Redraw points on top
          svg.append('path')
            .attr('class', `${pointClass} ${strokeClass}`)
            .attr('stroke-width', 2)
            .attr('d', delaunay.renderPoints());
          // Highlight neighbors
          const neighbours = delaunay.neighbors(ans);
          for (const iterator of neighbours) {
            svg.append('path')
              .attr('class', `cell-${iterator} ${neighborClass} ${strokeClass}`)
              .attr('stroke-width', 1)
              .attr('d', voronoi.renderCell(iterator));
          }
        });
      }
    }

    loadD3().then(drawVoronoi);

    return () => {
      isMounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [width, height, points, interactive]);

  return (
    <div
      className="flex items-center justify-center w-full"
      style={{
        height: height,
        minHeight: height,
      }}
    >
      <div ref={containerRef} style={{ width: width, height: height }} />
    </div>
  );
} 