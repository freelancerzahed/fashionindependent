
@extends('frontend.layouts.app')

@section('content')

<main class="main_container" id="mainContainer">
    <div class="main_container_wrapper">
        <div class="main_container_inner">
            <div class="section heru_section" style=" background:#990000  url({{static_asset('assets/img/home/heru.jpg')}}) no-repeat; background-size: cover;">
                <div class="description">
                    <h1>Meet the Only Virtual Fashion Stylist Powered by AI</h1>
                    <h2>Find Fashion that Fits and Flatters</h2>
                </div>
            </div>
            <section class="section" id="inBetaSection" style="background: #990000 url({{static_asset('assets/img/home/section_1.jpeg')}}) no-repeat; background-size: cover;">
                <div class="section_one">
                    <div></div>
                    <div class="section_one_wrapper">
                        <h1><u class="free">Free</u> styling help for <u>all</u> unique body types</h1>
                        <p class="title"> Welcome to Mirror Me Fashion Beta!</p>
                        <p class="free_check">&check; Get <span>Free & Instant fashion</span> advice from the World’s <span>First and Only </span><a href="">Virtual Fashion Stylist</a></p>
                        <p class="free_check">&check; Shop fashion retailers across the globe</p>
                        <p class="free_check">&check; Join as a Fashion Professional to expand your fashion business</p>
                        <p class="free_check">&check; Grow followers & monetize your brand</p>
                        <div class="action">
                            <button onclick="goToNextSection('#sopiaChatSection')">I’m a Shopper</button>
                            <button onclick="goToNextSection('#FashionProfessionalSection')">I’m a Fashion Professional</button>
                        </div>

                    </div>
                </div>
            </section>
            <section class="section" id="FashionProfessionalSection" style="background: #990000 url({{static_asset('assets/img/home/section_6.jpeg')}}) no-repeat; background-size: cover; display: none;">
                <div class="section_two">
                    <div class="left">
                        <div class="title">
                            <h1>Mirror Me Fashion</h1>
                            <h3>Discover Your Niche</h3>
                        </div>
                        <ul>
                            <li>&check; Powerful AI technology</li>
                            <li>&check; Streamlined services </li>
                            <li>&check; Increase your sales</li>
                            <li>&check; Monetize your following</li>
                        </ul>
                        <div class="learn_more"> <button>Learn more...</button></div>
                    </div>
                    <div class="right">
                        <h1>Welcome!</h1>
                        <p>What type of Fashion Professional are you?
                        </p>
                        <div class="right_container">


                            <select name="user_type" id="selectedUserType">
                                    <option value="">Select user type</option>
                                    <option value="retailer">I’m a Fashion Retailer</option>
                                    <option value="influencer">I’m a Fashion Influencer</option>
                                    <option value="advertiser">I’m a Fashion Advertiser</option>
                                    <option value="shopper">I’m a Fashion Stylist</option>
                                    <option value="shopper">I’m a Fashion Blogger</option>
                                    <option value="shopper">I’m a Fashion Photographer</option>
                                    <option value="shopper">Other Fashion Professional</option>
                                </select>

                            <div class="registration_btn">
                                <button type="button" onclick="userRegisterChecker(event)">Complete Registration</button>
                            </div>

                            <div class="agree_btn">
                                <input type="checkbox" id="agreeBtn"> <label for="agreeBtn">  I agree that I am above 18 years old</label>

                            </div>



                        </div>
                    </div>
                </div>
            </section>
            <section class="section" id="sopiaChatSection" style="display: none;">
                <div class="section_three">
                    <div class="left">
                        <div class="title">
                            <h1>ShapeMe® Body Modeler</h1>
                            <h2>by Mirror Me Fashion</h2>
                        </div>
                        <div class="models"><img src="{{static_asset('assets/img/home/models.png')}}" alt="Three 3D female body shapes"></div>
                    </div>
                    <div class="right">
                        <div class="chat_box">
                            <div class="chat_box_main">
                                <div class="chat_box_header">
                                    <div class="sophia_pic">
                                        <img src="{{static_asset('assets/img/home/sophia.png')}}" alt="">
                                    </div>

                                </div>
                                <div id="chatBody" class="chat_body" style="color: #990000;">
                                    <div class="talk_bubble">
                                        Hi there guest visitor! I’m Sophia, your Virtual Fashion Stylist! Are you female, male or non-binary?
                                    </div>
                                </div>
                            </div>
                            <div class="chat_box_footer">
                                <input type="text" id="userInput" placeholder="Enter your response here">
                                <button id="sendBtn">Send</button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="section" id="bodyModelerSection" style="display: flex">
                <div class="section_four">
                    <div class="modeler_controller" id="controls-container">
                        <p>Move the sliders of each body feature to reshape the model. Click "Body Rear" to change the rear side
                            of your model.</p>


                        <div class="controls" style="display: block;">
                            <div class="front-controls-full m-modeller">

                                <div class="head_and_neck">
                                    <!-- Head Group -->
                                    <div class="feature_group_wrap" id="head-shape">
                                        <label for="slider-head-shape">Head Shape:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_8" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>

                                            </div>
                                            <input id="slider-head-shape" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="2" step="1" value="0" data-tick-step="0.25"
                                                data-tick-id="sliderTicks_8" name="head_shape_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap ubiquitous" id="head-size">
                                        <label for="slider-head-size">Head Size:</label>
                                        <div class="tick-slider">

                                            <div id="sliderTicks_9" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>

                                            </div>
                                            <input id="slider-head-size" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.25" value="0" data-tick-step="0.25"
                                                data-tick-id="sliderTicks_9" name="head_size_val" />
                                        </div>
                                    </div>

                                    <!-- Neck Group -->
                                    <div class="feature_group_wrap ubiquitous" id="neck-height">
                                        <label for="slider-neck-height">Neck Height:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_11" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-neck-height" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.25" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_11" name="neck_height_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap ubiquitous" id="neck-width">
                                        <label for="name">Neck Width:</label>
                                        <div class="tick-slider">
                                            <div class="tick-slider-value-container">

                                                <div id="sliderTicks_12" class="tick-slider-tick-container">
                                                    <span class="tick-slider-tick"></span>
                                                    <span class="tick-slider-tick"></span>
                                                    <span class="tick-slider-tick"></span>

                                                </div>
                                                <input id="slider-neck-width" class="tick-slider-input slide-full topmost"
                                                    type="range" min="0" max="1" step="5" value="0.125"
                                                    data-tick-id="sliderTicks_12" name="neck_width_val" />
                                            </div>

                                        </div>
                                    </div>
                                    <div class="feature_group_wrap remove" id="trapezoidal-shape">
                                        <label for="slider-neck-shape">Neck Shape:</label>
                                        <div class="tick-slider">
                                            <div class="tick-slider-value-container">

                                                <div id="sliderTicks_29" class="tick-slider-tick-container">
                                                    <span class="tick-slider-tick"></span>
                                                    <span class="tick-slider-tick"></span>
                                                </div>
                                                <input id="slider-neck-shape" class="tick-slider-input slide-full topmost"
                                                    type="range" min="0" max="1" step="1" value="0" data-tick-step="1"
                                                    data-tick-id="sliderTicks_29" name="neck_width_val" />
                                            </div>

                                        </div>
                                    </div>
                                    <div class="feature_group_wrap remove" id="trapezoidal-shape">
                                        <label for="slider-chin-shape">Chin Shape :</label>
                                        <div class="tick-slider">
                                            <div class="tick-slider-value-container">

                                                <div id="sliderTicks_21" class="tick-slider-tick-container">
                                                    <span class="tick-slider-tick"></span>
                                                    <span class="tick-slider-tick"></span>
                                                </div>
                                                <input id="slider-chin-shape" class="tick-slider-input slide-full topmost"
                                                    type="range" min="0" max="1" step="1" value="0" data-tick-step="1"
                                                    data-tick-id="sliderTicks_21" name="chin_shape_val" />
                                            </div>

                                        </div>
                                    </div>
                                    <div class="feature_group_wrap remove" id="trapezoidal-shape">
                                        <label for="slider-neck-rolls">Neck Layers:</label>
                                        <div class="tick-slider">
                                            <div class="tick-slider-value-container">

                                                <div id="sliderTicks_18" class="tick-slider-tick-container">
                                                    <span class="tick-slider-tick"></span>
                                                    <span class="tick-slider-tick"></span>
                                                </div>
                                                <input id="slider-neck-rolls" class="tick-slider-input slide-full topmost"
                                                    type="range" min="0" max="1" step="1" value="0" data-tick-step="1"
                                                    data-tick-id="sliderTicks_18" name="neck_rolls_val" />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="shoulder_and_arm">


                                </div>
                                <div class="breast_and_torso">
                                    <!-- Torso Group -->
                                        <!-- Shoulders Group -->
                                        <div class="feature_group_wrap ubiquitous" id="shoulder-height">
                                            <label for="slider-shoulder-height">Shoulder Height:</label>
                                            <div class="tick-slider">
                                                <div id="sliderTicks_13" class="tick-slider-tick-container">
                                                    <span class="tick-slider-tick"></span>
                                                    <span class="tick-slider-tick"></span>
                                                    <span class="tick-slider-tick"></span>
                                                </div>
                                                <input id="slider-shoulder-height" class="tick-slider-input slide-full topmost"
                                                    type="range" min="0" max="1" step="0.5" value="0" data-tick-step="1"
                                                    data-tick-id="sliderTicks_13" name="shoulder_height_val" />
                                            </div>
                                        </div>
                                    <div class="feature_group_wrap ubiquitous" id="shoulder-width">
                                        <label for="slider-shoulder-width">Shoulder Width:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_14" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-shoulder-width" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.125" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_14" name="shoulder_width_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap" id="stomach-width">
                                        <label for="slider-stomach-width">Stomach Size:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_22" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-stomach-width" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.125" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_2" name="stomach_width_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap" id="stomach-shape">
                                        <label for="slider-stomach-shape">Stomach Shape:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_2" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-stomach-shape" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="5" step="1" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_2" name="stomach_shape_val" />
                                        </div>
                                    </div>



                                    <div class="feature_group_wrap" id="pregnant-size">
                                        <label for="slider-pregnant-size">Trimester:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_23" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>


                                            </div>
                                            <input id="slider-pregnant-size" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.333" value="0" data-tick-step="0.334"
                                                data-tick-id="sliderTicks_23" name="pregnant_size_val" />
                                        </div>
                                    </div>
                                      <!--   Arm  group -->
                                      <div class="feature_group_wrap" id="breast-size">
                                        <label for="slider-breast-size">Breast Size:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_1" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-breast-size" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.125" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_1" name="breast_shape_val" />
                                        </div>
                                    </div>
                                      <div class="feature_group_wrap" id="arm-size">
                                        <label for="slider-arm-size">Arm Size:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_15" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-arm-size" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.333" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_15" name="arm_size_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap" id="arm-length">
                                        <label for="slider-arm-length">Arm Length:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_10" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-arm-length" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="1" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_10" name="arm_length_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap" id="torso-height">
                                        <label for="slider-torso-height">Torso Height:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_3" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-torso-height" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.5" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_3" name="torso_height_val" />
                                        </div>
                                    </div>
                                </div>
                                <div class="leg_and_hip d_none_md">
                                    <!-- Leg Group -->
                                    <div class="feature_group_wrap" id="leg-size">
                                        <label for="slider-leg-size">Leg Size:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_4" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-leg-size" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.25" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_4" name="leg_size_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap" id="hip-size">
                                        <label for="slider-hip-size">Hip Size:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_66" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-hip-size" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.5" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_66" name="hip_size_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap" id="crotch-height">
                                        <label for="slider-crotch-height">Crotch Height:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_5" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                            </div>
                                            <input id="slider-crotch-height" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="0.5" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_5" name="crotch_height_val" />
                                        </div>
                                    </div>

                                    <div class="feature_group_wrap" id="bottom-shape">
                                        <label for="slider-bottom-shape">Bottom Shape:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_6" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>

                                            </div>
                                            <input id="slider-bottom-shape" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="5" step="1" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_6" name="bottom_shape_val" />
                                        </div>
                                    </div>
                                    <div class="feature_group_wrap" id="bottom-width">
                                        <label for="slider-bottom-width">Bottom Width:</label>
                                        <div class="tick-slider">
                                            <div id="sliderTicks_19" class="tick-slider-tick-container">
                                                <span class="tick-slider-tick"></span>
                                                <span class="tick-slider-tick"></span>


                                            </div>
                                            <input id="slider-bottom-width" class="tick-slider-input slide-full topmost"
                                                type="range" min="0" max="1" step="1" value="0" data-tick-step="1"
                                                data-tick-id="sliderTicks_19" name="bottom_width_val" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div class="body_modeler_action_btn">
                                <button  id="bodyRearBtn" style="cursor: pointer;">Body Rear</button>
                                <button style="cursor: pointer; padding: 10px;"
                                     id="submitRegBtn" onclick="goToRegisterSection('#registationSection')">Submit</button>
                            </div>
                        </div>
                    </div>
                    <div class="modeler_container">
                        <div class="body_modeler modeler-heading">
                            <h1>ShapeMe® Body Modeler</h1>
                            <h5>by Mirror Me Fashion</h5>
                            <div class="body_modeler_canvases">
                                <canvas id="renderCanvas" style="height: 100vh; max-width: 100%;"></canvas>
                            </div>


                        </div>
                    </div>
                </div>


            </section>

            <section class="section" id="registationSection" style="display: none;">
                <div class="section_five">
                    <div class="header_content">
                        <h1>Mirror Me Fashion</h1>
                        <p>Complete the missing fields to create your new account</p>
                    </div>
                    <form action="{{route('user.registration')}}" method="POST">
                        @csrf
                        <input type="hidden" name="shape_keys">
                        <input type="hidden" name="shape">
                        <input type="hidden" name="alphanumeri_code">
                        <input type="hidden" name="slider_values">

                        <div class="user_register_form" id="userRegisterForm">
                            <div class="left">
                                <div class="form_group">
                                    <label for="name">Name</label>
                                    <input type="text" name="name" id="name" value="">
                                </div>
                                <div class="form_group">
                                    <label for="email">Email address</label>
                                    <input type="text" name="email" id="email" value="">
                                </div>
                                <div class="form_group">
                                    <label for="password">Password</label>
                                    <input type="text" name="password" id="password" value="">
                                </div>
                                <div class="form_group">
                                    <label for="password_confirmation">Password Confirmation</label>
                                    <input type="text" name="password_confirmation" id="password_confirmation" value="">
                                </div>

                            </div>
                            <div class="right">
                                <div class="right_of_left">
                                    <div class="form_group">
                                        <label for="bust">Bust</label>
                                        <input type="text" name="bust" id="bust" value="">
                                    </div>
                                    <div class="form_group">
                                        <label for="shoe_size">Shoe Size</label>
                                        <input type="text" name="shoe_size" id="shoe_size" value="">
                                    </div>
                                    <div class="form_group">
                                        <label for="weight">Weight</label>
                                        <input type="text" name="weight" id="weight" value="">
                                    </div>
                                    <div class="form_group">
                                        <label for="height">Height</label>
                                        <input type="text" name="height" id="height" value="">
                                    </div>
                                </div>
                                <div class="right_of_rigth">
                                    <div class="form_group">
                                        <label for="bmi">BMI</label>
                                        <input type="text" name="bmi" id="bmi" value="">
                                    </div>
                                    <div class="form_group">
                                        <label for="age_range">Age</label>
                                        <input type="text" name="age_range" id="age_range" value="">
                                    </div>
                                    <div class="form_group">
                                        <label for="gender">Gender</label>
                                        <div id="gender" class="gender" id="gender">
                                            <input type="radio" name="gender" id="female" value="female">
                                            <label class="" for="female">
                                                Female
                                            </label>

                                            <input type="radio" name="gender" id="male" value="male">
                                            <label class="" for="male">
                                                Male
                                            </label>

                                            <input type="radio" name="gender" id="non-binary" value="male">
                                            <label class="" for="on-binary">
                                                Non-Binary
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="agree_btn">
                            <input type="checkbox" id="agreeBtn"> <label for="agreeBtn">By signing up to Mirror Me Fashion you agree to our Terms, Conditions and Cookies Policy.</label>
                            <div>
                                <button type="submit" class="user_register_btn">Join Now</button>
                            </div>

                        </div>
                    </form>

                </div>
            </section>
            <section class="section" id="advertiserSection" style="background: #990000 url({{static_asset('assets/img/home/section_2.png')}}) no-repeat; background-size: cover; display: none;">
                <div class="section_six">
                    <div class="left">
                        <div class="content">
                            <h1>Mirror Me Fashion Ad Program</h1>
                            <p>The total number of Mirror Me Fashion members is growing daily. Our end of year projection is 1.5M active users. We offer a full suite of program offerings including display, affiliate, and click through advertisements. </p>
                            <p>You can reach our members with your brand message by joining our Ad Program today. <a href="">Sign up now</a>.</p>
                        </div>
                        <div class="learn_more"> <a href="">Learn more...</a></div>
                    </div>
                    <div class="right">
                        <h1>
                            Tell Us About

                        <br>Your Business</h1>

                        <form action="{{route('advertiser.registration')}}" method="POST" class="registation_form">
                            @csrf
                            <input type="hidden" name="user_type" value="">
                            <input type="text" placeholder="Company Name" name="company_name">
                            <input type="text" placeholder="Email address" name="email">
                            <input type="text" placeholder="Describe the product or service you want to advertise" name="description">
                            <button type="submit">Complete Registration</button>
                            <div class="agree_btn">
                                <input type="checkbox" id="adagreeBtn"> <label for="adagreeBtn">I agree to the terms & conditions </label>

                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section class="section" id="retailerSection" style="background: #990000 url({{static_asset('assets/img/home/section_7.jpeg')}}) no-repeat; background-size: cover; display: none;">

                <div class="section_seven">
                    <form class=""  action="{{ route('shops.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="retailer_registration_form">
                            <div class="webstore_info">
                                <div class="webstore_info_blurb">
                                    <h1>Your Mirror Me Fashion Webstore</h1>
                                    <h3>To open a Mirror Me Fashion webstore you must meet the following requirements:</h3>
                                    <ul>
                                        <li>&check; Have an existing apparel business</li>
                                        <li>&check; Have a registered LLC, Corp or Ltd</li>
                                        <li>&check; Sell no less than five (5) SKU's</li>
                                        <li>&check; Maintain minmum quantities on each SKU</li>
                                        <li>&check; Adhere to company and product quality standards and <a href="">terms</a></li>
                                        <li>&check; Agree to the <a href="#" style="color:#79d000">Green Pledge</a></li>
                                    </ul>
                                </div>
                                <div class="pword-only">
                                    <div class="form-group">
                                        <label>Your Email <span class="text_primary">*</span></label>
                                        <input type="email" value="" placeholder="Email*" name="email">
                                    </div>
                                    <div class="form-group">
                                        <label>Your Password <span class="text_primary">*</span></label>
                                        <input type="password" placeholder="Password*" name="password">
                                    </div>
                                    <div class="form-group">
                                        <label>Repeat Password <span class="text_primary">*</span></label>
                                        <input type="password" placeholder="Confirm Password*" name="password_confirmation">
                                    </div>
                                </div>
                            </div>
                            <div class="shop_info">
                                <div>
                                    <h1>Store Info</h1>
                                </div>
                                <div class="form-group">
                                    <label>Your name <span class="text-primary">*</span></label>
                                    <input type="text" value="" placeholder="Full Name*" name="name">
                                </div>
                                <div class="p-3">
                                    <div class="form-group">
                                        <label>Business Name<span class="text-primary">*</span></label>
                                        <input type="text" placeholder="Complete Business Name*" name="business_name" required="">
                                    </div>
                                    <div class="form-group">
                                        <label>Shop Name <span class="text-primary"></span></label>
                                        <input type="text" placeholder="Your DBA" name="shop_name" required="">
                                    </div>
                                    <div class="form-group">
                                        <label>Mailing Address <span class="text-primary">*</span></label>
                                        <input type="text" placeholder="Your Address*" name="address" required="">
                                    </div>
                                    <div class="form-group">
                                        <label>Phone Number <span class="text-primary"></span></label>
                                        <input type="text" placeholder="Your phone number" name="phone" required="">
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="webstore_agree_btn">
                            <input type="checkbox" id="webstore_agreeBtn"> <label for="webstore_agree">I have read and agree to the <a href="">terms & conditions</a></label>
                        </div>
                        <div class="webstore_agree_btn">
                            <input type="checkbox" id="webstore_pledgeBtn"> <label for="pledge_agree">I have read and promise to comply with the <a href="" style="color:#79d000">green pledge</a></label>
                        </div>
                        <div class="text_right">
                            <button type="submit" class="retailer_register_btn">Register Now</button>
                        </div>
                    </form>
                </div>
            </section>


        </div>
    </div>
</main>
   @endsection
   @section('script')
   <script>
        initializeHorizontalScroll()

    </script>
    @endsection
