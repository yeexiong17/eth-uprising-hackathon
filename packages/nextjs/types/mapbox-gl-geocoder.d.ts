declare module '@mapbox/mapbox-gl-geocoder' {
    import * as mapboxgl from 'mapbox-gl';

    export default class MapboxGeocoder {
        constructor(options: {
            accessToken: string;
            mapboxgl: typeof mapboxgl;
            placeholder?: string;
            marker?: boolean;
        });

        on(event: string, callback: (e: any) => void): void;
        addTo(container: HTMLElement): this;
        onAdd(map: mapboxgl.Map): HTMLElement;
        // Add other methods and properties as needed
    }
}
