import Image from "next/image";

export const TemplateLogo = ({ logoImg }: { logoImg: string }) => (
  <div className="">
    <Image
      src={logoImg}
      alt="Institution Logo"
      width={100}
      height={100}
      className="w-[100px] h-[100px] max-w-[150px] max-h-[150px]"
    />
  </div>
);
