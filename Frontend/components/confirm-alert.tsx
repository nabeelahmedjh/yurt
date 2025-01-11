import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ControlledProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  children?: never;
};

type UncontrolledProps = {
  children: React.ReactNode;
  open?: never;
  onOpenChange?: never;
};

type ConfirmAlertProps = (ControlledProps | UncontrolledProps) & {
  title: string;
  descripton: string;
  action: () => void;
  actionLabel: string;
  actionClassName?: string;
  /** make a Ref and pass it in to spawn it in that container. useful for showing dialog properly in dropdown menu */
  containerRef?: React.RefObject<HTMLDivElement>;
};

export default function ConfirmAlert({
  children,
  title,
  descripton,
  action,
  actionLabel,
  actionClassName,
  open,
  onOpenChange,
  containerRef,
}: ConfirmAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        containerRef={containerRef}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{descripton}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={actionClassName} onClick={action}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
