import React from "react";
import Link from "next/link";

type IDropdownLink = {
  href: string;
  children: any;
  [rest: string]: any;
};

export default function DropdownLink({
  href,
  children,
  ...rest
}: IDropdownLink) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
}
