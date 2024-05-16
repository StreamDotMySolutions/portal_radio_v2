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
            $table->engine = 'InnoDB';
            $table->id();
           
            $table->string('type')->nullable();

            $table->string('photo')->nullable();
            $table->string('name')->nullable();
            $table->string('occupation')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('twitter')->nullable();
           
            $table->timestamps();
            NestedSet::columns($table);
        });
    }

    public function down()
    {
        Schema::dropIfExists('directories');
    }
}
