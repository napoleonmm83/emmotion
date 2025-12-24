"use client";

import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  TrendingUp,
  ThumbsUp,
  ArrowUpDown,
  Filter,
  ListOrdered,
} from "lucide-react";
import type { SortOption, SortDirection } from "./tv-types";

interface TVFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  availableYears: number[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
}

export function TVFilters({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  availableYears,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
}: TVFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col gap-4"
    >
      {/* Top row: Search and Year Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Videos durchsuchen..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
        />

        {/* Year Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Jahr:</span>
          <Select
            value={selectedYear?.toString() || "all"}
            onValueChange={(value) =>
              onYearChange(value === "all" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-[120px] bg-card border-border">
              <SelectValue placeholder="Alle Jahre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Jahre</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bottom row: Sort */}
      <div className="flex items-center justify-start sm:justify-end gap-2 flex-wrap">
        <ListOrdered className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Sortieren:</span>
        <div className="flex gap-2">
          {[
            { value: "date", label: "Datum", icon: Calendar },
            { value: "views", label: "Views", icon: TrendingUp },
            { value: "likes", label: "Likes", icon: ThumbsUp },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value as SortOption)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                sortBy === option.value
                  ? "gradient-primary text-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <option.icon className="w-3 h-3" />
              {option.label}
            </button>
          ))}
        </div>
        {/* Sort Direction Toggle */}
        <button
          onClick={() => onSortDirectionChange(sortDirection === "desc" ? "asc" : "desc")}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          title={sortDirection === "desc" ? "Absteigend (höchste zuerst)" : "Aufsteigend (niedrigste zuerst)"}
        >
          <ArrowUpDown className={`w-3 h-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
          {sortDirection === "desc" ? "Absteigend" : "Aufsteigend"}
        </button>
      </div>
    </motion.div>
  );
}
