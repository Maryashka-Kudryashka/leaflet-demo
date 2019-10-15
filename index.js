import { rooms } from "./rooms.js";
import { tables } from "./tables.js";

window.addEventListener("load", async () => {
  const colors = [
    "#fbb4ae",
    "#b3cde3",
    "#ccebc5",
    "#decbe4",
    "#fed9a6",
    "#ffffcc"
  ];

  const tablesMarkers = []
  const roomsPolygons = []

  const iconMaker = angle =>
    L.icon({
      iconUrl: `./tableIcons/table${angle}.svg`,
      iconSize: [120, 120],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]
    });

  const setMap = () => {
    const map = L.map("mapid", {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 0
    });
    const bounds = [[0, 0], [1200, 1800]];
    const image = L.imageOverlay("office.jpg", bounds).addTo(map);
    const outerLayer = new L.FeatureGroup();
    const innerLayer = new L.FeatureGroup();
    map
      .fitBounds(bounds)
      .addLayer(outerLayer)
      .on("zoomend", layersZoom);
    generatePolygons(outerLayer);
    generateMarkers(innerLayer)
    return { map, innerLayer, outerLayer };
  };

  const markerMaker = (coordinates, angle, tooltip, text) =>
    L.marker(coordinates, { icon: iconMaker(angle) })
      .bindPopup(text)
      .bindTooltip(tooltip, {
        permanent: true,
        offset: [35, -12],
        direction: "top",
        className: "tooltip"
      });

  const polygonMaker = (room, color) =>
    L.polygon(room.coordinates)
      .bindTooltip(room.number.toString(), {
        permanent: true,
        direction: "center"
      })
      .openTooltip()
      .setStyle({ fillColor: colors[color], color: [colors[color]] })
      .on("click", () => onZoom(room));

  const onZoom = (room) => {
    const x =
      (room.coordinates[3][1] - room.coordinates[0][1]) / 2 +
      room.coordinates[0][1];
    const y =
      (room.coordinates[1][0] - room.coordinates[0][0]) / 2 +
      room.coordinates[0][0];
    map.setView([y, x], 0);
  };

  const layersZoom = () => {
    if (map.getZoom() < 0) {
      map.removeLayer(innerLayer);
      map.addLayer(outerLayer);
    } else {
      map.addLayer(innerLayer);
      map.removeLayer(outerLayer);
    }
  };

  const generatePolygons = outerLayer => {
    for (var i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const color = i % colors.length;
      const polygon = polygonMaker(room, color)
      outerLayer.addLayer(polygon);
    }
  };

  const generateMarkers = innerLayer => {
    for (var i = 0; i < tables.length; i++) {
      const table = tables[i];
      const marker = markerMaker(table.coordinates, table.angle, table.number, table.person)
      innerLayer.addLayer(marker);
      tablesMarkers.push(marker)
    }
  }

  const { map, innerLayer, outerLayer } = setMap();

 
});
