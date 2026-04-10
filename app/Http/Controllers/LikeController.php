<?php

namespace App\Http\Controllers;

use App\Http\Resources\LikeCollection;
use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\Like;
use App\Models\Post;
use App\Notifications\CommonNotification;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function store(Request $request)
    {
        $is_liked = 0;
        $post = Post::find($request->id);

        // Validate post exists
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        $postOwner = $post->user; // Get the post owner
        $currentUserId = auth()->user()->id;

        // Like type: like
        if ($request->likeType == 'like') {
            $count = $post->likes()->where('user_id', $currentUserId)->where('type', 'like')->count();

            if ($count == 0) {
                $is_liked = 1;
                $like = new Like();
                $like->post_id = $request->id;
                $like->user_id = $currentUserId;
                $like->type = 'like';
                $like->save();

                // Only notify if the liker is not the post owner
                if ($currentUserId != $postOwner->id) {
                    $postOwner->notify(new CommonNotification([
                        'user_id' => $currentUserId,
                        'post_id' => $post->id,
                        'message' => auth()->user()->name . ' liked your post.',
                        'type' => 'post_like',
                    ]));
                }
            } else {
                Like::where('user_id', $currentUserId)
                    ->where('type', 'like')
                    ->where('post_id', $request->id)
                    ->first()
                    ->delete();
            }
            $post_like_count = Like::where('post_id', $post->id)->where('type', 'like')->count();
        }

        // Like type: love
        if ($request->likeType == 'love') {
            $count = $post->likes()->where('user_id', $currentUserId)->where('type', 'love')->count();

            if ($count == 0) {
                $is_liked = 1;
                $like = new Like();
                $like->post_id = $request->id;
                $like->user_id = $currentUserId;
                $like->type = 'love';
                $like->save();

                // Only notify if the liker is not the post owner
                if ($currentUserId != $postOwner->id) {
                    $postOwner->notify(new CommonNotification([
                        'user_id' => $currentUserId,
                        'post_id' => $post->id,
                        'message' => auth()->user()->name . ' loved your post.',
                        'type' => 'post_love',
                    ]));
                }
            } else {
                Like::where('user_id', $currentUserId)
                    ->where('type', 'love')
                    ->where('post_id', $request->id)
                    ->first()
                    ->delete();
            }
            $post_like_count = Like::where('post_id', $post->id)->where('type', 'love')->count();
        }

        // Like type: flag
        if ($request->likeType == 'flag') {
            $count = $post->likes()->where('user_id', $currentUserId)->where('type', 'flag')->count();

            if ($count == 0) {
                $is_liked = 1;
                $like = new Like();
                $like->post_id = $request->id;
                $like->user_id = $currentUserId;
                $like->type = 'flag';
                $like->save();

                // Only notify if the liker is not the post owner
                if ($currentUserId != $postOwner->id) {
                    $postOwner->notify(new CommonNotification([
                        'user_id' => $currentUserId,
                        'post_id' => $post->id,
                        'message' => auth()->user()->name . ' flagged your post.',
                        'type' => 'post_flag',
                    ]));
                }
            } else {
                Like::where('user_id', $currentUserId)
                    ->where('type', 'flag')
                    ->where('post_id', $request->id)
                    ->first()
                    ->delete();
            }
            $post_like_count = Like::where('post_id', $post->id)->where('type', 'flag')->count();
        }

        return response()->json(['count' => $post_like_count, 'is_liked' => $is_liked]);
    }

    public function comment_like(Request $request)
    {
        $is_liked = 0;
        $comment = Comment::find($request->id);

        // Validate comment exists
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        $commentOwner = $comment->user; // Get the comment owner
        $currentUserId = auth()->user()->id;

        // Like type: like
        if ($request->likeType == 'like') {
            $count = $comment->likes()->where('user_id', $currentUserId)->where('type', 'like')->count();

            if ($count == 0) {
                $is_liked = 1;
                $like = new CommentLike();
                $like->comment_id = $request->id;
                $like->user_id = $currentUserId;
                $like->type = 'like';
                $like->save();

                // Only notify if the liker is not the comment owner
                if ($currentUserId != $commentOwner->id) {
                    $commentOwner->notify(new CommonNotification([
                        'user_id' => $currentUserId,
                        'comment_id' => $comment->id,
                        'message' => auth()->user()->name . ' liked your comment.',
                        'type' => 'comment_like',
                    ]));
                }
            } else {
                CommentLike::where('user_id', $currentUserId)
                    ->where('type', 'like')
                    ->where('comment_id', $request->id)
                    ->first()
                    ->delete();
            }
            $comment_like_count = CommentLike::where('comment_id', $comment->id)->where('type', 'like')->count();
        }

        // Like type: love
        if ($request->likeType == 'love') {
            $count = $comment->likes()->where('user_id', $currentUserId)->where('type', 'love')->count();

            if ($count == 0) {
                $is_liked = 1;
                $like = new CommentLike();
                $like->comment_id = $request->id;
                $like->user_id = $currentUserId;
                $like->type = 'love';
                $like->save();

                // Only notify if the liker is not the comment owner
                if ($currentUserId != $commentOwner->id) {
                    $commentOwner->notify(new CommonNotification([
                        'user_id' => $currentUserId,
                        'comment_id' => $comment->id,
                        'message' => auth()->user()->name . ' loved your comment.',
                        'type' => 'comment_love',
                    ]));
                }
            } else {
                CommentLike::where('user_id', $currentUserId)
                    ->where('type', 'love')
                    ->where('comment_id', $request->id)
                    ->first()
                    ->delete();
            }
            $comment_like_count = CommentLike::where('comment_id', $comment->id)->where('type', 'love')->count();
        }

        // Like type: flag
        if ($request->likeType == 'flag') {
            $count = $comment->likes()->where('user_id', $currentUserId)->where('type', 'flag')->count();

            if ($count == 0) {
                $is_liked = 1;
                $like = new CommentLike();
                $like->comment_id = $request->id;
                $like->user_id = $currentUserId;
                $like->type = 'flag';
                $like->save();

                // Only notify if the liker is not the comment owner
                if ($currentUserId != $commentOwner->id) {
                    $commentOwner->notify(new CommonNotification([
                        'user_id' => $currentUserId,
                        'comment_id' => $comment->id,
                        'message' => auth()->user()->name . ' flagged your comment.',
                        'type' => 'comment_flag',
                    ]));
                }
            } else {
                CommentLike::where('user_id', $currentUserId)
                    ->where('type', 'flag')
                    ->where('comment_id', $request->id)
                    ->first()
                    ->delete();
            }
            $comment_like_count = CommentLike::where('comment_id', $comment->id)->where('type', 'flag')->count();
        }

        return response()->json(['count' => $comment_like_count, 'is_liked' => $is_liked]);
    }
}
