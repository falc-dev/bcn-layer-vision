import { useLoaderData } from "react-router";
import { Map, View } from "react-openlayers";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON.js";

import VoronoiTooltip from "@/components/voronoi-tooltip/voronoi-tooltip";
import { PointsLayer, VoronoiLayer, MaskLayer } from "@/components/layers";

import type { Location } from "@/types";
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

const getParticipacioCiudadanaData = async ({ limit = 10 } = {}) => {
  try {
    const url = new URL(
      "https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?resource_id=6e95bc70-e3a9-4190-9035-4039ca00ee3f",
    );
    url.searchParams.set("fields", "name,geo_epgs_4326_lat,geo_epgs_4326_lon");
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("filters", JSON.stringify({ secondary_filters_name: "Centres cívics" }));

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
  const locations = await getParticipacioCiudadanaData({ limit: 52 });
  return { locations };
};

export default function ParticipacioCiutadana() {
  const { locations } = useLoaderData();

  const bcnBorder = new GeoJSON()
    .readFeatures(polygonData, {
      dataProjection: polygonData.crs.properties.name,
      featureProjection: "EPSG:3857",
    })
    .at(0);

  const coordinateBounds = bcnBorder?.getGeometry()?.getExtent() as [
    number,
    number,
    number,
    number,
  ];

  return (
    <div className="participacio-ciutadana-page">
      <Map style={{ minHeight: "70vh" }}>
        <View center={fromLonLat([2.1734, 41.3851])} zoom={11} />
        <PointsLayer locations={locations} />
        <VoronoiLayer locations={locations} bounds={coordinateBounds} />
        <VoronoiTooltip />
        <MaskLayer feature={bcnBorder!} />
      </Map>
    </div>
  );
}
