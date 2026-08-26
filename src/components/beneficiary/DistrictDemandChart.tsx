import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { TrendingUp, BarChart2, Briefcase, Zap } from 'lucide-react';
import { Recommendation } from '../../types.js';

interface DistrictDemandChartProps {
  recommendations: Recommendation[];
  selectedRecIndex: number;
  onSelectRec: (index: number) => void;
  districtName?: string;
}

export const DistrictDemandChart: React.FC<DistrictDemandChartProps> = ({
  recommendations,
  selectedRecIndex,
  onSelectRec,
  districtName
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Track responsive width
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current || !recommendations || recommendations.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 20, right: 90, bottom: 35, left: 160 };
    const width = Math.max(containerWidth - margin.left - margin.right, 200);
    const barHeight = 44;
    const height = (recommendations || []).length * barHeight + margin.top + margin.bottom;

    svg.attr('width', containerWidth).attr('height', height);

    // Defs for gradients and glow filters
    const defs = svg.append('defs');

    // Selected Active Bar Gradient (Amber)
    const amberGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-amber-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    amberGrad.append('stop').attr('offset', '0%').attr('stop-color', '#d97706');
    amberGrad.append('stop').attr('offset', '100%').attr('stop-color', '#fbbf24');

    // Neutral Inactive Bar Gradient
    const neutralGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-neutral-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    neutralGrad.append('stop').attr('offset', '0%').attr('stop-color', '#2a2a2a');
    neutralGrad.append('stop').attr('offset', '100%').attr('stop-color', '#3f3f46');

    // Hover Bar Gradient
    const hoverGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-hover-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    hoverGrad.append('stop').attr('offset', '0%').attr('stop-color', '#3f3f46');
    hoverGrad.append('stop').attr('offset', '100%').attr('stop-color', '#52525b');

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale: 0 to 100 Demand Score
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);

    // Y Scale: Recommendations
    const yScale = d3
      .scaleBand()
      .domain((recommendations || []).map((_, idx) => idx.toString()))
      .range([0, (recommendations || []).length * barHeight])
      .padding(0.28);

    // Subtle background grid lines
    const gridTicks = [25, 50, 75, 100];
    chartGroup
      .append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(gridTicks)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', recommendations.length * barHeight)
      .attr('stroke', 'rgba(255, 255, 255, 0.06)')
      .attr('stroke-dasharray', '3,3');

    // Background Bar Track (Full width 100)
    chartGroup
      .selectAll('.bar-track')
      .data(recommendations)
      .enter()
      .append('rect')
      .attr('class', 'bar-track')
      .attr('y', (_, i) => yScale(i.toString()) || 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', width)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', 'rgba(255, 255, 255, 0.03)')
      .attr('stroke', 'rgba(255, 255, 255, 0.05)')
      .attr('stroke-width', 1);

    // Dynamic Foreground Demand Bars
    const bars = chartGroup
      .selectAll<SVGRectElement, Recommendation>('.demand-bar')
      .data(recommendations)
      .enter()
      .append('rect')
      .attr('class', 'demand-bar')
      .attr('y', (_, i) => yScale(i.toString()) || 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', 0) // start at 0 for entry animation
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('cursor', 'pointer')
      .attr('fill', (_, i) => {
        if (i === selectedRecIndex) return 'url(#d3-amber-gradient)';
        if (i === hoveredIndex) return 'url(#d3-hover-gradient)';
        return 'url(#d3-neutral-gradient)';
      })
      .attr('stroke', (_, i) =>
        i === selectedRecIndex ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'
      )
      .attr('stroke-width', (_, i) => (i === selectedRecIndex ? 1.5 : 1))
      .on('click', (_event, d) => {
        const clickedIdx = recommendations.indexOf(d);
        if (clickedIdx >= 0) {
          onSelectRec(clickedIdx);
        }
      })
      .on('mouseenter', function (_event, d) {
        const idx = recommendations.indexOf(d);
        setHoveredIndex(idx);
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 0.95);
      })
      .on('mouseleave', function () {
        setHoveredIndex(null);
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1);
      });

    // Animate bars on mount/update
    bars
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('width', (d: Recommendation) => xScale(Math.min(100, Math.max(10, d.economicDemand?.demandScore || 80))));

    // Left Y-Axis Labels (Role titles & NSQF Level)
    const yAxisGroup = chartGroup.append('g').attr('class', 'y-axis-labels');

    recommendations.forEach((rec, idx) => {
      const yPos = (yScale(idx.toString()) || 0) + yScale.bandwidth() / 2;
      const isSelected = idx === selectedRecIndex;

      // Group for each label
      const labelGroup = yAxisGroup
        .append('g')
        .attr('transform', `translate(-12, ${yPos})`)
        .attr('cursor', 'pointer')
        .on('click', () => onSelectRec(idx));

      // Truncate long title for neat layout
      const rawTitle = rec.qualificationPackTitle || `Role #${idx + 1}`;
      const displayTitle = rawTitle.length > 22 ? `${rawTitle.slice(0, 20)}...` : rawTitle;

      // Main role text
      labelGroup
        .append('text')
        .attr('text-anchor', 'end')
        .attr('dy', '-2')
        .attr('fill', isSelected ? '#fbbf24' : '#e4e4e7')
        .attr('font-size', '11px')
        .attr('font-weight', isSelected ? '700' : '500')
        .attr('font-family', 'ui-sans-serif, system-ui, sans-serif')
        .text(displayTitle);

      // Subtitle (NSQF Level & vacancies)
      labelGroup
        .append('text')
        .attr('text-anchor', 'end')
        .attr('dy', '11')
        .attr('fill', isSelected ? '#fef08a' : '#71717a')
        .attr('font-size', '9px')
        .attr('font-family', 'ui-monospace, monospace')
        .text(`NSQF L${rec.nsqfLevel} • ${rec.economicDemand?.estimatedVacancies || 20} openings`);
    });

    // Right-side Numeric Demand & Wage Labels
    recommendations.forEach((rec, idx) => {
      const score = rec.economicDemand?.demandScore || 85;
      const yPos = (yScale(idx.toString()) || 0) + yScale.bandwidth() / 2;
      const isSelected = idx === selectedRecIndex;

      const valGroup = chartGroup
        .append('g')
        .attr('transform', `translate(${width + 12}, ${yPos})`);

      // Score text
      valGroup
        .append('text')
        .attr('text-anchor', 'start')
        .attr('dy', '-2')
        .attr('fill', isSelected ? '#fbbf24' : '#a1a1aa')
        .attr('font-size', '12px')
        .attr('font-weight', '700')
        .attr('font-family', 'ui-monospace, monospace')
        .text(`${score}/100`);

      // Wage text
      valGroup
        .append('text')
        .attr('text-anchor', 'start')
        .attr('dy', '11')
        .attr('fill', '#10b981')
        .attr('font-size', '9px')
        .attr('font-family', 'ui-monospace, monospace')
        .text(`₹${((rec.economicDemand?.avgMonthlyWage || 14000) / 1000).toFixed(0)}k/mo`);
    });

    // Bottom X-Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues([0, 25, 50, 75, 100])
      .tickFormat(d => `${d}%`);

    const xAxisG = chartGroup
      .append('g')
      .attr('transform', `translate(0, ${recommendations.length * barHeight + 6})`)
      .call(xAxis);

    xAxisG.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.1)');
    xAxisG.selectAll('.tick line').attr('stroke', 'rgba(255, 255, 255, 0.1)');
    xAxisG
      .selectAll('.tick text')
      .attr('fill', 'rgba(255, 255, 255, 0.4)')
      .attr('font-size', '9px')
      .attr('font-family', 'ui-monospace, monospace');

    // X-Axis Axis Title
    chartGroup
      .append('text')
      .attr('x', width / 2)
      .attr('y', recommendations.length * barHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.35)')
      .attr('font-size', '9px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('letter-spacing', '0.05em')
      .text('DISTRICT DEMAND & ABSORPTION VIABILITY INDEX');

  }, [recommendations, selectedRecIndex, hoveredIndex, containerWidth]);

  const activeRec = recommendations[selectedRecIndex];

  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl p-5 mb-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-editorial-serif font-bold text-white text-sm flex items-center space-x-2">
              <span>Local District Job Demand (D3.js Market Viability)</span>
              <span className="bg-amber-500/15 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/30">
                {districtName || activeRec?.economicDemand?.district || 'Local District Hub'}
              </span>
            </h4>
            <p className="text-[11px] text-white/50 font-light">
              Comparative hiring intensity, wage absorption potential, and local MSME vacancy depth
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
            <span>Active Selection</span>
          </div>
          <div className="flex items-center space-x-1.5 text-white/40 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-700 inline-block"></span>
            <span>Alternative NSQF Matches</span>
          </div>
        </div>
      </div>

      {/* D3 Chart Canvas Container */}
      <div ref={containerRef} className="w-full mt-3 overflow-x-auto">
        <svg ref={svgRef} className="w-full select-none" />
      </div>

      {/* Market Viability Highlights Row */}
      {activeRec && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/5">
          <div className="bg-[#181818] p-2.5 rounded-lg border border-white/5 flex items-center space-x-2.5">
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white/40 text-[10px] block font-mono">DISTRICT ABSORPTION</span>
              <span className="text-white font-medium">{activeRec.economicDemand?.demandScore || 85}% High Demand Trend</span>
            </div>
          </div>

          <div className="bg-[#181818] p-2.5 rounded-lg border border-white/5 flex items-center space-x-2.5">
            <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white/40 text-[10px] block font-mono">LOCAL HIRING DEPTH</span>
              <span className="text-emerald-300 font-medium">{activeRec.economicDemand?.estimatedVacancies || 20} Active Openings</span>
            </div>
          </div>

          <div className="bg-[#181818] p-2.5 rounded-lg border border-white/5 flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white/40 text-[10px] block font-mono">ENTRY WAGE BENCHMARK</span>
              <span className="text-amber-300 font-medium">₹{(activeRec.economicDemand?.avgMonthlyWage || 14000).toLocaleString('en-IN')}/month</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
