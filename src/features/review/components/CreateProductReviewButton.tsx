"use client";
import { Button } from "@/components/ui/button";
import { members } from "@wix/members";
import { products } from "@wix/stores";
import { useState } from "react";
import { CreateProductReviewDialog } from "./CreateProductReviewDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";

interface CreateProductReviewButtonProps {
  product: products.Product;
  loggedInMember: members.Member | null;
  hasExistingReview: boolean;
}
export const CreateProductReviewButton = ({
  loggedInMember,
  product,
  hasExistingReview,
}: CreateProductReviewButtonProps) => {
  const searchParams = useSearchParams();
  const [showReviewDialog, setShowReviewDialog] = useState(
    searchParams.has("createReview"),
  );
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  return (
    <>
      <Button
        disabled={!loggedInMember}
        onClick={() => setShowReviewDialog(true)}
      >
        {loggedInMember ? "Write a review" : "Login to write a review"}
      </Button>
      <CreateProductReviewDialog
        onOpenChange={setShowReviewDialog}
        open={showReviewDialog && !hasExistingReview && !!loggedInMember}
        onSubmitted={() => {
          setShowReviewDialog(false);
          setShowConfirmationDialog(true);
        }}
        product={product}
      />
      <ReviewSubmittedDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      />
      <ReviewAlreadyExistsDialog
        open={showReviewDialog && hasExistingReview}
        onOpenChange={setShowReviewDialog}
      />
    </>
  );
};

interface ReviewSubmittedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ReviewSubmittedDialog({
  onOpenChange,
  open,
}: ReviewSubmittedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thank you for your review</DialogTitle>
          <DialogDescription>
            Your review has been submitted successfully
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
interface ReviewAlreadyExistsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function ReviewAlreadyExistsDialog({
  onOpenChange,
  open,
}: ReviewAlreadyExistsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review already exists</DialogTitle>
          <DialogDescription>
            You have already written a review for this product
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
