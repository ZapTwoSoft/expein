import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
        <DialogContent className={className}>
          <DialogHeader className="pb-4">
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
        <DrawerHeader className="pb-4">
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
    <div className={`flex-1 overflow-auto modal-scrollbar ${isDesktop ? 'p-2' : 'p-2'} ${className || ''}`}>
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
      <div className={`flex gap-3 sm:flex-row justify-end pt-4 mt-auto ${className || ''}`}>
        {children}
      </div>
    )
  }

  return (
    <DrawerFooter>
      <div className={`flex gap-3 sm:flex-row justify-end ${className || ''}`}>
        {children}
      </div>
    </DrawerFooter>
  )
} 