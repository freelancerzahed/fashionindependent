@extends('backend.layouts.app')

@section('content')

<div class="aiz-titlebar text-left mt-2 mb-3">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('Fashion Independent Campaigns')}}</h1>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <form method="GET" action="{{ route('admin.campaigns.index') }}" class="aiz-filter-form">
            <div class="row gutters-5 align-items-center">
                <div class="col">
                    <h5 class="mb-0 h6">{{translate('All Campaigns')}} 
                        <span class="badge badge-primary">{{ $campaigns->total() ?? 0 }}</span>
                    </h5>
                </div>
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" name="search" value="{{ $sort_search ?? '' }}" placeholder="{{ translate('Search campaigns') }}">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="submit">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-control form-control-sm" name="status" onchange="this.form.submit()">
                        <option value="">{{ translate('All Status') }}</option>
                        <option value="draft" @if($status_filter == 'draft') selected @endif>{{ translate('Draft') }}</option>
                        <option value="pending" @if($status_filter == 'pending') selected @endif>{{ translate('Pending') }}</option>
                        <option value="active" @if($status_filter == 'active') selected @endif>{{ translate('Approved') }}</option>
                        <option value="live" @if($status_filter == 'live') selected @endif>{{ translate('Live') }}</option>
                        <option value="completed" @if($status_filter == 'completed') selected @endif>{{ translate('Completed') }}</option>
                        <option value="cancelled" @if($status_filter == 'cancelled') selected @endif>{{ translate('Cancelled') }}</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-control form-control-sm" name="per_page" onchange="this.form.submit()">
                        <option value="10" @if($per_page == 10) selected @endif>10 {{ translate('per page') }}</option>
                        <option value="15" @if($per_page == 15) selected @endif>15 {{ translate('per page') }}</option>
                        <option value="25" @if($per_page == 25) selected @endif>25 {{ translate('per page') }}</option>
                        <option value="50" @if($per_page == 50) selected @endif>50 {{ translate('per page') }}</option>
                    </select>
                </div>
            </div>
        </form>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover table-sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{{translate('Title')}}</th>
                        <th>{{translate('Creator')}}</th>
                        <th>{{translate('Goal/Funded')}}</th>
                        <th>{{translate('Status')}}</th>
                        <th>{{translate('Created')}}</th>
                        <th class="text-center">{{translate('Actions')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($campaigns as $campaign)
                    <tr>
                        <td>{{ $campaign->id }}</td>
                        <td>
                            <a href="{{ route('admin.campaigns.show', $campaign->id) }}" class="text-primary font-weight-bold" title="{{ $campaign->title }}">
                                {{ \Illuminate\Support\Str::limit($campaign->title, 40) }}
                            </a>
                            <br>
                            <small class="text-muted">{{ \Illuminate\Support\Str::limit($campaign->description, 60) }}</small>
                        </td>
                        <td>
                            @if($campaign->user)
                                <div class="font-size-sm font-weight-bold">{{ $campaign->user->name }}</div>
                                <small class="text-muted">{{ $campaign->user->email }}</small>
                                @if($campaign->creator)
                                <br>
                                <small class="badge badge-info">{{ $campaign->creator->brand_name ?? 'Brand' }}</small>
                                @endif
                            @else
                                <span class="text-muted">-</span>
                            @endif
                        </td>
                        <td>
                            <div class="font-weight-bold">{{ format_price($campaign->current_funding) }}</div>
                            <small class="text-muted">/ {{ format_price($campaign->funding_goal) }}</small>
                            <br>
                            @if($campaign->funding_goal > 0)
                                <div class="progress mt-1" style="height: 5px;">
                                    <div class="progress-bar" style="width: {{ min(round(($campaign->current_funding / $campaign->funding_goal) * 100, 1), 100) }}%"></div>
                                </div>
                            @endif
                        </td>
                        <td>
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
                        </td>
                        <td>
                            <small>{{ $campaign->created_at->format('M d, Y') }}</small>
                        </td>
                        <td class="text-center">
                            <div class="btn-group btn-group-sm" role="group">
                                <a class="btn btn-soft-primary" href="{{ route('admin.campaigns.show', $campaign->id) }}" title="{{ translate('View') }}">
                                    <i class="las la-eye"></i>
                                </a>
                                @can('edit_campaign')
                                    <a class="btn btn-soft-warning" href="{{ route('admin.campaigns.edit', $campaign->id) }}" title="{{ translate('Edit') }}">
                                        <i class="las la-edit"></i>
                                    </a>
                                @endcan
                                @can('approve_campaign')
                                    @if($campaign->status == 'pending' || $campaign->status == 'draft')
                                        <form method="POST" action="{{ route('admin.campaigns.approve', $campaign->id) }}" class="d-inline" style="display: inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-soft-success" title="{{ translate('Approve') }}" onclick="return confirm('{{ translate('Approve this campaign?') }}');">
                                                <i class="las la-check"></i>
                                            </button>
                                        </form>
                                    @endif
                                @endcan
                                @can('delete_campaign')
                                    <a class="btn btn-soft-danger confirm-delete" href="{{ route('admin.campaigns.destroy', $campaign->id) }}" title="{{ translate('Delete') }}">
                                        <i class="las la-trash"></i>
                                    </a>
                                @endcan
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="text-center py-5">
                            <i class="las la-inbox" style="font-size: 48px; color: #ccc;"></i>
                            <p class="text-muted mt-3">{{ translate('No campaigns found') }}</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="text-muted font-size-sm">
                {{ translate('Showing') }} {{ $campaigns->firstItem() ?? 0 }} {{ translate('to') }} {{ $campaigns->lastItem() ?? 0 }} 
                {{ translate('of') }} {{ $campaigns->total() }} {{ translate('campaigns') }}
            </div>
            <div class="aiz-pagination">
                {{ $campaigns->render('pagination::bootstrap-4') }}
            </div>
        </div>
    </div>
</div>

@endsection
