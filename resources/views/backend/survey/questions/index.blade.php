@extends('backend.layouts.app')

@section('content')
<div class="row align-items-center">
    <div class="col-md-6">
        <h1 class="h3">{{translate('All Questions')}}</h1>
    </div>
    <div class="col-md-6 text-md-right">
        <a href="{{ route('questions.create') }}" class="btn btn-primary">
            <span>{{translate('Create New Question')}}</span>
        </a>
    </div>
</div>

    <div class="card">
        <form class="" id="sort_questions" action="" method="GET">
            <div class="card-header row gutters-5">
                <div class="col">
                    <h5 class="mb-0 h6">{{ translate('Questions') }}
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
                    @foreach ($questions as $key => $question)
                        <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                                <button class="btn " data-toggle="collapse" data-target="#collapse{{ $key }}"
                                    aria-expanded="true" aria-controls="collapse{{ $key }}">
                                    <strong class="mr-2"> #{{ $key + 1 }}</strong>{{ $question->question }}
                                </button>
                            </h5>
                        </div>

                        <div id="collapse{{ $key }}" class="collapse show" aria-labelledby="headingOne"
                            data-parent="#accordion">
                            <div class="card-body">
                                <ul class="list-group">

                                    @foreach ($question->answers as $akey => $answer)
                                        <li class="list-group-item d-flex justify-content-between">

                                            <div>
                                                <b class="mr-2">{{ $akey + 1 }})</b>{{ $answer->answer }}
                                            </div>
                                           @if ($question->type=='radio')
                                           <div>
                                            {{ intval(($answer->responses->count() * 100) / $question->responses->count()) }}%
                                        </div> 
                                           @endif
                                          
                                      
                                        </li>
                                    @endforeach


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
