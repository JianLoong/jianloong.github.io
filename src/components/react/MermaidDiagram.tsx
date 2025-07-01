'use client';

import React from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
    chart: string;
    title?: string;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

const getId = () => `mermaid-${Math.random().toString(36).substr(2, 9)}`;

export default function MermaidDiagram({
    chart,
    title,
    className = '',
    align = 'center'
}: MermaidDiagramProps) {
    const elementRef = React.useRef<HTMLDivElement>(null);
    const [id] = React.useState(getId);

    const renderDiagram = React.useCallback(async () => {
        if (!elementRef.current) return;

        try {
            // Get current theme
            const theme = document?.documentElement?.getAttribute('data-theme') === 'light' ? 'forest' : 'dark';

            // Initialize with current theme
            await mermaid.initialize({
                startOnLoad: false,
                theme: theme as 'forest' | 'dark',
                fontFamily: '"Fira Code", monospace',
                securityLevel: 'loose',
                htmlLabels: true,
                fontSize: 16,
                themeVariables: {
                    fontSize: '16px',
                    fontFamily: '"Fira Code", monospace',
                    diagramPadding: 16
                },
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                }
            });

            // Render to SVG
            const { svg } = await mermaid.render(id, chart);
            if (elementRef.current) {
                elementRef.current.innerHTML = svg;

                // Find the SVG element and ensure it's responsive
                const svgElement = elementRef.current.querySelector('svg');
                if (svgElement) {
                    // Remove inline width/height from SVG
                    svgElement.removeAttribute('width');
                    svgElement.removeAttribute('height');
                    // Add viewBox if it doesn't exist
                    if (!svgElement.getAttribute('viewBox')) {
                        const box = svgElement.getBBox();
                        svgElement.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
                    }
                    // Apply responsive styling
                    svgElement.style.width = '100%';
                    svgElement.style.height = '100%';
                    svgElement.style.display = 'block';
                    svgElement.style.margin = '0 auto';
                    svgElement.style.maxHeight = '85vh';
                    svgElement.style.padding = '1rem';
                }
            }
        } catch (error) {
            console.error('Error rendering diagram:', error);
            if (elementRef.current) {
                elementRef.current.innerHTML = 'Error rendering diagram';
            }
        }
    }, [chart, id]);

    // Initial render and theme changes
    React.useEffect(() => {
        renderDiagram();

        const observer = new MutationObserver(() => {
            renderDiagram();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, [renderDiagram]);

    return (
        <div className={`mermaid-wrapper text-${align} ${className}`}>
            {title && <h4 className={`diagram-title text-${align} mb-8`}>{title}</h4>}
            <div className="mermaid-container mx-auto mt-8 mb-12 w-full max-w-3xl">
                <div className="diagram-aspect-wrapper relative w-full" style={{ minHeight: "300px" }}>
                    <div ref={elementRef} className="mermaid w-full h-full" />
                </div>
            </div>
        </div>
    );
}
