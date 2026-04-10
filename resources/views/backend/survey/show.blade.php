@extends('backend.layouts.app')

@section('content')

<div class="row">
    <div class="col-lg-8 mx-auto">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0 h6">{{translate('Servey Information')}}</h5>
            </div>
            <div class="card-body">
                <form class="form-horizontal" action="{{ route('surveys.update') }}" method="POST" enctype="multipart/form-data">
                	@csrf
                    <input type="hidden" name="id" value="{{$survey->id}}" >
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Title')}}</label>
                        <div class="col-md-9">
                            <input type="text" value="{{$survey->title}}" placeholder="{{translate('Title')}}" id="serveyTitle" name="title" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Purpose')}}</label>
                        <div class="col-md-9">
                            <input type="text"  value="{{$survey->purpose}}" placeholder="{{translate('Purpose')}}" id="serveyPurpose" name="purpose" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-group mb-0 text-right">
                        <button type="submit" class="btn btn-primary">{{translate('Update')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection
