import Mask from "ol-ext/filter/Mask";
import { Fill } from "ol/style";
import GeoJSON from "ol/format/GeoJSON.js";
import { Feature } from "ol";
import { useMap } from "react-openlayers";

import { useEffect } from "react";

export default function MaskLayer({ feature }: { feature: Feature }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const createAndApplyMask = () => {
      const mask = new Mask({
        feature,
        inner: false,
        fill: new Fill({ color: [255, 255, 255, 0.8] }),
        shadowWidth: 10,
        shadowColor: "rgba(0,0,0,0.5)",
      });

      const layers = map?.getAllLayers();

      layers?.forEach((layer) => {
        layer.addFilter(mask);
      });
    };

    console.log("Setting up loadend listener for Mask application");
    map.once("loadend", createAndApplyMask);

    return () => {
      map.un("loadend", createAndApplyMask);
    };
  }, [map, feature]);

  return null;
}
