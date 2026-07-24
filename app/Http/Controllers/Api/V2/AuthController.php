<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Controllers\OTPVerificationController;
use App\Mail\GuestAccountOpeningMailManager;
use App\Models\Address;
use App\Models\BusinessSetting;
use App\Models\Creator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Notifications\AppEmailVerificationNotification;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Cart;
use App\Models\BodyData;
use App\Rules\Recaptcha;
use App\Utility\EmailUtility;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use App\Services\FashionIndependentEmailService;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        // ✅ Validation rules
        $validator = Validator::make($request->all(), [
            'name'              => 'required|string|max:255',
            'email'             => [
                'required',
                'email',
                Rule::when(!$request->filled('provider_id'), ['unique:users,email'])
            ],
            'password'          => 'required|min:6|max:255',
            'role'              => 'nullable|in:customer,creator,backer', // Optional role from frontend
            // Optional body data fields for MirrorMe Fashion
            'gender'            => 'nullable|in:male,female,non-binary,prefer-not-to-say',
            'weight'            => 'nullable|numeric|min:1|max:500',
            'height'            => 'nullable|numeric|min:30|max:300',
            'bmi'               => 'nullable|numeric',
            'shoe_size'         => 'nullable|string|max:50',
            'shape'             => 'nullable|string|max:255',
            'shape_keys'        => 'nullable|array',
            'slider_values'     => 'nullable|array',
            'alphanumeric_code' => 'nullable|string|max:255',
            'bust'              => 'nullable|string|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $existingUser = User::where('email', $request->email)->first();
            $isProfileCompletion = $request->filled('provider_id') && $existingUser;

            if ($isProfileCompletion) {
                $user = $existingUser;
                $user->name = $request->name;
                $user->password = Hash::make($request->password);
                $user->user_type = $request->role ?? $user->user_type ?? 'customer';
                $user->provider_id = $request->provider_id ?: $user->provider_id;
                $user->email_verified_at = now();
                $user->save();

                Log::info('Google profile completed during signup', ['user_id' => $user->id, 'user_type' => $user->user_type, 'role' => $request->role]);
            } else {
                $user = new User();
                $user->name = $request->name;
                $user->email = $request->email;
                $user->password = Hash::make($request->password);
                $user->user_name = Str::random(12);
                $user->user_type = $request->role ?? 'customer';
                $user->email_verified_at = now();
                $user->provider_id = $request->provider_id;
                $user->save();

                Log::info('User created during signup', ['user_id' => $user->id, 'user_type' => $user->user_type, 'role' => $request->role]);
            }

            // If user is registering as creator, create creator profile
            if (($request->role ?? $user->user_type) === 'creator') {
                try {
                    $creator = Creator::firstOrCreate(
                        ['user_id' => $user->id],
                        [
                            'status' => 'pending',
                            'brand_name' => $request->name,
                            'has_inventory' => true,
                            'has_tech_pack' => false,
                            'accepted_terms' => true,
                            'accepted_collaboration_agreement' => false,
                            'accepted_delivery_obligation' => false,
                            'terms_accepted_at' => now(),
                        ]
                    );
                    Log::info('Creator profile ensured during signup', ['user_id' => $user->id, 'creator_id' => $creator->id]);
                } catch (\Exception $e) {
                    Log::error('Failed to create creator profile during signup', ['user_id' => $user->id, 'error' => $e->getMessage()]);
                }
            }

            // Create or update body data only if body measurements are provided
            if ($request->filled('gender') || $request->filled('weight') || $request->filled('height') || $request->filled('age_range')) {
                $alphanumericCode = $request->filled('alphanumeric_code') ? trim((string) $request->input('alphanumeric_code')) : null;

                if (!$alphanumericCode) {
                    $alphanumericCode = $request->filled('alphanumericCode') ? trim((string) $request->input('alphanumericCode')) : null;
                }

                if (!$alphanumericCode) {
                    $alphanumericCode = 'AUTO-' . strtoupper(Str::random(8));
                }

                $bodyData = BodyData::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'weight' => $request->weight,
                        'height' => $request->height,
                        'bmi' => $request->bmi,
                        'age' => $request->age_range,
                        'gender' => $request->gender,
                        'shoe_size' => $request->shoe_size,
                        'shape' => $request->shape,
                        'shape_keys' => $request->filled('shape_keys') ? json_encode($request->shape_keys) : null,
                        'slider_values' => $request->filled('slider_values') ? json_encode($request->slider_values) : null,
                        'alphanumeric_code' => $alphanumericCode,
                        'bust' => ($request->gender === 'female' && $request->filled('bust')) ? $request->bust : null,
                    ]
                );

                Log::info('Body data updated during signup', ['user_id' => $user->id, 'body_data_id' => $bodyData->id]);
            }

            // Auto-login and return token
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User registered', ['user_id' => $user->id, 'user_type' => $user->user_type]);

            // Build roles array based on user_type
            $roles = [$user->user_type];
            
            // For testing: Give all creator users both creator and backer roles
            if ($user->user_type === 'creator') {
                $roles = ['creator', 'backer'];
            }

            // Send welcome email (best-effort)
            try {
                app(FashionIndependentEmailService::class)->sendWelcomeEmail($user);
            } catch (\Exception $e) {
                Log::error('Welcome email failed: ' . $e->getMessage());
            }

            return response()->json([
                'status'  => true,
                'message' => 'Registration successful!',
                'user'    => $user,
                'roles'   => $roles,
                'token'   => $token
            ], 201);
        } catch (\Exception $e) {
            Log::error('Signup failed', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function resendCode()
    {
        $user = auth()->user();
        $user->verification_code = rand(100000, 999999);

        if ($user->email) {
            try {
                $user->notify(new AppEmailVerificationNotification());
            } catch (\Exception $e) {
                Log::error('Resend verification notification failed: ' . $e->getMessage());
            }
        } else {
            $otpController = new OTPVerificationController();
            $otpController->send_code($user);
        }

        $user->save();

        return response()->json([
            'result' => true,
            'message' => translate('Verification code is sent again'),
        ], 200);
    }

    public function confirmCode(Request $request)
    {
        $user = auth()->user();

        if ($user->verification_code == $request->verification_code) {
            $user->email_verified_at = date('Y-m-d H:i:s');
            $user->verification_code = null;
            $user->save();
            return response()->json([
                'result' => true,
                'message' => translate('Your account is now verified'),
            ], 200);
        } else {
            return response()->json([
                'result' => false,
                'message' => translate('Code does not match, you can request for resending the code'),
            ], 200);
        }
    }


    public function getUserByUsername($username)
{
    $user = User::where('user_name', $username)->first();
    $auth_user = auth()->user();
    if (!$user) {
        return response()->json([
            'status' => false,
            'message' => 'User not found',
        ], 404);
    }

    // Check if auth_user exists before calling methods on it
    $isFollowing = false;
    if ($auth_user) {
        $isFollowing = $auth_user->isFriendWith($user);
    }

    // Filter out sensitive or internal fields
    $filtered = $user->makeHidden([
        'id',
        'referred_by',
        'provider',
        'provider_id',
        'refresh_token',
        'access_token',
        'password',
        'remember_token',
        'email_verified_at',
        'verification_code',
        'new_email_verificiation_code',
        'device_token',
        'balance',
        'banned',
        'customer_package_id',
        'remaining_uploads',
        'top_10_friends',
        'chat_connection_id',
        'status',
        'created_at',
        'updated_at',
    ]);

    // Add the isFollowing field to the user object
    $filtered->isFollowing = $isFollowing;


    return response()->json([
        'status' => true,
        'user' => $filtered,
    ], 200);
}


    public function login(Request $request)
    {
        // Check if reCAPTCHA is enabled (default: false - optional)
        $recaptchaEnabled = false; // Default to false - reCAPTCHA is optional unless explicitly enabled
        
        try {
            $setting = get_setting('recaptcha_enabled');
            if ($setting !== null) {
                $recaptchaEnabled = (bool) $setting;
            } else {
                // Fall back to environment variable, default to false
                $recaptchaEnabled = filter_var(env('RECAPTCHA_ENABLED', 'false'), FILTER_VALIDATE_BOOLEAN);
            }
        } catch (\Throwable $e) {
            // If get_setting fails, fall back to env variable, default to false
            Log::warning('Error checking reCAPTCHA setting: ' . $e->getMessage());
            $recaptchaEnabled = filter_var(env('RECAPTCHA_ENABLED', 'false'), FILTER_VALIDATE_BOOLEAN);
        }

        Log::debug('reCAPTCHA enabled: ' . ($recaptchaEnabled ? 'true' : 'false'));

        $messages = [
            'email.required'            => $request->login_by == 'email' ? 'Email is required' : 'Phone is required',
            'email.email'               => 'Email must be a valid email address',
            'email.numeric'             => 'Phone must be a number.',
            'password.required'         => 'Password is required',
            'recaptcha_token.required'  => 'Captcha is required',
        ];

        $rules = [
            'password'         => 'required',
            'login_by'         => 'required',
            'email' => [
                'required',
                Rule::when($request->login_by === 'email', ['email', 'required']),
                Rule::when($request->login_by === 'phone', ['numeric', 'required']),
            ]
        ];

        // Only require recaptcha_token if it's enabled
        if ($recaptchaEnabled) {
            $rules['recaptcha_token'] = 'required';
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'result'  => false,
                'message' => $validator->errors()->all()
            ], 422);
        }

        // Verify reCAPTCHA with Google only if enabled and token is provided
        if ($recaptchaEnabled && $request->filled('recaptcha_token')) {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => env('RECAPTCHA_SECRET_KEY'),
                'response' => $request->recaptcha_token,
                'remoteip' => $request->ip(),
            ]);

            if (!$response->json('success')) {
                return response()->json(['message' => 'Captcha verification failed'], 422);
            }
        }
        // Existing login process
        $req_email = $request->email;
        $user_type = $request->user_type ?? 'customer';

        $user = User::where('user_type', $user_type)
            ->where(function ($query) use ($req_email) {
                $query->where('email', $req_email)
                      ->orWhere('phone', $req_email);
            })->first();

        if (!$user) {
            return response()->json([
                'result' => false,
                'message' => 'User not found',
                'user' => null
            ], 401);
        }

        if ($user->banned) {
            return response()->json([
                'result' => false,
                'message' => 'User is banned',
                'user' => null
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'result' => false,
                'message' => 'Unauthorized',
                'user' => null
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Build roles array based on user_type and relationships
        $roles = [$user->user_type];
        
        // For testing: Give all creator users both creator and backer roles
        if ($user->user_type === 'creator') {
            $roles = ['creator', 'backer'];
        }

        return response()->json([
            'result' => true,
            'message' => 'Login successful',
            'user' => $user,
            'roles' => $roles,
            'token' => $token
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
public function body_data()
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
        ], 401);
    }

    $bodyData = BodyData::where('user_id', $user->id)->first();

    if (!$bodyData) {
        return response()->json([
            'success' => true,
            'message' => 'No body data found',
            'data'    => null,
        ], 200);
    }

    // ✅ No need for json_decode because of $casts
    return response()->json([
        'success' => true,
        'data'    => $bodyData,
    ]);
}

public function update_body_data(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);
    }

    // Get only fields from the payload
    $payload = $request->only([
        'shape',
        'shape_keys',
        'slider_values',
        'alphanumeric_code'
    ]);

    // -------------------------------
    // Normalize shape_keys and slider_values if they are strings
    // -------------------------------
    if (isset($payload['shape_keys'])) {
        if (is_string($payload['shape_keys'])) {
            $decoded = json_decode($payload['shape_keys'], true);
            $payload['shape_keys'] = $decoded ?? [];
        }
    }

    if (isset($payload['slider_values'])) {
        if (is_string($payload['slider_values'])) {
            $decoded = json_decode($payload['slider_values'], true);
            $payload['slider_values'] = $decoded ?? [];
        }
    }

    // -------------------------------
    // Update or create body data
    // -------------------------------
    $bodyData = $user->bodyData()->updateOrCreate(
        ['user_id' => $user->id],
        $payload
    );

    return response()->json([
        'success' => true,
        'message' => 'Body data updated successfully',
        'data'    => $bodyData
    ]);
}




    public function logout(Request $request)
    {
        $user = request()->user();
        if ($user && $user->currentAccessToken()) {
            $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
        }

        return response()->json([
            'result' => true,
            'message' => translate('Successfully logged out')
        ]);
    }

    public function socialLogin(Request $request)
    {
        if (!$request->provider) {
            return response()->json([
                'result' => false,
                'message' => translate('User not found'),
                'user' => null
            ]);
        }

        switch ($request->social_provider) {
            case 'facebook':
                $social_user = Socialite::driver('facebook')->fields([
                    'name',
                    'first_name',
                    'last_name',
                    'email'
                ]);
                break;
            case 'google':
                $social_user = Socialite::driver('google')->scopes(['profile', 'email']);
                break;
            case 'twitter':
                $social_user = Socialite::driver('twitter');
                break;
            case 'apple':
                $social_user = Socialite::driver('sign-in-with-apple')->scopes(['name', 'email']);
                break;
            default:
                $social_user = null;
        }
        if ($social_user == null) {
            return response()->json(['result' => false, 'message' => translate('No social provider matches'), 'user' => null]);
        }

        if ($request->social_provider == 'twitter') {
            $social_user_details = $social_user->userFromTokenAndSecret($request->access_token, $request->secret_token);
        } else {
            $social_user_details = $social_user->userFromToken($request->access_token);
        }

        if ($social_user_details == null) {
            return response()->json(['result' => false, 'message' => translate('No social account matches'), 'user' => null]);
        }

        $existingUserByProviderId = User::where('provider_id', $request->provider)->first();

        if ($existingUserByProviderId) {
            $existingUserByProviderId->access_token = $social_user_details->token;
            if ($request->social_provider == 'apple') {
                $existingUserByProviderId->refresh_token = $social_user_details->refreshToken;
                if (!isset($social_user->user['is_private_email'])) {
                    $existingUserByProviderId->email = $social_user_details->email;
                }
            }
            $existingUserByProviderId->save();
            return $this->loginSuccess($existingUserByProviderId, null, null, false);
        }

        $existing_or_new_user = User::firstOrNew([
            'email' => $social_user_details->email,
        ]);

        $isNewSocialUser = !$existing_or_new_user->exists;
        $existing_or_new_user->provider_id = $social_user_details->id;

        if ($isNewSocialUser) {
            if ($request->social_provider == 'apple') {
                $existing_or_new_user->name = $request->name ?: 'Apple User';
            } else {
                $existing_or_new_user->name = $social_user_details->name;
            }
            $existing_or_new_user->email = $social_user_details->email;
            $existing_or_new_user->email_verified_at = date('Y-m-d H:m:s');
        }

        $existing_or_new_user->save();

        return $this->loginSuccess($existing_or_new_user, null, null, $isNewSocialUser);
    }

    // Guest user Account Create
    public function guestUserAccountCreate(Request $request)
    {
        $success = 1;
        $password = substr(hash('sha512', rand()), 0, 8);
        $isEmailVerificationEnabled = get_setting('email_verification');

        // User Create
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = addon_is_activated('otp_system') ? $request->phone : null;
        $user->password = Hash::make($password);
        $user->email_verified_at = $isEmailVerificationEnabled != 1 ? date('Y-m-d H:m:s') : null;
        $user->save();

        // Account Opening and verification(if activated) email send
        try {
            EmailUtility::customer_registration_email('registration_from_system_email_to_customer', $user, $password);
        } catch (\Exception $e) {
            $success = 0;
            $user->delete();
        }

        if ($success == 0) {
            return response()->json([
                'result' => false,
                'message' => translate('Something went wrong!')
            ]);
        }

        if ($isEmailVerificationEnabled == 1) {
            $user->notify(new AppEmailVerificationNotification());
        }

        // User Address Create
        $address = new Address();
        $address->user_id       = $user->id;
        $address->address       = $request->address;
        $address->country_id    = $request->country_id;
        $address->state_id      = $request->state_id;
        $address->city_id       = $request->city_id;
        $address->postal_code   = $request->postal_code;
        $address->phone         = $request->phone;
        $address->longitude     = $request->longitude;
        $address->latitude      = $request->latitude;
        $address->save();

        Cart::where('temp_user_id', $request->temp_user_id)
            ->update([
                'user_id' => $user->id,
                'temp_user_id' => null,
                'address_id' => $address->id
            ]);

        // create token
        $user->createToken('tokens')->plainTextToken;

        return $this->loginSuccess($user);
    }

    public function loginSuccess($user, $token = null, $tempUserId = null, $isNewSocialUser = false)
    {
        if (!$token) {
            $token = $user->createToken('API Token')->plainTextToken;
        }

        if ($tempUserId != null) {
            Cart::where('temp_user_id', $tempUserId)
                ->update([
                    'user_id' => $user->id,
                    'temp_user_id' => null
                ]);
        }

        $missingProfileFields = $this->getProfileMissingFields($user);

        return response()->json([
            'result' => true,
            'message' => translate('Successfully logged in'),
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => null,
            'is_new_user' => $isNewSocialUser,
            'profile_complete' => empty($missingProfileFields),
            'profile_missing_fields' => $missingProfileFields,
            'user' => [
                'id' => $user->id,
                'type' => $user->user_type,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'avatar_original' => uploaded_asset($user->avatar_original),
                'phone' => $user->phone,
                'email_verified' => $user->email_verified_at != null
            ]
        ]);
    }

    protected function getProfileMissingFields($user)
    {
        $missingFields = [];

        if (empty($user->user_type)) {
            $missingFields[] = 'role';
        }

        $bodyData = $user->bodyData()->first();

        if (!$bodyData) {
            $missingFields[] = 'age';
            $missingFields[] = 'gender';
            return $missingFields;
        }

        if (empty($bodyData->age)) {
            $missingFields[] = 'age';
        }

        if (empty($bodyData->gender)) {
            $missingFields[] = 'gender';
        }

        return $missingFields;
    }

    protected function loginFailed()
    {
        return response()->json([
            'result' => false,
            'message' => translate('Login Failed'),
            'access_token' => '',
            'token_type' => '',
            'expires_at' => null,
            'user' => [
                'id' => 0,
                'type' => '',
                'name' => '',
                'email' => '',
                'avatar' => '',
                'avatar_original' => '',
                'phone' => ''
            ]
        ]);
    }

    public function account_deletion()
    {
        if (auth()->user()) {
            Cart::where('user_id', auth()->user()->id)->delete();
        }
        $auth_user = auth()->user();
        $auth_user->tokens()->where('id', $auth_user->currentAccessToken()->id)->delete();
        $auth_user->customer_products()->delete();

        User::destroy(auth()->user()->id);

        return response()->json([
            "result" => true,
            "message" => translate('Your account deletion successfully done')
        ]);
    }

    public function getUserInfoByAccessToken(Request $request)
    {
        $token = PersonalAccessToken::findToken($request->access_token);
        if (!$token) {
            return $this->loginFailed();
        }
        $user = $token->tokenable;

        if ($user == null) {
            return $this->loginFailed();
        }

        return $this->loginSuccess($user, $request->access_token);
    }
}
