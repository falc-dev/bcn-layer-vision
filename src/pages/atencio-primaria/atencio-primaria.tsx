import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON.js";
import { Map, View } from "react-openlayers";
import { useLoaderData } from "react-router";
import type { Location } from "@/types";

import VoronoiTooltip from "@/components/voronoi-tooltip/voronoi-tooltip";
import { PointsLayer, VoronoiLayer, MaskLayer } from "@/components/layers";

import polygonData from "../../components/layers/clip-layer/unitats-administratives-poligon-bcn.json";

type APIResponse = {
  result: {
    records: Array<{
      name: string;
      geo_epgs_4326_lat: number;
      geo_epgs_4326_lon: number;
    }>;
  };
};

const mapAPIResponseToLocation = (apiResponse: APIResponse): Location[] => {
  return apiResponse.result.records.map((record) => ({
    name: record.name,
    latitude: record.geo_epgs_4326_lat,
    longitude: record.geo_epgs_4326_lon,
    coordinates: fromLonLat([record.geo_epgs_4326_lon, record.geo_epgs_4326_lat]),
  }));
};

const getCAPLocations = async ({ limit = 10 } = {}) => {
  try {
    const url = new URL(
      "https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?resource_id=9e135848-eb0a-4bc5-8e60-de558213b3ed",
    );
    url.searchParams.set("fields", "name,geo_epgs_4326_lat,geo_epgs_4326_lon");
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("filters", JSON.stringify({ secondary_filters_name: "CAPs" }));

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return mapAPIResponseToLocation(json);
  } catch (e: any) {
    console.error(e.message);
    return [];
  }
};

export const loader = async () => {
  const locations = await getCAPLocations({ limit: 50 });
  return { locations };
};

export default function AtencioPrimaria() {
  const { locations } = useLoaderData();

  const bcnBorder = new GeoJSON()
    .readFeatures(polygonData, {
      dataProjection: polygonData.crs.properties.name,
      featureProjection: "EPSG:3857",
    })
    .at(0);
  console.log("BCN Border Feature:", bcnBorder);

  const coordinateBounds = bcnBorder?.getGeometry()?.getExtent() as [
    number,
    number,
    number,
    number,
  ];

  return (
    <div className="atencio-primaria-page">
      Atenció Primària Page
      <Map style={{ minHeight: "60vh" }}>
        <View center={fromLonLat([2.1734, 41.3851])} zoom={11} />
        <PointsLayer locations={locations} />
        <VoronoiLayer locations={locations} bounds={coordinateBounds} />
        <VoronoiTooltip />
        <MaskLayer feature={bcnBorder!} />
      </Map>
    </div>
  );
}
