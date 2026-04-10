
@extends('frontend.layouts.app')

@php
   $user= Auth::user();

$head_shape_val = $user->body_stat->head_shape_val;
$head_size_val = $user->body_stat->head_size_val;
$neck_shape_val = $user->body_stat->neck_shape_val;
$neck_height_val = $user->body_stat->neck_height_val;
$neck_width_val = $user->body_stat->neck_width_val;
$shoulder_height_val = $user->body_stat->shoulder_height_val;
$shoulder_width_val = $user->body_stat->shoulder_width_val;
$arm_size_val = $user->body_stat->arm_size_val;
$breasts_shape_val = $user->body_stat->breasts_shape_val;
$stomach_shape_val = $user->body_stat->stomach_shape_val;
$torso_height_val = $user->body_stat->torso_height_val;
$crotch_height_val = $user->body_stat->crotch_height_val;
$leg_size_val = $user->body_stat->leg_size_val;
$hip_size_val = $user->body_stat->hip_size_val;
$head_bg_pos =$user->body_stat->head_bg_pos;
$breasts_bg_pos =$user->body_stat->breasts_bg_pos;
$neck_bg_pos =$user->body_stat->neck_bg_pos;
$shoulders_bg_pos =$user->body_stat->shoulders_bg_pos;
$stomach_bg_pos =$user->body_stat->stomach_bg_pos;
$legs_bg_pos =$user->body_stat->legs_bg_pos;

$shape = $user->body_stat->weight_class;
$gender = $user->bodyData->gender;
$bmi = $user->bodyData->bmi;

$url = static_asset('assets/js/modelers/'.$gender.'_'.$shape.'.js');

// dd($url);
@endphp
@section('content')

<div class="container-fulid">
    <div class="row">
        <div class="col-md-4">
            
        </div>
    </div>
</div>

  @endsection
@section('script')
<script src="{{$url}}"></script>
<script>


let sex ="{{ $gender}}";
   let BMI = {{$bmi}};
   
    mhead_shape({{$head_shape_val}});
    mhead_size({{$head_size_val}});
    mneck_shape({{$neck_shape_val}});
    mneck_height({{$neck_height_val}});
    mneck_width({{$neck_width_val}});
    mshoulders_height({{$shoulder_height_val}});
    mshoulders_width({{$shoulder_width_val}});
    marms({{$arm_size_val}});
   
    mstomach_shape({{$stomach_shape_val}});
   
    mlegs({{$leg_size_val}});
   
    mhips({{$hip_size_val}});

 if(sex=='male'){
    mcrotch({{$crotch_height_val}});
    torso_height({{$torso_height_val}});
 }else{
    mbreast_shape({{$breasts_shape_val}});
 }
   
   document.getElementById("slider-head-size").max = "4"; 
	   document.getElementById("slider-neck-shape").max = "1"; 
	   document.getElementById("slider-neck-height").max = "5"; 
	   document.getElementById("slider-neck-width").max = "4"; 
	   document.getElementById("slider-shoulder-width").max = "8"; 
   if ((sex == "female" || sex == "non-binary" || sex == "non binary")) {

document.getElementById("slider-head-shape").max = "2"; 
document.getElementById("slider-shoulder-height").max = "4"; 
document.getElementById("slider-arm-size").max = "4"; 
document.getElementById("slider-breasts-shape").max = "8"; 
document.getElementById("slider-torso-height").max = "0"; 
document.getElementById("slider-hip-size").max = "2"; 
document.getElementById("slider-stomach-shape").value = "2"; 

if (BMI >= 16 && BMI < 22) {
   document.getElementById("slider-stomach-shape").max = "3"; 
   document.getElementById("slider-stomach-shape").value = "1"; 
   document.getElementById("slider-leg-size").max = "2"; 


} else if (BMI >= 22 && BMI < 26) {
   document.getElementById("slider-stomach-shape").max = "4"; 
   document.getElementById("slider-leg-size").max = "4";              
  
} else if (BMI >= 26 && BMI < 36) {
   document.getElementById("slider-stomach-shape").max = "4"; 
   document.getElementById("slider-leg-size").max = "4"; 
  

} else if (BMI >= 36 && BMI < 42) {
   document.getElementById("slider-stomach-shape").max = "4"; 
   document.getElementById("slider-stomach-shape").value = "1"; 
   document.getElementById("slider-leg-size").max = "4"; 


} else {
   //BMI >= 35 && BMI < 43
   document.getElementById("slider-stomach-shape").max = "4"; 
   document.getElementById("slider-leg-size").max = "4"; 

}



} else if ((sex == "male") && (BMI >= 16 && BMI < 65)) {
document.getElementById("slider-head-shape").max = "3"; 
document.getElementById("slider-shoulder-height").max = "2"; 
document.getElementById("slider-breasts-shape").max = "1"; 
document.getElementById("slider-hip-size").max = "1"; 
document.getElementById("slider-crotch-height").max = "2"; 
document.getElementById("slider-stomach-shape").value = "2"; 

if (BMI >= 16 && BMI < 22) {
   document.getElementById("slider-arm-size").max = "4"; 
   document.getElementById("slider-leg-size").max = "2"; 
   document.getElementById("slider-stomach-shape").max = "2";  
   document.getElementById("slider-stomach-shape").value = "1";    
   document.getElementById("slider-torso-height").max = "0"; 

} else if (BMI >= 22 && BMI < 36) {
   document.getElementById("slider-arm-size").max = "6"; 
   document.getElementById("slider-leg-size").max = "4"; 
   document.getElementById("slider-stomach-shape").max = "6";   
   document.getElementById("slider-torso-height").max = "1"; 

} 
else {
   document.getElementById("slider-arm-size").max = "4"; 
   document.getElementById("slider-leg-size").max = "4"; 
   document.getElementById("slider-stomach-shape").max = "6";      
   document.getElementById("slider-torso-height").max = "1"; 

}

}

setTimeout(() => {
	const sliders = document.getElementsByClassName("tick-slider-input");
			   sliderTrickgenerator(sliders);
}, 10000);
</script>
 
@endsection

