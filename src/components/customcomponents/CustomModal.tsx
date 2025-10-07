import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import CustomButton from "./CustomButton";

interface CustomModalProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  dialogHeader?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  customButtonClass?: string;
  disabled?: boolean;
  showCancelButton?: boolean;
}

export function CustomModal({
  trigger,
  title,
  description,
  children,
  onSubmit,
  submitText = "Save changes",
  open,
  setOpen,
  dialogHeader,
  cancelText = "Cancel",
  onCancel,
  customButtonClass,
  disabled,
  showCancelButton = true,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/60 fixed inset-0 z-50" />
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="sm:max-w-[440px]  bg-lightdark rounded-lg p-5 text-white border-none [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {dialogHeader && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="relative">{children}</div>
        <DialogFooter>
          {!disabled && showCancelButton && (
            <CustomButton
              type="submit"
              className={`w-auto py-4  flex-1 border-1 border-grey bg-transparent text-grey ${customButtonClass}`}
              onClick={onCancel}
              text={cancelText}
            />
          )}
          <CustomButton
            disabled={disabled}
            type="submit"
            className={`w-auto py-4 flex-1 ${customButtonClass}`}
            onClick={onSubmit}
            text={submitText}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
