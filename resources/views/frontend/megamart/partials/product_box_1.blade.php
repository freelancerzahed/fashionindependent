@php
    $cart_added = [];
@endphp
<style>
    .product-thumbnail {
        position: relative;
        overflow: hidden;
        height: 300px; /* Increased height for better view of fashion product */
    }

    /* Front and Back Thumbnails */
    .front-thumbnail, .back-thumbnail {
        transition: opacity 0.3s ease-in-out;
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensures images fill the area properly */
    }

    /* Initially hide the back thumbnail */
    .back-thumbnail {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
    }

    /* Hover effect for showing the back thumbnail */
    .product-thumbnail:hover .back-thumbnail {
        opacity: 1;
    }
    .product-thumbnail:hover .front-thumbnail {
        opacity: 0;
    }

    /* Improved "Add to Cart" button design */
    .cart-btn {
        background-color: #ff6347;
        color: white;
        border-radius: 4px;
        text-align: center;
        padding: 12px 20px;
        font-weight: 700;
        width: 100%;
        font-size: 14px;
        margin-top: 10px;
        transition: background-color 0.3s ease;
    }

    .cart-btn:hover {
        background-color: #e55347;
        text-decoration: none;
    }

    .cart-btn i {
        margin-left: 5px;
    }

    /* Make the product name more fashion-forward */
    h3.product-name {
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 10px;
        color: #333;
        text-align: center;
    }

    .product-price {
        font-size: 16px;
        font-weight: 600;
        color: #e53e3e;
        text-align: center;
    }

    .aiz-card-box {
        transition: transform 0.2s ease;
    }

    .aiz-card-box:hover {
        transform: translateY(-5px);
    }

    /* Wishlist Button */
    .hov-svg-white {
        display: block;  /* Ensure it's displayed */
        visibility: visible;  /* Make sure it's not hidden */
        position: absolute;  /* If you want it to be fixed in a certain position */
        top: 10px;  /* Adjust the position */
        right: 10px;  /* Adjust the position */
        z-index: 10;  /* Ensure it's on top of the image */
    }
</style>

<div class="aiz-card-box h-auto bg-white py-3 hov-scale-img">
    <div class="position-relative img-fit overflow-hidden">
        @php
            $product_url = route('product', $product->slug);
        @endphp
        <div class="product-thumbnail position-relative">
            <a href="{{ $product_url }}" class="d-block h-100">
                <!-- Front Thumbnail -->
                <img class="lazyload front-thumbnail"
                    src="{{ get_image($product->thumbnail) }}"
                    alt="{{ $product->getTranslation('name') }}"
                    title="{{ $product->getTranslation('name') }}"
                    onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';">

                <!-- Back Thumbnail -->
                <img class="lazyload back-thumbnail"
                    src="{{ get_image($product->back_thumbnail) }}"
                    alt="{{ $product->getTranslation('name') }}"
                    title="{{ $product->getTranslation('name') }}"
                    onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';">
            </a>
        </div>

        <!-- Wishlist Button -->
        <a href="javascript:void(0)" class="hov-svg-white" onclick="addToWishList({{ $product->id }})"
           data-toggle="tooltip" data-title="{{ translate('Add to wishlist') }}" data-placement="left">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14.4" viewBox="0 0 16 14.4">
               <g id="_51a3dbe0e593ba390ac13cba118295e4" data-name="51a3dbe0e593ba390ac13cba118295e4"
                  transform="translate(-3.05 -4.178)">
                   <path id="Path_32649" data-name="Path 32649"
                         d="M11.3,5.507l-.247.246L10.8,5.506A4.538,4.538,0,1,0,4.38,11.919l.247.247,6.422,6.412,6.422-6.412.247-.247A4.538,4.538,0,1,0,11.3,5.507Z"
                         transform="translate(0 0)" fill="#919199" />
                   <path id="Path_32650" data-name="Path 32650"
                         d="M11.3,5.507l-.247.246L10.8,5.506A4.538,4.538,0,1,0,4.38,11.919l.247.247,6.422,6.412,6.422-6.412.247-.247A4.538,4.538,0,1,0,11.3,5.507Z"
                         transform="translate(0 0)" fill="#919199" />
               </g>
           </svg>
        </a>
    </div>

    <!-- Add to Cart button moved below the image -->
    <a class="cart-btn d-flex justify-content-center align-items-center @if (in_array($product->id, $cart_added)) active @endif"
        href="javascript:void(0)" onclick="showAddToCartModal({{ $product->id }})">
        <span class="cart-btn-text">
            {{ translate('Add to Cart') }}
        </span>
        <span><i class="las la-2x la-shopping-cart"></i></span>
    </a>
    <div class="p-2 p-md-3 text-left">
        <!-- Product name -->
        <h3 class="product-name">
            <a href="{{ $product_url }}" class="d-block text-reset hov-text-primary"
                title="{{ $product->getTranslation('name') }}">{{ $product->getTranslation('name') }}</a>
        </h3>

        <!-- Product Price -->
        <div class="product-price">
            <span class="fw-700">{{ home_discounted_base_price($product) }}</span>
        </div>
    </div>
</div>
