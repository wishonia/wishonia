"use client";

import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription, CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {NavItem} from "@/types";
import {Inset} from "@radix-ui/themes";

interface ToolCardProps {
  navItem: NavItem;
}

export const LinkCard = ({
  navItem
}: ToolCardProps) => {
  const router = useRouter();
  
  const onClick = () => {
    router.push(navItem.href);
  }

  return (
    <Card onClick={onClick} className="group cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center">
{/*        {navItem.img && (
          <div className="relative h-8 w-8 mr-2 group-hover:scale-125 transition duration-150">
            <Image alt="Icon" src={navItem.img} fill />
          </div>
        )}*/}
          {navItem.title}
        </CardTitle>
        <CardDescription>{navItem.tooltip}</CardDescription>
      </CardHeader>
      <Inset clip="padding-box" side="top" pb="current">
        <img
            src={navItem.img}
            alt="Bold typography"
            style={{
              display: 'block',
              objectFit: 'cover',
              width: '100%',
              height: 140,
              backgroundColor: 'var(--gray-5)',
            }}
        />
      </Inset>
    </Card>
  );
};
