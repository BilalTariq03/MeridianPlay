import { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

// Module-level cache — only written from effects, never during render
let cachedTopology = null;
let cachedFeatures = null;

const getScale = (area) => {
  if (area > 3000000) return 280;
  if (area > 1000000) return 400;
  if (area > 300000)  return 700;
  if (area > 100000)  return 1100;
  if (area > 30000)   return 1800;
  return 3000;
};

const findCountry = (features, numericCode) => {
  const code = parseInt(numericCode);
  return features.find(g =>
    parseInt(g.id) === code ||
    String(g.id) === String(code)
  );
};

function WorldMap({ numericCode, area }) {
  const [topology, setTopology] = useState(cachedTopology);
  const [features, setFeatures] = useState(cachedFeatures);
  const scale = getScale(area || 500000);

  useEffect(() => {
    if (cachedTopology) return;
    fetch(GEO_URL)
      .then(r => r.json())
      .then(topo => {
        cachedTopology = topo;
        cachedFeatures = feature(topo, topo.objects.countries).features;
        setTopology(topo);
        setFeatures(cachedFeatures);
      });
  }, []);

  const center = useMemo(() => {
    if (!features) return [0, 20];
    const target = findCountry(features, numericCode);
    if (!target) {
      console.warn('Country not found for numericCode:', numericCode);
      return [0, 20];
    }
    return geoCentroid(target);
  }, [numericCode, features]);

  return (
    <div style={{
      width: '200%',
      maxWidth: '600px',
      margin: '0 auto',
      background: '#0f172a',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <ComposableMap
        projectionConfig={{ center, scale: topology ? scale : 160 }}
        style={{ width: '100%', height: 'auto' }}
      >
        {topology && (
          <Geographies geography={topology}>
            {({ geographies }) =>
              geographies.map(geo => {
                const isTarget = parseInt(geo.id) === parseInt(numericCode);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isTarget ? '#3b82f6' : '#334155'}
                    stroke="#0f172a"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>
    </div>
  );
}

export default WorldMap;
