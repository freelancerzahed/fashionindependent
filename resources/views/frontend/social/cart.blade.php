
@extends('frontend.layouts.app')

@section('content')
<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <!-- ================== Middle Section Start============= -->
    <div class="middle_side">
        @include('frontend/social/partials/menu')
        <!-- ================== Cart Content Start============= -->
        <section class="my-4" id="cart-details">
            <div class="cart-table">
                @if($carts->isEmpty())
                    <div class="text-center bg-white p-4 border">
                        <img class="mw-100 h-200px" src="{{ static_asset('assets/img/nothing.svg') }}" alt="Empty Cart">
                        <h5 class="mb-0 h5 mt-3">{{ translate('Your cart is empty') }}</h5>
                    </div>
                @else
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th><input type="checkbox" class="check-all"></th>
                                <th>{{ translate('Product') }}</th>
                                <th>{{ translate('Price') }}</th>
                                <th>{{ translate('Quantity') }}</th>
                                <th>{{ translate('Action') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($carts as $cart)
                                <tr>
                                    <td>
                                        <input type="checkbox" class="check-one check-one-{{ $cart->seller_id ?? 'default' }}" name="id[]" value="{{ $cart->id }}">
                                    </td>
                                    <td>
                                        <a href="{{ route('product', $cart->product->slug) }}">
                                            {{ $cart->product->getTranslation('name') }}
                                        </a>
                                    </td>
                                    <td>{{ home_discounted_base_price($cart->product) }}</td>
                                    <td>
                                        <input type="number" class="form-control w-100px" value="{{ $cart->quantity }}" min="1" onchange="updateQuantity({{ $cart->id }}, this)">
                                    </td>
                                    <td>
                                        <a href="#" class="text-danger" onclick="removeFromCartView(event, {{ $cart->id }})">
                                            <i class="la la-trash"></i> {{ translate('Remove') }}
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div id="cart_summary" class="mt-4">
                        <div class="card">
                            <div class="card-body">
                                <h5>{{ translate('Cart Summary') }}</h5>
                                <form id="apply-coupon-form" class="mb-3">
                                    <div class="input-group">
                                        <input type="text" name="coupon_code" class="form-control" placeholder="{{ translate('Enter coupon code') }}">
                                        <div class="input-group-append">
                                            <button type="button" id="coupon-apply" class="btn btn-primary">{{ translate('Apply') }}</button>
                                        </div>
                                    </div>
                                </form>
                                <form id="remove-coupon-form">
                                    <button type="button" id="coupon-remove" class="btn btn-danger">{{ translate('Remove Coupon') }}</button>
                                </form>
                                <p class="mt-3">{{ translate('Total:') }} <span id="cart-total">{{ $carts->sum('total') }}</span></p>
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </section>
        <!-- ================== Cart Content End============= -->
    </div>
    <!-- ================== Middle Section End============= -->
    <!-- ================== Right Section Side Start============= -->
    @include('frontend/social/partials/right_sidebar')
    <!-- ================== Right Section Side End============= -->
</main>
@endsection

@section('script')
    {{-- <script type="text/javascript">
        function removeFromCart(key) {
            $.post('{{ route('cart.remove') }}', {
                _token: AIZ.data.csrf,
                id: key
            }, function(data) {
                $('#cart-details').html(data.cart_view);
                updateNavCart(data.nav_cart_view, data.cart_count);
                AIZ.plugins.notify('success', '{{ translate('Item removed from cart') }}');
            });
        }

        function removeFromCartView(e, key) {
            e.preventDefault();
            removeFromCart(key);
        }

        function updateQuantity(key, element) {
            $.post('{{ route('cart.updateQuantity') }}', {
                _token: AIZ.data.csrf,
                id: key,
                quantity: element.value
            }, function(data) {
                updateNavCart(data.nav_cart_view, data.cart_count);
                $('#cart-details').html(data.cart_view);
                AIZ.extra.plusMinus();
            });
        }

        // Cart item selection
        $(document).on("change", ".check-all", function() {
            $('.check-one:checkbox').prop('checked', this.checked);
            updateCartStatus();
        });

        $(document).on("change", ".check-seller", function() {
            var value = this.value;
            $('.check-one-' + value + ':checkbox').prop('checked', this.checked);
            updateCartStatus();
        });

        $(document).on("change", ".check-one[name='id[]']", function(e) {
            e.preventDefault();
            updateCartStatus();
        });

        function updateCartStatus() {
            $('.aiz-refresh').addClass('active');
            let product_id = [];
            $(".check-one[name='id[]']:checked").each(function() {
                product_id.push($(this).val());
            });

            $.post('{{ route('cart.updateCartStatus') }}', {
                _token: AIZ.data.csrf,
                product_id: product_id
            }, function(data) {
                $('#cart-details').html(data);
                AIZ.extra.plusMinus();
                $('.aiz-refresh').removeClass('active');
            });
        }

        // Coupon apply
        $(document).on("click", "#coupon-apply", function() {
            @if (Auth::check())
                @if(Auth::user()->user_type != 'customer')
                    AIZ.plugins.notify('warning', "{{ translate('Please Login as a customer to apply coupon code.') }}");
                    return false;
                @endif

                var data = new FormData($('#apply-coupon-form')[0]);
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    method: "POST",
                    url: "{{ route('checkout.apply_coupon_code') }}",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data, textStatus, jqXHR) {
                        AIZ.plugins.notify(data.response_message.response, data.response_message.message);
                        $("#cart_summary").html(data.html);
                    }
                });
            @else
                $('#login_modal').modal('show');
            @endif
        });

        // Coupon remove
        $(document).on("click", "#coupon-remove", function() {
            @if (Auth::check() && Auth::user()->user_type == 'customer')
                var data = new FormData($('#remove-coupon-form')[0]);
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    method: "POST",
                    url: "{{ route('checkout.remove_coupon_code') }}",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data, textStatus, jqXHR) {
                        $("#cart_summary").html(data);
                    }
                });
            @endif
        });

        // Update navigation cart (placeholder, adjust as needed)
        function updateNavCart(nav_cart_view, cart_count) {
            $('#nav-cart').html(nav_cart_view);
            $('#cart-count').text(cart_count);
        }
    </script> --}}
@endsection
