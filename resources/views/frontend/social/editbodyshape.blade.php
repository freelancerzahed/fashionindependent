@extends('frontend.layouts.app')
@section('content')
<style>
    /* Loader Container */
    .modeler-loader-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 1000; /* Ensure it appears above the canvas */
    }

    /* Loader Animation */
    .modeler-loader {
        border: 5px solid #f3f3f3; /* Light grey */
        border-top: 5px solid #900000; /* Blue */
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
    }

    /* Spin Animation */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Loader Text */
    .modeler-loader-container p {
        margin-top: 10px;
        font-size: 16px;
        color: #333;
    }
</style>

    <section class="section" id="bodyModelerSection">
        <div class="section_four">
            <div class="modeler_controller">
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
                                        type="range" min="0" max="2" step="1"
                                        value="{{ $slider_values['headShape'] ?? 0 }}" data-tick-step="0.25"
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
                                    <input id="slider-head-size" class="tick-slider-input slide-full topmost" type="range"
                                        min="0" max="1" step="0.25"
                                        value="{{ $slider_values['headSize'] ?? 0 }}" data-tick-step="0.25"
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
                                        type="range" min="0" max="1" step="0.25"
                                        value="{{ $slider_values['neckHeight'] }}" data-tick-step="1"
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
                                            type="range" min="0" max="1" step="0.5"
                                            value="{{ $slider_values['neckWidth'] }}" data-tick-step="1"
                                            data-tick-id="sliderTicks_12" name="neck_width_val" />
                                    </div>

                                </div>
                            </div>
                            <div class="feature_group_wrap remove" id="trapezoidal-shape">
                                <label for="slider-neck-shape">Neck Shape:</label>
                                <div class="tick-slider">
                                    <div class="tick-slider-value-container">

                                        <div id="sliderTicks_12" class="tick-slider-tick-container">
                                            <span class="tick-slider-tick"></span>
                                            <span class="tick-slider-tick"></span>
                                        </div>
                                        <input id="slider-neck-shape" class="tick-slider-input slide-full topmost"
                                            type="range" min="0" max="1" step="1" value="0"
                                            data-tick-step="1" data-tick-id="sliderTicks_12" name="neck_width_val" />
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
                                            type="range" min="0" max="1" step="1"
                                            value="{{ $slider_values['chinShape'] }}" data-tick-step="1"
                                            data-tick-id="sliderTicks_12" name="chin_shape_val" />
                                    </div>

                                </div>
                            </div>
                            <div class="feature_group_wrap remove" id="trapezoidal-shape">
                                <label for="slider-neck-rolls">Neck Rolls:</label>
                                <div class="tick-slider">
                                    <div class="tick-slider-value-container">

                                        <div id="sliderTicks_18" class="tick-slider-tick-container">
                                            <span class="tick-slider-tick"></span>
                                            <span class="tick-slider-tick"></span>
                                        </div>
                                        <input id="slider-neck-rolls" class="tick-slider-input slide-full topmost"
                                            type="range" min="0" max="1" step="1"
                                            value="{{ $slider_values['neckLayers'] }}" data-tick-step="1"
                                            data-tick-id="sliderTicks_12" name="neck_layers_val" />
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
                                        type="range" min="0" max="1" step="0.5"
                                        value="{{ $slider_values['shoulderHeight'] }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="0.125"
                                        value="{{ $slider_values['shoulderWidth'] }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="0.125"
                                        value="{{ $slider_values['stomachWidth'] }}" data-tick-step="1"
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
                                        type="range" min="0" max="5" step="1"
                                        value="{{ $slider_values['stomachShape'] }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="0.333"
                                        value="{{ $slider_values['trimester'] ?? 0 }}
" data-tick-step="0.334"
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
                                        type="range" min="0" max="1" step="0.125"
                                        value="{{ $slider_values['breastSize'] ?? 0 }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="0.333"
                                        value="{{ $slider_values['armSize'] ?? 0 }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="1"
                                        value="{{ $slider_values['armLength'] ?? 0 }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="0.5"
                                        value="{{ $slider_values['torsoHeight'] ?? 0 }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="0.25"
                                        value="{{ $slider_values['legSize'] ?? 0 }}" data-tick-step="1"
                                        data-tick-id="sliderTicks_4" name="leg_size_val" />
                                </div>
                            </div>
                            <div class="feature_group_wrap" id="hip-size">
                                <label for="slider-hip-size">Hip Size:</label>
                                <div class="tick-slider">
                                    <div id="sliderTicks_6" class="tick-slider-tick-container">
                                        <span class="tick-slider-tick"></span>
                                        <span class="tick-slider-tick"></span>
                                        <span class="tick-slider-tick"></span>
                                    </div>
                                    <input id="slider-hip-size" class="tick-slider-input slide-full topmost"
                                        type="range" min="0" max="1" step="0.5"
                                        value="{{ $slider_values['hipSize'] ?? 0 }}" data-tick-step="1"
                                        data-tick-id="sliderTicks_6" name="hip_size_val" />
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
                                        type="range" min="0" max="1" step="0.5"
                                        value="{{ $slider_values['crotchHeight'] ?? 0 }}" data-tick-step="1"
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
                                        type="range" min="0" max="5" step="1"
                                        value="{{ $slider_values['bottomShape'] }}" data-tick-step="1"
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
                                        type="range" min="0" max="1" step="1"
                                        value="{{ $slider_values['bottomWidth'] ?? 0 }}" data-tick-step="1"
                                        data-tick-id="sliderTicks_19" name="bottom_width_val" />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="body_modeler_action_btn">
                        <button id="bodyRearBtn" style="cursor: pointer;">Body Rear</button>
                        <button style="cursor: pointer; padding: 10px;" id="updateBody">Submit</button>
                    </div>
                </div>
            </div>
            <div class="modeler_container">
                <div class="body_modeler modeler-heading">
                    <h1>ShapeMe® Body Modeler</h1>
                    <h5>by Mirror Me Fashion</h5>
                    <div class="body_modeler_canvases">
                        <!-- Loader Container -->
                        <div class="modeler-loader-container" style="display: none">
                            <div class="modeler-loader"></div>
                            <p>Updating slider values...</p>
                        </div>

                        <!-- Canvas for 3D Model -->
                        <canvas id="renderCanvas" style="height: 100vh; max-width: 100%;"></canvas>
                    </div>


                </div>
            </div>
        </div>


    </section>
