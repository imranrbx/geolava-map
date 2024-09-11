import { Popup } from 'react-map-gl';
import { useMemo } from 'react';
import useMapContext from '../useMapContext';

const PopupsContainer = () => {
  const { geojson } = useMapContext();
  const popUps = useMemo(() => {
    if (
      !geojson?.features?.length ||
      !geojson?.features?.some((f: any) => f.geometry?.type?.toLowerCase() === 'point')
    ) {
      return null;
    }
    const geojsonFeatures = geojson.features.filter(
      (f: any) => f.geometry?.type?.toLowerCase() === 'point',
    );
    return (
      <>
        {geojsonFeatures.map((feature: any, index) => (
          <Popup
            key={index}
            latitude={feature.geometry.coordinates[1]}
            longitude={feature.geometry.coordinates[0]}
            closeButton={false}
            closeOnClick={false}
            anchor="left"
            offset={20}
          >
            <div className="popup-content">
              {feature.properties.name || feature.properties.address}
            </div>
          </Popup>
        ))}
      </>
    );
  }, [geojson]);
  return popUps;
};

export default PopupsContainer;
