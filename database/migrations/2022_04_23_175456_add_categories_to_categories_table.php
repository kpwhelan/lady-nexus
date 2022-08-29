<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    private $categories = [
        'Relationships',
        'Teen',
        'Vent Session',
        'New Moms',
        'Current Moms',
        'Recommendations',
        'Fashion',
        'Pets',
        'Work',
        'Books',
    ];

    public function up() {
        foreach ($this->categories as $category) {
            Category::create([
                'name' => $category,
            ]);
        }
    }

    public function down() {
        foreach ($this->categories as $category) {
            Category::where('name', '=', $category)->delete();
        }
    }
};
