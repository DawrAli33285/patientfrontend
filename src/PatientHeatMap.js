import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FileSpreadsheet, Loader2, Upload, AlertCircle } from 'lucide-react';
import { BASE_URL } from './baseurl';

const API_BASE = BASE_URL;

const ZIP_COORDS = {
  '29673': [34.7012, -82.4643], '29697': [34.6256, -82.4788],
  '29669': [34.6523, -82.5123], '29642': [34.7678, -82.5734],
  '29621': [34.5034, -82.6501], '29627': [34.5245, -82.4912],
  '29625': [34.5612, -82.6278], '29657': [34.7756, -82.7034],
  '29626': [34.4823, -82.6712], '29655': [34.4278, -82.4523],
  '29624': [34.5423, -82.6134], '29670': [34.6734, -82.6012],
  '29684': [34.7234, -82.6789], '29654': [34.4012, -82.5634],
  '29611': [34.8456, -82.3978], '29640': [34.8234, -82.6023],
  '29630': [34.8967, -82.7456], '29605': [34.8023, -82.3612],
  '29671': [34.8812, -82.7289], '29689': [34.7534, -82.7612],
  '29601': [34.8526, -82.3940], '29607': [34.8234, -82.3412],
  '29609': [34.8934, -82.3678], '29610': [34.8712, -82.3234],
  '29615': [34.8412, -82.3089], '29617': [34.9012, -82.4312],
  '29620': [34.3634, -82.4789], '29628': [34.4023, -82.5012],
  '29631': [34.8878, -82.7856], '29635': [35.0023, -82.6234],
  '29638': [34.4534, -82.6312], '29639': [34.3678, -82.5456],
  '29641': [34.7878, -82.5534], '29644': [34.6823, -82.5634],
  '29645': [34.6134, -82.5134], '29650': [34.9234, -82.2712],
  '29653': [34.3078, -82.2789], '29656': [34.7534, -82.6312],
  '29658': [34.7834, -82.7512], '29659': [34.2134, -82.6012],
  '29661': [35.0712, -82.5534], '29662': [34.8012, -82.3389],
  '29665': [34.7412, -82.8534], '29667': [34.7212, -82.8734],
  '29672': [34.7712, -82.7812], '29675': [34.6734, -82.9234],
  '29676': [34.9512, -82.9134], '29678': [34.6934, -82.8434],
  '29680': [34.7512, -82.2312], '29681': [34.7312, -82.2512],
  '29682': [34.8712, -82.8512], '29683': [35.0123, -82.4834],
  '29685': [34.9712, -82.8034], '29687': [34.9512, -82.2089],
  '29688': [34.9012, -82.2389], '29690': [35.0323, -82.4234],
  '29691': [34.9123, -83.0123], '29692': [34.6123, -82.6512],
  '29693': [34.5423, -82.8934], '29695': [34.3812, -82.4323],
  '29696': [34.8623, -82.9512], '29702': [35.1434, -81.8323],
  '29706': [34.7234, -81.2534], '28801': [35.5951, -82.5515],
  '28803': [35.5651, -82.5115], '28804': [35.6251, -82.5715],
  '28806': [35.5751, -82.5915], '28715': [35.4434, -82.6989],
  '28726': [35.3623, -82.5134], '28739': [35.3023, -82.5534],
  '28792': [35.3823, -82.4734], '29301': [34.9496, -81.9321],
  '29302': [34.9296, -81.9121], '29303': [34.9696, -81.9521],
  '29316': [34.9896, -81.8721], '29323': [35.0123, -81.8323],
  '29334': [34.8712, -81.9634], '29340': [34.9312, -81.5634],
  '29372': [34.9734, -81.8034], '29376': [34.8934, -81.9434],
};

