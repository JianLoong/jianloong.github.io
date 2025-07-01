'use client';

import React from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
    chart: string;
    title?: string;
    className?: string;
}

function useMermaidInit() {
    React.useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: document?.documentElement?.getAttribute('data-theme') === 'light' ? 'forest' : 'dark',
            fontFamily: '"Fira Code", monospace',
            securityLevel: 'loose'
        });
    }, []);
}

export default function MermaidDiagram({ chart, title, className = '' }: MermaidDiagramProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    useMermaidInit();

    React.useEffect(() => {
        if (!containerRef.current) return;

        const renderDiagram = async () => {
            try {
                await mermaid.run();
            } catch (err) {
                console.error('Error rendering Mermaid diagram:', err);
                if (containerRef.current) {
                    containerRef.current.innerHTML = 'Error rendering diagram';
                }
            }
        };

        renderDiagram();

        // Watch for theme changes
        const observer = new MutationObserver(() => {
            mermaid.initialize({
                theme: document?.documentElement?.getAttribute('data-theme') === 'light' ? 'forest' : 'dark'
            });
            renderDiagram();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, [chart]);

    return (
        <div className={`mermaid-wrapper ${className}`}>
            {title && <h4 className="diagram-title">{title}</h4>}
            <div ref={containerRef} className="mermaid">
                {chart}
            </div>
        </div>
    );
}
