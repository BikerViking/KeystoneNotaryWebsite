import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDebugFlag } from '../hooks/useDebugFlag';

type Metric = {
  id: string;
  top: number;
  left?: number;
  width?: number;
  height: number;
  progress?: number;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const computeProgress = (top: number, height: number, vh: number) => {
  const scrollable = Math.max(1, height - vh);
  const amount = -top; // how far the top has moved past the viewport top
  return clamp01(amount / scrollable);
};

const DebugOverlay: React.FC = () => {
  const debug = useDebugFlag();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [fps, setFps] = useState(0);
  const [avgFps, setAvgFps] = useState(0);
  const [maxFrameMs, setMaxFrameMs] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollVel, setScrollVel] = useState(0);
  const [running, setRunning] = useState(true);
  const [showTrace, setShowTrace] = useState(true);
  const [showBoxes, setShowBoxes] = useState(false);
  const [timeScale, setTimeScale] = useState<number>(() => (typeof window !== 'undefined' && typeof window.__DEBUG_TIME_SCALE__ === 'number') ? window.__DEBUG_TIME_SCALE__! : 1);
  const [marks, setMarks] = useState<number[]>([]);
  const [showHover, setShowHover] = useState(false);
  const [pointer, setPointer] = useState<{clientX:number; clientY:number; pageX:number; pageY:number}>({clientX:0, clientY:0, pageX:0, pageY:0});
  const [hoverInfo, setHoverInfo] = useState<{desc:string; top:number; left:number; width:number; height:number; attrs:Record<string,string>}>();
  const overlayRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const buildSelector = (el: Element | null): string => {
    if (!el) return '';
    // Prefer id if present
    if ((el as HTMLElement).id) return `#${(el as HTMLElement).id}`;
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && parts.length < 6 && node.nodeType === 1 && (node as HTMLElement).tagName.toLowerCase() !== 'html') {
      const tag = (node as HTMLElement).tagName.toLowerCase();
      const id = (node as HTMLElement).id;
      const className = (node as HTMLElement).className;
      if (id) { parts.unshift(`${tag}#${id}`); break; }
      const classPart = (typeof className === 'string' && className.trim()) ? '.' + className.trim().replace(/\s+/g, '.') : '';
      const parent = node.parentElement;
      let nth = '';
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => (c as HTMLElement).tagName === (node as HTMLElement).tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(node) + 1;
          nth = `:nth-of-type(${index})`;
        }
      }
      parts.unshift(`${tag}${classPart}${nth}`);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const frameTimes = useRef<number[]>([]);
  const scrollHist = useRef<number[]>([]);
  const lastTs = useRef<number | null>(null);
  const lastScroll = useRef<number>(0);

  useEffect(() => {
    if (!debug) return;
    let raf = 0;
    const sample = (ts?: number) => {
      if (!running) {
        raf = requestAnimationFrame(sample);
        return;
      }
      const now = ts ?? performance.now();
      const sY = window.scrollY || window.pageYOffset || 0;
      // FPS
      if (lastTs.current !== null) {
        const dt = now - lastTs.current;
        if (dt > 0) {
          const instFps = 1000 / dt;
          setFps(Math.round(instFps));
          frameTimes.current.push(dt);
          if (frameTimes.current.length > 120) frameTimes.current.shift();
          const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
          setAvgFps(Math.round(1000 / avg));
          setMaxFrameMs((prev) => Math.max(prev, Math.round(dt)));
        }
      }
      lastTs.current = now;
      // Scroll velocity (px/s)
      const dScroll = sY - lastScroll.current;
      lastScroll.current = sY;
      setScrollY(Math.round(sY));
      setScrollVel(Math.round(dScroll * 60)); // approx per second at 60hz
      scrollHist.current.push(sY);
      if (scrollHist.current.length > 120) scrollHist.current.shift();

      // Section metrics
      const ids = ['hero', 'services', 'about', 'faq', 'contact'];
      const vh = window.innerHeight || 1;
      const m: Metric[] = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: NaN, height: NaN };
        const r = el.getBoundingClientRect();
        const progress = computeProgress(r.top, r.height, vh);
        return {
          id,
          top: Math.round(r.top),
          left: Math.round(r.left),
          width: Math.round(r.width),
          height: Math.round(r.height),
          progress: Number(progress.toFixed(2)),
        };
      });
      setMetrics(m);
      raf = requestAnimationFrame(sample);
    };
    raf = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(raf);
  }, [debug, running]);

  useEffect(() => {
    if (!debug) return;
    const onMove = (e: MouseEvent) => {
      setPointer({ clientX: e.clientX, clientY: e.clientY, pageX: e.pageX, pageY: e.pageY });
      if (!showHover) return;
      const ovRoot = rootRef.current;
      let prevPE: string | null = null;
      if (ovRoot) {
        prevPE = ovRoot.style.pointerEvents;
        ovRoot.style.pointerEvents = 'none';
      }
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (ovRoot) {
        ovRoot.style.pointerEvents = prevPE || 'auto';
      }
      if (!el) { setHoverInfo(undefined); return; }
      const r = el.getBoundingClientRect();
      const attrs: Record<string,string> = {};
      if (el.id) attrs.id = el.id;
      if (el.className && typeof el.className === 'string') attrs.class = (el.className as string).slice(0, 120);
      const label = el.getAttribute('aria-label'); if (label) attrs['aria-label'] = label;
      const role = el.getAttribute('role'); if (role) attrs.role = role;
      if (el.dataset) {
        Object.keys(el.dataset).forEach((k) => {
          const v = (el.dataset as any)[k];
          if (v) attrs[`data-${k}`] = String(v).slice(0, 140);
        });
      }
      const desc = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + (el.className as string).trim().replace(/\s+/g,'.') : ''}`.slice(0,180);
      setHoverInfo({ desc, top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), attrs });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [debug, showHover]);

  const handleCopy = () => {
    const lines = [
      `fps: ${fps} (avg ${avgFps}) maxFrameMs: ${maxFrameMs}`,
      `scrollY: ${scrollY} vel: ${scrollVel}px/s`,
      ...metrics.map((m) => `${m.id}: top ${m.top} h ${m.height}${typeof m.progress === 'number' ? ` p ${m.progress}` : ''}`),
    ];
    const text = lines.join('\n');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const handleReset = () => {
    frameTimes.current = [];
    setMaxFrameMs(0);
  };

  if (!debug) return null;

  const node = (
    <div
      style={{
        position: 'fixed',
        right: 8,
        top: 8,
        zIndex: 2147483647,
        pointerEvents: 'auto',
        fontSize: 12,
        color: '#fff',
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(63,63,70,0.8)',
        borderRadius: 6,
        padding: '6px 8px',
        minWidth: 160,
        maxWidth: 420,
        lineHeight: 1.4,
      }}
      ref={rootRef}
    >
      <div ref={overlayRef} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ opacity: 0.8 }}>debug overlay (press "d")</span>
        <button onClick={handleCopy} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>copy</button>
        <button onClick={() => setRunning((r) => !r)} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>{running ? 'pause' : 'resume'}</button>
        <button onClick={handleReset} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>reset</button>
        <button onClick={() => setShowTrace((v) => !v)} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: showTrace ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>trace</button>
        <button onClick={() => setShowBoxes((v) => !v)} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: showBoxes ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>boxes</button>
        <button onClick={() => setShowHover((v) => !v)} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: showHover ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>hover</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ opacity: 0.8 }}>time</span>
        {[1, 0.5, 0.25, 0.1].map((v) => (
          <button
            key={v}
            onClick={() => {
              setTimeScale(v);
              window.__DEBUG_TIME_SCALE__ = v;
            }}
            style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: timeScale === v ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}
          >
            {v}x
          </button>
        ))}
        <button onClick={() => setMarks((m) => [...m, frameTimes.current.length - 1].slice(-10))} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: 'rgba(56,189,248,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>mark</button>
      </div>
      <div style={{ marginBottom: 4 }}>fps {fps} (avg {avgFps}) · max {maxFrameMs}ms</div>
      <div style={{ marginBottom: 6 }}>scrollY {scrollY} · vel {scrollVel}px/s · pointer {pointer.clientX},{pointer.clientY} (page {pointer.pageX},{pointer.pageY})</div>
      {showHover && hoverInfo && (
        <div style={{ marginBottom: 6 }}>
          <div style={{ opacity: 0.8 }}>hovered:</div>
          <div>{hoverInfo.desc}</div>
          <div style={{ opacity: 0.8 }}>selector:</div>
          <div style={{ wordBreak: 'break-all' }}>{buildSelector(document.elementFromPoint(pointer.clientX, pointer.clientY))}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button onClick={() => { const el = document.elementFromPoint(pointer.clientX, pointer.clientY); const text = buildSelector(el); navigator.clipboard?.writeText(text).catch(() => {}); }} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: 'rgba(56,189,248,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>copy selector</button>
            <button onClick={() => { const el = document.elementFromPoint(pointer.clientX, pointer.clientY) as HTMLElement | null; if (!el) return; const r = el.getBoundingClientRect(); const attrs: string[] = []; if (el.id) attrs.push(`id=${el.id}`); const c = el.className; if (c && typeof c === 'string') attrs.push(`class=${c}`); const ar = el.getAttribute('aria-label'); if (ar) attrs.push(`aria-label=${ar}`); const rl = el.getAttribute('role'); if (rl) attrs.push(`role=${rl}`); if (el.dataset) { Object.keys(el.dataset).forEach((k) => { const v = (el.dataset as any)[k]; if (v) attrs.push(`data-${k}=${String(v)}`); }); } const text = [`${el.tagName.toLowerCase()} @ ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`, 'selector: ' + buildSelector(el), ...attrs].join('\n'); navigator.clipboard?.writeText(text).catch(() => {}); }} style={{ pointerEvents: 'auto', cursor: 'pointer', padding: '2px 6px', fontSize: 11, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff' }}>copy hovered</button>
          </div>
        </div>
      )}
      {showTrace && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          height: 40,
          marginBottom: 6,
          }}>
          {frameTimes.current.map((dt, i) => {
            const h = Math.max(2, Math.min(40, (dt / 16) * 40));
            const color = dt <= 18 ? '#22c55e' : dt <= 28 ? '#eab308' : '#ef4444';
            const marked = marks.includes(i);
            return <div key={i} style={{ width: 2, height: h, background: marked ? '#38bdf8' : color }} />;
          })}
        </div>
      )}
      {metrics.map((m) => (
        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ opacity: 0.8 }}>{m.id}:</span>
          <span>
            {isNaN(m.top) ? '—' : `top ${m.top}`} · {isNaN(m.height) ? '—' : `h ${m.height}`}
            {typeof m.progress === 'number' ? ` · p ${m.progress}` : ''}
          </span>
        </div>
      ))}
    </div>
  );

  const boxes = showBoxes ? (() => {
    const base = metrics.filter((m) => !isNaN(m.top) && m.width && m.left !== undefined).map((m) => (
      <div key={`box-${m.id}`} style={{ position: 'fixed', top: m.top, left: m.left!, width: m.width!, height: m.height, border: '1px dashed #22c55e', zIndex: 2147483646, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, background: 'rgba(34,197,94,0.85)', color: '#000', fontSize: 10, padding: '0 3px' }}>{m.id}</div>
      </div>
    ));
    const extras: JSX.Element[] = [];
    document.querySelectorAll<HTMLElement>('[data-debug]').forEach((el, idx) => {
      const r = el.getBoundingClientRect();
      extras.push(
        <div key={`box-extra-${idx}`} style={{ position: 'fixed', top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), border: '1px dashed #38bdf8', zIndex: 2147483646, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, background: 'rgba(56,189,248,0.85)', color: '#000', fontSize: 10, padding: '0 3px' }}>{el.dataset.debug || el.tagName.toLowerCase()}</div>
        </div>
      );
    });
    return (<>{base}{extras}</>);
  })() : null;

  const hoverBox = showHover && hoverInfo ? (
    <>
      <div style={{ position: 'fixed', top: hoverInfo.top, left: hoverInfo.left, width: hoverInfo.width, height: hoverInfo.height, border: '1px dashed #f472b6', zIndex: 2147483646, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: hoverInfo.top, left: hoverInfo.left, background: 'rgba(244,114,182,0.9)', color: '#000', fontSize: 10, padding: '0 3px', zIndex: 2147483647, pointerEvents: 'none' }}>
        {hoverInfo.desc}
        {Object.keys(hoverInfo.attrs).length ? ' · ' + Object.entries(hoverInfo.attrs).slice(0,4).map(([k,v]) => `${k}=${v}`).join(' ') : ''}
      </div>
    </>
  ) : null;

  return createPortal(
    <>
      {node}
      {boxes}
      {hoverBox}
    </>,
    document.body
  );
};

export default DebugOverlay;
