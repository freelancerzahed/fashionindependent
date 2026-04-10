<?php

namespace App\Http\Controllers;

use App\BodyStat;
use App\Models\User;
use App\Models\BodyData;
use App\Models\Customer;
use App\Models\MediaUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Traits\UserValidationTrait;
use App\Traits\BodyDataValidationTrait;
use App\Traits\RememberMeExpiration;
use App\Http\Requests\LoginRequest;
use App\Models\BusinessSetting;
use App\Models\Customer as ModelsCustomer;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UsersController extends Controller
{


    protected function authenticated(Request $request, $user)
    {
        return redirect('user/profile');
    }

    public function index()
    {
        $user = auth()->user();
        if ($user) {
            return redirect('/user/profile');
        }
        return view('frontend.index');
    }

    public function profile()
    {
        $user = auth()->user();
        if (!$user) {
            return redirect('/login');
        }

        $bodyShapes = bodyShapes();

        $shape = $user->bodyStats->shape != '' ? $bodyShapes[$user->bodyStats->shape] : $bodyShapes['empty'];

        $avatarImg = $user->image != '' ? '/uploads/' . $user->image : '/images/user.png';
        return view('users.profile', [
            'user'   => $user,
            'avatar' => app()->isLocal() ? $avatarImg : 'public/' . $avatarImg,
            'shape'  => $shape
        ]);
    }

    public function login()
    {
        return view('users.login');
    }

    public function doLogin(LoginRequest $request)
    {
        $credentials = $request->getCredentials();

        if (!Auth::validate($credentials)) :
            return redirect()->to('login')
                ->withErrors(trans('auth.failed'));
        endif;

        $user = Auth::getProvider()->retrieveByCredentials($credentials);

        Auth::login($user, $request->get('remember'));

        if ($request->get('remember')) :
            $this->setRememberMeExpiration($user);
        endif;

        return $this->authenticated($request, $user);
    }


    public function doLogout()
    {
        Auth::logout();
        return redirect('/');
    }


    public function store(Request $request)
    {


        // Validate incoming data
        // $request->validate([
        //     'name' => 'required|string|max:255',
        //     'email' => 'required|email|unique:users,email',
        //     'password' => 'required|confirmed|min:6',
        //     'shape_keyes' => 'required|json',
        //     'bust' => 'required|numeric',
        //     'shoe_size' => 'required|numeric',
        //     'weight' => 'required|numeric',
        //     'height' => 'required|numeric',
        //     'bmi' => 'required|numeric',
        //     'age_range' => 'required|numeric',
        //     'gender' => 'required|in:female,male,non-binary',
        //     'shape' => 'required|string'
        // ]);

        $user = new User();
        $email = User::where('email', $request->email)->first();
        if ($email == null) {
            $user->email = $request->email;
        } else {
            flash('You have already registered!');
            return back();
        }

        $validator = Validator::make($request->all(), [
            'password' => 'required|confirmed|max:12| min:5'

        ]);

        if ($validator->fails()) {
            flash(translate('Password confirmation does not match!'))->error();
            return back();
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',

        ]);

        if ($validator->fails()) {
            flash(translate('Name is required!'))->error();
            return back();
        } else {
            $user->name = $request->name;
        }
      /*   $validator = Validator::make($request->all(), $this->bodyDataRules()); */
        $user->password = Hash::make($request->password);
        $user_name = floor(time() - 999999999) . uniqid() . Str::random(9);
        $user->name = $request->name;
        $user->user_name = $user_name;
        // $user->country = $request->country;
         $user->save();


         $bodydata = new BodyData();
         $bodydata->user_id = $user->id;

         // Conditionally set bust only for females
         if ($request->gender == 'female') {
             $bodydata->bust = $request->bust;
         }

         $bodydata->weight = $request->weight;
         $bodydata->height = $request->height;
         $bodydata->bmi = $request->bmi;
         $bodydata->gender = $request->gender;
         $bodydata->shoe_size = $request->shoe_size;
         $bodydata->shape = $request->shape; // Include shape if needed
         $bodydata->shape_keys = $request->shape_keys; // Store the shape keys as well
         $bodydata->slider_values = $request->slider_values; // Store the shape keys as well
         $bodydata->alphanumeri_code = $request->alphanumeri_code; // Store the shape keys as well

         // Save the body data
         $bodydata->save();


         // Sign the user in
        Auth::attempt($request->only('email', 'password'));

        if ($user->email != null) {
            if (BusinessSetting::where('type', 'email_verification')->first()->value != 1) {
                $user->email_verified_at = date('Y-m-d H:m:s');
                $user->save();
                flash(translate('Registration successfull.'))->success();
            } else {
                event(new Registered($user));
                flash(translate('Registration successfull. Please verify your email.'))->success();
            }
        }

        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());


    }
    public function updatebody(Request $request)
    {



        $userId = Auth::user()->id;

        // Retrieve the existing body data for the authenticated user
        $bodydata = BodyData::where('user_id', $userId)->first();

        if ($bodydata) {
            // Update the shape keys
            $bodydata->shape_keys = $request->shape_keys;

            // Save the changes
            $bodydata->update();
        } else {
            // Handle the case where no body data exists for the user
            return response()->json(['message' => 'Body data not found for the user'], 404);
        }



    }
    // Save new user
    public function oldstore(Request $request)
    {


        $user = new User();
        $email = User::where('email', $request->email)->first();
        if ($email == null) {
            $user->email = $request->email;
        } else {
            flash('You have already registered!');
            return back();
        }

        $validator = Validator::make($request->all(), [
            'password' => 'required|confirmed|max:12| min:5'

        ]);

        if ($validator->fails()) {
            flash(translate('Password confirmation does not match!'))->error();
            return back();
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',

        ]);

        if ($validator->fails()) {
            flash(translate('Name is required!'))->error();
            return back();
        } else {
            $user->name = $request->name;
        }
      /*   $validator = Validator::make($request->all(), $this->bodyDataRules()); */
        $user->password = Hash::make($request->password);
        $user_name = floor(time() - 999999999) . uniqid() . Str::random(9);
        $user->name = $request->name;
        $user->user_name = $user_name;
        // $user->country = $request->country;
         $user->save();
        $customer = new Customer();
        $customer->user_id = $user->id;
         $customer->save();
         $customer->user_id = $user->id;
        // Validate & Store the new user body data
      /*
        if ($validator->fails()) {
            flash(translate('Something is worng in body data!'))->error();
            return back();
        } */
        $bodydata = new BodyData();
        $bodydata->user_id = $user->id;
        $bodydata->weight = $request->weight;
        $bodydata->height = $request->height;
        $bodydata->bmi = $request->bmi;
        $bodydata->gender = $request->gender;
        $bodydata->shoe_size = $request->shoe_size;
        if ($request->gender == 'female') {
            $bodydata->bust = $request->bust;
        }
        // $bodydata->variant = $request->variant;
        // $bodydata->shape = strtolower($request->shape);
        // //Body model Slider value
        // $bodydata->head_shape = $request->head_shape;
        // $bodydata->head_size= $request->head_size;
        // $bodydata->neck_shape = $request->neck_shape;
        // $bodydata->neck_height = $request->neck_height;
        // $bodydata->neck_width = $request->neck_width;
        // $bodydata->shoulder_height = $request->shoulder_height;
        // $bodydata->shoulder_width = $request->shoulder_width;
        // $bodydata->arm_size = $request->arm_size;
        // $bodydata->breasts_shape = $request->breasts_shape;
        // $bodydata->stomach_shape = $request->stomach_shape;
        // //male only
        // if ($request->gender == 'male') {
        //     $bodydata->torso_height = $request->torso_height;
        //     $bodydata->crotch_height = $request->crotch_height;
        // }
        // $bodydata->legs_size = $request->legs_size;
        // $bodydata->hips_size = $request->hips_size;

        $bodydata->save();
        //Body model css possiton data
        // $body_stat= New BodyStat();
        // $body_stat->user_id =$user->id;
        // $body_stat->body_data_id = $bodydata->id;
        // $body_stat->head_shape_val = $request->head_shape_val;
        // $body_stat->head_size_val = $request->head_size_val;
        // $body_stat->neck_shape_val  =$request->neck_shape_val;
        // $body_stat->neck_height_val  =$request->neck_height_val;
        // $body_stat->neck_width_val  =$request->neck_width_val;
        // $body_stat->shoulder_height_val  =$request->shoulder_height_val;
        // $body_stat->shoulder_width_val  =$request->shoulder_width_val;
        // $body_stat->arm_size_val  =$request->arm_size_val;
        // $body_stat->breasts_shape_val  =$request->breasts_shape_val;
        // $body_stat->stomach_shape_val  =$request->stomach_shape_val;
        // $body_stat->leg_size_val  =$request->leg_size_val;
        // $body_stat->hip_size_val  =$request->hip_size_val;
        // $body_stat->torso_height_val  =$request->torso_height_val;
        // $body_stat->crotch_height_val  =$request->crotch_height_val;
        // $body_stat->head_bg_pos = $request->head_bg_pos;
        // $body_stat->breasts_bg_pos = $request->breasts_bg_pos;
        // $body_stat->neck_bg_pos = $request->neck_bg_pos;
        // $body_stat->shoulders_bg_pos = $request->shoulders_bg_pos;
        // $body_stat->stomach_bg_pos = $request->stomach_bg_pos;
        // $body_stat->legs_bg_pos = $request->legs_bg_pos;
        // $body_stat->weight_class = $request->weight_class;
        // $body_stat->save();


        // Sign the user in
        Auth::attempt($request->only('email', 'password'));

        if ($user->email != null) {
            if (BusinessSetting::where('type', 'email_verification')->first()->value != 1) {
                $user->email_verified_at = date('Y-m-d H:m:s');
                $user->save();
                flash(translate('Registration successfull.'))->success();
            } else {
                event(new Registered($user));
                flash(translate('Registration successfull. Please verify your email.'))->success();
            }
        }

        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());
    }

    protected function registered(Request $request, $user)
    {
        if ($user->email == null) {
            return redirect()->route('verification');
        } else {
            return redirect()->route('get_user_profile');
        }
    }

    // Update user details
    public function update(Request $request)
    {
        $user = User::find(auth()->user()->id);
        $params = request()->all();
        foreach (request()->all() as $param => $val) {
            if ($val == null) {
                unset($params[$param]);
            }
        }

        if (isset($params['email']) && $params['email'] != $user->email) {
            $this->validate($request, [
                'email'    => ['required', 'string', 'email', 'max:255', 'unique:users']
            ]);
        }

        // Validate user name
        if (isset($params['name'])) {
            $this->validate($request, [
                'name'     => ['required', 'string', 'max:255']
            ]);
        }

        $birthday = $request->birthday;
        $params['birthday'] = date('Y-m-d', strtotime(str_replace('-', '/', $birthday)));
        $user->update($params);

        if ($request->password != '') {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }
        return redirect('/profile')->with('Message', 'Profile updateed');
    }

    // Handle uploading profile images
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imageName = uniqid() . time() . '.' . $request->image->extension();
        $request->image->move(public_path('uploads'), $imageName);

        /* Store $imageName name in DATABASE from HERE */
        $user = User::find(auth()->user()->id);
        $user->image = $imageName;
        $user->save();

        return back()
            ->with('success', 'You have successfully upload image.')
            ->with('image', $imageName);
    }

    // Handle user media upload
    public function uploadMedia(Request $request)
    {
        $request->validate([
            'media' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $mediaName = uniqid() . time() . '.' . $request->media->extension();
        $request->media->move(public_path('uploads'), $mediaName);

        /* Store $mediaName name in DATABASE from HERE */
        MediaUpload::create([
            'user_id'     => auth()->user()->id,
            'title'       => '',
            'description' => '',
            'type'        => 'image',
            'file_name'   => $mediaName
        ]);

        return redirect('/profile#media');
    }

    public function removeMedia(MediaUpload $media_upload)
    {
        $path = public_path('uploads') . '/' . $media_upload->file_name;
        if (file_exists($path)) {
            unlink($path);
        }
        $media_upload->delete();
        return redirect('/profile#media');
    }

    public function destroy(User $user)
    {
        if ($user->bodyStats) {
            $user->bodyStats->delete();
        }

        // Remove all the user media
        if ($user->mediaUploads) {
            foreach ($user->mediaUploads as $upload) {
                $path = public_path('uploads') . '/' . $upload->file_name;
                if (file_exists($path)) {
                    unlink($path);
                }
            }
            $user->mediaUploads()->delete();
        }

        // Remove the user image
        $path = public_path('uploads') . '/' . $user->image;
        if (file_exists($path)) {
            unlink($path);
        }

        $user->delete();
        Auth::logout();
        return redirect('/');
    }
    public function updateActivationSettingsInEnv($request)
    {
        if ($request->type == 'FORCE_HTTPS' && $request->value == '1') {
            $this->overWriteEnvFile($request->type, 'On');

            if (strpos(env('APP_URL'), 'http:') !== FALSE) {
                $this->overWriteEnvFile('APP_URL', str_replace("http:", "https:", env('APP_URL')));
            }
        } elseif ($request->type == 'FORCE_HTTPS' && $request->value == '0') {
            $this->overWriteEnvFile($request->type, 'Off');
            if (strpos(env('APP_URL'), 'https:') !== FALSE) {
                $this->overWriteEnvFile('APP_URL', str_replace("https:", "http:", env('APP_URL')));
            }
        } elseif ($request->type == 'FILESYSTEM_DRIVER' && $request->value == '1') {
            $this->overWriteEnvFile($request->type, 's3');
        } elseif ($request->type == 'FILESYSTEM_DRIVER' && $request->value == '0') {
            $this->overWriteEnvFile($request->type, 'local');
        }

        return '1';
    }


    public function UpdateMaintenanceMode()
    {

        $business_settings = BusinessSetting::where('type', 'maintenance_mode')->first();
        if ($business_settings != null) {


            if (env('DEMO_MODE') != 'On') {
                Artisan::call('up');
            }

            $business_settings->value = 0;
            $business_settings->save();
        } else {
            $business_settings = new BusinessSetting;
            $business_settings->type = 'maintenance_mode';
            $business_settings->value = 0;
            $business_settings->save();
        }

        Artisan::call('cache:clear');
        return redirect('/');
    }
}
