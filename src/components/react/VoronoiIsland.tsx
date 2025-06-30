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

      // Theme-aware colors
      const isDark = document.body.className.includes('dark');
      const strokeColor = isDark ? '#444' : '#ccc';
      const pointColor = isDark ? '#fff' : '#000';
      // const backgroundColor = isDark ? '#1a1a1a' : '#fff';

      svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', 5)
        .attr('d', voronoi.render());

      svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', 5)
        .attr('d', voronoi.renderBounds());

      svg.append('path')
        .attr('fill', pointColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 2)
        .attr('d', delaunay.renderPoints());

      // Interactivity
      if (interactive) {
        svg.on('click', function(this: any) {
          const coords = d3.mouse(this);
          // Remove all cell highlights
          svg.selectAll("[class^='cell-']").remove();
          const ans = delaunay.find(coords[0], coords[1]);
          // Highlight selected cell
          svg.append('path')
            .attr('class', `cell-${ans}`)
            .attr('fill', isDark ? '#f56565' : '#e53e3e')
            .attr('stroke', strokeColor)
            .attr('stroke-width', 1)
            .attr('d', voronoi.renderCell(ans));
          // Redraw points on top
          svg.append('path')
            .attr('fill', pointColor)
            .attr('stroke', strokeColor)
            .attr('stroke-width', 2)
            .attr('d', delaunay.renderPoints());
          // Highlight neighbors
          const neighbours = delaunay.neighbors(ans);
          for (const iterator of neighbours) {
            svg.append('path')
              .attr('class', `cell-${iterator}`)
              .attr('fill', isDark ? '#4299e1' : '#3182ce')
              .attr('stroke', strokeColor)
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
      className="voronoi-container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: height,
        minHeight: height,
      }}
    >
      <div ref={containerRef} style={{ width: width, height: height }} />
    </div>
  );
} 