<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Blog;

echo "=== Checking News Blogs ===\n";
$news_blogs = Blog::where('type', 'news')->get();
echo "Total news blogs: " . count($news_blogs) . "\n";

foreach ($news_blogs as $blog) {
    echo "ID: {$blog->id}, Title: {$blog->title}, Type: {$blog->type}, Status: {$blog->status}, Slug: {$blog->slug}\n";
}

echo "\n=== Checking All Blogs ===\n";
$all_blogs = Blog::get();
echo "Total blogs: " . count($all_blogs) . "\n";
foreach ($all_blogs->take(5) as $blog) {
    echo "ID: {$blog->id}, Title: {$blog->title}, Type: {$blog->type}, Status: {$blog->status}\n";
}
