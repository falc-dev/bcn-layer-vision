import { VectorLayer } from "react-openlayers";
import { Vector } from "ol/source";
import { Style, Fill, Stroke } from "ol/style";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";

export default function PolygonLayer({
  polygon,
  feature,
  style,
}: {
  polygon?: Coordinate[];
  feature?: Feature;
  style?: Style;
}) {
  const polygonFeature =
    feature ??
    new Feature({
      geometry: new Polygon([polygon || []]),
    });

  const layerStyle =
    style ||
    new Style({
      stroke: new Stroke({
        color: "blue",
        width: 2,
      }),
    });

  const source = new Vector({
    features: [polygonFeature],
  });

  return <VectorLayer source={source} style={layerStyle} />;
}
