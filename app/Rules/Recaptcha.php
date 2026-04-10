<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Recaptcha implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $data = array(
            'secret' => env('RECAPTCHA_SECRET_KEY'),
            'response' => $value
        );

        try {
            // Initialize cURL
            $verify = curl_init();

            // Set the cURL options
            curl_setopt($verify, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
            curl_setopt($verify, CURLOPT_POST, true);
            curl_setopt($verify, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($verify, CURLOPT_SSL_VERIFYPEER, true); // Enabling SSL verification
            curl_setopt($verify, CURLOPT_RETURNTRANSFER, true);

            // Execute the cURL request
            $response = curl_exec($verify);

            // Check for errors in the cURL request
            if(curl_errno($verify)) {
                \Log::error('cURL Error: ' . curl_error($verify));
                return false;
            }

            // Decode the response and check for success
            $result = json_decode($response);
            return $result->success;
        } catch (\Exception $e) {
            // Log the error for debugging purposes but avoid disclosing sensitive data
            \Log::error("Recaptcha verification failed: " . $e->getMessage());
            return false;
        }
    }


    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'reCAPTCHA verification failed.';
    }
}
