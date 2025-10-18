import React from "react";
import Image from "next/image";

const Logo = ({title}: {title: string}) => {
  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <Image
        src="/logos/punjab-board.png"
        alt="logo-image"
        width={100}
        height={100}
        className="object-contain"
      />
      <h2 className="text-xl font-bold text-white text-center">
        {title}
      </h2>
    </div>
  );
};

export default Logo;
