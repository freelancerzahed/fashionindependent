"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Facebook, Twitter, Linkedin, MessageCircle, Mail } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useCallback } from "react"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: { id: number | string; content: string } | null
  onShareSuccess: (postId: number | string) => void
}

export function ShareDialog({ open, onOpenChange, post, onShareSuccess }: ShareDialogProps) {
  const shareUrl = post ? `${window.location.origin}/dashboard?postId=${post.id}` : ""
  const shareText = post
    ? `Check out this post: "${post.content.substring(0, 100)}${post.content.length > 100 ? "..." : ""}"`
    : ""

  const handleCopyLink = useCallback(async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link Copied!",
          description: "The post link has been copied to your clipboard.",
        })
        if (post) onShareSuccess(post.id)
        onOpenChange(false)
      } catch (err) {
        console.error("Failed to copy: ", err)
        toast({
          title: "Copy Failed",
          description: "Could not copy the link to clipboard.",
          variant: "destructive",
        })
      }
    }
  }, [shareUrl, post, onOpenChange, onShareSuccess])

  const handleShareToPlatform = useCallback(
    (platform: string) => {
      let url = ""
      switch (platform) {
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
          break
        case "twitter":
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
          break
        case "linkedin":
          url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent("Social Feed Post")}&summary=${encodeURIComponent(shareText)}`
          break
        case "whatsapp":
          url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
          break
        case "mail":
          url = `mailto:?subject=${encodeURIComponent("Check out this post!")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
          break
        default:
          return
      }
      window.open(url, "_blank", "noopener,noreferrer")
      toast({
        title: "Shared!",
        description: `Opening ${platform} for sharing.`,
      })
      if (post) onShareSuccess(post.id)
      onOpenChange(false)
    },
    [shareUrl, shareText, post, onOpenChange, onShareSuccess],
  )

  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>Share this post with your friends and followers on social media.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Input id="share-link" defaultValue={shareUrl} readOnly className="flex-1" />
            <Button type="button" size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" /> Copy Link
            </Button>
          </div>
          <div className="flex justify-around mt-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full text-blue-600 hover:bg-blue-50"
              onClick={() => handleShareToPlatform("facebook")}
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full text-blue-400 hover:bg-blue-50"
              onClick={() => handleShareToPlatform("twitter")}
            >
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full text-blue-700 hover:bg-blue-50"
              onClick={() => handleShareToPlatform("linkedin")}
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full text-green-500 hover:bg-green-50"
              onClick={() => handleShareToPlatform("whatsapp")}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">WhatsApp</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full text-gray-600 hover:bg-gray-50"
              onClick={() => handleShareToPlatform("mail")}
            >
              <Mail className="h-6 w-6" />
              <span className="sr-only">Email</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
