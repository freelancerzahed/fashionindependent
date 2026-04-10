<?php

namespace App\Http\Controllers;

use App\Mail\NotificationEmailManager;
use Illuminate\Support\Facades\Mail;
use App\Models\Post;
use App\Models\Report;
use App\Models\Upload;
use App\Notifications\PostNotification;
use Storage;
use Image;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class PostController extends Controller
{


    /*To Upload File.
    *
    * @return \Illuminate\Http\Response
    */
    public function upload($request)
    {
        $type = array(
            "jpg" => "image",
            "jpeg" => "image",
            "png" => "image",
            "svg" => "image",
            "webp" => "image",
            "gif" => "image",
            "mp4" => "video",
            "mpg" => "video",
            "mpeg" => "video",
            "webm" => "video",
            "ogg" => "video",
            "avi" => "video",
            "mov" => "video",
            "flv" => "video",
            "swf" => "video",
            "mkv" => "video",
            "wmv" => "video",
            "wma" => "audio",
            "aac" => "audio",
            "wav" => "audio",
            "mp3" => "audio",
            "zip" => "archive",
            "rar" => "archive",
            "7z" => "archive",
            "doc" => "document",
            "txt" => "document",
            "docx" => "document",
            "pdf" => "document",
            "csv" => "document",
            "xml" => "document",
            "ods" => "document",
            "xlr" => "document",
            "xls" => "document",
            "xlsx" => "document"
        );

        if ($request->hasFile('aiz_file')) {
            $upload = new Upload;
            $extension = strtolower($request->file('aiz_file')->getClientOriginalExtension());

            if (isset($type[$extension])) {
                $upload->file_original_name = null;
                $arr = explode('.', $request->file('aiz_file')->getClientOriginalName());
                for ($i = 0; $i < count($arr) - 1; $i++) {
                    if ($i == 0) {
                        $upload->file_original_name .= $arr[$i];
                    } else {
                        $upload->file_original_name .= "." . $arr[$i];
                    }
                }

                $path = $request->file('aiz_file')->store('uploads/all', 'local');
                $size = $request->file('aiz_file')->getSize();

                // Return MIME type ala mimetype extension
                $finfo = finfo_open(FILEINFO_MIME_TYPE);

                // Get the MIME type of the file
                $file_mime = finfo_file($finfo, base_path('public/') . $path);

                if ($type[$extension] == 'image' && get_setting('disable_image_optimization') != 1) {
                    try {
                        $img = Image::make($request->file('aiz_file')->getRealPath())->encode();
                        $height = $img->height();
                        $width = $img->width();
                        if ($width > $height && $width > 1500) {
                            $img->resize(1500, null, function ($constraint) {
                                $constraint->aspectRatio();
                            });
                        } elseif ($height > 1500) {
                            $img->resize(null, 800, function ($constraint) {
                                $constraint->aspectRatio();
                            });
                        }
                        $img->save(base_path('public/') . $path);
                        clearstatcache();
                        $size = $img->filesize();
                    } catch (\Exception $e) {
                        //dd($e);
                    }
                }

                if (env('FILESYSTEM_DRIVER') == 's3') {
                    Storage::disk('s3')->put(
                        $path,
                        file_get_contents(base_path('public/') . $path),
                        [
                            'visibility' => 'public',
                            'ContentType' =>  $extension == 'svg' ? 'image/svg+xml' : $file_mime
                        ]
                    );
                    if ($arr[0] != 'updates') {
                        unlink(base_path('public/') . $path);
                    }
                }

                $upload->extension = $extension;
                $upload->file_name = $path;
                $upload->post_type = 'media';
                $upload->user_id = Auth::user()->id;
                $upload->type = $type[$upload->extension];
                $upload->file_size = $size;
                $upload->save();
            }
            return  $upload->id;
        }
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)

    {        $user = Auth::user();
        $friends = $user->getFriends();

        $recipients = collect($friends)->map(function ($friend) {
          if(isTopFriend($friend)){
            return $friend;
          }
        });

         $media = $this->upload($request);
        $post = new Post();
        $post->user_id = $user->id;
        $post->body = $request->body;
         $post->media = $media;
        $post->save();




        //sends email to User
        if (env('MAIL_USERNAME') != null) {
            $array['view'] = 'emails.notification';
            $array['subject'] = $user->name .'' . translate('posted a new comment!');
            $array['from'] = env('MAIL_FROM_ADDRESS');
            $array['user_name']=$user->name;
            $array['type'] ='top_friend_post';

            try {
                Mail::to($recipients)->queue(new NotificationEmailManager($array));

            } catch (\Exception $e) {
            }
        }

        Notification::send($friends, new PostNotification($user));
        flash(translate('Post Successfully Added'))->success();
        return back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {


        // $all_uploads =  Upload::where('user_id', auth()->user()->id);
        // $search = null;
        // $sort_by = null;

        // if ($request->search != null) {
        //     $search = $request->search;
        //     $all_uploads->where('file_original_name', 'like', '%'.$request->search.'%');
        // }

        // $sort_by = $request->sort;
        // switch ($request->sort) {
        //     case 'newest':
        //         $all_uploads->orderBy('created_at', 'desc');
        //         break;
        //     case 'oldest':
        //         $all_uploads->orderBy('created_at', 'asc');
        //         break;
        //     case 'smallest':
        //         $all_uploads->orderBy('file_size', 'asc');
        //         break;
        //     case 'largest':
        //         $all_uploads->orderBy('file_size', 'desc');
        //         break;
        //     default:
        //         $all_uploads->orderBy('created_at', 'desc');
        //         break;
        // }

        $all_uploads = $all_uploads->paginate(60)->appends(request()->query());
        $user = Auth::user();
        $post = Post::find($id);
        $friends = $user->getFriends();
        if ($friends->isEmpty()) {
            $feeds = [];
        } else {
            $user_friends_id = $friends->pluck('id');
            $feeds = Post::whereIn('user_id', $user_friends_id)->get();
        }
        $top_friend = json_decode($user->top_10_friends);

        $top_10_friends = User::whereIn('id', $top_friend)->get();
        $bodyShapes = bodyShapes();
        $shape = $user->bodyStats->shape != '' ? $bodyShapes[$user->bodyStats->shape] : $bodyShapes['empty'];
        return view('frontend.social.postupdate', compact(['shape', 'all_uploads', 'feeds', 'post', 'top_10_friends']));
    }
    public function report(Request $request)
    {
        $report = new Report();
        $report->user_id = Auth::user()->id;
        $report->post_id = $request->post_id;
        $report->message = $request->message;
        $report->save();
        flash(translate('Report has been sent !'))->success();
        return back();
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $media = $this->upload($request);
        $post = Post::find($id);
        $post->body = $request->body;
        $post->media = $media;
        $post->update();
        flash(translate('Post Successfully Updated'))->success();
        return redirect()->route('get_user_profile');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->comments()->delete();
        if ($post->destroy($id)) {
            flash(translate('Post has been deleted!'))->error();
        }
        return back();
    }
}
