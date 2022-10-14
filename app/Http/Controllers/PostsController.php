<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\User;
use Error;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostsController extends Controller {
    public function getCategories() {
        $categories = Category::all();

        return response()->json(['categories' => $categories]);
    }

    public function getMoreDashboardPosts(Request $request): JsonResponse {
        $offset = $request->offset;

        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->offset($offset)
            ->limit(20)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });

        return response()->json([
            'status' => 'Success',
            'code'   => 200,
            'posts'  => $posts,
        ]);
    }

    public function createPost(Request $request) {
        $request->validate([
            'post_body' => 'required',
            'category_id' => 'required'
        ],
        [
            'post_body.required' => 'You have to write something first...',
            'category_id.required' => 'You have to select a category!'
        ]);

        $post             = new Post();
        $post->post       = $request->post_body;
        $post->category_id = $request->category_id;
        $post->user_id    = Auth::user()->id;

        if (!$post->save()) {
            return back()->withErrors(['message' => 'Something went wrong, please try again.']);
        }

        return Redirect::route('my-posts');
    }

    public function deletePost($id) {
        $post_id = $id;
        $post = Post::find($post_id);

        if (!$post) {
            return response()->json([
                'message' => 'Hmmm we\'re having trouble deleting that post...try again?',
            ], 404);
        }

        $post->comments()->delete();

        $post->delete();

        return response()->json([
            'post_id' => $post_id,
            'message' => 'Post deleted',
        ]);
    }

    public function updatePost(Request $request) {
        $request->validate([
            'post_body' => 'required',
            'category_id' => 'required'
        ],
        [
            'post_body.required' => 'You have to write something first...',
            'category_id.required' => 'You have to select a category!'
        ]);

        try {
            $post = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
                ->find($request->post_id);

            if ($post->user->profile_picture_url) {
                $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
            }

            $post->comments->each(function ($comment) {
                if ($comment->user->profile_picture_url) {
                    $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                }

                $comment->sub_comments->each(function ($sub_comment) {
                    if ($sub_comment->user->profile_picture_url) {
                        $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                    }
                });
            });
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Sorry, something went wrong, try again'], 500);
        }

        if (!$post) {
            return response()->json(['message' => 'Sorry, something went wrong, please try again.'], 404);
        }

        $post->post = $request->post_body;
        $post->category_id = $request->category_id;

        if (!$post->save()) {
            return response()->json(['message' => 'Something went wrong, please try again.'], 500);
        }

        return response()->json([
            'post' => $post
        ]);
    }

    public function retrieveMorePosts(Request $request) {
        $limit = $request->limit;
        $current_posts_length = $request->current_posts_length;
        $skip = $current_posts_length > 0 ? $current_posts_length : 0;

        $posts = Post::where('user_id', Auth::user()->id)
            ->with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->skip($skip)
            ->limit($limit)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });

        return response()->json([
            'posts'  => $posts,
        ]);
    }

    public function getMyPostsPage(Request $request) {
        $categories = Category::all();
        $my_comment_count = Comment::where('user_id', Auth::user()->id)->count();
        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->where('user_id', Auth::user()->id)
            ->limit(20)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });

        return Inertia::render('MyPosts', [
            'posts' => $posts,
            'categories' => $categories,
            'comment_count' => $my_comment_count,
        ]);
    }

    public function getMyLikesPage(Request $request) {
        $categories = Category::all();
        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->whereRelation('post_likes', 'user_id', Auth::user()->id)
            ->offset($request->offset ? $request->offset : 0)
            ->limit(20)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });

        return Inertia::render('MyLikes', [
            'posts' => $posts,
            'categories' => $categories
        ]);
    }

    public function getMoreLikedPosts(Request $request) {
        $limit = $request->limit;
        $current_posts_length = $request->current_posts_length;
        $skip = $current_posts_length > 0 ? $current_posts_length : 0;

        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->whereRelation('post_likes', 'user_id', Auth::user()->id)
            ->skip($skip)
            ->limit($limit)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });

        return response()->json([
            'posts'  => $posts,
        ]);
    }

    public function toggleLike(Request $request) {
        $user_id = Auth::user()->id;
        $post_id = $request->post_id;
        $is_post_liked_by_user = $request->is_post_liked_by_user;

        $post_like = PostLike::where([
            ['user_id', $user_id],
            ['post_id', $post_id]
        ])
        ->first();

        if ($post_like) {
            $post_like->update([
                'active' => $is_post_liked_by_user ? false : true
            ]);
        } elseif (!$post_like) {
            $post_like = new PostLike();

            $post_like->user_id = $user_id;
            $post_like->post_id = $post_id;
            $post_like->active  = true;

            $post_like->save();
        }

        return response()->json();
    }

    public function getUserProfilePosts(Request $request) {
        $limit = $request->limit;
        $user_id = $request->user_id;
        $user_post_count = count(User::find($user_id)->posts);

        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->where('user_id', $user_id)
            ->limit($limit)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });


        return response()->json([
            'posts' => $posts,
        ]);
    }

    public function getMoreUserProfilePosts(Request $request) {
        $user_id = $request->user_id;
        $limit = $request->limit;
        $current_posts_length = $request->current_posts_length;
        $skip = $current_posts_length > 0 ? $current_posts_length : 0;

        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->where('user_id', $user_id)
            ->skip($skip)
            ->limit($limit)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });


        return response()->json([
            'posts' => $posts,
        ]);
    }

    public function getMyFollowPostsPage() {
        $following_user_ids = User::find(Auth::user()->id)->follows ?? [];
        $categories = Category::all();

        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->whereIn('user_id', $following_user_ids)
            ->limit(20)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });

        return Inertia::render('MyFollows', [
            'posts' => $posts,
            'categories' => $categories
        ]);
    }

    public function fetchMoreFollowPosts(Request $request) {
        $limit = $request->limit;
        $current_posts_length = $request->current_posts_length;
        $skip = $current_posts_length > 0 ? $current_posts_length : 0;
        $following_user_ids = User::find(Auth::user()->id)->follows;

        $posts = Post::with(['user', 'category', 'comments', 'comments.user', 'comments.sub_comments.user', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->whereIn('user_id', $following_user_ids)
            ->skip($skip)
            ->limit($limit)
            ->orderBy('id', 'desc')
            ->get()
            ->each(function ($post) {
                if ($post->user->profile_picture_url) {
                    $post->user->temp_profile_picture_url = Storage::temporaryUrl($post->user->profile_picture_url, now()->addHours(24));
                }

                $post->comments->each(function ($comment) {
                    if ($comment->user->profile_picture_url) {
                        $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
                    }

                    $comment->sub_comments->each(function ($sub_comment) {
                        if ($sub_comment->user->profile_picture_url) {
                            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
                        }
                    });
                });
            });


        return response()->json([
            'posts' => $posts,
        ]);
    }
}
