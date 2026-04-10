@extends('frontend.layouts.app')
@section('css')
    <style>
        .converter {
            width: 50vw;
            margin: 0 auto;
        }

        .converter .item input {
            height: 50px;
            width: 130px;
            margin: 10px;
            background: #ddd;
            border: none;
            padding: 9px;
        }

        .input-metric span {
            font-size: 20px;
            font-weight: 500;
        }

        .converter .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .ft-in .input-metric input {
            width: 50px;
        }

        .meric-size-images {
            margin: 20px 10px;
        }

        @media screen and (max-width: 1200px) {
            .converter-header h1 {
                font-size: 27px;
                margin-top: 27px;
            }

            .converter-header p {
                font-size: 13px;
            }

            .converter {
                width: 95vw;
                margin: 8px 20px;
            }

            .converter .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-right: 41px;
            }

            .converter h2 {
                font-size: 20px;
            }

            .converter .item input {
                height: 20px;
                width: 60px;
                margin: 10px;
                background: #ddd;
                border: none;
            }

            .conveter-btn {
                padding: 3px 10px;
            }

            .input-metric span {
                font-size: 12px;
                font-weight: 500;
            }

            .ft-in .input-metric input {
                width: 28px;
                margin: 2px;
            }
        }
    </style>
@endsection
@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="converter-header text-center text-primary col-md-6 offset-md-3">
                <h1>Conversion Chart</h1>
                <p>Convert kilograms to Pounds Inches/Metars to Centimeters, International Shoes Size to U.S Shoe Sizes</p>
            </div>
        </div>

        <div class="converter">

            <h2 class=" my-3">Kilogram (kg) to Pounds (lb)</h2>

            <div class="item">

                <div class="input-metric">
                    <input type="text" id="kilograms"><span>kg</span>
                </div>
                <button class="btn conveter-btn btn-primary border-0"
                    onclick="metricConveter('#kilograms','#pounds','kg')">Convert</button>
                <div class="input-metric">
                    <input type="text" id="pounds"><span>lb</span>
                </div>
            </div>
            <h2 class="my-3">Inches (in) or Meters (m) to Centimeters (cm)</h2>
            <div class="item">
                <div class="input-metric">
                    <input type="text" id="mToCm"><span>m</span>
                </div>
                <button class="btn btn-primary conveter-btn border-0"
                    onclick="metricConveter('#mToCm','#cmTom','mToCm')">Convert</button>
                <div class="input-metric">
                    <input type="text" id="cmTom"><span>cm</span>
                </div>
            </div>
            <div class="item">
                <div class="input-metric">
                    <input type="text" id="inToCm"><span>in</span>
                </div>
                <button class="btn conveter-btn btn-primary border-0"
                    onclick="metricConveter('#inToCm','#cmToin','inToCm')">Convert</button>
                <div class="input-metric">
                    <input type="text" id="cmToin"><span>cm</span>
                </div>
            </div>
            <div class="item">
                <div class="ft-in">
                    <div class="input-metric">
                        <input type="text" id="ftTOcm"><span>ft</span>
                        <input type="text" id="inFtToCm"><span>in</span>
                    </div>

                </div>
                <button class="btn conveter-btn btn-primary border-0"
                    onclick="metricConveter('#ftTOcm','#cmToFtIn','inFtToCm')">Convert</button>
                <div class="input-metric">
                    <input type="text" id="cmToFtIn"><span>cm</span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="meric-size-images">
                <img src="{{ static_asset('assets/img/women-shoe-size.png') }}" alt="">
                <img src="{{ static_asset('assets/img/men-shoe-size.png') }}" alt="">
                <img src="{{ static_asset('assets/img/kids-shoe-size.png') }}" alt="">
            </div>
        </div>
    </div>
@endsection
@section('script')
    <script>
        function metricConveter(input, output, type) {
            let inputValue = input.split(/\s/).join('');
            let outputValue = output.split(/\s/).join('');
            let typeValue = type.split(/\s/).join('');
            console.log(typeValue, outputValue, inputValue);
            let unitValue = document.querySelector(inputValue).value;

            if (isNaN(unitValue)) {
                alert("Must input numbers");
                return false;
            }

            function result(units) {
                return document.querySelector(outputValue).value = units.toFixed(2)
            }
            switch (typeValue) {
                case 'kg':
                    // code block

                    result(unitValue * 2.20462262);

                    break;
                case 'mToCm':
                    // code block

                    result(unitValue * 100);
                    break;
                case 'inToCm':
                    // code block
                    result(unitValue * 2.54);
                    break;
                case 'inFtToCm':
                    // code block
                    let inches = document.querySelector('#inFtToCm').value;
                    result((unitValue * 12 * 2.54) + inches * 2.54);
                    break;

                default:
                    // code block
            }



        }
    </script>
@endsection
