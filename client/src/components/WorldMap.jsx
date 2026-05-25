import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

function WorldMap({ numericCode }) {
  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <ComposableMap
        projectionConfig={{ scale: 140 }}
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