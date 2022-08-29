<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CommentFactory extends Factory
{
    public function definition()
    {
        return [
            'comment' => $this->faker->sentence(),
        ];
    }
}
