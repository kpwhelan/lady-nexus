<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    public function definition()
    {
        return [
            'post' => $this->faker->paragraph(),
            'category_id' => rand(1,10),
        ];
    }
}
