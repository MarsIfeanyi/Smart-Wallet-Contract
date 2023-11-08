import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

type Props = {};

export function Header() {
  return (
    <div className="flex justify-between mt-10 mx-10 ">
      <h1 className="font-bold text-2xl text-black ">Smart Account</h1>

      <ConnectButton showBalance={true} />
    </div>
  );
}
