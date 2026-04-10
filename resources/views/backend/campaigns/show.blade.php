@extends('backend.layouts.app')

@section('content')

<div class="aiz-titlebar text-left mt-2 mb-3">
    <div class="row align-items-center">
        <div class="col-md-8">
            <h1 class="h3">{{ $campaign->title }}</h1>
            <p class="text-muted">
                @php
                    $status_class = [
                        'draft' => 'badge-warning',
                        'pending' => 'badge-info',
                        'active' => 'badge-success',
                        'live' => 'badge-primary',
                        'completed' => 'badge-success',
                        'cancelled' => 'badge-danger',
                    ];
                @endphp
                <span class="badge {{ $status_class[$campaign->status] ?? 'badge-secondary' }}">
                    {{ ucfirst($campaign->status) }}
                </span>
            </p>
        </div>
        <div class="col-md-4 text-right">
            <a href="{{ route('admin.campaigns.index') }}" class="btn btn-secondary">
                <i class="las la-arrow-left"></i> {{ translate('Back') }}
            </a>
            @can('edit_campaign')
                <a href="{{ route('admin.campaigns.edit', $campaign->id) }}" class="btn btn-primary">
                    <i class="las la-edit"></i> {{ translate('Edit') }}
                </a>
            @endcan
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-8">
        <!-- Product Images Gallery -->
        @if($campaign->product_images && count($campaign->product_images) > 0)
        <div class="card mb-3">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Product Images') }}</h6>
            </div>
            <div class="card-body">
                <!-- Image Gallery -->
                <div class="row">
                    @forelse($campaign->product_images as $index => $image)
                    <div class="col-md-4 mb-3">
                        <div class="position-relative">
                            @php
                                $imageUrl = asset('storage/' . $image['path']);
                                $imageType = $image['type'] ?? 'additional';
                            @endphp
                            <img src="{{ $imageUrl }}" alt="{{ $imageType }}" class="img-fluid rounded" style="height: 200px; object-fit: cover; width: 100%;">
                            
                            <div class="position-absolute" style="top: 0; right: 0;">
                                <span class="badge badge-primary m-2">{{ ucfirst($imageType) }}</span>
                            </div>

                            <div class="position-absolute" style="bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 5px; display: flex; justify-content: space-between; align-items: center;">
                                <small class="text-white">{{ $image['name'] ?? 'Image' }}</small>
                                @can('edit_campaign')
                                <form method="POST" action="{{ route('admin.campaigns.delete-image', [$campaign->id, $index]) }}" class="d-inline" onsubmit="return confirm('{{ translate('Delete this image?') }}');">
                                    @csrf
                                    <button type="submit" class="btn btn-sm btn-danger" title="{{ translate('Delete') }}">
                                        <i class="las la-trash"></i>
                                    </button>
                                </form>
                                @endcan
                            </div>
                        </div>
                    </div>
                    @empty
                    <div class="col-12 text-center py-4">
                        <p class="text-muted">{{ translate('No images uploaded yet') }}</p>
                    </div>
                    @endforelse
                </div>

                @can('edit_campaign')
                <hr>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#uploadImagesModal">
                    <i class="las la-plus"></i> {{ translate('Upload More Images') }}
                </button>
                @endcan
            </div>
        </div>
        @endif

        <!-- Campaign Details Card -->
        <div class="card mb-3">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Campaign Details') }}</h6>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Creator') }}</h6>
                        @if($campaign->user)
                            <p><strong>{{ $campaign->user->name }}</strong></p>
                            <p class="text-muted">{{ $campaign->user->email }}</p>
                        @else
                            <p class="text-muted">-</p>
                        @endif
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Created Date') }}</h6>
                        <p>{{ $campaign->created_at->format('Y-m-d H:i') }}</p>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Created Date') }}</h6>
                        <p>{{ $campaign->created_at->format('Y-m-d H:i') }}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Number of Backers') }}</h6>
                        <p><strong>{{ $campaign->backer_count ?? 0 }}</strong></p>
                    </div>
                </div>

                <div class="mb-3">
                    <h6 class="text-muted mb-2">{{ translate('Description') }}</h6>
                    <p>{{ $campaign->description }}</p>
                </div>

                @if(!empty($campaign->tech_pack_file))
                <div class="mb-3">
                    <h6 class="text-muted mb-2">{{ translate('Tech Pack File') }}</h6>
                    <a href="{{ asset('storage/' . $campaign->tech_pack_file) }}" target="_blank" class="btn btn-sm btn-info">
                        <i class="las la-download"></i> {{ translate('Download') }}
                    </a>
                </div>
                @endif

                @if(!empty($campaign->materials))
                <div class="mb-3">
                    <h6 class="text-muted mb-2">{{ translate('Materials') }}</h6>
                    @php
                        $matData = $campaign->materials ?? [];
                        if (is_string($matData)) {
                            $decoded = @json_decode($matData, true);
                            $matData = is_array($decoded) ? $decoded : explode(',', $matData);
                        }
                        if (!is_array($matData)) {
                            $matData = [];
                        }
                        $matDisplay = implode(', ', array_filter(array_map(function($v) { 
                            return is_string($v) ? trim($v) : (is_array($v) ? '' : (string)$v); 
                        }, $matData)));
                    @endphp
                    <p>{{ $matDisplay ?: 'N/A' }}</p>
                </div>
                @endif

                @if(!empty($campaign->colors))
                <div class="mb-3">
                    <h6 class="text-muted mb-2">{{ translate('Available Colors') }}</h6>
                    @php
                        $colData = $campaign->colors ?? [];
                        if (is_string($colData)) {
                            $decoded = @json_decode($colData, true);
                            $colData = is_array($decoded) ? $decoded : explode(',', $colData);
                        }
                        if (!is_array($colData)) {
                            $colData = [];
                        }
                    @endphp
                    <div class="d-flex flex-wrap">
                        @forelse($colData as $color)
                            @if(is_string($color))
                            <span class="badge badge-primary mr-2">{{ trim($color) }}</span>
                            @endif
                        @empty
                            <span class="text-muted">N/A</span>
                        @endforelse
                    </div>
                </div>
                @endif

                @if(!empty($campaign->sizes))
                <div class="mb-3">
                    <h6 class="text-muted mb-2">{{ translate('Available Sizes') }}</h6>
                    @php
                        $sizeData = $campaign->sizes ?? [];
                        if (is_string($sizeData)) {
                            $decoded = @json_decode($sizeData, true);
                            $sizeData = is_array($decoded) ? $decoded : explode(',', $sizeData);
                        }
                        if (!is_array($sizeData)) {
                            $sizeData = [];
                        }
                    @endphp
                    <div class="d-flex flex-wrap">
                        @forelse($sizeData as $size)
                            @if(is_string($size))
                            <span class="badge badge-primary mr-2">{{ trim($size) }}</span>
                            @endif
                        @empty
                            <span class="text-muted">N/A</span>
                        @endforelse
                    </div>
                </div>
                @endif
            </div>
        </div>

        <!-- Funding Card -->
        <div class="card mb-3">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Funding Progress') }}</h6>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Funding Goal') }}</h6>
                        <p class="h5"><strong>{{ format_price($campaign->funding_goal) }}</strong></p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Current Funding') }}</h6>
                        <p class="h5"><strong>{{ format_price($campaign->current_funding) }}</strong></p>
                    </div>
                </div>

                <div class="mb-3">
                    <div class="progress" style="height: 25px;">
                        @php
                            $percentage = $campaign->funding_goal > 0 ? min(round(($campaign->current_funding / $campaign->funding_goal) * 100, 1), 100) : 0;
                        @endphp
                        <div class="progress-bar" role="progressbar" style="width: {{ $percentage }}%" aria-valuenow="{{ $percentage }}" aria-valuemin="0" aria-valuemax="100">
                            {{ $percentage }}%
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Launch Date') }}</h6>
                        <p>{{ $campaign->launch_date?->format('Y-m-d') ?? translate('Not launched yet') }}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('End Date') }}</h6>
                        <p>{{ $campaign->end_date?->format('Y-m-d') ?? '-' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Manufacturing Card -->
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Manufacturing Details') }}</h6>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Manufacturing Location') }}</h6>
                        <p>{{ $campaign->manufacturing_location ?? '-' }}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Manufacturing Partner') }}</h6>
                        <p>{{ $campaign->manufacturing_partner ?? '-' }}</p>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Expected Delivery Date') }}</h6>
                        <p>{{ $campaign->expected_delivery_date?->format('Y-m-d') ?? '-' }}</p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">{{ translate('Actual Delivery Date') }}</h6>
                        <p>{{ $campaign->actual_delivery_date?->format('Y-m-d') ?? '-' }}</p>
                    </div>
                </div>

                @if($campaign->delivery_notes)
                <div class="mb-3">
                    <h6 class="text-muted mb-2">{{ translate('Delivery Notes') }}</h6>
                    <p>{{ $campaign->delivery_notes }}</p>
                </div>
                @endif
            </div>
        </div>
    </div>

    <!-- Sidebar -->
    <div class="col-md-4">
        <!-- Actions Card -->
        <div class="card mb-3">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Actions') }}</h6>
            </div>
            <div class="card-body">
                @can('approve_campaign')
                    @if($campaign->status === 'pending' || $campaign->status === 'draft')
                        <form method="POST" action="{{ route('admin.campaigns.approve', $campaign->id) }}" class="mb-2">
                            @csrf
                            <button type="submit" class="btn btn-success btn-block" onclick="return confirm('{{ translate('Approve this campaign?') }}');">
                                <i class="las la-check"></i> {{ translate('Approve Campaign') }}
                            </button>
                        </form>

                        <div class="mb-2">
                            <button type="button" class="btn btn-danger btn-block" data-toggle="modal" data-target="#rejectModal">
                                <i class="las la-times"></i> {{ translate('Reject Campaign') }}
                            </button>
                        </div>
                    @endif

                    @if($campaign->status === 'active')
                        <form method="POST" action="{{ route('admin.campaigns.mark-live', $campaign->id) }}" class="mb-2">
                            @csrf
                            <button type="submit" class="btn btn-primary btn-block" onclick="return confirm('{{ translate('Mark campaign as live?') }}');">
                                <i class="las la-play-circle"></i> {{ translate('Mark as Live') }}
                            </button>
                        </form>
                    @endif

                    @if($campaign->status === 'live')
                        <form method="POST" action="{{ route('admin.campaigns.mark-completed', $campaign->id) }}" class="mb-2">
                            @csrf
                            <button type="submit" class="btn btn-success btn-block" onclick="return confirm('{{ translate('Mark campaign as completed?') }}');">
                                <i class="las la-flag-checkered"></i> {{ translate('Mark as Completed') }}
                            </button>
                        </form>
                    @endif
                @endcan

                @can('delete_campaign')
                    <a class="btn btn-outline-danger btn-block" href="{{ route('admin.campaigns.destroy', $campaign->id) }}" onclick="return confirm('{{ translate('Are you sure?') }}');">
                        <i class="las la-trash"></i> {{ translate('Delete Campaign') }}
                    </a>
                @endcan
            </div>
        </div>

        <!-- Statistics Card -->
        <div class="card mb-3">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Campaign Statistics') }}</h6>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <p class="text-muted mb-1">{{ translate('Total Views') }}</p>
                    <h5>{{ $campaign->views ?? 0 }}</h5>
                </div>
                <div class="mb-3">
                    <p class="text-muted mb-1">{{ translate('Total Shares') }}</p>
                    <h5>{{ $campaign->shares ?? 0 }}</h5>
                </div>
                <div class="mb-3">
                    <p class="text-muted mb-1">{{ translate('Backers') }}</p>
                    <h5>{{ $campaign->backer_count ?? 0 }}</h5>
                </div>
            </div>
        </div>

        <!-- Rejection Reason Card -->
        @if($campaign->rejection_reason)
        <div class="card border-danger">
            <div class="card-header bg-danger">
                <h6 class="mb-0 text-white">{{ translate('Rejection Reason') }}</h6>
            </div>
            <div class="card-body">
                <p>{{ $campaign->rejection_reason }}</p>
            </div>
        </div>
        @endif
    </div>
</div>

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

<!-- Reject Modal -->
<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog" aria-labelledby="rejectModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="rejectModalLabel">{{ translate('Reject Campaign') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="{{ route('admin.campaigns.reject', $campaign->id) }}" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="form-group">
                        <label for="rejection_reason">{{ translate('Rejection Reason') }} *</label>
                        <textarea class="form-control" id="rejection_reason" name="rejection_reason" rows="5" required></textarea>
                        <small class="form-text text-muted">{{ translate('Provide a detailed reason for rejection') }}</small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ translate('Cancel') }}</button>
                    <button type="submit" class="btn btn-danger">{{ translate('Reject Campaign') }}</button>
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
