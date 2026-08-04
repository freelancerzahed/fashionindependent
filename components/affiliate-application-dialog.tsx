"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AffiliateApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AffiliateApplyDialog({ open, onOpenChange }: AffiliateApplicationDialogProps) {
  const [formValues, setFormValues] = React.useState({
    fullName: "",
    email: "",
    website: "",
    audience: "",
    message: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Affiliate application submitted", formValues);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Affiliate Application</DialogTitle>
          <DialogDescription>
            Tell us a little about your platform so we can get you approved quickly.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Full name
              <Input
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              Email address
              <Input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            Website or platform
            <Input
              name="website"
              value={formValues.website}
              onChange={handleChange}
              placeholder="https://yourblog.com"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            Audience / promo channels
            <Input
              name="audience"
              value={formValues.audience}
              onChange={handleChange}
              placeholder="Instagram, blog, newsletter..."
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            Why do you want to join?
            <textarea
              name="message"
              value={formValues.message}
              onChange={handleChange}
              className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition focus-visible:border-ring focus-visible:ring-ring/50 outline-none"
              placeholder="Tell us about your audience and affiliate goals."
              required
            />
          </label>

          <DialogFooter className="gap-3 pt-2">
            <Button type="submit" className="w-full sm:w-auto">
              Submit application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
