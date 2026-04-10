@extends('backend.layouts.app')

@section('content')

<div class="aiz-titlebar text-left mt-2 mb-3">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('Campaign Statistics')}}</h1>
        </div>
        <div class="col-md-6 text-right">
            <a href="{{ route('admin.campaigns.index') }}" class="btn btn-secondary">
                <i class="las la-arrow-left"></i> {{ translate('Back') }}
            </a>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-3">
        <div class="card text-center">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Total Campaigns') }}</h6>
                <h2 class="text-primary mb-0">{{ $stats['total'] }}</h2>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card text-center">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Pending Review') }}</h6>
                <h2 class="text-info mb-0">{{ $stats['pending'] }}</h2>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card text-center">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Active Campaigns') }}</h6>
                <h2 class="text-success mb-0">{{ $stats['active'] }}</h2>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card text-center">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Live Campaigns') }}</h6>
                <h2 class="text-primary mb-0">{{ $stats['live'] }}</h2>
            </div>
        </div>
    </div>
</div>

<div class="row mt-3">
    <div class="col-md-3">
        <div class="card text-center">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Completed') }}</h6>
                <h2 class="text-success mb-0">{{ $stats['completed'] }}</h2>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card text-center">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Cancelled') }}</h6>
                <h2 class="text-danger mb-0">{{ $stats['cancelled'] }}</h2>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Total Funding Raised') }}</h6>
                <h4 class="text-success">{{ format_price($stats['total_funding']) }}</h4>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card">
            <div class="card-body">
                <h6 class="text-muted mb-2">{{ translate('Total Funding Goal') }}</h6>
                <h4 class="text-info">{{ format_price($stats['total_goal']) }}</h4>
            </div>
        </div>
    </div>
</div>

<div class="row mt-3">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Campaign Status Distribution') }}</h6>
            </div>
            <div class="card-body">
                <div class="list-group">
                    <div class="list-group-item d-flex align-items-center justify-content-between py-3">
                        <span class="text-muted">{{ translate('Pending Review') }}</span>
                        <span class="badge badge-info">{{ $stats['pending'] }}</span>
                    </div>
                    <div class="list-group-item d-flex align-items-center justify-content-between py-3">
                        <span class="text-muted">{{ translate('Approved') }}</span>
                        <span class="badge badge-success">{{ $stats['active'] }}</span>
                    </div>
                    <div class="list-group-item d-flex align-items-center justify-content-between py-3">
                        <span class="text-muted">{{ translate('Live') }}</span>
                        <span class="badge badge-primary">{{ $stats['live'] }}</span>
                    </div>
                    <div class="list-group-item d-flex align-items-center justify-content-between py-3">
                        <span class="text-muted">{{ translate('Completed') }}</span>
                        <span class="badge badge-success">{{ $stats['completed'] }}</span>
                    </div>
                    <div class="list-group-item d-flex align-items-center justify-content-between py-3">
                        <span class="text-muted">{{ translate('Cancelled') }}</span>
                        <span class="badge badge-danger">{{ $stats['cancelled'] }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">{{ translate('Funding Summary') }}</h6>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <p class="text-muted mb-1">{{ translate('Total Funding Raised') }}</p>
                    <h5 class="text-success">{{ format_price($stats['total_funding']) }}</h5>
                </div>
                <hr>
                <div class="mb-3">
                    <p class="text-muted mb-1">{{ translate('Total Funding Goal') }}</p>
                    <h5 class="text-info">{{ format_price($stats['total_goal']) }}</h5>
                </div>
                <hr>
                <div>
                    <p class="text-muted mb-1">{{ translate('Success Rate') }}</p>
                    @php
                        $success_rate = $stats['total_goal'] > 0 
                            ? round(($stats['total_funding'] / $stats['total_goal']) * 100, 2)
                            : 0;
                    @endphp
                    <h5 class="text-primary">{{ $success_rate }}%</h5>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: {{ min($success_rate, 100) }}%" aria-valuenow="{{ $success_rate }}" aria-valuemin="0" aria-valuemax="100">
                            {{ $success_rate }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection
