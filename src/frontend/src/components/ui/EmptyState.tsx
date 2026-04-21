import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  "data-ocid"?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  "data-ocid": ocid,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      data-ocid={ocid}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="font-display font-semibold text-base text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm mb-4 max-w-xs">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
