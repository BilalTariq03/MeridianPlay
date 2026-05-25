import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Center coordinates and zoom scale per region
const REGION_CONFIG = {
  Africa:    { center: [20, 2],    scale: 380 },
  Americas:  { center: [-80, 15], scale: 280 },
  Asia:      { center: [90, 30],  scale: 320 },
  Europe:    { center: [15, 54],  scale: 700 },
  Oceania:   { center: [140, -25], scale: 450 },
  Antarctic: { center: [0, -90],  scale: 300 },
};

function WorldMap({ numericCode, region }) {
  const config = REGION_CONFIG[region] || { center: [0, 20], scale: 160 };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      background: '#0f172a',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <ComposableMap
        projectionConfig={{ center: config.center, scale: config.scale }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
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
      </ComposableMap>
    </div>
  );
}

export default WorldMap;