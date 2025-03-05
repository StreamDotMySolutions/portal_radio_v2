<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class VodJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $vod;

    /**
     * Create a new job instance.
     */
    public function __construct($vod)
    {
        $this->vod = $vod;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        \Log::info($this->vod->name);
    }
}
