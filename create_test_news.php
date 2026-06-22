<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Blog;

$blog = new Blog();
$blog->title = 'Test News: New Collection Launch';
$blog->slug = 'test-news-new-collection-launch';
$blog->short_description = 'We are excited to announce the launch of our new sustainable fashion collection.';
$blog->description = '<p>Our new collection features eco-friendly materials and ethical manufacturing practices.</p>';
$blog->category_id = 1;
$blog->type = 'news';
$blog->status = 1;
$blog->save();

echo "✓ News item created with ID: " . $blog->id . "\n";
