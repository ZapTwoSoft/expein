import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ResponsiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title: string
  className?: string
}

export function ResponsiveModal({
  open,
  onOpenChange,
  children,
  title,
  className,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("gap-0", className)}>
          <DialogHeader className="pb-4 flex-shrink-0">
            <DialogTitle className="text-xl font-semibold">
              {title}
            </DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={className}>
        <DrawerHeader className="pb-4 flex-shrink-0">
          <DrawerTitle className="text-xl font-semibold">
            {title}
          </DrawerTitle>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}

export function ResponsiveModalContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  
  return (
    <div className={cn(
      "flex-1 overflow-y-auto overflow-x-hidden min-h-0 modal-scrollbar",
      isDesktop ? "px-2 pb-2" : "px-4 pb-2",
      className
    )}>
      {children}
    </div>
  )
}

export function ResponsiveModalFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  if (isDesktop) {
    return (
      <div className={cn("flex gap-3 flex-row justify-end pt-4 flex-shrink-0", className)}>
        {children}
      </div>
    )
  }

  return (
    <DrawerFooter className="flex-shrink-0">
      <div className={cn("flex gap-3 flex-row justify-end", className)}>
        {children}
      </div>
    </DrawerFooter>
  )
} 