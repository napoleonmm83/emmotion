"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "./tv-helpers";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 text-center">
        <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
        <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
          {typeof value === "number" ? (
            <AnimatedCounter value={value} duration={2 + delay} />
          ) : (
            value
          )}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </Card>
    </motion.div>
  );
}
