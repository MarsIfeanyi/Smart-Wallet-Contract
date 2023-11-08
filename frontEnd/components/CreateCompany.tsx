import { Container } from "./Container";
import factory_abi from "../utils/factory_abi.json";
import factory_address from "../utils/factory_address";

import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

export function CreateCompany() {
  const [companyName, setCompanyName] = useState("");
  const [companySymbol, setCompanySymbol] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [duration, setDuration] = useState(0);
  const [singleAccount, setSingleAccount] = useState<any>("");
  const [addr, setAddr] = useState("");
  const [done, setdone] = useState<Boolean>(false);
  const [connectedAddr, setConnectedAddr] = useState<any>("");

  const { address } = useAccount();

  // const CreateCompany = () => {
  //   console.log("creating company");
  //   createCompanyWrite?();
  // };

  const { config: CreateCompanyConfig } = usePrepareContractWrite({
    address: factory_address,
    abi: factory_abi,
    functionName: "createOrganization",
    args: [companyName, companySymbol, duration, tokenAddress],
  });

  const {
    data: createCompanyData,
    isLoading: createCompanyIsLoading,
    isError: createCompanyIsError,
    write: createCompanyWrite,
  } = useContractWrite(CreateCompanyConfig);

  const {
    data: CompanyAddr,
    isLoading: yourCompanyIsLoading,
    isError: yourCompanyIsError,
  } = useContractRead({
    address: factory_address,
    abi: factory_abi,
    functionName: "getOrganization",
    args: [connectedAddr ?? "0x00"],
  });

  useEffect(() => {
    setConnectedAddr(address);
    console.log(`final child addr:`, CompanyAddr);
    setSingleAccount(CompanyAddr);
  }, [address, CompanyAddr, connectedAddr]);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      console.log("creating company.....");
      createCompanyWrite?.();
    } catch (error:any) {
      //@ts-ignore
      console.error(
        "Error calling createCompanyWrite:",
        // @ts-ignore
        error.message as string
      );
    }
  };

  return (
    <Container className={clsx("pt-20 pb-16 lg:pt-32")}>
      <form
        className={clsx(
          "flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl"
        )}
        onSubmit={handleCreate}
      >
        <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
          Create Your Company
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="Company_name">Name</label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              placeholder="Company Name"
              onChange={(e) => {
                setCompanyName(e.target.value);
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="Company_symbol">Symbol</label>
            <input
              type="text"
              name="company_symbol"
              id="company_symbol"
              placeholder="Company Symbol"
              onChange={(e) => {
                setCompanySymbol(e.target.value);
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 "
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="token_address">Address</label>
            <input
              type="text"
              name="token_address"
              id="token_address"
              placeholder="Token Address"
              onChange={(e) => {
                setTokenAddress(e.target.value);
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 "
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="duration">Supply</label>
            <input
              type="number"
              name="token_supply"
              id="token_supply"
              placeholder="Token Initial Supply"
              onChange={(e) => {
                setDuration(Number(e.target.value));
              }}
              className="w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 "
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#7F56D9] text-white px-4 py-2 rounded-lg"
        >
          Create Company
        </button>
      </form>
    </Container>
  );
}
