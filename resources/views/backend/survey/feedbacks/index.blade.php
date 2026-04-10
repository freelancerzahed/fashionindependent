@extends('backend.layouts.app')

@section('content')
<div class="aiz-titlebar text-left mt-2 mb-3">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('All feedbacks')}}</h1>
        </div>
       
    </div>
</div>
<div class="card">
    <div class="card-header d-block d-md-flex">
        <h5 class="mb-0 h6">{{ translate('feedbacks') }}</h5>
        <form class="" id="sort_serveys" action="" method="GET">
            <div class="box-inline pad-rgt pull-left">
                <div class="" style="min-width: 200px;">
                    <input type="text" class="form-control" id="search" name="search"@isset($sort_search) value="{{ $sort_search }}" @endisset placeholder="{{ translate('Type name & Enter') }}">
                </div>
            </div>
        </form>
    </div>
    @if ($feedbacks->count() > 0)
    <div class="card-body">
        <table class="table aiz-table mb-0">
          <thead>
                <tr>
                   
                    <th>{{translate('Title')}}</th>
                   
                    <th width="10%" class="text-right">{{translate('Options')}}</th>
                </tr>
            </thead> 
            <tbody>
                @foreach($feedbacks as $key => $feedback)
                    <tr>
                     
                        <td>{{$feedback->name}}</td>
                     
                          
                        <td class="text-right">
                            <a class="btn btn-soft-success btn-icon btn-circle btn-sm" href="{{route('feedbacks.show', $feedback->id)}}" title="View">
                                <i class="las la-eye"></i>
                            </a>
                            <a href="#" class="btn btn-soft-danger btn-icon btn-circle btn-sm confirm-delete" data-href="{{route('feedbacks.destroy', $feedback->id)}}" title="{{ translate('Delete') }}">
                                <i class="las la-trash"></i>
                            </a>
                         
                        </td>
                        
                    </tr>
                @endforeach
            </tbody>
        </table>
        <div class="aiz-pagination">
           
        </div>
    </div> 
</div>
    @endif
  
@endsection


@section('modal')
    @include('modals.delete_modal')
@endsection


@section('script')
    <script type="text/javascript">
  /*       function update_featured(el){
            if(el.checked){
                var status = 1;
            }
            else{
                var status = 0;
            }
            $.post('{{ route('categories.featured') }}', {_token:'{{ csrf_token() }}', id:el.value, status:status}, function(data){
                if(data == 1){
                    AIZ.plugins.notify('success', '{{ translate('Featured categories updated successfully') }}');
                }
                else{
                    AIZ.plugins.notify('danger', '{{ translate('Something went wrong') }}');
                }
            });
        } */
    </script>
@endsection
