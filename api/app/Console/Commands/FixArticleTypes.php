<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;

class FixArticleTypes extends Command
{
    protected $signature   = 'articles:fix-types {--dry-run : Preview changes without saving}';
    protected $description = 'Set article type to "folder" if it has children, "file" if it is a leaf node';

    public function handle()
    {
        $dryRun = $this->option('dry-run');

        $articles = Article::withCount('children')->get();

        $folders = $articles->where('children_count', '>', 0);
        $files   = $articles->where('children_count', 0);

        $this->info("Total articles : {$articles->count()}");
        $this->info("Will mark as folder : {$folders->count()}");
        $this->info("Will mark as file   : {$files->count()}");

        if ($dryRun) {
            $this->warn('Dry run — no changes saved.');

            $this->table(['ID', 'Title', 'Children', 'Current Type', 'New Type'],
                $articles->map(fn($a) => [
                    $a->id,
                    str($a->title)->limit(50),
                    $a->children_count,
                    $a->type ?? '(null)',
                    $a->children_count > 0 ? 'folder' : 'file',
                ])->toArray()
            );

            return self::SUCCESS;
        }

        if (! $this->confirm('Apply these changes?', true)) {
            $this->line('Cancelled.');
            return self::SUCCESS;
        }

        Article::whereIn('id', $folders->pluck('id'))->update(['type' => 'folder']);
        Article::whereIn('id', $files->pluck('id'))->update(['type' => 'file']);

        $this->info('Done. Types updated successfully.');

        return self::SUCCESS;
    }
}
