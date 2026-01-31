import { Feature } from "ol";
import { VectorLayer } from "react-openlayers";
import { Vector } from "ol/source";
import { Coordinate } from "ol/coordinate";
import { Style, Circle, Fill, Stroke } from "ol/style";
import { Point } from "ol/geom";

type Location = {
  name: string;
  latitude: number;
  longitude: number;
  coordinates: Coordinate;
};

export default function PointsLayer({ locations }: { locations: Location[] }) {
  const features = locations.map(
    (location) => new Feature({ geometry: new Point(location.coordinates), name: location.name }),
  );

  return (
    <VectorLayer
      source={
        new Vector({
          features,
        })
      }
      style={
        new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: "red" }),
            stroke: new Stroke({ color: "black", width: 2 }),
          }),
        })
      }
    />
  );
}