const HARDCODED_DATA = {
  '29601': { count: 142, address: '100 N Main St',          cityStateZip: 'GREENVILLE SC 29601' },
  '29607': { count: 98,  address: '1500 Woodruff Rd',       cityStateZip: 'GREENVILLE SC 29607' },
  '29605': { count: 87,  address: '300 Augusta St',         cityStateZip: 'GREENVILLE SC 29605' },
  '29621': { count: 76,  address: '200 N Murray Ave',       cityStateZip: 'ANDERSON SC 29621' },
  '29673': { count: 65,  address: '101 Piedmont Hwy',       cityStateZip: 'PIEDMONT SC 29673' },
  '29609': { count: 61,  address: '400 Buncombe Rd',        cityStateZip: 'GREENVILLE SC 29609' },
  '29615': { count: 54,  address: '700 Haywood Rd',         cityStateZip: 'GREENVILLE SC 29615' },
  '29650': { count: 49,  address: '500 Wade Hampton Blvd',  cityStateZip: 'GREER SC 29650' },
  '29687': { count: 43,  address: '200 Spartan Blvd',       cityStateZip: 'TAYLORS SC 29687' },
  '29680': { count: 38,  address: '100 Reidville Rd',       cityStateZip: 'SIMPSONVILLE SC 29680' },
  '29681': { count: 35,  address: '300 Harrison Bridge Rd', cityStateZip: 'SIMPSONVILLE SC 29681' },
  '29625': { count: 33,  address: '150 E Greenville St',    cityStateZip: 'ANDERSON SC 29625' },
  '29657': { count: 29,  address: '100 Old Buncombe Rd',    cityStateZip: 'SANS SOUCI SC 29657' },
  '29630': { count: 27,  address: '200 Academy St',         cityStateZip: 'CENTRAL SC 29630' },
  '29640': { count: 24,  address: '100 E Poinsett St',      cityStateZip: 'EASLEY SC 29640' },
  '29684': { count: 21,  address: '100 Stamp Creek Rd',     cityStateZip: 'STARR SC 29684' },
  '29670': { count: 19,  address: '100 Main St',            cityStateZip: 'PELZER SC 29670' },
  '29669': { count: 17,  address: '100 Mauldin Rd',         cityStateZip: 'PELZER SC 29669' },
  '29697': { count: 15,  address: '100 Old Williamston Rd', cityStateZip: 'WILLIAMSTON SC 29697' },
  '29611': { count: 13,  address: '100 Brushy Creek Rd',    cityStateZip: 'GREENVILLE SC 29611' },
  '28801': { count: 11,  address: '100 Tunnel Rd',          cityStateZip: 'ASHEVILLE NC 28801' },
  '29301': { count: 9,   address: '100 E Main St',          cityStateZip: 'SPARTANBURG SC 29301' },
  '29672': { count: 8,   address: '100 Keowee School Rd',   cityStateZip: 'SENECA SC 29672' },
  '29676': { count: 7,   address: '100 Ram Cat Alley',      cityStateZip: 'SALEM SC 29676' },
  '29691': { count: 6,   address: '100 W Main St',          cityStateZip: 'WALHALLA SC 29691' },
};

function extractZip(val) {
  const m = String(val || '').match(/\b(\d{5})(?:-\d{4})?\b/);
  return m ? m[1] : null;
}

function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L && window.L.heatLayer) { resolve(); return; }
    const cssId = 'leaflet-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const loadHeat = () => {
      if (window.L.heatLayer) { resolve(); return; }
      const heat = document.createElement('script');
      heat.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      heat.onload = () => resolve();
      document.head.appendChild(heat);
    };
    if (window.L) { loadHeat(); return; }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = loadHeat;
    document.head.appendChild(script);
  });
}

