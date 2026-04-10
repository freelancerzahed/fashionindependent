<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\FeedbackResponse;
use App\Models\Survey;
use App\Upload;
use Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\New_;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $feedbacks =  Feedback::orderBy('created_at', 'desc')->get();

        return view('backend.survey.feedbacks.index', compact('feedbacks'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($id)
    {
        $survey = Survey::findOrFail($id);
        $survey->load('questions.answers');

        return view('frontend.pages.feedback', compact('survey'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)

    {


        $feedback = new Feedback();
        $feedback = $feedback->create($request['feedback']);
        foreach ($request['renponses'] as $response) {

            if (isset($response['answer_id']) && is_array($response['answer_id'])) {
                $response['answer_id'] =   json_encode($response['answer_id']);
            }
            if(isset($response['media'])){
                $response['media'] = $this->upload($response['media']);
            }

            $feedback->feedback_responses()->create($response);
        }
 

        flash(translate('Thanks for your feedback. We are constantly trying to improve our services'))->success();
        return redirect()->back();
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $responses = FeedbackResponse::where('feedback_id', $id)->orderBy('created_at', 'desc')->get();


        return view('backend.survey.feedbacks.show', compact('responses'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $feedback = Feedback::FindOrFail($id);
        $responses = $feedback->feedback_responses();
        $feedback->delete();
        $responses->delete();
        flash(translate('Feedback has been successfully deleted!'))->success();
        return back();
    }

    /*To Upload File.
    *
    * @return \Illuminate\Http\Response
    */
    public function upload($media)
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

        if ($media) {
            $upload = new Upload();
            $extension = strtolower($media->getClientOriginalExtension());

            if (isset($type[$extension])) {
                $upload->file_original_name = null;
                $arr = explode('.', $media->getClientOriginalName());
                for ($i = 0; $i < count($arr) - 1; $i++) {
                    if ($i == 0) {
                        $upload->file_original_name .= $arr[$i];
                    } else {
                        $upload->file_original_name .= "." . $arr[$i];
                    }
                }

                $path = $media->store('uploads/all/feedback', 'local');
                $size = $media->getSize();

                // Return MIME type ala mimetype extension
                $finfo = finfo_open(FILEINFO_MIME_TYPE);

                // Get the MIME type of the file
                $file_mime = finfo_file($finfo, base_path('public/') . $path);

                if ($type[$extension] == 'image' && get_setting('disable_image_optimization') != 1) {
                    try {
                        $img = Image::make($media->getRealPath())->encode();
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
                $upload->user_id =0;
                $upload->type = $type[$upload->extension];
                $upload->file_size = $size;
                $upload->save();
            }
            return  $upload->id;
        }
    }
}
