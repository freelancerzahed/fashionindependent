"use client"
import { useState, useCallback } from "react"
import type React from "react"

import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Bookmark, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { ShareDialog } from "./share-dialog"

interface Comment {
  id: string
  user: string
  avatar: string
  text: string
  replies?: Comment[]
}

interface Post {
  id: number | string
  user: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  image?: string
  mediaType?: "image" | "video"
  timestamp: string
  likes: number
  comments: Comment[]
  shares: number
  liked: boolean
  showComments?: boolean
}

// Recursive component to display comments and their replies
const CommentItem = ({
  comment,
  depth = 0,
  onAddReply,
}: {
  comment: Comment
  depth?: number
  onAddReply: (parentCommentId: string, text: string) => void
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onAddReply(comment.id, replyText)
      setReplyText("")
      setShowReplyInput(false)
    }
  }

  // Limit depth for visual clarity, e.g., max 3 levels of indentation
  const currentDepth = Math.min(depth, 3)
  const marginLeft = currentDepth > 0 ? 40 : 0
  const borderLeft = currentDepth > 0 ? "border-l border-gray-200 dark:border-gray-700 pl-4" : ""

  return (
    <div style={{ marginLeft: `${marginLeft}px` }} className={`mt-3 ${borderLeft}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-7 w-7 mt-0.5">
          <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
          <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-gray-100 rounded-lg p-2">
          <p className="text-sm">
            <span className="font-semibold text-gray-900">{comment.user}</span>{" "}
            <span className="text-gray-800">{comment.text}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-10 mt-1 text-xs text-gray-500">
        <Button
          variant="link"
          size="sm"
          className="h-6 px-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          Reply
        </Button>
      </div>

      {showReplyInput && (
        <div className="flex gap-2 ml-10 mt-2">
          <Input
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={handleReplySubmit} disabled={!replyText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} onAddReply={onAddReply} />
          ))}
        </div>
      )}
    </div>
  )
}

interface SocialFeedProps {
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function SocialFeed({ posts, setPosts }: SocialFeedProps) {
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({})
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedPostForShare, setSelectedPostForShare] = useState<Post | null>(null)

  const handleLike = useCallback(
    (postId: number | string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
            : post,
        ),
      )
    },
    [setPosts],
  )

  const handleCommentToggle = useCallback(
    (postId: number | string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? { ...post, showComments: !post.showComments } : post)),
      )
    },
    [setPosts],
  )

  const handleCommentChange = useCallback((postId: number | string, text: string) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }))
  }, [])

  const addComment = useCallback(
    (postId: number | string, commentText: string, parentCommentId?: string) => {
      if (commentText.trim()) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const newComment: Comment = {
                id: `${postId}-${Date.now()}`,
                user: "Current User",
                avatar: "/placeholder.svg?height=24&width=24&text=CU",
                text: commentText.trim(),
                replies: [],
              }

              if (parentCommentId) {
                const addReplyToCommentTree = (comments: Comment[], parentId: string): Comment[] => {
                  return comments.map((comment) => {
                    if (comment.id === parentId) {
                      return {
                        ...comment,
                        replies: [...(comment.replies || []), newComment],
                      }
                    } else if (comment.replies && comment.replies.length > 0) {
                      return {
                        ...comment,
                        replies: addReplyToCommentTree(comment.replies, parentId),
                      }
                    }
                    return comment
                  })
                }
                return { ...post, comments: addReplyToCommentTree(post.comments, parentCommentId) }
              } else {
                return { ...post, comments: [...post.comments, newComment] }
              }
            }
            return post
          }),
        )
        if (!parentCommentId) {
          setCommentTexts((prev) => ({ ...prev, [postId]: "" }))
        }
        toast({
          title: "Comment Added!",
          description: "Your comment has been successfully posted.",
        })
      } else {
        toast({
          title: "Error",
          description: "Comment cannot be empty.",
          variant: "destructive",
        })
      }
    },
    [setPosts],
  )

  const handleShareSuccess = useCallback(
    (postId: number | string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)),
      )
    },
    [setPosts],
  )

  const handleShareClick = useCallback(
    async (post: Post) => {
      // Check if Web Share API is available and if we're in a secure context
      const canUseWebShare =
        (typeof navigator !== "undefined" && "share" in navigator && window.location.protocol === "https:") ||
        window.location.hostname === "localhost"

      if (canUseWebShare) {
        const shareText = `Check out this post by ${post.user.name}: "${post.content.substring(0, 100)}${post.content.length > 100 ? "..." : ""}"`
        const shareUrl = `${window.location.origin}/dashboard?postId=${post.id}`

        try {
          await navigator.share({
            title: "Social Feed Post",
            text: shareText,
            url: shareUrl,
          })
          toast({
            title: "Post Shared!",
            description: "The post has been successfully shared.",
          })
          handleShareSuccess(post.id)
          return
        } catch (error) {
          // Only log the error, don't show it to user since we have a fallback
          console.log("Web Share API failed, using fallback:", error)
        }
      }

      // Fallback: Always open custom share dialog
      setSelectedPostForShare(post)
      setIsShareDialogOpen(true)
    },
    [handleShareSuccess],
  )

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-white shadow-sm rounded-lg">
          <CardHeader className="flex flex-row items-center gap-3 p-4 pb-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                {post.user.verified && <Flag className="h-4 w-4 text-blue-500" />}
              </div>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Hide Post</DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-800 mb-4">{post.content}</p>
            {post.image && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                {post.mediaType === "image" ? (
                  <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-full object-cover" />
                ) : (
                  <video src={post.image} controls className="w-full h-full object-cover">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 px-2"
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                  <span>{post.likes} Likes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCommentToggle(post.id)}
                  className="flex items-center gap-1 px-2"
                >
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                  <span>{post.comments.length} Comments</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShareClick(post)}
                className="flex items-center gap-1 px-2"
              >
                <Share2 className="h-4 w-4 text-gray-500" />
                <span>{post.shares} Shares</span>
              </Button>
            </div>

            {post.showComments && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                {post.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onAddReply={(parentId, text) => addComment(post.id, text, parentId)}
                  />
                ))}
                <div className="flex items-center gap-2 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=CU" alt="Current User" />
                    <AvatarFallback>CU</AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentTexts[post.id] || ""}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    className="flex-1 resize-none min-h-[40px] max-h-[100px] pr-10"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    className="shrink-0"
                    onClick={() => addComment(post.id, commentTexts[post.id] || "")}
                    disabled={!commentTexts[post.id]?.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send comment</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        post={selectedPostForShare}
        onShareSuccess={handleShareSuccess}
      />
    </div>
  )
}