function simplifyAddress(address) {
  return address
    .replace(/\s*(entrance\s*[a-z]|ste\s*[\w]+|suite\s*[\w]+|unit\s*[\w]+|apt\s*[\w]+|#[\w]+)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function geocodeAddress(fullAddress) {
  try {
    const attempts = [fullAddress, simplifyAddress(fullAddress)];
    for (const query of attempts) {
      if (!query) continue;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      if (data && data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (_) {}
  return null;
}


function makeIcon(color, size = 16) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1.5}" fill="${color}" stroke="white" stroke-width="2"/>
  </svg>`;
  return window.L.divIcon({ html: svg, className: '', iconSize: [size, size], iconAnchor: [size/2, size/2] });
}

function HeatMap({ zipData, stats, fileName, onReset, format }) {
  const mapRef      = useRef(null);
  const leafletMap  = useRef(null);
  const heatLayer   = useRef(null);
  const markersRef  = useRef([]);
  const [mapReady, setMapReady]       = useState(false);
  const [radius,   setRadius]         = useState(35);
  const [opacity,  setOpacity]        = useState(0.8);
  const [hoveredKey, setHoveredKey]   = useState(null);
  const [showHeat, setShowHeat]       = useState(true);
  const [showMarkers, setShowMarkers] = useState(format === 'primary-competitor');

  const mapPoints = Object.entries(zipData).map(([key, val]) => ({ key, ...val }));
  const maxCount  = mapPoints.length ? Math.max(...mapPoints.map(p => p.count)) : 1;

  const buildHeatData = () =>
    mapPoints
      .filter(p => format !== 'primary-competitor' || p.type === 'primary')
      .map(({ coords, count }) => [coords[0], coords[1], count]);

  const buildHeatLayer = (map, r, o) => {
    const data = buildHeatData();
    if (!data.length) return null;
    const heat = window.L.heatLayer(data, {
      radius: r, blur: 25, maxZoom: 17, max: maxCount, minOpacity: 0.3,
      gradient: { 0.1: '#bfdbfe', 0.3: '#3b82f6', 0.5: '#1d4ed8', 0.65: '#eab308', 0.8: '#f97316', 1.0: '#ef4444' },
    }).addTo(map);
    if (heat._canvas) heat._canvas.style.opacity = o;
    return heat;
  };

  const addMarkers = (map) => {
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    mapPoints.forEach(({ coords, label, name, count, type }) => {
      const color = type === 'primary' ? '#2563eb' : '#dc2626';
      const marker = window.L.marker(coords, { icon: makeIcon(color) })
        .addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;min-width:160px">
          <div style="font-weight:700;font-size:13px;margin-bottom:4px">${name || label}</div>
          <div style="font-size:11px;color:#64748b;margin-bottom:6px">${label}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="background:${type==='primary'?'#eff6ff':'#fef2f2'};color:${color};padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600">${type==='primary'?'Primary':'Competitor'}</span>
            <span style="font-size:11px;color:#374151;font-weight:600">${count}×</span>
          </div></div>`);
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    loadLeaflet().then(() => {
      if (!mapRef.current || leafletMap.current) return;
      const center = mapPoints.length
        ? [mapPoints.reduce((s,p)=>s+p.coords[0],0)/mapPoints.length, mapPoints.reduce((s,p)=>s+p.coords[1],0)/mapPoints.length]
        : [34.85, -82.39];
      const map = window.L.map(mapRef.current, { zoomControl: true }).setView(center, 9);
      leafletMap.current = map;
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO', subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);
      if (showHeat) heatLayer.current = buildHeatLayer(map, radius, opacity);
      if (showMarkers && format === 'primary-competitor') addMarkers(map);
      setMapReady(true);
    });
    return () => {
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; heatLayer.current = null; markersRef.current = []; }
    };
  }, [zipData]);

  useEffect(() => {
    if (!leafletMap.current || !mapReady) return;
    if (heatLayer.current) { leafletMap.current.removeLayer(heatLayer.current); heatLayer.current = null; }
    if (showHeat) heatLayer.current = buildHeatLayer(leafletMap.current, radius, opacity);
  }, [radius, opacity, showHeat, mapReady]);

  useEffect(() => {
    if (!leafletMap.current || !mapReady || format !== 'primary-competitor') return;
    if (showMarkers) { addMarkers(leafletMap.current); }
    else { markersRef.current.forEach(m => leafletMap.current.removeLayer(m)); markersRef.current = []; }
  }, [showMarkers, mapReady]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
     
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { val: stats?.total?.toLocaleString(), label: 'Rows',       bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
            stats?.primaries   != null && { val: stats.primaries,   label: 'Primary',    bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
            stats?.competitors != null && { val: stats.competitors, label: 'Competitor', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
            stats?.uniqueZips  != null && { val: stats.uniqueZips,  label: 'Addresses',  bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
            { val: stats?.mapped, label: 'Mapped', bg: '#fefce8', color: '#a16207', border: '#fef08a' },
          ].filter(Boolean).map(({ val, label, bg, color, border }) => (
            <div key={label} style={{ padding: '5px 14px', borderRadius: 20, border: `1px solid ${border}`, background: bg, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color, fontWeight: 700, fontSize: 14 }}>{val}</span>
              <span style={{ color: '#64748b', fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
        <button onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#ffffff', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Upload size={14} /> New File
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ width: 260, background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>Controls</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <button onClick={() => setShowHeat(v => !v)}
                style={{ flex: 1, padding: '5px 0', borderRadius: 7, border: `1px solid ${showHeat ? '#2563eb' : '#e2e8f0'}`, background: showHeat ? '#eff6ff' : '#f9fafb', color: showHeat ? '#2563eb' : '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Heatmap
              </button>
              {format === 'primary-competitor' && (
                <button onClick={() => setShowMarkers(v => !v)}
                  style={{ flex: 1, padding: '5px 0', borderRadius: 7, border: `1px solid ${showMarkers ? '#2563eb' : '#e2e8f0'}`, background: showMarkers ? '#eff6ff' : '#f9fafb', color: showMarkers ? '#2563eb' : '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Markers
                </button>
              )}
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#374151', fontSize: 12 }}>Heat radius</span>
                <span style={{ color: '#2563eb', fontSize: 12, fontWeight: 600 }}>{radius}px</span>
              </div>
              <input type="range" min="10" max="80" value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#374151', fontSize: 12 }}>Opacity</span>
                <span style={{ color: '#2563eb', fontSize: 12, fontWeight: 600 }}>{Math.round(opacity * 100)}%</span>
              </div>
              <input type="range" min="0.2" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
            </div>
          </div>

          <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Gradient scale</p>
            <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(to right, #bfdbfe, #3b82f6, #1d4ed8, #eab308, #f97316, #ef4444)', marginBottom: 6 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontSize: 10 }}>Low</span>
              <span style={{ color: '#94a3b8', fontSize: 10 }}>High</span>
            </div>
            {format === 'primary-competitor' && (
              <div style={{ marginTop: 10, display: 'flex', gap: 14 }}>
                {[{ color: '#2563eb', label: 'Primary' }, { color: '#dc2626', label: 'Competitor' }].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: '1.5px solid white', boxShadow: `0 0 0 1px ${color}` }} />
                    <span style={{ fontSize: 10, color: '#64748b' }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '12px 16px 8px' }}>
            <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Top Locations</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 12px' }}>
            {[...mapPoints].sort((a, b) => b.count - a.count).slice(0, 20).map(({ key, label, name, count, type }, i) => {
              const pct     = count / maxCount;
              const isPri   = type !== 'competitor';
              const color   = isPri ? (pct > 0.6 ? '#1d4ed8' : '#2563eb') : (pct > 0.6 ? '#dc2626' : '#ef4444');
              const bgColor = isPri ? '#eff6ff' : '#fef2f2';
              return (
                <div key={key}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', background: hoveredKey === key ? '#f8fafc' : 'transparent', border: hoveredKey === key ? '1px solid #e2e8f0' : '1px solid transparent', transition: 'all 0.15s', marginBottom: 2 }}
                >
                  <span style={{ color: '#cbd5e1', fontSize: 10, width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 4 }}>
                      <span style={{ color: '#111827', fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || label}</span>
                      <span style={{ color, fontSize: 11, fontWeight: 700, flexShrink: 0, background: bgColor, padding: '1px 7px', borderRadius: 10 }}>{count}</span>
                    </div>
                    <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct * 100}%`, background: color, borderRadius: 2, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <main style={{ flex: 1, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          {!mapReady && (
            <div style={{ position: 'absolute', inset: 0, background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, zIndex: 999 }}>
              <Loader2 size={28} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Loading map…</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function PatientHeatMap() {
  const [phase, setPhase]       = useState('upload');
  const [dragOver, setDragOver] = useState(false);
  const [zipData, setZipData]   = useState(null);
  const [stats, setStats]       = useState(null);
  const [error, setError]       = useState('');
  const [fileName, setFileName] = useState('');
  const [format, setFormat]     = useState('address-zip');
  const fileInputRef            = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    setError(''); setFileName(file.name); setPhase('processing');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/parse-excel`, { method: 'POST', body: formData });
      if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || `Server error ${res.status}`); }
      const { rows, addresses, format: detectedFormat } = await res.json();
      setFormat(detectedFormat || 'address-zip');

      const geocoded = {};

      if (detectedFormat === 'primary-competitor') {
        for (const entry of addresses) {
          const { fullAddress, address, name, count, type, coords } = entry;
          if (coords) geocoded[fullAddress] = { coords, count, label: address, name, type };
        }
        setStats({
          total: rows,
          primaries:   addresses.filter(a => a.type === 'primary').length,
          competitors: addresses.filter(a => a.type === 'competitor').length,
          mapped: Object.keys(geocoded).length,
        });
      } else {
        for (const { address, cityStateZip, count, coords: serverCoords } of addresses) {
            const zip = extractZip(cityStateZip);
            const fullAddress = address ? `${address}, ${cityStateZip}` : cityStateZip;
            const coords = serverCoords || (zip && ZIP_COORDS[zip]) || await geocodeAddress(fullAddress);
            if (coords) geocoded[`${address}||${cityStateZip}`] = { coords, count, label: address || cityStateZip };
          }
          setStats({ total: rows, uniqueZips: addresses.length, mapped: Object.keys(geocoded).length });
      }

      setZipData(geocoded);
      setPhase('map');
    } catch (e) {
      setError(e.message || 'Failed to process file');
      setPhase('upload');
    }
  }, []);

  const loadDemo = () => {
    const demoGeocoded = {};
    let total = 0;
    Object.entries(HARDCODED_DATA).forEach(([zip, { count, address, cityStateZip }]) => {
      if (ZIP_COORDS[zip]) { demoGeocoded[`${address}||${cityStateZip}`] = { coords: ZIP_COORDS[zip], count, label: address }; total += count; }
    });
    setFileName('demo-patients.xlsx');
    setZipData(demoGeocoded);
    setFormat('address-zip');
    setStats({ total, uniqueZips: Object.keys(demoGeocoded).length, mapped: Object.keys(demoGeocoded).length });
    setPhase('map');
  };

  const handleDrop = useCallback((e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }, [processFile]);

  if (phase === 'map' && zipData)
    return <HeatMap zipData={zipData} stats={stats} fileName={fileName} format={format} onReset={() => { setPhase('upload'); setZipData(null); setFileName(''); }} />;

  if (phase === 'processing') return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '40px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Loader2 size={28} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#111827', fontWeight: 700, fontSize: 16, margin: 0 }}>Processing spreadsheet…</p>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>{fileName}</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
      
        {error && (
          <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
            style={{ border: `2px dashed ${dragOver ? '#2563eb' : '#d1d5db'}`, borderRadius: 14, padding: '36px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#eff6ff' : '#f9fafb', transition: 'all 0.2s', marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <FileSpreadsheet size={24} color="#2563eb" />
            </div>
            <p style={{ color: '#111827', fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>Drop your Excel file here</p>
            <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 18px' }}>.xlsx, .xls, .csv supported</p>
            <span style={{ background: '#2563eb', color: 'white', fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 8, display: 'inline-block' }}>Select File</span>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={(e) => processFile(e.target.files[0])} />
          </div>
          <button onClick={loadDemo}
            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.background = '#f9fafb'}>
            Preview with demo data →
          </button>
          <div style={{ marginTop: 16, padding: '14px 16px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 12 }}>
            <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Supported formats</p>
            <div style={{ marginBottom: 10 }}>
              <p style={{ color: '#374151', fontSize: 11, fontWeight: 600, margin: '0 0 4px' }}>Format A — Competitor analysis</p>
              {[['primary', 'Full address of your location'], ['competitor', 'Full address of competitor']].map(([col, desc]) => (
                <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
                  <span style={{ color: '#2563eb', fontSize: 12, fontFamily: 'monospace', width: 100 }}>{col}</span>
                  <span style={{ color: '#6b7280', fontSize: 11 }}>{desc}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}>
              <p style={{ color: '#374151', fontSize: 11, fontWeight: 600, margin: '0 0 4px' }}>Format B — Patient addresses</p>
              {[['City State Zip', '"ANDERSON SC 29621"'], ['Address', 'Patient street address']].map(([col, desc]) => (
                <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                  <span style={{ color: '#16a34a', fontSize: 12, fontFamily: 'monospace', width: 100 }}>{col}</span>
                  <span style={{ color: '#6b7280', fontSize: 11 }}>{desc}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ color: '#374151', fontSize: 11, fontWeight: 600, margin: '0 0 4px' }}>Format C — Employee addresses</p>
              {[
                ['Address Line 1 + Address Line 2', 'Employee street address'],
                ['City, State Zip Code (Formatted)', '"Indianapolis, IN 46235"'],
              ].map(([col, desc]) => (
                <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#9333ea', flexShrink: 0 }} />
                  <span style={{ color: '#9333ea', fontSize: 12, fontFamily: 'monospace', flexShrink: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{col}</span>
                  <span style={{ color: '#6b7280', fontSize: 11 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}