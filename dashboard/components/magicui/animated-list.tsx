"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
}

interface AnimatedListItemProps {
  className?: string;
  children: React.ReactNode;
  index: number;
}

export function AnimatedList({ className, children }: AnimatedListProps) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function AnimatedListItem({
  className,
  children,
  index,
}: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.045 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

