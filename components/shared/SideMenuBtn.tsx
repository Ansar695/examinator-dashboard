import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation';

interface SideMenuBtnProps {
    icon: React.ReactNode;
    title: string;
    link: string;
}

const SideMenuBtn = (props: SideMenuBtnProps) => {
    const pathname = usePathname();
    const  { icon, title, link } = props
  return (
    <Link href={link}>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-white hover:bg-[#e5e7eb] data-[state=active]:bg-[#e5e7eb] rounded-tr-none rounded-br-none rounded-tl-xl rounded-bl-xl data-[state=active]:text-blue-500"
          data-state={pathname === link ? "active" : "inactive"}
        >
          {icon}
          {title}
        </Button>
      </Link>
  )
}

export default SideMenuBtn
