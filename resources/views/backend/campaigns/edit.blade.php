@extends('backend.layouts.app')

@section('content')

<div class="aiz-titlebar text-left mt-2 mb-3">
    <div class="row align-items-center">
        <div class="col-md-8">
            <h1 class="h3">{{ translate('Edit Campaign') }}</h1>
        </div>
        <div class="col-md-4 text-right">
            <a href="{{ route('admin.campaigns.index') }}" class="btn btn-secondary">
                <i class="las la-arrow-left"></i> {{ translate('Back') }}
            </a>
        </div>
    </div>
</div>

<form action="{{ route('admin.campaigns.update', $campaign->id) }}" method="POST">
    @csrf
    @method('PUT')

    <div class="row">
        <div class="col-md-8">
            <!-- Image Management Section -->
            @if($campaign->product_images && count($campaign->product_images) > 0)
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Product Images') }}</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        @foreach($campaign->product_images as $index => $image)
                        <div class="col-md-4 mb-3">
                            <div class="position-relative">
                                @php
                                    $imageUrl = asset('storage/' . $image['path']);
                                    $imageType = $image['type'] ?? 'additional';
                                @endphp
                                <img src="{{ $imageUrl }}" alt="{{ $imageType }}" class="img-fluid rounded" style="height: 150px; object-fit: cover; width: 100%;">
                                
                                <span class="badge badge-primary position-absolute" style="top: 5px; right: 5px;">{{ ucfirst($imageType) }}</span>

                                <form method="POST" action="{{ route('admin.campaigns.delete-image', [$campaign->id, $index]) }}" class="d-inline" style="position: absolute; bottom: 5px; right: 5px;" onsubmit="return confirm('{{ translate('Delete this image?') }}');">
                                    @csrf
                                    <button type="submit" class="btn btn-sm btn-danger" title="{{ translate('Delete') }}">
                                        <i class="las la-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                        @endforeach
                    </div>
                    <hr>
                    <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#uploadImagesModal">
                        <i class="las la-plus"></i> {{ translate('Add More Images') }}
                    </button>
                </div>
            </div>
            @endif

            <!-- Basic Information -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Basic Information') }}</h6>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="title">{{ translate('Campaign Title') }}</label>
                        <input type="text" class="form-control" id="title" name="title" value="{{ $campaign->title }}" required>
                        @error('title')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="description">{{ translate('Campaign Description') }}</label>
                        <textarea class="form-control" id="description" name="description" rows="4">{{ $campaign->description }}</textarea>
                        @error('description')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="tech_pack_file">{{ translate('Tech Pack File') }}</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="tech_pack_file" name="tech_pack_file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip">
                            <label class="custom-file-label" for="tech_pack_file">{{ translate('Choose file') }}</label>
                        </div>
                        <small class="text-muted">{{ translate('Upload tech pack documentation (PDF, DOC, XLS, ZIP)') }}</small>
                    </div>

                    <div class="form-group">
                        <label for="materials">{{ translate('Materials') }}</label>
                        @php
                            $materialsValue = '';
                            $matData = $campaign->materials ?? [];
                            if (!empty($matData)) {
                                if (is_string($matData)) {
                                    $decoded = @json_decode($matData, true);
                                    $matData = is_array($decoded) ? $decoded : explode(',', $matData);
                                }
                                if (is_array($matData)) {
                                    $materialsValue = trim(implode(', ', array_filter(array_map(function($v) { 
                                        return is_string($v) ? trim($v) : (is_array($v) ? '' : (string)$v); 
                                    }, $matData))));
                                }
                            }
                        @endphp
                        <input type="text" class="form-control" id="materials" name="materials" value="{{ (string)$materialsValue }}" placeholder="{{ translate('e.g., Cotton, Polyester, Wool') }}">
                        <small class="text-muted">{{ translate('Separate multiple materials with commas') }}</small>
                    </div>

                    <div class="form-group">
                        <label for="colors">{{ translate('Available Colors') }}</label>
                        @php
                            $colorsValue = '';
                            $colData = $campaign->colors ?? [];
                            if (!empty($colData)) {
                                if (is_string($colData)) {
                                    $decoded = @json_decode($colData, true);
                                    $colData = is_array($decoded) ? $decoded : explode(',', $colData);
                                }
                                if (is_array($colData)) {
                                    $colorsValue = trim(implode(', ', array_filter(array_map(function($v) { 
                                        return is_string($v) ? trim($v) : (is_array($v) ? '' : (string)$v); 
                                    }, $colData))));
                                }
                            }
                        @endphp
                        <input type="text" class="form-control" id="colors" name="colors" value="{{ (string)$colorsValue }}" placeholder="{{ translate('e.g., Red, Blue, Green') }}">
                        <small class="text-muted">{{ translate('Separate multiple colors with commas') }}</small>
                    </div>

                    <div class="form-group">
                        <label for="sizes">{{ translate('Available Sizes') }}</label>
                        @php
                            $sizesValue = '';
                            $sizeData = $campaign->sizes ?? [];
                            if (!empty($sizeData)) {
                                if (is_string($sizeData)) {
                                    $decoded = @json_decode($sizeData, true);
                                    $sizeData = is_array($decoded) ? $decoded : explode(',', $sizeData);
                                }
                                if (is_array($sizeData)) {
                                    $sizesValue = trim(implode(', ', array_filter(array_map(function($v) { 
                                        return is_string($v) ? trim($v) : (is_array($v) ? '' : (string)$v); 
                                    }, $sizeData))));
                                }
                            }
                        @endphp
                        <input type="text" class="form-control" id="sizes" name="sizes" value="{{ (string)$sizesValue }}" placeholder="{{ translate('e.g., XS, S, M, L, XL, XXL') }}">
                        <small class="text-muted">{{ translate('Separate multiple sizes with commas') }}</small>
                    </div>
                </div>
            </div>

            <!-- Funding Information -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Funding Information') }}</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="funding_goal">{{ translate('Funding Goal') }}</label>
                                <input type="number" class="form-control" id="funding_goal" name="funding_goal" value="{{ $campaign->funding_goal }}" step="0.01" required>
                                @error('funding_goal')
                                    <span class="text-danger">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="current_funding">{{ translate('Current Funding') }}</label>
                                <input type="number" class="form-control" id="current_funding" name="current_funding" value="{{ $campaign->current_funding }}" step="0.01" required>
                                @error('current_funding')
                                    <span class="text-danger">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Timeline Information -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Timeline') }}</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="expected_delivery_date">{{ translate('Expected Delivery Date') }}</label>
                                <input type="date" class="form-control" id="expected_delivery_date" name="expected_delivery_date" value="{{ $campaign->expected_delivery_date?->format('Y-m-d') }}">
                                @error('expected_delivery_date')
                                    <span class="text-danger">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="actual_delivery_date">{{ translate('Actual Delivery Date') }}</label>
                                <input type="date" class="form-control" id="actual_delivery_date" name="actual_delivery_date" value="{{ $campaign->actual_delivery_date?->format('Y-m-d') }}">
                                @error('actual_delivery_date')
                                    <span class="text-danger">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Campaign Questionnaire -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Campaign Questionnaire') }}</h6>
                </div>
                <div class="card-body">
                    <!-- Question 1: Previous Sales -->
                    <div class="form-group mb-4">
                        <label class="font-weight-bold text-dark">{{ translate('I have previously sold this product to customers (check all that apply)') }}</label>
                        <div class="mt-2">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="sold_own_website" name="previous_sales[]" value="own_website" 
                                    @if($campaign->previous_sales && in_array('own_website', (array)json_decode($campaign->previous_sales ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="sold_own_website">
                                    {{ translate('On a website I own') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="sold_third_party" name="previous_sales[]" value="third_party" 
                                    @if($campaign->previous_sales && in_array('third_party', (array)json_decode($campaign->previous_sales ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="sold_third_party">
                                    {{ translate('On a third-party website') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="sold_physical_store" name="previous_sales[]" value="physical_store" 
                                    @if($campaign->previous_sales && in_array('physical_store', (array)json_decode($campaign->previous_sales ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="sold_physical_store">
                                    {{ translate('In a physical store') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="sold_other" name="previous_sales[]" value="other" 
                                    @if($campaign->previous_sales && in_array('other', (array)json_decode($campaign->previous_sales ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="sold_other">
                                    {{ translate('Other') }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <!-- Question 2: Existing Inventory -->
                    <div class="form-group mb-4">
                        <label class="font-weight-bold text-dark">{{ translate('I have existing inventory') }}</label>
                        <div class="mt-2">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="inventory_1_50" name="existing_inventory[]" value="1_50" 
                                    @if($campaign->existing_inventory && in_array('1_50', (array)json_decode($campaign->existing_inventory ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="inventory_1_50">
                                    {{ translate('1 – 50 units') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="inventory_50_200" name="existing_inventory[]" value="50_200" 
                                    @if($campaign->existing_inventory && in_array('50_200', (array)json_decode($campaign->existing_inventory ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="inventory_50_200">
                                    {{ translate('50 – 200 units') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="inventory_200_500" name="existing_inventory[]" value="200_500" 
                                    @if($campaign->existing_inventory && in_array('200_500', (array)json_decode($campaign->existing_inventory ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="inventory_200_500">
                                    {{ translate('200 - 500 units') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="inventory_500_plus" name="existing_inventory[]" value="500_plus" 
                                    @if($campaign->existing_inventory && in_array('500_plus', (array)json_decode($campaign->existing_inventory ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="inventory_500_plus">
                                    {{ translate('500+ units') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="inventory_none" name="existing_inventory[]" value="none" 
                                    @if($campaign->existing_inventory && in_array('none', (array)json_decode($campaign->existing_inventory ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="inventory_none">
                                    {{ translate('I do not have inventory') }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <!-- Question 3: Manufacturer Restock Time -->
                    <div class="form-group mb-4">
                        <label class="font-weight-bold text-dark">{{ translate('I have an existing manufacturer who can restock my inventory in') }}</label>
                        <div class="mt-2">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="restock_10days" name="manufacturer_restock[]" value="10_days" 
                                    @if($campaign->manufacturer_restock && in_array('10_days', (array)json_decode($campaign->manufacturer_restock ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="restock_10days">
                                    {{ translate('10 days') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="restock_14days" name="manufacturer_restock[]" value="14_days" 
                                    @if($campaign->manufacturer_restock && in_array('14_days', (array)json_decode($campaign->manufacturer_restock ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="restock_14days">
                                    {{ translate('14 days') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="restock_30days" name="manufacturer_restock[]" value="30_days" 
                                    @if($campaign->manufacturer_restock && in_array('30_days', (array)json_decode($campaign->manufacturer_restock ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="restock_30days">
                                    {{ translate('30 days') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="restock_60days" name="manufacturer_restock[]" value="60_days" 
                                    @if($campaign->manufacturer_restock && in_array('60_days', (array)json_decode($campaign->manufacturer_restock ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="restock_60days">
                                    {{ translate('60 days') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="restock_60plus" name="manufacturer_restock[]" value="60_plus" 
                                    @if($campaign->manufacturer_restock && in_array('60_plus', (array)json_decode($campaign->manufacturer_restock ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="restock_60plus">
                                    {{ translate('60+ days') }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <!-- Question 4: Manufacturing Assistance -->
                    <div class="form-group mb-4">
                        <label class="font-weight-bold text-dark">{{ translate('I require manufacturing assistance (check all that apply)') }}</label>
                        <div class="mt-2">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="assist_techpack" name="manufacturing_assistance[]" value="techpack" 
                                    @if($campaign->manufacturing_assistance && in_array('techpack', (array)json_decode($campaign->manufacturing_assistance ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="assist_techpack">
                                    {{ translate('I have a factory ready tech pack') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="assist_partner" name="manufacturing_assistance[]" value="partner" 
                                    @if($campaign->manufacturing_assistance && in_array('partner', (array)json_decode($campaign->manufacturing_assistance ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="assist_partner">
                                    {{ translate('I have a manufacturing partner') }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <!-- Question 5: Business Registration -->
                    <div class="form-group mb-0">
                        <label class="font-weight-bold text-dark">{{ translate('My fashion brand is currently registered as a business') }}</label>
                        <div class="mt-2">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="business_yes" name="business_registration[]" value="yes" 
                                    @if($campaign->business_registration && in_array('yes', (array)json_decode($campaign->business_registration ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="business_yes">
                                    {{ translate('Yes') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="business_no" name="business_registration[]" value="no" 
                                    @if($campaign->business_registration && in_array('no', (array)json_decode($campaign->business_registration ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="business_no">
                                    {{ translate('No') }}
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="business_progress" name="business_registration[]" value="in_progress" 
                                    @if($campaign->business_registration && in_array('in_progress', (array)json_decode($campaign->business_registration ?? '[]', true))) checked @endif>
                                <label class="custom-control-label" for="business_progress">
                                    {{ translate('In progress') }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manufacturing Information -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Manufacturing Details') }}</h6>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="manufacturing_location">{{ translate('Manufacturing Location') }}</label>
                        <input type="text" class="form-control" id="manufacturing_location" name="manufacturing_location" value="{{ $campaign->manufacturing_location }}">
                    </div>

                    <div class="form-group">
                        <label for="manufacturing_partner">{{ translate('Manufacturing Partner') }}</label>
                        <input type="text" class="form-control" id="manufacturing_partner" name="manufacturing_partner" value="{{ $campaign->manufacturing_partner }}">
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="col-md-4">
            <!-- Status -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Campaign Status') }}</h6>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="status">{{ translate('Status') }}</label>
                        <select class="form-control" id="status" name="status" required>
                            <option value="draft" @if($campaign->status == 'draft') selected @endif>{{ translate('Draft') }}</option>
                            <option value="pending" @if($campaign->status == 'pending') selected @endif>{{ translate('Pending Review') }}</option>
                            <option value="active" @if($campaign->status == 'active') selected @endif>{{ translate('Approved') }}</option>
                            <option value="live" @if($campaign->status == 'live') selected @endif>{{ translate('Live') }}</option>
                            <option value="completed" @if($campaign->status == 'completed') selected @endif>{{ translate('Completed') }}</option>
                            <option value="cancelled" @if($campaign->status == 'cancelled') selected @endif>{{ translate('Cancelled') }}</option>
                        </select>
                        @error('status')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    @if($campaign->rejection_reason)
                    <div class="alert alert-danger" role="alert">
                        <h6 class="alert-heading">{{ translate('Rejection Reason') }}</h6>
                        {{ $campaign->rejection_reason }}
                    </div>
                    @endif

                    @if($campaign->status === 'cancelled' || $campaign->status === 'rejected')
                    <div class="form-group">
                        <label for="rejection_reason">{{ translate('Reason for Rejection/Cancellation') }}</label>
                        <textarea class="form-control" id="rejection_reason" name="rejection_reason" rows="3" readonly>{{ $campaign->rejection_reason }}</textarea>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Creator Information -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Creator Information') }}</h6>
                </div>
                <div class="card-body">
                    @if($campaign->user)
                    <p>
                        <strong>{{ $campaign->user->name }}</strong><br>
                        <small class="text-muted">{{ $campaign->user->email }}</small>
                    </p>
                    @else
                    <p class="text-muted">{{ translate('No creator assigned') }}</p>
                    @endif
                </div>
            </div>

            <!-- Funding Progress -->
            <div class="card mb-3">
                <div class="card-header">
                    <h6 class="mb-0">{{ translate('Funding Progress') }}</h6>
                </div>
                <div class="card-body">
                    @php
                        $percentage = $campaign->funding_goal > 0 ? min(round(($campaign->current_funding / $campaign->funding_goal) * 100, 1), 100) : 0;
                    @endphp
                    <div class="progress mb-2" style="height: 25px;">
                        <div class="progress-bar" role="progressbar" style="width: {{ $percentage }}%" aria-valuenow="{{ $percentage }}" aria-valuemin="0" aria-valuemax="100">
                            {{ $percentage }}%
                        </div>
                    </div>
                    <p class="text-center text-muted">
                        {{ format_price($campaign->current_funding) }} / {{ format_price($campaign->funding_goal) }}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Submit Button -->
    <div class="row">
        <div class="col-md-8">
            <button type="submit" class="btn btn-primary">
                <i class="las la-save"></i> {{ translate('Save Changes') }}
            </button>
            <a href="{{ route('admin.campaigns.index') }}" class="btn btn-secondary">
                {{ translate('Cancel') }}
            </a>
        </div>
    </div>
</form>

<!-- Upload Images Modal -->
<div class="modal fade" id="uploadImagesModal" tabindex="-1" role="dialog" aria-labelledby="uploadImagesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="uploadImagesModalLabel">{{ translate('Upload Campaign Images') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="{{ route('admin.campaigns.upload-images', $campaign->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                    <div class="form-group">
                        <label for="front_image">{{ translate('Front Image') }}</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="front_image" name="product_images[]" accept="image/*">
                                <label class="custom-file-label" for="front_image">{{ translate('Choose file') }}</label>
                            </div>
                        </div>
                        <small class="text-muted">{{ translate('Upload front view of the product') }}</small>
                    </div>

                    <div class="form-group">
                        <label for="back_image">{{ translate('Back Image') }}</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="back_image" name="product_images[]" accept="image/*">
                                <label class="custom-file-label" for="back_image">{{ translate('Choose file') }}</label>
                            </div>
                        </div>
                        <small class="text-muted">{{ translate('Upload back view of the product') }}</small>
                    </div>

                    <div class="form-group">
                        <label for="additional_images">{{ translate('Additional Images') }}</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="additional_images" name="product_images[]" multiple accept="image/*">
                                <label class="custom-file-label" for="additional_images">{{ translate('Choose files') }}</label>
                            </div>
                        </div>
                        <small class="text-muted">{{ translate('Upload additional product images') }}</small>
                    </div>

                    <div class="alert alert-info">
                        <i class="las la-info-circle"></i> {{ translate('Maximum file size: 5MB per image') }}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ translate('Cancel') }}</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="las la-upload"></i> {{ translate('Upload Images') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.querySelectorAll('.custom-file-input').forEach(input => {
    input.addEventListener('change', function() {
        const label = this.nextElementSibling;
        const files = this.files;
        if (files.length > 0) {
            label.textContent = Array.from(files).map(f => f.name).join(', ');
        } else {
            label.textContent = '{{ translate("Choose file") }}';
        }
    });
});
</script>

@endsection
