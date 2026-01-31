import { useEffect, useState } from "react";
import { useMap, VectorLayer } from "react-openlayers";
import { Style, Fill, Stroke } from "ol/style";
import { Vector } from "ol/source";
import { Feature, Map as olMap } from "ol";
import { Polygon } from "ol/geom";
import { Delaunay } from "d3";
import type { Location } from "@/types";
import RenderEvent from "ol/render/Event";

const createVoronoiSource = (
  locations: Location[],
  bounds: [number, number, number, number],
  map: olMap,
) => {
  // Convertir coordenadas geográficas a coordenadas de píxeles
  const pixel_coords = locations.map((location) =>
    map.getPixelFromCoordinate(location.coordinates),
  ) as Delaunay.Point[];
  console.log("Pixel Coordinates:", pixel_coords);

  // Crear diagrama de Voronoi
  const delaunay = Delaunay.from(pixel_coords);
  const corner1 = map.getPixelFromCoordinate([bounds[0], bounds[1]]);
  const corner2 = map.getPixelFromCoordinate([bounds[2], bounds[3]]);
  const pixelBounds: [number, number, number, number] = [
    corner1[0],
    corner2[1],
    corner2[0],
    corner1[1],
  ];
  const voronoi = delaunay.voronoi(pixelBounds);

  // Crear capa de Voronoi
  const voronoiSource = new Vector();

  pixel_coords.forEach((coord, index) => {
    const cell = voronoi.cellPolygon(index);
    if (cell) {
      // Convertir píxeles de vuelta a coordenadas
      const polygonCoords = cell.map((point) => map.getCoordinateFromPixel(point));
      const feature = new Feature({
        geometry: new Polygon([polygonCoords]),
        name: locations[index].name,
      });

      feature.setStyle(
        new Style({
          fill: new Fill({
            color: "rgba(255, 0, 0, 0.2)",
          }),
          stroke: new Stroke({
            color: "red",
            width: 2,
          }),
        }),
      );

      voronoiSource.addFeature(feature);
    }
  });

  return voronoiSource;
};

export default function VoronoiLayer({
  locations,
  bounds,
}: {
  locations: Location[];
  bounds: [number, number, number, number];
}) {
  const map = useMap();
  const [source, setSource] = useState<Vector | null>(null);

  useEffect(() => {
    if (!map) return;
    const generateVoronoi = (event: RenderEvent) => {
      if (locations.length > 0) {
        const voronoiSource = createVoronoiSource(locations, bounds, map);
        setSource(voronoiSource);
      }
    };
    console.log("Setting up rendercomplete listener for Voronoi generation");
    map.once("rendercomplete", generateVoronoi);
    return () => {
      map.un("rendercomplete", generateVoronoi);
    };
  }, [map]);

  return source ? <VectorLayer source={source} /> : null;
}
