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

export default function MermaidDiagram({ chart, title, className = '', align = 'center' }: MermaidDiagramProps) {
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
                securityLevel: 'loose'
            });

            // Render to SVG
            const { svg } = await mermaid.render(id, chart);
            if (elementRef.current) {
                elementRef.current.innerHTML = svg;
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
            {title && <h4 className={`diagram-title text-${align} mb-4`}>{title}</h4>}
            <div className="mermaid-container inline-block">
                <div ref={elementRef} className="mermaid" />
            </div>
        </div>
    );
}
