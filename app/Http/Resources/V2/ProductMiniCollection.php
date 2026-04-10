<?php

namespace App\Http\Resources\V2;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductMiniCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($data) {
                $wholesale_product =
                    ($data->wholesale_product == 1) ? true : false;
                
                // Handle thumbnail image - check if it's an ID or a filename
                $thumbnailImage = '/placeholder.svg';
                if ($data->thumbnail_img) {
                    // If it's numeric, treat as Upload ID; otherwise treat as filename
                    if (is_numeric($data->thumbnail_img)) {
                        $thumbnailImage = uploaded_asset($data->thumbnail_img);
                    } else {
                        // It's a filename, use my_asset to generate URL
                        $thumbnailImage = my_asset($data->thumbnail_img);
                    }
                }
                
                return [
                    'id' => $data->id,
                    'slug' => $data->slug,
                    'name' => $data->getTranslation('name'),
                    'slug' => $data->slug,
                    'thumbnail_image' => $thumbnailImage,
                    'has_discount' => home_base_price($data, false) != home_discounted_base_price($data, false),
                    'discount' => "-" . discount_in_percentage($data) . "%",
                    'stroked_price' => home_base_price($data),
                    'main_price' => home_discounted_base_price($data),
                    'rating' => (float) $data->rating,
                    'sales' => (int) $data->num_of_sale,
                    'is_wholesale' => $wholesale_product,
                    'links' => [
                        'details' => route('products.show', $data->id),
                    ]
                ];
            })
        ];
    }

    public function with($request)
    {
        $pagination = [];
        
        // Extract pagination info if available
        if ($this->resource instanceof \Illuminate\Pagination\AbstractPaginator) {
            $pagination = [
                'current_page' => $this->resource->currentPage(),
                'per_page' => $this->resource->perPage(),
                'total' => $this->resource->total(),
                'last_page' => $this->resource->lastPage(),
                'from' => $this->resource->firstItem(),
                'to' => $this->resource->lastItem(),
                'path' => $this->resource->path(),
            ];
        }

        return [
            'success' => true,
            'status' => 200,
            'meta' => $pagination
        ];
    }
}
