<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kalnoy\Nestedset\NestedSet;

class CreateDirectoriesTable extends Migration
{
    public function up()
    {
        Schema::create('directories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('occupation');
            $table->string('email');
            $table->timestamps();
            NestedSet::columns($table);
        });
    }

    public function down()
    {
        Schema::dropIfExists('directories');
    }
}
