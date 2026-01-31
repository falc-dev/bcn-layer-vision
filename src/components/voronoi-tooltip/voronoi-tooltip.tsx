import { useEffect } from "react";
import { useMap } from "react-openlayers";
import { MapBrowserEvent } from "ol";

import SimpleOverlay from "../simple-overlay/simple-overlay";

import "./voronoi-tooltip.css";

export default function VoronoiTooltip() {
  const map = useMap();

  const handlePointerMove = (evt: MapBrowserEvent) => {
    const feature = map?.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
    const overlay = map?.getOverlayById("tooltip");
    if (feature) {
      const name = feature.get("name");
      if (name && overlay) {
        overlay.setPosition(evt.coordinate);
        const tooltip = overlay.getElement();
        if (tooltip) {
          tooltip.innerHTML = name;
        }
      } else {
        overlay?.setPosition(undefined);
      }
    } else {
      overlay?.setPosition(undefined);
    }
  };

  useEffect(() => {
    if (map) {
      map.on("pointermove", handlePointerMove);
    }
  }, [map]);

  return (
    <SimpleOverlay
      className="voronoi-tooltip"
      id="tooltip"
      positioning="bottom-center"
      stopEvent={true}
    />
  );
}
