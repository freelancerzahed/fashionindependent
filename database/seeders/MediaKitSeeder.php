<?php

namespace Database\Seeders;

use App\Models\MediaKitItem;
use Illuminate\Database\Seeder;

class MediaKitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'name' => 'Brand Guidelines',
                'description' => 'Complete brand guidelines for The Fashion Independent',
                'file_path' => '/media/brand-guidelines.pdf',
                'file_size' => '2.4 MB',
                'file_format' => 'PDF',
            ],
            [
                'name' => 'Logo Pack',
                'description' => 'High-resolution logos in various formats',
                'file_path' => '/media/logo-pack.zip',
                'file_size' => '5.1 MB',
                'file_format' => 'ZIP',
            ],
            [
                'name' => 'Press Photos',
                'description' => 'Professional press photos for use in articles',
                'file_path' => '/media/press-photos.zip',
                'file_size' => '12.8 MB',
                'file_format' => 'ZIP',
            ],
            [
                'name' => 'Fact Sheet',
                'description' => 'Key facts and figures about The Fashion Independent',
                'file_path' => '/media/fact-sheet.pdf',
                'file_size' => '890 KB',
                'file_format' => 'PDF',
            ],
        ];

        foreach ($items as $item) {
            MediaKitItem::firstOrCreate(
                ['name' => $item['name']],
                array_merge($item, ['is_active' => true])
            );
        }
    }
}
