'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { Gear, SignOut } from '@phosphor-icons/react';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import Link from "next/link";
import {avatarNav} from "@/config/links";
import {Icons} from "@/components/icons";

function UserBadge() {
  const [position, setPosition] = React.useState('bottom');
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
        <div className='flex items-center p-2 gap-2'>
          <Skeleton className='size-9 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-2 w-[100px]' />
            <Skeleton className='h-2 w-[150px]' />
          </div>
        </div>
    );
  }

  return (
      <>
        {!session && (
            <Button onClick={() => signIn()} className='flex justify-start p-2 h-auto shadow-lg'>
              Sign In
            </Button>
        )}
        {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='flex justify-start p-2 h-auto shadow-lg'>
                  <div className='flex items-start gap-2 w-full'>
                    <div className='rounded-full size-9 overflow-hidden'>
                      {session?.user?.image && (
                          <Image src={session.user.image} alt='user' width={50} height={50} />
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-1'>
                    <span className='text-sm font-semibold whitespace-nowrap'>
                      {session?.user?.name}
                    </span>
                      </div>
                      <span className='text-xs font-light whitespace-nowrap'>
                    {session?.user?.email}
                  </span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex items-center justify-between w-full'>
                    <div className='rounded-full size-9 overflow-hidden'>
                      {session?.user?.image && (
                          <Image src={session.user.image} alt='user' width={50} height={50} />
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-1'>
                    <span className='text-sm font-semibold whitespace-nowrap'>
                      {session?.user?.name}
                    </span>
                      </div>
                      <span className='text-xs font-light whitespace-nowrap'>
                    {session?.user?.email}
                  </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                    className='flex flex-col gap-1 w-full m-0'
                >
                  <DropdownMenuItem className='flex pointer-events-none opacity-50 items-center gap-1 text-sm dark:hover:bg-muted hover:bg-muted py-1 rounded-md px-2 focus:outline-none cursor-pointer'>
                <span>
                  <Gear />
                </span>
                    <span className='flex items-center justify-between w-full'>
                  <span>Usage</span>
                  <span className='text-xs'>In progress...</span>
                </span>
                  </DropdownMenuItem>
                    {avatarNav.data.map((item, index) => {
                        const Icon = Icons[item.icon || "next"]
                        return (
                            item.href && (
                                <DropdownMenuItem key={index}
                                                  className='flex items-center gap-1 text-sm dark:hover:bg-muted py-1 rounded-md px-2 hover:bg-muted focus:outline-none cursor-pointer'
                                                  asChild>
                                    <Link href={item.href}>
                                        <div className="flex items-center">
                                            <Icon className="mr-2 h-4 w-4" />
                                            <span>{item.title}</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            )
                        )
                    })}
                  <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className='flex items-center gap-1 text-sm dark:hover:bg-muted py-1 rounded-md px-2 hover:bg-muted focus:outline-none cursor-pointer'
                  >
                <span>
                  <SignOut />
                </span>
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
        )}
      </>
  );
}

export default UserBadge;