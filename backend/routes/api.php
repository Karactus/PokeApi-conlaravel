<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/saludo', function () {
    return response()->json([
        'mensaje' => 'Hola desde Laravel',
        'estado' => 'Backend funcionando'
    ]);
});



Route::get('/pokemon', function () {

  
    $offset = max(0, (int) request()->query('offset', 0));

  
    $response = Http::get(
        'https://pokeapi.co/api/v2/pokemon',
        [
            'limit' => 10,
            'offset' => $offset
        ]
    );

    if ($response->failed()) {
        return response()->json([
            'error' => 'No se pudo consultar PokeAPI'
        ], 502);
    }

    $resultados = $response->json('results');
    $pokemones = [];

    foreach ($resultados as $pokemon) {

        $detalleResponse = Http::get($pokemon['url']);

        if ($detalleResponse->failed()) {
            continue;
        }

        $detalle = $detalleResponse->json();

        $pokemones[] = [
            'nombre' => $detalle['name'],
            'imagen' => $detalle['sprites']['other']['official-artwork']['front_default']
                ?? $detalle['sprites']['front_default'],
            'tipos' => array_map(
                fn($tipo) => $tipo['type']['name'],
                $detalle['types']
            ),
            'altura' => $detalle['height'],
            'peso' => $detalle['weight']
        ];
    }

    return response()->json($pokemones);

});


