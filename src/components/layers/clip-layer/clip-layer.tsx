import { useRef, useEffect } from "react";
import { useMap, VectorLayer as VLayer } from "react-openlayers";
import { getVectorContext } from "ol/render.js";
import VectorSource from "ol/source/Vector.js";
import type TileLayer from "ol/layer/Tile.js";
import GeoJSON from "ol/format/GeoJSON.js";
import RenderEvent from "ol/render/Event";
import Fill from "ol/style/Fill.js";
import Style from "ol/style/Style.js";
import polygonData from "./unitats-administratives-poligon-bcn.json";
import { Feature } from "ol";

const getBarcelonaClipGeometry = () => {
  // Aquí definirías la geometría que representa el área de Barcelona.
  // Por simplicidad, este ejemplo no incluye una geometría real.
  return null;
};

export default function ClipLayer({ feature }: { feature: Feature }) {
  const map = useMap();

  const baseLayer = useRef<TileLayer>(null);

  const source = new VectorSource({
    features: [feature],
  });

  const style = new Style({
    fill: new Fill({
      color: "black",
    }),
  });

  useEffect(() => {
    if (map) {
      baseLayer.current = map.getLayers().item(0) as TileLayer;
    }
  }, [map]);

  useEffect(() => {
    if (baseLayer.current && source) {
      source.on("addfeature", function (event) {
        baseLayer.current?.setExtent(source.getExtent());
      });
    }
  }, [baseLayer, source]);

  useEffect(() => {
    baseLayer.current?.on("postrender", function (event: RenderEvent) {
      //const ctx = event.context;
      const vectorContext = getVectorContext(event);
      (event.context as CanvasRenderingContext2D).globalCompositeOperation = "destination-in";
      source.forEachFeature(function (feature) {
        vectorContext.drawFeature(feature, style);
      });
      (event.context as CanvasRenderingContext2D).globalCompositeOperation = "source-over";
    });
  }, [baseLayer, source, style]);

  if (!map) return null;

  return <VLayer source={source} />;
}
