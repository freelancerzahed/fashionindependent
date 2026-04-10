@extends('frontend.layouts.app')
@section('content')

<style>
    /* Modernized Styling */
    .container {
        display: flex;
        flex-direction: row;
        gap: 24px;
        padding: 24px;
        background-color: #f8f9fa;
    }

    .middle_side {
        flex: 1;
        padding: 16px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .body_shape_section {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 16px;
    }

    .body_modeler_canvases {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
    }

    .body_modeler_canvases canvas {
        width: 100%;
        max-width: 600px;
        height: auto;
        border-radius: 10px;
        border: 1px solid #ddd;
    }

    .body_shape_section h1 {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
    }

    .body_shape_section h2, .body_shape_section h5 {
        font-size: 1.5rem;
        color: #555;
    }

    .body_shape_section p {
        font-size: 1rem;
        color: #666;
        margin: 8px 0;
    }

    .btn {
        display: inline-block;
        padding: 12px 24px;
        margin-top: 20px;
        font-size: 1rem;
        color: #fff;
        background: #007bff;
        border-radius: 8px;
        text-decoration: none;
        transition: background 0.3s;
    }

    .btn:hover {
        background: #0056b3;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .container {
            flex-direction: column;
            padding: 16px;
        }

        .middle_side {
            padding: 12px;
        }

        .body_modeler_canvases canvas {
            max-width: 100%;
        }
    }
</style>

<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <!-- ================== Middle Section Start============= -->
    <div class="middle_side">
        @include('frontend/social/partials/menu')
        <div class="body_shape_section">
            <div class="modeler_container">
                <div class="body_modeler modeler-heading">
                    <h1>ShapeMe® Body Modeler</h1>
                    <h5>by Mirror Me Fashion</h5>
                    <div class="body_modeler_canvases">
                        <canvas id="renderCanvas" style="height: 100vh; max-width: 100%;"></canvas>
                    </div>
                </div>
            </div>
            <div>
                <h2>Your Body Shape</h2>
                <p><strong>Shape Classification:</strong> Spoon Shape</p>
                <p>Height: {{ $bodyData->height }} in</p>
                <p>Weight: {{ $bodyData->weight }} lbs</p>
                <p>BMI: {{ $bodyData->bmi }}</p>
                <p>Gender: {{ ucfirst($bodyData->gender) }}</p>
                <a href="{{ route('edit-body-shape') }}" class="btn">Update Body Shape</a>
            </div>
        </div>
    </div>
    <!-- ================== Middle Section End============= -->
    <!-- ================== Right Section Side Start============= -->
    @include('frontend/social/partials/right_sidebar')
    <!-- ================== Right Section Side End============= -->
</main>

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
            handleStomachShapeChange("{{ $slider_values['stomachShape'] }}", "{{ $slider_values['stomachWidth'] }}");
            handleShoulderWidthChange("{{ $slider_values['shoulderWidth'] }}", "{{ $slider_values['stomachShape'] }}");
            handleStomachWidthChange("{{ $slider_values['stomachWidth'] }}", "{{ $slider_values['stomachShape'] }}");
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
