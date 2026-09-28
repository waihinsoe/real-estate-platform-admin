"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

type RouteType = { href: string; label: string };

type PageHeadingProps = {
  heading: string;
  routeListRight?: RouteType[];
};

const PageHeading = ({ heading, routeListRight }: PageHeadingProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem key={"home"}>
          <BreadcrumbLink render={<Link href={"/"} />}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          className="hidden md:block"
          key={"home-separator"}
        />
        {routeListRight?.map((list, idx) => (
          <Fragment key={`${idx}-${list.label}`}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                render={<Link href={list.href} className="capitalize" />}
              >
                {list.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator
              className="hidden md:block"
              key={`${idx}-${list.label}-separator`}
            />
          </Fragment>
        ))}
        <BreadcrumbItem key={"current-heading"}>
          <BreadcrumbPage className="capitalize">{heading}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageHeading;
