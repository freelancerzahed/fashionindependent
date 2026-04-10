namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    // Store a new post
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'nullable|string',
            'visibility' => 'required|in:public,private',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4,mov,avi|max:20480', // 20MB max
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $mediaPath = $request->file('media')->store('posts', 'public');
            $ext = strtolower($request->file('media')->getClientOriginalExtension());
            $mediaType = in_array($ext, ['mp4','mov','avi']) ? 'video' : 'image';
        }

        $post = Post::create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
            'visibility' => $request->visibility,
        ]);

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post->load('user'),
        ], 201);
    }

    // Get all posts
    public function index()
    {
        $posts = Post::with('user')->latest()->get();

        return response()->json($posts);
    }
}
