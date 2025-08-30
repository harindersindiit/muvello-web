import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,

} from "@/components/ui/drawer";
import CustomButton from "./CustomButton";

interface DrawerSidebarProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  showFooter?: boolean;
  className?: string;
  showCreateButton?: boolean;
}

export function DrawerSidebarWorkoutDetails({

  children,
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  open = false,
  setOpen,
  showFooter = true,
  className,

}: DrawerSidebarProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className={`${className} bg-black`}>
        <div className="mx-auto w-full max-w-sm">

          <div className="pb-0 max-h-[calc(100vh-10px)] overflow-y-auto scrollCustom scrollCustom1">
            <div className="pb-0">{children}</div>
            {showFooter && (
              <DrawerFooter className="flex flex-row justify-between">
                <DrawerClose asChild>
                  <CustomButton
                    text={cancelText}
                    type="button"
                    className="w-1/2 bg-transparent border border-primary text-primary"
                  />
                </DrawerClose>
                <CustomButton
                  text={submitText}
                  type="submit"
                  onClick={onSubmit}
                  className="w-1/2"
                />
              </DrawerFooter>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
