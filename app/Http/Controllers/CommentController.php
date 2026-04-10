<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        if ($comment->destroy($id)) {
            flash(translate('Comment has been deleted!'))->error();
        }
        return back();
    }

}
