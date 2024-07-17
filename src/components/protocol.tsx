import { useState, type ReactNode } from 'react';

export function Title({ title, logo }: { title: string; logo: string }) {
  return (
    <div className="flex items-center justify-start mt-24">
      <div className="flex items-center justify-center gap-4">
        <img src={logo} className="w-12 h-12" />
        <div className="text-5xl font-medium">{title}</div>
      </div>
    </div>
  );
}

export function Description({ children }: { children: ReactNode }) {
  return <p className="text-white opacity-70 text-xl mt-8">{children}</p>;
}

export function Sidebar({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 w-full max-w-[30%]">{children}</div>;
}

export function SidebarItem({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative bg-[#0F0F0F] hover:bg-[#191919] rounded px-4 py-2 border border-white border-opacity-10 hover:border-opacity-25 duration-200 font-medium cursor-pointer"
    >
      {children}
      <div
        className="absolute top-[50%] right-12  translate-y-[-50%] duration-300"
        style={{
          right: hover ? '16px' : '32px',
          opacity: hover ? '100%' : '0%'
        }}
      >
        <ArrowRight />
      </div>
    </div>
  );
}

export function Main({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-8 w-full">{children}</div>;
}

export function Container({ children }: { children: ReactNode }) {
  return <div className="flex justify-center gap-8 mt-8 mb-16">{children}</div>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="bg-[#0F0F0F] border border-white border-opacity-20 rounded px-8 py-2 w-full font-medium">
        {title}
      </div>
      <div className="bg-[#0F0F0F] border border-white border-opacity-10 rounded p-8 w-full">
        <div>{children}</div>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#FFFFFF"
      height="24px"
      width="24px"
      viewBox="0 0 330 330"
    >
      <path d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255  s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0  c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z" />
    </svg>
  );
}
