import type { IpGeo } from '../types';
import * as React from 'react';

interface LatLng {
  lat: number;
  lng: number;
}

interface ClusterPoint extends LatLng {
  count: number;
}

const Map = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    nodesGeo?: { [nodeId: string]: IpGeo };
  }
  // Complains about props not being validated
  // eslint-disable-next-line
>(({ className, nodesGeo, ...props }, ref) => {
  const [width, setWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const updateWidth = () => {
      setWidth(globalThis.window.innerWidth);
    };
    updateWidth();
    globalThis.window.addEventListener('resize', updateWidth);
    return () => {
      globalThis.window.removeEventListener('resize', updateWidth);
    };
  }, []);

  function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  function latLonToOffsets(
    latitude: number,
    longitude: number,
    mapWidth: number,
    mapHeight: number,
  ) {
    const FE = 45; // False easting
    const radius = mapWidth / (2 * Math.PI);

    const latRad = degreesToRadians(latitude);
    const lonRad = degreesToRadians(longitude + FE);

    const x = lonRad * radius;

    const yFromEquator = radius * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = mapHeight / 2 - yFromEquator;

    return { x, y };
  }

  function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Radius of the Earth in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in KM
  }

  function clusterPoints(points: LatLng[], radius: number): ClusterPoint[] {
    if (!Array.isArray(points)) {
      throw new TypeError('Expected an array of LatLng objects');
    }
    const clusters: ClusterPoint[] = [];
    const visited = new Set<number>();

    points.forEach((point, idx) => {
      if (visited.has(idx)) return;

      const cluster: LatLng[] = [point];
      visited.add(idx);

      for (let i = 0; i < points.length; i++) {
        if (visited.has(i)) continue;

        const distance = haversineDistance(
          point.lat,
          point.lng,
          points[i].lat,
          points[i].lng,
        );
        if (distance <= radius) {
          cluster.push(points[i]);
          visited.add(i);
        }
      }

      const midPoint: LatLng = cluster.reduce(
        (acc, cur) => ({
          lat: acc.lat + cur.lat / cluster.length,
          lng: acc.lng + cur.lng / cluster.length,
        }),
        { lat: 0, lng: 0 },
      );
      clusters.push({ ...midPoint, count: cluster.length });
    });

    return clusters;
  }

  // Const { x: japX, y: japY } = latLonToOffsets(35.6764 * 1.8, 139.65, 100, 100);

  return (
    <div className={className} ref={ref} {...props}>
      <div className="relative">
        <img src="images/map.svg" className="w-full text-white" />
        {/* <div
          className="absolute"
          style={{
            left: `${japX}%`,
            top: `${japY}%`,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            Japan
          </div>
        </div> */}
        {nodesGeo != null ? (
          clusterPoints(
            Object.values(nodesGeo).map((geo) => ({
              lat: geo.ll[0],
              lng: geo.ll[1],
            })),
            1000,
          ).map(({ count, lat, lng }, i) => {
            const { x, y } = latLonToOffsets(lat * 1.8, lng, 100, 100);
            return (
              <div
                key={i}
                className="aspect-square border-[rgba(255, 255, 255, 0.4)] border rounded-full absolute grid place-items-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x > 0 ? x : 100 + x}%`,
                  top: `${y}%`,
                  transformOrigin: 'top left',
                  width: `${
                    Math.max(Math.min(Math.log(count * 1000), 15), 1) +
                    (width > 640 ? 0 : 4)
                  }%`,
                }}
              >
                <div className="aspect-square bg-white w-[75%] rounded-full flex justify-center">
                  <img
                    src="images/polykey-logomark-dark.svg"
                    className="w-[60%]"
                  />
                </div>
                <div
                  className="
                  absolute bottom-0 right-0
                  rounded-full
                  aspect-square w-6 leading-5
                  bg-[#134647] border-[#289295]
                  border-2 text-center
                  text-xs
                  text-white
                  inline-block
                  align-middle"
                >
                  {count}
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
