import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import CustomButton from "./CustomButton";
import { IMAGES } from "@/contants/images";

interface DrawerSidebarProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  showFooter?: boolean;
  className?: string;
  showCreateButton?: boolean;
  editProfile?: boolean;
  onEditProfile?: () => void;
}

export function DrawerSidebar({
  title = "Move Goal",
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
  open = false,
  setOpen,
  showFooter = true,
  className,
  showCreateButton,
  editProfile,
  onEditProfile,
}: DrawerSidebarProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent
        className={`${className} bg-black `}
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="mx-auto w-full max-w-sm scroll-hide">
          <DrawerHeader className="border-b border-gray-800">
            <DrawerTitle className="text-md font-semibold text-white flex items-center gap-2">
              <img
                src={IMAGES.arrowLeft}
                alt="arrowLeft"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setOpen?.(false);
                  onCancel();
                }}
              />
              {title}
              {showCreateButton && (
                <CustomButton
                  onClick={onSubmit}
                  text={submitText}
                  type="button"
                  className="w-auto ms-auto h-auto  text-xs px-3 py-2 bg-primary border border-primary text-black"
                />
              )}
              {editProfile && (
                <img
                  onClick={onEditProfile}
                  src={IMAGES.edit}
                  alt="close"
                  className="w-5 h-5 cursor-pointer ms-auto"
                />
              )}
            </DrawerTitle>
          </DrawerHeader>

          <div
            className={`pb-0 overflow-y-auto scrollCustom scrollCustom1 ${
              showFooter === true
                ? "h-[calc(100vh-150px)]"
                : "h-[calc(100vh-50px)]"
            }`}
          >
            <div className="pb-0">{children}</div>
          </div>

          {showFooter && (
            <DrawerFooter className="flex flex-row justify-between">
              {onCancel ? (
                <CustomButton
                  text={cancelText}
                  type="submit"
                  onClick={onCancel}
                  className="w-1/2"
                />
              ) : (
                <DrawerClose asChild>
                  <CustomButton
                    text={cancelText}
                    type="button"
                    className="w-1/2 bg-transparent border border-primary text-primary"
                  />
                </DrawerClose>
              )}

              <CustomButton
                text={submitText}
                type="submit"
                onClick={onSubmit}
                className="w-1/2"
              />
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
