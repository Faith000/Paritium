"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsEventParameters
} from "@/lib/analytics";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: AnalyticsEventName;
  eventParameters?: AnalyticsEventParameters;
};

export default function TrackedLink({
  children,
  eventName,
  eventParameters,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackAnalyticsEvent(eventName, eventParameters);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
