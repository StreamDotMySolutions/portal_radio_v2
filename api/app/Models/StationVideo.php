<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Kalnoy\Nestedset\NodeTrait;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class StationVideo extends Model
{
    use HasFactory;
    use NodeTrait;
    use LogsActivity;

    // Files live under storage/app/public/station-videos/{id}/{version}/ (master.m3u8, v0..v2, poster.jpg)
    public const ROOT = 'station-videos';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logUnguarded()->logOnlyDirty();
    }

    protected $guarded = ['id'];

    protected $casts = [
        'renditions' => 'array',
        'active'     => 'boolean',
        'duration'   => 'float',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    protected $appends = ['hls_url', 'poster_url'];

    // Ordering (up/down) is within one station
    protected function getScopeAttributes()
    {
        return ['station_id'];
    }

    public function station()
    {
        return $this->belongsTo(Station::class);
    }

    public function directory(): string
    {
        return self::ROOT . '/' . $this->id;
    }

    // Paths under /storage, like the station images: the frontends prefix their own server URL
    public function getHlsUrlAttribute(): ?string
    {
        return $this->version ? "{$this->directory()}/{$this->version}/master.m3u8" : null;
    }

    public function getPosterUrlAttribute(): ?string
    {
        return $this->version ? "{$this->directory()}/{$this->version}/poster.jpg" : null;
    }

    // Uploads wait on the private local disk (not web-served) until they are transcoded
    public const INBOX = 'station-video-inbox';

    public function sourcePath(): ?string
    {
        return $this->source_filename ? Storage::disk('local')->path(self::INBOX . '/' . $this->source_filename) : null;
    }
}
