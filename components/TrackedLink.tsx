"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from "@/lib/analytics";

type TrackedLinkProps<EventName extends AnalyticsEventName> =
  AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: EventName;
  eventParameters: AnalyticsEventMap[EventName];
};

export default function TrackedLink<EventName extends AnalyticsEventName>({
  children,
  eventName,
  eventParameters,
  onClick,
  ...props
}: TrackedLinkProps<EventName>) {
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
