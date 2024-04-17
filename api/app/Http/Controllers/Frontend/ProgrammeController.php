<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Programme;


class ProgrammeController extends Controller
{
    public function index()
    {

        $programmes = Programme::query()->defaultOrder()->get()->toTree();
        
        return response()->json(['items' => $programmes]);
    }

}
