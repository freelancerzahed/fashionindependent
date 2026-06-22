<?php

namespace Database\Seeders;

use App\Models\PressRelease;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PressReleaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $releases = [
            [
                'title' => 'The Fashion Independent Reaches $100K in Designer Funding',
                'excerpt' => 'Platform celebrates milestone achievement as 100 independent designers receive backing from global community of fashion enthusiasts.',
                'content' => 'Platform celebrates milestone achievement as 100 independent designers receive backing from global community of fashion enthusiasts. This represents a major milestone in our mission to support independent fashion designers worldwide.',
                'published_date' => '2025-03-15',
            ],
            [
                'title' => 'Introducing ShapeMe Body Modeler: Revolutionary Sizing Technology',
                'excerpt' => 'New 3D body modeling feature helps backers find perfect fit while supporting sustainable fashion practices.',
                'content' => 'New 3D body modeling feature helps backers find perfect fit while supporting sustainable fashion practices. The ShapeMe Body Modeler uses advanced technology to ensure customers get the right size every time.',
                'published_date' => '2025-02-28',
            ],
            [
                'title' => 'The Fashion Independent Launches Eco-Friendly Manufacturing Facility',
                'excerpt' => 'State-of-the-art facility promises 7-21 day turnaround times while minimizing waste and utilizing sustainable materials.',
                'content' => 'State-of-the-art facility promises 7-21 day turnaround times while minimizing waste and utilizing sustainable materials. Our new manufacturing facility represents a significant investment in sustainable fashion production.',
                'published_date' => '2025-01-10',
            ],
            [
                'title' => 'Partnership Announcement: Collaboration with Global Sustainable Fashion Alliance',
                'excerpt' => 'Strategic partnership to promote ethical manufacturing and sustainable practices across the fashion industry.',
                'content' => 'Strategic partnership to promote ethical manufacturing and sustainable practices across the fashion industry. This collaboration marks a major step forward in our commitment to sustainability and ethical fashion.',
                'published_date' => '2024-12-20',
            ],
            [
                'title' => 'The Fashion Independent Wins "Innovation in E-Commerce" Award',
                'excerpt' => 'Platform recognized for groundbreaking approach to supporting independent designers and sustainable fashion.',
                'content' => 'Platform recognized for groundbreaking approach to supporting independent designers and sustainable fashion. The award highlights our unique position in the fashion industry.',
                'published_date' => '2024-11-15',
            ],
        ];

        foreach ($releases as $release) {
            PressRelease::firstOrCreate(
                ['slug' => Str::slug($release['title'])],
                array_merge($release, ['is_active' => true])
            );
        }
    }
}
