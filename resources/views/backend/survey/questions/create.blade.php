@extends('backend.layouts.app')

@section('content')

	<div class="col-sm-12">

		<div class="card">
			<div class="card-header">
				<h5 class="mb-0 h6">{{translate('Questions Form')}}</h5>
			</div>
		
			<div class="card-body">
				<form action="{{ route('questions.store') }}" method="post">
					@csrf
					<div class="row">
						<div class="col-lg-12 form-horizontal" id="form">
							<div class="form-group row">
								<label class="col-md-3 col-form-label">{{translate('Question')}}</label>
								<div class="col-md-9">
									<input type="text" placeholder="{{translate('Question')}}" id="name" name="question[question]" class="form-control" required>
								</div>
							</div>
							<div class="form-group row">
								<label class="col-md-3 col-form-label">
									{{translate('Ordering Number')}}
								</label>
								<div class="col-md-9">
									<input type="number" name="orders" class="form-control" id="order_level" placeholder="{{translate('Order Level')}}">
									<small>{{translate('Higher number has high priority')}}</small>
								</div>
							</div>
							<div class="form-group row">
								<label class="col-md-3 col-form-label">
									{{translate('Editional Information')}}
								</label>
								<div class="col-md-9">
									<input type="text" name="question[editional_info]" class="form-control" id="editional_info" placeholder="{{translate('Editional Information')}}">
								
								</div>
							</div>
							<div class="form-group row" id="survey">
								<label class="col-md-3 col-from-label">{{translate('Select Survey')}} <span class="text-danger">*</span></label>
								<div class="col-md-8">
									<select class="form-control aiz-selectpicker"  required name="survey_id"  data-live-search="true" required>
										<option value="">Choose...</option>
										@foreach (App\Models\Survey::get() as $survey)
										<option value="{{$survey->id}}">{{$survey->title}}</option>
										@endforeach
											
											
										  
									</select>
								</div>
							</div>

							<div class="form-group row" id="questionType">
								<label class="col-md-3 col-from-label">{{translate('Select Question Type')}} <span class="text-danger">*</span></label>
								<div class="col-md-8">
								<select onchange="appenddToForm()" required name="question[type]"class="form-control aiz-selectpicker" id="selectedQuestion">
								  <option value="">Choose...</option>
								  <option value="text">Text</option>
								  <option value="select">Select</option>
								  <option value="radio">Radio</option>
								  <option value="file">File</option>
								</select>
								</div>
							</div>
						</div>
							  </div>
							  <div id="answerForm">
								
							  </div>
								
						</div>
						
					</div>
					<div class="form-group mb-0 text-right">
						<button type="submit" class="btn btn-primary">{{translate('Save')}}</button>
					</div>
				</form>
			</div>
		</div>

	</div>

@endsection

