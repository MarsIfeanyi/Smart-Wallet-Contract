import { Container } from "./Container";
import child_abi from "../utils/child_abi.json";
import factory_abi from "../utils/factory_abi.json";
import factory_address from "../utils/factory_address";

import React, { useEffect, useState } from "react";

import { clsx } from "clsx";
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

export function Vesting() {
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [duration, setDuration] = useState(0);

  const [singleAccount, setSingleAccount] = useState<Address>();
  const [connectedAddr, setConnectedAddr] = useState("");

  const { address } = useAccount();

  const { config: vestTokenConfig } = usePrepareContractWrite({
    address: singleAccount,
    abi: child_abi,
    functionName: "addMember",
    args: [userName, userAddress as Address, tokenAmount, duration],
  });

  const {
    data: vestTokenData,
    isLoading: vestTokenIsLoading,
    isError: vestTokenIsError,
    write: vestTokenWrite,
    isSuccess: Successfully,
  } = useContractWrite(vestTokenConfig);

  const {
    data: certAddr,
    isLoading: yourCertIsLoading,
    isError: yourCertIsError,
  } = useContractRead({
    address: factory_address,
    abi: factory_abi,
    functionName: "getOrganization",
    args: [connectedAddr ?? "0x00"],
  });

  useEffect(() => {
    setConnectedAddr(address as Address);
    console.log(`final child addr:`, certAddr);
    setSingleAccount(certAddr as Address);
  }, [address, certAddr, connectedAddr]);

  const handleVestToken = async (e: any) => {
    e.preventDefault();
    try {
      console.log("creating vesting.....");
      vestTokenWrite?.();
    } catch (error: any) {
      //@ts-ignore
      console.error("Error calling vestTokenWrite:", error.message as string);
    }
  };

  return (
    <Container className="pt-20 pb-16 lg:pt-32">
      <form
        className={clsx(
          "flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl"
        )}
        onSubmit={handleVestToken}
      >
        <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
          Add User
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="cert_name">Role</label>
            <input
              type="text"
              name="username"
              id=""
              placeholder="User Role"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="cert_name"> Address</label>
            <input
              type="text"
              name="userAddress"
              id=""
              placeholder="User Address"
              onChange={(e) => {
                setUserAddress(e.target.value);
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="token_amount"> Amount</label>
            <input
              type="number"
              name="token_amount"
              id=""
              placeholder="Token Amount"
              onChange={(e) => {
                setTokenAmount(Number(e.target.value));
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 "
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="duration">Duration</label>
            <input
              type="number"
              name="duration"
              id=""
              placeholder="Vest Duration"
              onChange={(e) => {
                setDuration(Number(e.target.value));
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 "
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="bg-[#7F56D9] text-white px-4 py-2 rounded-lg"
          >
            Add User
          </button>
        </div>
        <p className="green">{Successfully ? `VESTING SUCCESFUL` : ""}</p>
      </form>
    </Container>
  );
}
