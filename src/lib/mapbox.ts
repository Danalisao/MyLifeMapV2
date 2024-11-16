import mapboxgl from 'mapbox-gl';

// Configuration de Mapbox
mapboxgl.accessToken = "pk.eyJ1IjoiZGFuYWxpc2FvIiwiYSI6ImNtM2g0bDJwZTA5MXIyeHM2MTM0dXF4dzQifQ.iAwnVWzq8Lc-mzeuLlQBpQ";

// Vérification du support WebGL
if (!mapboxgl.supported()) {
  console.error('Votre navigateur ne supporte pas Mapbox GL');
}

export { mapboxgl };