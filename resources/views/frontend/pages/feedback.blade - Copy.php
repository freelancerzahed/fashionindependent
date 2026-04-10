@extends('frontend.layouts.app')
@section('content')
<section class="container feedback-layout">
    <h1>Mirror Me Fashion in Beta</h1>
    <h2>Feedback Form</h2>
    <p>Welcome to the Beta launch of the world's first and only <a href="">AI Powered Virtual Fashion Stylist</a>. We are extremely pleased to hear from you. Sharing the 
    device, browser, and operating system that you used to view the site today along with your feedback would be helpful. If you don't know this information, that’s okay. 
    </p>
    <p>Answer each question to the best of your ability. Attach screenshots and photos of your issue if you have any. Use the comment section at the end to give us any 
    additional feedback that you want to offer not covered in the questions. 
    </p>
    <form method="POST" action="{{route('feedback.store')}}" id="feedback_form">
        @csrf
        <div class="feedback-form-group" id="feedback_name">
            <label for="feedback_name">Your Full Name</label>
            <input type="text" class="form-control" id="feedback_name_input" name="name" placeholder="Enter your first and last name. Optional">
        </div>
        <div class="feedback-form-group" id="feedback_email">
            <label for="feedback_email">Your Email Address</label>
            <input type="text" class="form-control" id="feedback_email_input" name="email" placeholder="Enter your email address. Optional">
        </div>
        <div class="feedback-form-group" id="device_type">
            <label for="">What type of device did you use to view the site?</label><br>
            <input type="radio" id="deviceType_PC" name="device_type" value="Computer/Desktop/Laptop">
            <label for="deviceType_PC">Computer/Desktop/Laptop</label><br>
            <input type="radio" id="deviceType_tablet" name="device_type" value="Tablet">
            <label for="deviceType_tablet">Tablet</label><br>  
            <input type="radio" id="deviceType_mobile" name="device_type" value="Mobile">
            <label for="deviceType_mobile">Phone</label>
        </div>
        <div class="feedback-form-group" id="browser_type">
        <label for="">What browser did you use to view the site?</label><br>
            <input type="radio" id="browser_chrome" name="browser_type" value="Chrome">
            <label for="browser_chrome">Chrome</label><br>
            <input type="radio" id="browser_firefox" name="browser_type" value="Firefox">
            <label for="browser_firefox">Firefox</label><br>  
            <input type="radio" id="browser_edge" name="browser_type" value="Edge">
            <label for="browser_edge">Edge</label><br>
            <input type="radio" id="browser_IE" name="browser_type" value="Internet Explorer">
            <label for="browser_IE">Internet Explorer</label><br>
            <input type="radio" id="browser_safari" name="browser_type" value="Safari">
            <label for="browser_sarafi">Safari</label><br>
            <input type="radio" id="browser_other" name="browser_type" value="Other">
            <label for="browser_other">Other</label><br>  
        </div>
        <div class="feedback-form-group" id="op_system">
            <label for="">Do you know your operating system?</label><br>
            <input type="radio" id="op_sys_yes" name="system" value="Yes">
            <label for="op_sys_yes">Yes, I know it</label><br>
            <input type="radio" id="op_sys_no" name="system" value="No">
            <label for="op_sys_no">No</label><br>  
            <input type="text" class="form-control" id="operating_system" name="system" placeholder="Enter the operating system for your device">
        </div>
        <div class="feedback-form-group" id="home_speed">
            <label for="">I would describe the loading speed for the home page as:</label><br>
            <input type="radio" id="speed_fast" name="home_speed" value="Fast">
            <label for="speed_fast">Fast</label><br>
            <input type="radio" id="speed_average" name="home_speed" value="Average">
            <label for="speed_average">Average</label><br>  
            <input type="radio" id="speed_slow" name="home_speed" value="Slow">
            <label for="speed_slow">Slow</label><br> 
            <input type="radio" id="speed_slow" name="home_speed" value="Unsure">
            <label for="speed_slow">I don't know</label>
        </div>
        <div class="feedback-form-group" id="profile_speed">
            <label for="">I would describe the loading speed for the profile page as:</label><br>
            <input type="radio" id="speed_fast" name="profile_speed" value="Fast">
            <label for="speed_fast">Fast</label><br>
            <input type="radio" id="speed_average" name="profile_speed" value="Average">
            <label for="speed_average">Average</label><br>  
            <input type="radio" id="speed_slow" name="profile_speed" value="Slow">
            <label for="speed_slow">Slow</label><br> 
            <input type="radio" id="speed_slow" name="profile_speed" value="Unsure">
            <label for="speed_slow">I don't know</label>
        </div>
        <div class="feedback-form-group" id="blog_speed">
            <label for="">I would describe the loading speed for the blog page as:</label><br>
            <input type="radio" id="speed_fast" name="blog_speed" value="Fast">
            <label for="speed_fast">Fast</label><br>
            <input type="radio" id="speed_average" name="blog_speed" value="Average">
            <label for="speed_average">Average</label><br>  
            <input type="radio" id="speed_slow" name="blog_speed" value="Slow">
            <label for="speed_slow">Slow</label><br> 
            <input type="radio" id="speed_slow" name="blog_speed" value="Unsure">
            <label for="speed_slow">I don't know</label>
        </div>
        <div class="feedback-form-group" id="navigability">
            <label for="">My ability to navigate the website was:</label><br>
            <input type="radio" id="nav_superb" name="nav" value="Superb">
            <label for="nav_superb">Superb</label><br>  
            <input type="radio" id="nav_good" name="nav" value="Good">
            <label for="nav_good">Good</label><br>  
            <input type="radio" id="nav_nogood" name="nav" value="Unsatisfactory">
            <label for="nav_nogood">Unsatisfactory</label><br>  
            <input type="radio" id="nav_good" name="nav" value="Unsure">
            <label for="nav_good">I don't know</label><br>  

        </div>
        <div class="feedback-form-group" id="errors_found">
            <label for="">I found an error/typo/broken link:</label><br>
            <input type="checkbox" id="error_found_mgs" name="error_found" value="Error Message">
            <label for="">Error (with code)</label><br>            
            <input type="checkbox" id="error_found_broken" name="error_found" value="Broken code">
            <label for="">Broken page/link/tool</label><br>    
            <input type="checkbox" id="error_found_typo" name="error_found" value="Typo">
            <label for="">Typo</label><br>    
            <textarea id="w3review" name="w3review" rows="4" cols="60">Enter the URL where the error was found, describe the error, and enter the error code (i.e. 404, 419, etc.)
            </textarea>
        </div>
        <div class="feedback-form-group" id="experience">
            <label for="">My overall experience was:</label>
            <input type="text" class="form-control" id="description_expe" name="experience" placeholder="Describe your experience in a few words">
        </div>
        <div class="feedback-form-group" id="expectation">
            <label for="">I'd like to see this from Mirror Me Fashion:</label>
            <textarea id="w3review" name="expectation" rows="4" cols="60">Use this space to describe what you expected from Mirror Me Fashion. Did we exceed, meet or fall-short of your expectation? What would you like to see in the future?
            </textarea>
        </div>
        <div class="feedback-form-group" id="modeler_feedback">
            <label for="">Using the ShapeMe&#174; Body Modeler was:</label><br>
            <input type="checkbox" id="" name="modeler_feedback" value="Impossible, it did not work">
            <label for="">Impossible, it did not work</label><br>            
            <input type="checkbox" id="" name="modeler_feedback" value="Difficult. It required work, though">
            <label for="">Difficult. It required work, though</label><br>
            <input type="checkbox" id="" name="modeler_feedback" value="Confusing. How do I use it?">
            <label for="">Confusing. How do I use it?</label><br>
            <input type="checkbox" id="" name="modeler_feedback" value="It was okay, I figured it out">
            <label for="">It was okay, I figured it out</label><br>
            <input type="checkbox" id="" name="modeler_feedback" value="Super easy">
            <label for="">Super easy</label><br>
            <input type="text" class="form-control" id="" name="modeler_feedback_des" placeholder="Additional comments on the ShapeMe&#174; Body Modeler">
        </div>
        <div class="feedback-form-group" id="modeler_efficacy">
            <label for="">The body model that I constructed resembles my own body shape:</label><br>
            <input type="radio" id="" name="modeler_efficacy" value="Strongly agree">
            <label for="">Strongly agree</label><br>
            <input type="radio" id="" name="modeler_efficacy" value="Neither">
            <label for="">Neither agree nor disagree</label><br>  
            <input type="radio" id="" name="modeler_efficacy" value="Strongly disagree">
            <label for="">Strongly disagree</label>
        </div>
        <div class="feedback-form-group" id="revisiting">
            <label for="">My likelihood of revisiting Mirror Me Fashion is:</label><br>
            <input type="radio" id="" name="revisiting" value="Strong">
            <label for="">Strong, I want to see where this goes!</label><br>
            <input type="radio" id="" name="revisiting" value="Average">
            <label for="">Meh, maybe I'll check you out later</label><br>  
            <input type="radio" id="" name="revisiting" value="Unlikely">
            <label for="">Unlikely, this ain't my thing</label>
        </div>
        
        <div class="feedback-form-group" id="feedback_attachment">
            <label for="myfile">Attach one or more files:</label>
            <input type="file" id="attachment" name="attachment" multiple><br>
        </div>
        <div class="feedback-form-group" id="feedback_other">
            <label for="">Do you have other feedback?</label>
            <textarea id="w3review" name="feedback_other" rows="8" cols="60"> Enter your feedback here
            </textarea>
        </div>
        <input type="submit" class="btn" value="Submit" id="submit_feedback">
    </form>
</section>

@endsection