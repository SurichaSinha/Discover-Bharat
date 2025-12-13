import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import indiaBoundaries from "../data/india-admin1.json";
import "leaflet/dist/leaflet.css";

const IndiaMap = ({ onStateClick }) => {
  const defaultStyle = {
    fillColor: "#A9DEF9",
    color: "#1D3557",
    weight: 1,
    fillOpacity: 0.4,
  };

  const highlightStyle = {
    fillColor: "#457B9D",
    weight: 2,
    fillOpacity: 0.7,
  };

  const onEachState = (feature, layer) => {
    layer.on({
      mouseover: (e) => e.target.setStyle(highlightStyle),
      mouseout: (e) => e.target.setStyle(defaultStyle),
      click: () => {
        const stateName =
          feature.properties.shapeName;        

        onStateClick(stateName);
      },
    });
  };

  return (
    <MapContainer
      center={[22.5, 80]}
      zoom={4.6}
      style={{ height: "680px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <GeoJSON
        data={indiaBoundaries}
        style={() => defaultStyle}
        onEachFeature={onEachState}
      />
    </MapContainer>
  );
};

export default IndiaMap;
