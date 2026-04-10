"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ImageIcon,
  Video,
  Smile,
  MapPin,
  X,
  ChevronDown,
  Globe,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreatePostProps {
  onCreatePost: (post: any) => void;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const [postContent, setPostContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [postVisibility, setPostVisibility] = useState<"public" | "private">(
    "public"
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // cleanup object URLs
  useEffect(() => {
    return () => {
      if (selectedMedia) {
        URL.revokeObjectURL(selectedMedia);
      }
    };
  }, [selectedMedia]);

  const handleSubmit = async () => {
    if (!postContent.trim() && !selectedMedia) return;

    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("visibility", postVisibility);

    if (imageInputRef.current?.files?.[0]) {
      formData.append("media", imageInputRef.current.files[0]);
    }
    if (videoInputRef.current?.files?.[0]) {
      formData.append("media", videoInputRef.current.files[0]);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sanctum / JWT token
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onCreatePost(data.post);
        setPostContent("");
        if (selectedMedia) URL.revokeObjectURL(selectedMedia);
        setSelectedMedia(null);
        setMediaType(null);
        setIsExpanded(false);
        setPostVisibility("public");
      } else {
        console.error("Post failed:", data);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (selectedMedia) {
        URL.revokeObjectURL(selectedMedia);
      }
      const objectURL = URL.createObjectURL(file);
      setSelectedMedia(objectURL);
      setMediaType(type);
    }
  };

  const removeMedia = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia);
    }
    setSelectedMedia(null);
    setMediaType(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-3 md:gap-4">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
            <AvatarImage src="/placeholder.svg?height=40&width=40&text=You" />
            <AvatarFallback className="bg-red-100 text-red-600 font-semibold">
              You
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 md:space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="min-h-[60px] md:min-h-[80px] resize-none border-none shadow-none text-base md:text-lg placeholder:text-gray-400 focus-visible:ring-0 p-0"
            />

            {selectedMedia && (
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  {mediaType === "image" ? (
                    <img
                      src={selectedMedia || "/placeholder.svg"}
                      alt="Selected media"
                      className="w-full h-48 md:h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={selectedMedia}
                      controls
                      className="w-full h-48 md:h-64 object-cover bg-black"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    onClick={removeMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {(isExpanded || postContent || selectedMedia) && (
              <div className="space-y-3 md:space-y-4">
                {/* Media Options */}
                <div className="flex flex-wrap gap-2">
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "image")}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full px-3 py-2 active:scale-95 transition-all"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Photo</span>
                  </Button>

                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, "video")}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-3 py-2 active:scale-95 transition-all"
                  >
                    <Video className="h-4 w-4" />
                    <span className="hidden sm:inline">Video</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-full px-3 py-2 active:scale-95 transition-all"
                  >
                    <Smile className="h-4 w-4" />
                    <span className="hidden sm:inline">Feeling</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full px-3 py-2 active:scale-95 transition-all"
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Location</span>
                  </Button>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1 bg-green-100 text-green-700 text-xs hover:bg-green-200"
                      >
                        {postVisibility === "public" ? (
                          <>
                            <Globe className="h-3 w-3" /> Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3" /> Private
                          </>
                        )}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => setPostVisibility("public")}
                      >
                        <Globe className="h-4 w-4 mr-2" /> Public
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPostVisibility("private")}
                      >
                        <Lock className="h-4 w-4 mr-2" /> Private
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setPostContent("");
                        if (selectedMedia) {
                          URL.revokeObjectURL(selectedMedia);
                        }
                        setSelectedMedia(null);
                        setMediaType(null);
                        setPostVisibility("public");
                      }}
                      className="text-gray-500 hover:text-gray-700 active:scale-95 transition-all"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!postContent.trim() && !selectedMedia}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 rounded-full active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