@section('script')
	<script type="text/javascript">

		var i = 0;

		function add_customer_choice_options(em){
			var j = $(em).closest('.form-group.row').find('.option').val();
			var str = '<div class="form-group row">'
							+'<div class="col-sm-6 col-sm-offset-4">'
								+`<input class="form-control" type="text" name="answers[][answer]" value="" required>`
							+'</div>'
							+'<div class="col-sm-2"> <span class="btn btn-icon btn-circle icon-lg" onclick="delete_choice_clearfix(this)"><i class="las la-times"></i></span>'
							+'</div>'
						+'</div>'
			$(em).parent().find('.customer_choice_options_types_wrap_child').append(str);
		}
		function delete_choice_clearfix(em){
			$(em).parent().parent().remove();
		}
		function appenddToForm(){
		
			let type = $('#selectedQuestion').val()
		
			//$('#form').removeClass('seller_form_border');
			if(type == 'text'){
				var str = '<div class="form-group row" style="background:rgba(0,0,0,0.1);padding:10px 0;">'
								
								+'<div class="col-lg-3">'
									+'<label class="col-from-label">Text</label>'
								+'</div>'
								+'<div class="col-lg-7">'
									+`<input class="form-control" value="1"  type="text" name="answers[][answer]" placeholder="{{ translate('Label') }}">`
								+'</div>'
								+'<div class="col-lg-2">'
									+'<span class="btn btn-icon btn-circle icon-lg" onclick="delete_choice_clearfix(this)"><i class="las la-times"></i></span>'
								+'</div>'
							+'</div>';
				$('#answerForm').html(str);
			}
			else if (type == 'select') {
				i++;
				var str = '<div class="form-group row" style="background:rgba(0,0,0,0.1);padding:10px 0;">'
								
								+'<div class="col-lg-3">'
									+'<label class="col-from-label">Select</label>'
								+'</div>'
								+'<div class="col-lg-7">'
									
									+'<div class="customer_choice_options_types_wrap_child">'

									+'</div>'
									+'<button class="btn btn-success pull-right" type="button" onclick="add_customer_choice_options(this)"><i class="glyphicon glyphicon-plus"></i> Add option</button>'
								+'</div>'
								+'<div class="col-lg-2">'
									+'<span class="btn btn-icon btn-circle icon-lg" onclick="delete_choice_clearfix(this)"><i class="las la-times"></i></span>'
								+'</div>'
							+'</div>';
				$('#answerForm').html(str);
			}
			else if (type == 'multi-select') {
				i++;
				var str = '<div class="form-group row" style="background:rgba(0,0,0,0.1);padding:10px 0;">'
								
								+'<div class="col-lg-3">'
									+'<label class="col-from-label">Multiple select</label>'
								+'</div>'
								+'<div class="col-lg-7">'
									+'<input class="form-control" type="text" name="label[]" placeholder="{{ translate('Multiple Select Label') }}" style="margin-bottom:10px">'
									+'<div class="customer_choice_options_types_wrap_child">'

									+'</div>'
									+'<button class="btn btn-success pull-right" type="button" onclick="add_customer_choice_options(this)"><i class="glyphicon glyphicon-plus"></i> Add option</button>'
								+'</div>'
								+'<div class="col-lg-2">'
									+'<span class="btn btn-icon btn-circle icon-lg" onclick="delete_choice_clearfix(this)"><i class="las la-times"></i></span>'
								+'</div>'
							+'</div>';
				$('#answerForm').html(str);
			}
			else if (type == 'radio') {
				i++;
				var str = '<div class="form-group row" style="background:rgba(0,0,0,0.1);padding:10px 0;">'
								+'<input type="hidden" name="option[]" class="option" value="'+i+'">'
								
								+'<div class="col-lg-7">'
									+'<div class="customer_choice_options_types_wrap_child">'
									

									+'</div>'
									+'<button class="btn btn-success pull-right" type="button" onclick="add_customer_choice_options(this)"><i class="glyphicon glyphicon-plus"></i> Add option</button>'
								+'</div>'
								+'<div class="col-lg-2">'
									+'<span class="btn btn-icon btn-circle icon-lg" onclick="delete_choice_clearfix(this)"><i class="las la-times"></i></span>'
								+'</div>'
							+'</div>';
				$('#answerForm').html(str);
			}
			else if (type == 'file') {
				var str = '<div class="form-group row" style="background:rgba(0,0,0,0.1);padding:10px 0;">'
								
								+'<div class="col-lg-3">'
									+'<label class="col-from-label">File</label>'
								+'</div>'
								+'<div class="col-lg-7">'
									+`<input  class="form-control"  type="text" name="answers[][answer]" placeholder="{{ translate('Label') }}">`
								+'</div>'
								+'<div class="col-lg-2">'
									+'<span class="btn btn-icon btn-circle icon-lg" onclick="delete_choice_clearfix(this)"><i class="las la-times"></i></span>'
								+'</div>'
							+'</div>';
				$('#answerForm').html(str);
			}
		}
	</script>
@endsection
