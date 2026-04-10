@extends('frontend.layouts.app')

@section('content')
<section class="container feedback-layout py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
            <div class="card border-0 shadow-sm rounded">
                <div class="mmf-feedback-header text-center py-4 bg-white border-bottom">
                    <h1 class="fw-bold text-dark">Mirror Me Fashion</h1>
                    <p class="text-muted">Beta Feedback</p>
                </div>

                <div class="card-body p-4">
                    <p class="text-center mb-4">
                        Welcome to the Beta launch of the world's first
                        <a href="#" class="text-primary fw-bold">AI-Powered Virtual Fashion Stylist</a>.
                        Your feedback is invaluable!
                    </p>

                    <form method="POST" action="{{ route('feedback.store') }}" enctype="multipart/form-data">
                        @csrf
                        <input type="hidden" name="feedback[survey_id]" value="{{ $survey->id }}">

                        <!-- User Info -->
                        <div class="mb-4">
                            <h5 class="fw-semibold">Tell Us About Yourself</h5>
                            <div class="mb-3">
                                <label for="feedback_name_input" class="form-label">Full Name (Optional)</label>
                                <input type="text" class="form-control" id="feedback_name_input" name="feedback[name]" placeholder="John Doe">
                            </div>
                            <div>
                                <label for="feedback_email_input" class="form-label">Email Address (Optional)</label>
                                <input type="email" class="form-control" id="feedback_email_input" name="feedback[email]" placeholder="your@email.com">
                            </div>
                        </div>

                        <!-- Survey Questions -->
                        <div class="questions-section">
                            @foreach ($survey->questions as $key => $question)
                                <div class="mb-4 p-3 border rounded">
                                    <label class="fw-bold">{{ $question->question }}</label>

                                    @foreach ($question->answers as $answer)
                                        @if ($question->type == 'text')
                                            <textarea class="form-control mt-2" name="responses[{{$key}}][additional_info]" rows="4" placeholder="Your response here"></textarea>
                                            <input type="hidden" name="responses[{{$key}}][answer_id]" value="{{$answer->id}}">

                                        @elseif ($question->type == 'radio')
                                            <div class="form-check mt-2">
                                                <input type="radio" class="form-check-input" id="answer{{$answer->id}}" name="responses[{{$key}}][answer_id]" value="{{$answer->id}}">
                                                <label class="form-check-label" for="answer{{$answer->id}}">{{ $answer->answer }}</label>
                                            </div>

                                        @elseif ($question->type == 'select')
                                            <div class="form-check mt-2">
                                                <input type="checkbox" class="form-check-input" id="answer{{$answer->id}}" name="responses[{{$key}}][answer_id][]" value="{{$answer->id}}">
                                                <label class="form-check-label" for="answer{{$answer->id}}">{{ $answer->answer }}</label>
                                            </div>

                                        @elseif ($question->type == 'file')
                                            <div class="mt-3">
                                                <label class="form-label" for="answer{{$answer->id}}">Upload File</label>
                                                <input type="hidden" name="responses[{{$key}}][answer_id]" value="{{$answer->id}}">
                                                <input type="file" class="form-control-file" id="answer{{$answer->id}}" name="responses[{{$key}}][media]">
                                            </div>
                                        @endif
                                    @endforeach

                                    @if ($question->additional_info !== null)
                                        <textarea class="form-control mt-2" name="responses[{{$key}}][additional_info]" rows="3" placeholder="Additional comments"></textarea>
                                    @endif
                                </div>
                            @endforeach
                        </div>

                        <!-- Submit Button -->
                        <div class="text-center mt-4">
                            <button type="submit" class="btn btn-primary px-4 py-2">Submit Feedback</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.feedback-layout {
    min-height: 100vh;
    background-color: #f9f9f9;
}

.card {
    border-radius: 10px;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0,123,255,0.3);
}

.btn-primary {
    transition: all 0.3s ease-in-out;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,123,255,0.3);
}
</style>
@endsection
