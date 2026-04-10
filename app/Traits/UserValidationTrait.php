<?php

namespace App\Traits;

trait UserValidationTrait
{
    protected function userRules ()
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'country'  => ['required', 'string', 'max:255']
        ];
    }
}
