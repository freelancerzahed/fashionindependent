@extends('backend.layouts.app')

@section('content')
    <div class="aiz-titlebar text-left mt-2 mb-3">
        <div class="align-items-center">
            <h1 class="h3">{{ translate('All Feedbacks') }}</h1>
        </div>
    </div>


    <div class="card">
        <form class="" id="sort_questions" action="" method="GET">
            <div class="card-header row gutters-5">
                <div class="col">
                    <h5 class="mb-0 h6">{{ translate('Feedbacks') }}
                        {{--  <span class="btn btn-soft-danger">{{ \App\Model\Question::count() }}</span> --}}
                    </h5>

                </div>

                <div class="dropdown mb-2 mb-md-0">
                    <button class="btn border dropdown-toggle" type="button" data-toggle="dropdown">
                        {{ translate('Bulk Action') }}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="#"
                            onclick="bulk_delete()">{{ translate('Delete selection') }}</a>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="form-group mb-0">
                        <input type="text" class="form-control" id="search"
                            name="search"@isset($sort_search) value="{{ $sort_search }}" @endisset
                            placeholder="{{ translate('Type email or name & Enter') }}">
                    </div>
                </div>
            </div>
        </form>
        <div class="card-body">
            <div id="accordion">
                <div class="card">

                    @foreach ($responses as $key => $response)
                        <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                                <button class="btn " data-toggle="collapse" data-target="#collapse{{ $key }}"
                                    aria-expanded="true" aria-controls="collapse{{ $key }}">
                                    <strong class="mr-2"> #{{ $key + 1 }}</strong>{{ $response->question->question }}
                                </button>
                            </h5>
                        </div>

                        <div id="collapse{{ $key }}" class="collapse show" aria-labelledby="headingOne"
                            data-parent="#accordion">
                            <div class="card-body">
                                <ul class="list-group">


                                  
                                        @if ($response->question->type == 'radio')
                                        <li class="list-group-item d-flex justify-content-between">
                                            <div>
                                                <strong> Answer : </strong> {{ $response->answer->answer }}
                                            </div>
                                        </li>
                                        @elseif ($response->question->type == 'text')
                                        <li class="list-group-item">
                                        <div>
                                            <strong> Answer : </strong> {{ $response->aditional_info }}
                                        </div>
                                        </li>
                                        @elseif ($response->question->type == 'select')
                                        @php $selects = json_decode($response->answer_id); @endphp
                                       @foreach ($selects as $select_id )
                                       @php
                                           $selected_answer = App\Models\Answer::find($select_id);
                                       @endphp
                                       <li class="list-group-item">

                                        <strong>  Answer : </strong> {{$selected_answer->answer}}
                                      
                                       </li>
                                    
                                       @endforeach
                                       @if ($response->aditional_info != null)
                                       <p class="my-2 ml-2">Aditional Information : {{$response->aditional_info}}</p>  
                                     @endif
                                        @endif



                                    



                                </ul>

                            </div>
                        </div>
                    @endforeach
                </div>

            </div>
            {{--  <div class="aiz-pagination">
                {{ $questions->appends(request()->input())->links() }}
            </div> --}}
        </div>

    </div>


    <div class="modal fade" id="confirm-ban">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h6">{{ translate('Confirmation') }}</h5>
                    <button type="button" class="close" data-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>{{ translate('Do you really want to ban this question?') }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-dismiss="modal">{{ translate('Cancel') }}</button>
                    <a type="button" id="confirmation" class="btn btn-primary">{{ translate('Proceed!') }}</a>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="confirm-unban">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h6">{{ translate('Confirmation') }}</h5>
                    <button type="button" class="close" data-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>{{ translate('Do you really want to unban this question?') }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-dismiss="modal">{{ translate('Cancel') }}</button>
                    <a type="button" id="confirmationunban" class="btn btn-primary">{{ translate('Proceed!') }}</a>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('modal')
    @include('modals.delete_modal')
@endsection

@section('script')
    <script type="text/javascript">
        $(document).on("change", ".check-all", function() {
            if (this.checked) {
                // Iterate each checkbox
                $('.check-one:checkbox').each(function() {
                    this.checked = true;
                });
            } else {
                $('.check-one:checkbox').each(function() {
                    this.checked = false;
                });
            }

        });

        function sort_questions(el) {
            $('#sort_questions').submit();
        }

        function confirm_ban(url) {
            $('#confirm-ban').modal('show', {
                backdrop: 'static'
            });
            document.getElementById('confirmation').setAttribute('href', url);
        }

        function confirm_unban(url) {
            $('#confirm-unban').modal('show', {
                backdrop: 'static'
            });
            document.getElementById('confirmationunban').setAttribute('href', url);
        }

        function bulk_delete() {
            var data = new FormData($('#sort_questions')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "{{ route('bulk-customer-delete') }}",
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function(response) {
                    if (response == 1) {
                        location.reload();
                    }
                }
            });
        }
    </script>
@endsection