@endsection
@push('scripts')
    <script>
        let gender = "{{ $bodyData->gender }}";
        let shape = "{{ $bodyData->shape }}";

        async function initializeScene() {
            try {
                const url = "{{ static_asset('assets/modeler') }}/" + `${gender}_${shape}.glb`;
                console.log("Loading model from:", url); // Debugging: Verify the URL
                await loadGLBFileAsync(url);

                handleHeadShapeChange("{{ $slider_values['headShape'] }}");
                handleStomachShapeChange("{{ $slider_values['stomachShape'] }}",
                    "{{ $slider_values['stomachWidth'] }}");
                handleShoulderWidthChange("{{ $slider_values['shoulderWidth'] }}",
                    "{{ $slider_values['stomachShape'] }}");
                handleStomachWidthChange("{{ $slider_values['stomachWidth'] }}",
                    "{{ $slider_values['stomachShape'] }}");
                handleBottomShapeChange("{{ $slider_values['bottomShape'] }}");
                addShapeKeySizes(); // Corrected function name
            } catch (error) {
                console.error("Failed to initialize scene:", error);
            }
        }

        function addShapeKeySizes() {
            addShapeKyeSize("{{ $slider_values['headSize'] }}", 'head_size');
            addShapeKyeSize("{{ $slider_values['neckHeight'] }}", 'neck_height');
            addShapeKyeSize("{{ $slider_values['neckWidth'] }}", 'neck_width');
            addShapeKyeSize("{{ $slider_values['shoulderHeight'] }}", 'shoulder_height');
            addShapeKyeSize("{{ $slider_values['armSize'] }}", 'arm_size');
            addShapeKyeSize("{{ $slider_values['armSize'] }}", 'arms_distended');
            addShapeKyeSize("{{ $slider_values['breastSize'] }}", 'breasts');
            addShapeKyeSize("{{ $slider_values['torsoHeight'] }}", 'torso_distended');
            addShapeKyeSize("{{ $slider_values['crotchHeight'] }}", 'crotch_height');
            addShapeKyeSize("{{ $slider_values['legSize'] }}", 'leg_size');
            addShapeKyeSize("{{ $slider_values['hipSize'] }}", 'hips_size');
            addShapeKyeSize("{{ $slider_values['trimester'] ?? 0 }}", 'trimester');
            addShapeKyeSize("{{ $slider_values['chinShape'] }}", 'chin_shape');
            addShapeKyeSize("{{ $slider_values['neckLayers'] }}", 'neck_layers');
        }

        initializeScene().then(() => {
            console.log("Scene initialized successfully!");
        }).catch((error) => {
            console.error("Scene initialization failed:", error);
        });
    </script>
@endpush
@push('scripts')
    <script>
        // Wait for the HTML content to be fully loaded before executing the script
        document.addEventListener("DOMContentLoaded", function() {
            // Select the loader container element using its class
            const loaderContainer = document.querySelector('.modeler-loader-container');

            // Event listener for the "Submit" button
            document.getElementById('updateBody').addEventListener('click', async function() {
                // Show the loader
                if (loaderContainer !== null) {
                    loaderContainer.style.display = 'flex';
                }

                const sliderValues = getSliderValues();
                console.log("Slider Values (Transformed):",
                sliderValues); // Debugging: Check the transformed values

                try {
                    const response = await fetch("{{ route('update.slider.values') }}", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': "{{ csrf_token() }}"
                        },
                        body: JSON.stringify({
                            slider_values: sliderValues
                        })
                    });

                    const result = await response.json();

                    if (response.ok) {

                        console.log("Server Response:", result);
                    } else {
                        throw new Error(result.message || "Failed to update slider values");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred while updating slider values.");
                } finally {
                    // Hide the loader
                    if (loaderContainer !== null) {
                        loaderContainer.style.display = 'none';
                    }
                }
            });
        });
    </script>
@endpush
