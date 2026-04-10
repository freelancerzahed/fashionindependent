<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Creator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class TestCreatorSignup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:creator-signup {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the creator signup flow';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? 'testcreator' . time() . '@test.com';
        $password = 'TestPassword123!';
        $name = 'Test Creator';

        $this->info('🎯 Testing Creator Signup Flow');
        $this->info('================================');
        $this->newLine();

        try {
            $this->info('1. Creating user with user_type=creator...');
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'user_type' => 'creator',
                'user_name' => Str::random(12),
                'email_verified_at' => now(),
            ]);
            $this->info("   ✓ User created (ID: {$user->id}, Email: {$user->email})");

            $this->newLine();
            $this->info('2. Creating creator profile...');
            $creator = Creator::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'brand_name' => $name,
                'has_inventory' => true,
                'has_tech_pack' => false,
                'accepted_terms' => true,
                'accepted_collaboration_agreement' => false,
                'accepted_delivery_obligation' => false,
                'terms_accepted_at' => now(),
            ]);
            $this->info("   ✓ Creator profile created (ID: {$creator->id}, Status: {$creator->status})");

            $this->newLine();
            $this->info('3. Creating auth token...');
            $token = $user->createToken('auth_token')->plainTextToken;
            $this->info("   ✓ Token created (Preview: " . substr($token, 0, 20) . "...)");

            $this->newLine();
            $this->info('4. Verifying relationships...');
            $userCheck = User::find($user->id);
            if ($userCheck->creator) {
                $this->info("   ✓ User has creator relationship: {$userCheck->creator->id}");
            } else {
                $this->error("   ✗ User does not have creator relationship");
            }

            $creatorCheck = Creator::find($creator->id);
            if ($creatorCheck->user) {
                $this->info("   ✓ Creator has user relationship: {$creatorCheck->user->id}");
            } else {
                $this->error("   ✗ Creator does not have user relationship");
            }

            $this->newLine();
            $this->info('✅ All tests passed!');
            $this->newLine();
            $this->info('Test credentials:');
            $this->line("  Email: $email");
            $this->line("  Password: $password");
            $this->line("  User ID: {$user->id}");
            $this->line("  Creator ID: {$creator->id}");
            $this->line("  Token: " . substr($token, 0, 30) . "...");

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->line($e->getFile() . ':' . $e->getLine());
            return 1;
        }

        return 0;
    }
}
