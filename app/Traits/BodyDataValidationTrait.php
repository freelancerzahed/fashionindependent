<?php

namespace App\Traits;

trait BodyDataValidationTrait
{
    protected function bodyDataRules()
    {
        return [
            'weight'   => ['string', 'max:255', 'required'],
            'height' => ['string', 'max:255', 'required'],
            'bmi' => ['string', 'max:255', 'required'],
            'gender'    => ['string', 'max:255', 'required'],
            'variant' => ['string', 'max:255', 'required'],
            'shape'           => ['string', 'max:255', 'required'],
            'head_shape'     => ['string', 'max:255', 'required'],
            'head_size'     => ['string', 'max:255', 'required'],
            'neck_shape'      => ['string', 'max:255', 'required'],
            'neck_height' => ['string', 'max:255', 'required'],
            'neck_width'  => ['string', 'max:255', 'required'],
            'shoulder_height'           => ['string', 'max:255', 'required'],
            'shoulder_width'        => ['string', 'max:255', 'required'],
           
            'arm_size'           => ['string', 'max:255', 'required'],
            'breasts_shape'           => ['string', 'max:255', 'required'],
            'stomach_shape'      => ['string', 'max:255', 'required'],
            'legs_size'           => ['string', 'max:255', 'required'],
            'hips_size'          => ['string', 'max:255', 'required'],

            'head_bg_pos'     => ['string', 'max:255', 'required'],
            'breasts_bg_pos'          => ['string', 'max:255', 'required'],
            'neck_bg_pos'     => ['string', 'max:255', 'required'],
            'shoulders_bg_pos' => ['string', 'max:255', 'required'],
            'stomach_bg_pos' => ['string', 'max:255', 'required'],
            'legs_bg_pos' => ['string', 'max:255', 'required'],
          
        ];
    }
}
