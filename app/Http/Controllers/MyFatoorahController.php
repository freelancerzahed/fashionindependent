<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MyFatoorahController extends Controller
{
    protected $mfObj;

    // Remove constructor entirely or leave it empty
    public function __construct()
    {
        // Do NOT instantiate the SDK here
    }

    public function test()
    {
        return response()->json([
            'success' => true,
            'message' => 'Controller is working!'
        ]);
    }

    public function pay(Request $request)
    {
        // Only instantiate the SDK here
        if (!class_exists(\MyFatoorah\Library\PaymentMyfatoorahApiV2::class)) {
            return response()->json([
                'success' => false,
                'message' => 'MyFatoorah SDK not installed'
            ]);
        }

        $this->mfObj = new \MyFatoorah\Library\PaymentMyfatoorahApiV2(
            env('MYFATOORAH_TOKEN'),
            env('MYFATOORAH_COUNTRY_ISO'),
            get_setting('myfatoorah_sandbox') == 1
        );

        // Your payment logic
        return response()->json(['success' => true, 'message' => 'SDK instantiated']);
    }
}
