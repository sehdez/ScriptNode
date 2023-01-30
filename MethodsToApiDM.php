// Rutas para los métodos linea 35

Route::get('subir-imagenes', 'ProductoController@uploadImages')->name('uploadImages');
Route::get('delete-imagenes', 'ProductoController@deleteImages')->name('deleteImages');
Route::get('subir-imagenes-shopify', 'Tiendas\ShopifyDMController@updateImages')->name('updateImages');


// Función para subir las imagenes la base de datos ProductoController:
public function uploadImages(Request $request) {
    $image = $request->nombre;
    try {        
        // Separar el nombre del archivo en el SKU y el número de imagen
        $image_parts = explode('-', $image);
        $sku = $image_parts[0];
        $image_number = $image_parts[1];
        // Buscar el producto con ese SKU en la base de datos
        $product = Productos::where('sku', $sku)->select('id')->first();
        
        // Crear una nueva entrada en la tabla de imágenes
        $new_image = new Imagenes();
        $new_image->id_producto = $product->id;
        $new_image->url = 'storage/producto/imagenes/'.$image;
        // dd($new_image);
        $new_image->save();
        return response(["ok" => true, "imagen" => $image ], 200);
    } catch (\Throwable $th) {
        return response(["ok" => false, 'image' => $image] , 500);
    }
}

// Función para Actualizar las imágenes en shopify, validar que sí se envén shopifyController
public function updateImages(Request $request) {
        try {        
            $sku = $request->sku;
            $producto = $this->producto->with('imagenes', 'shopify_dm')->where('sku', $sku )->first();

            if( is_null($producto->shopify_dm->id_shopify_dm) ){
                return response(["ok" => false, 'sku' => $sku, 'msg' => 'El producto no extiste en Shopify DM'] , 500);
            }

            $imagenes = [];
            $body = [];

            foreach( $producto->imagenes as $key => $imagen ){
                if (Str::startsWith($imagen->url, 'http'))
                    $pathUrl = $imagen->url;
                else
                    $pathUrl = 'https://dm.goco.mx/' . $imagen->url;
                array_push($imagenes,['src' => $pathUrl ]);
            }
            $body  = [
                "product"=>[
                    "images" => $imagenes,
                ]
            ];            
            // Hardcodeo
            $path  = 'products/' .  $producto->shopify_dm->id_shopify_dm .'.json';
            
            $response = $this->http->put($path, $body)->json();
            if(isset($response['errors'])){
                if( isset($response['errors']['title']) )
                    return response(["ok" => false, 'sku' => $sku] , 500);
                else
                    return response(["ok" => false, 'sku' => $sku] , 500);

            } else if (isset($response['product'])){
                return response(["ok" => true, 'sku' => $sku, 'images'=>$response['product']['images']] , 200);

            } else {
                return response(["ok" => false, 'sku' => $sku] , 500);
            }
        } catch (\Throwable $th) {
            return response(["ok" => false, 'sku' => $sku] , 500);
        }
    }





// Función para eliminarlas esperemos que no se ocupe ProductoController: 
public function deleteImages(Request $request) {
    $image = $request->nombre;
    try {        
        // Separar el nombre del archivo en el SKU y el número de imagen
        $image_parts = explode('-', $image);
        $sku = $image_parts[0];
        $image_number = $image_parts[1];
        
        Imagenes::where('url', 'like', 'storage/producto/imagenes/'.$image)->delete();
        return response(["ok" => true, "imagen" => $image ], 200);
    } catch (\Throwable $th) {
        return response(["ok" => false, 'image' => $image] , 500);
    }
}