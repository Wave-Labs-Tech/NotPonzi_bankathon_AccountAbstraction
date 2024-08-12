import { USDTABI } from "./assets/abis/UsdtABI";
import { CONTRACT_ADDRESS } from "./assets/constants";
import { USDTAddress } from "./assets/constants";
import { TowerbankABI } from "./assets/abis/TowerbankABI";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState, useCallback } from "react";
// import { formatEther, parseUnits } from "viem/utils";
// import {useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract, useReadContract } from "wagmi";

// import { readContract, writeContract, waitForTransactionReceipt, waitForTransaction} from "wagmi/actions";
// import styles from "../styles/Home.module.css";
import ModalResumen from './components/ModalResumen'; 
import FormularioOferta from './components/FormularioOferta'
import OfferCard from "./components/OfferCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uiConsole, convertToBigNumber, convertFromBigNumber } from './utils/Utils';
import truncateEthAddress from 'truncate-eth-address';




import Web3 from "web3";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, UserInfo, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Contract, ethers, formatEther, hashMessage, JsonRpcProvider, Wallet } from 'ethers';

import { addItemToLocalStorage, initializeExistingPrefixes, findItemsByInitialNumbers }from './utils/StorageFuntions';
// import truncateEthAddress from 'truncate-eth-address';
import "./App.css";
import styles from './App.module.css';

// import { waitForTransactionReceipt } from 'wagmi/actions';
// import { config } from './main';
// import { Client, createClient, Transport } from 'viem';

import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import 'react-toastify/dist/ReactToastify.css';
import { Toast } from "react-toastify/dist/components";


// console.log("ABI CONTRACT", TowerbankABI);
console.log("ADDRESS CONTRACT", CONTRACT_ADDRESS);
// console.log("ABI TokenClass", USDTABI);
console.log("ADDRESS Token", USDTAddress);
//BORRAR AL RESCUPERAR WEB3AUTH
//BORRAR AL RESCUPERAR WEB3AUTH
//BORRAR AL RESCUPERAR WEB3AUTH
declare global {
  interface Window {
    ethereum?: any;
  }
}
//BORRAR AL RESCUPERAR WEB3AUTH
//BORRAR AL RESCUPERAR WEB3AUTH
//BORRAR AL RESCUPERAR WEB3AUTH

const clientId = process.env.REACT_APP_CLIENT_ID; // get from https://dashboard.web3auth.io

// const verifier = "w3a-firebase-demo";
// IMP END - Dashboard Registration
// const chainConfig = {
  //   chainId: "0x66eee", // Please use 0x1 for Mainnet
//   rpcTarget: process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL || "",
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   displayName: "Arbitrum Sepolia",
//   blockExplorerUrl: "https://arbiscan.io/",
//   ticker: "AETH",
//   tickerName: "AETH",
//   logo: "https://images.toruswallet.io/eth.svg",
// };
const chainConfig = {
  chainId: "0xaa36a7", // Chain ID para Sepolia (0xaa36a7 en hexadecimal)
  rpcTarget: process.env.REACT_APP_SEPOLIA_RPC_URL || "", // Asegúrate de tener el RPC correcto para Sepolia
  chainNamespace: CHAIN_NAMESPACES.EIP155, // Mantén el mismo valor, ya que es Ethereum
  displayName: "Ethereum Sepolia", // Nombre que se mostrará para la red
  blockExplorerUrl: "https://sepolia.etherscan.io/", // Explorador de bloques para Sepolia
  ticker: "ETH", // Ticker de la moneda (ETH para Ethereum)
  tickerName: "Ethereum", // Nombre completo de la moneda
  logo: "https://images.toruswallet.io/eth.svg", // Mantén el logo de Ethereum
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

if (!clientId) {
  throw new Error('ClientId not found')
}

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: privateKeyProvider,
});


export default function Home() {
 
  // Check if the user's wallet is connected, and it's address using Wagmi's hooks.
  // const { address, isConnected } = useAccount();

  // State variable to know if the component has been mounted yet or not
  const [isMounted, setIsMounted] = useState(false);

  // State variable to show loading state when waiting for a transaction to go through
  // const [loading,setIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State variable to store all proposals in the DAO
  const [proposals, setProposals] = useState([]);
  // State variable to switch between the 'Create Proposal' and 'View Proposals' tabs
  const [selectedTab, setSelectedTab] = useState("");
  // const [version, setVersion] = useState('');
  const [stableAddress, setStableAddress] = useState('');
  const [approveValue, setApproveValue] = useState(0);
  const [seller, setSeller] = useState("");
  const [value, setValue] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  // const [releaseNum, setReleaseNum] = useState(0);
  const [refundNumber, setRefundNumber] = useState(0);
  const [refundNumberNativeC, setRefundNumberNativeC] = useState(0);
  const [releaseNumber, setReleaseNumber] = useState(0);
  const [releaseNumberNativeC, setReleaseNumberNativeC] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosModal, setDatosModal] = useState({
    crypto: "usdt",
    amount: 0,
    price: 0,
    maximo: 0,
    minimo: 0,
    // payment_mode: "",
    // usdtSeleccionado: false,
    // ethSeleccionado: false,
    // location: "",
    conditions: ""
  });
  const [balanceOf, setBalanceOf] = useState(0); //ERC20 token balance
  const [ethBalance, setEthBalance] = useState('');//ETH balance
  const [allowance, setAllowance] = useState(0);
  const [orderId, setOrderId] = useState(0);
  // const [provider, setProvider] = useState<IProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [lastEscrow, setLastEscrow] = useState<any | null>(null);
  const [owner, setOwner] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [nativeOffers, setNativeOffers] = useState<any[]>([]);
  const [usdtOffers, setUsdtOffers] = useState<any[]>([]);
  // const [balance, setBalance] = useState<number>(0);
  const [feeBuyer, setFeeBuyer] = useState<number>(0);
  const [feeSeller, setFeeSeller] = useState<number>(0);
  
  const fetchFees = useCallback(async (): Promise<void> => {
    try {
      let _feeSeller = await contract?.feeSeller();
      setFeeSeller(_feeSeller || 0);
  
      let _feeBuyer = await contract?.feeBuyer();
      setFeeBuyer(_feeBuyer || 0);
    } catch (error) {
      console.error("Error al obtener las fees:", error);
      // Maneja el error según sea necesario
    }
  }, [contract]); 

  // useEffect(() => {
  //   const init = async () => {
  //     try {
        // IMP START - SDK Initialization
        // Verificar si el web3auth ya está conectado

       //-------->>>>>>///DESCOMENTAR PARA USAR WEB3 AUTH///<<<<<-----------

        // if (!web3auth.connected && !web3auth.provider) {
        //   await web3auth.initModal();
        //   setProvider(web3auth.provider);
        // }
        // // Verificar si provider está inicializado
        // if (web3auth.provider) {
        //   setProvider(web3auth.provider);
        //   const user: Partial<UserInfo> = await web3auth.getUserInfo();
        //   // console.log("USER", user);
        //   setUser(user);

        //   const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
        //     web3auth.provider
        //   );
        //   // console.log("w3aProvider", w3aProvider);

        //   const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
        //   setSigner(w3aSigner);
        //   // console.log("w3aSigner", w3aSigner);

        //   const web3 = new Web3(web3auth.provider as any);

        //   let initAddress: any = await web3.eth.getAccounts();
        //   initAddress = initAddress[0];

        //   // console.log("initAddress", initAddress);
        //   setAddress(initAddress);

        //   if (web3auth.connected) {
        //     setLoggedIn(true);
        //   }

          // const provider: JsonRpcProvider = new JsonRpcProvider(
          //   process.env.REACT_APP_SEPOLIA_RPC_URL
          // );

          // const signer: ethers.Wallet = new Wallet(
          //   process.env.REACT_APP_WALLET_PRIVATE_KEY || "",
          //   provider
          // );
          
          // const initAddress = await signer.getAddress(); //BBORRAR AL DESCOMENTAR WRB3AUTH

          // const initContract = new Contract(CONTRACT_ADDRESS, TowerbankABI, signer);
          // setContract(initContract);
          // const tokContract = new Contract(USDTAddress, USDTABI, signer);
          // setTokenContract(tokContract);
          
          // // setBalance(formatUnits(tokContract.balanceOf(initAddress), 18));
          // setBalanceOf(await tokContract.balanceOf(initAddress));

          // console.log("PRUEBA");
          // console.log("BalanceOf", await tokContract.balanceOf(initAddress).toString());
          // setIsLoading(false);
        // } else {
        //   throw new Error("Provider not initialized");
        // }
      
        // setEth(
        //   web3.utils.fromWei(
        //     await web3.eth.getBalance(initAddress as string), // Balance is in wei
        //     "ether"
        //   )
        // );

        // setBalanceOf(await initContract.balanceOf(initAddress));

        // setAllowance(
        //   await initContract.allowance(
        //     initAddress,
        //     "0xD96B642Ca70edB30e58248689CEaFc6E36785d68"
        //   )
        // );
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

  //   init();
  // // }, [productId]);
  // }, []);


//BORRAR ESTE Y DESCOMENTAR EL OTRO
//BORRAR ESTE Y DESCOMENTAR EL OTRO
const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//BORRAR ESTE Y DESCOMENTAR EL OTRO
//BORRAR ESTE Y DESCOMENTAR EL OTRO


// useEffect(() => {
  //   const fetchLastEscrow = async () => {
  //     if (!contract) {
    //       console.error("Contract is not initialized");
  //       return;
  //     }
  //     try {
  //       const _orderId = await contract?.orderId();
  //       const result: any = await contract?.getEscrow(parseInt(_orderId.toString()) - 1); // Cambiado a getEscrow
  //       if (result) {
  //         setLastEscrow(result);
  //         console.log("Seller:", result.seller);
  //         console.log("Value:", result.value);
  //         console.log("Cost:", result.cost);
  //       } else {
  //         console.error("No se encontraron datos para la oferta con ID:", _orderId.toString());
  //       }
  //     } catch (error) {
  //       console.error("Error al obtener datos de la oferta:", error);
  //     }
  //   };
  
  //   // Solo ejecutar fetchLastEscrow cuando el contrato esté inicializado
  //   if (contract) {
  //     fetchLastEscrow();
  //   }
  // }, [contract]); // El hook se ejecutará solo cuando contract cambie

    const fetchOffers = useCallback(async () => {
      if (!contract) return; // Verifica que el contrato esté disponible
  
      setIsLoading(true);
      try {
        const orderId = await contract.orderId();
        const fetchedNativeOffers: any[] = [];
        const fetchedUsdtOffers: any[] = [];
  
        for (let i = 0; i < orderId; i++) {
          const escrow = await contract.getEscrow(i);
          console.log("ESCROW en FOR", escrow);
          if (escrow?.[2].toString()!== '0') {
            // Crear un objeto que incluya el id
            const offer = {
              id: i, // Asocia el id del índice al escrow
              ...escrow,
            };
            console.log("Oferta en FOR", offer);
          if (escrow.status !== 'Completed') {
            if (escrow.escrowNative) {
              fetchedNativeOffers.push(offer);
            } else {
              fetchedUsdtOffers.push(offer);
            }
          }
          }
        }
                // setEth(
        //   web3.utils.fromWei(
        //     await web3.eth.getBalance(initAddress as string), // Balance is in wei
        //     "ether"
        //   )
        // );

        // setBalanceOf(await initContract.balanceOf(initAddress));

        const balance = await tokenContract?.balanceOf(address);
        setBalanceOf(balance);
        const _balance =  await provider?.getBalance(address);
        setEthBalance(_balance? ethers.formatEther(_balance) : '');
        console.log("OFFERS EN USE_EFEFCT", fetchedNativeOffers);
        console.log("OFFERS EN USE_EFEFCT", fetchedUsdtOffers);
        setNativeOffers(fetchedNativeOffers);
        setUsdtOffers(fetchedUsdtOffers);
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      } finally {
        setIsLoading(false);
      }
    }, [contract, address, provider, tokenContract]); 

   

  useEffect(() => {
    fetchOffers();
    fetchFees();
  }, [contract, fetchFees, fetchOffers, orderId]);

  
  //-------->>>>>COMENTAR ESTA FUNCION Y DESCOMENTAR LA de web3auth PARA PERMITIR WEB3AUTH<<<<<<--------
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Solicitar al usuario que conecte su billetera
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Solicitar al usuario que conecte una cuenta
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
        setProvider(provider);
        setSigner(signer);
        userAddress? setLoggedIn(true): setLoggedIn(false);

        console.log("Provider:", provider);
        console.log("Signer:", signer);
        console.log("Connected Address:", userAddress);
        console.log("ISLOGGED?", loggedIn);
        if (provider && signer) {
          // Initialize Towerbank contract
          const towerbankContract = new Contract(CONTRACT_ADDRESS, TowerbankABI, signer);
          if (!towerbankContract) {
            console.error("Towerbank contract initialization failed");
          } else {
            console.log("Towerbank Contract initialized:", towerbankContract);
          }
          setContract(towerbankContract);
          console.log("Contract:", towerbankContract);
          
          // Initialize USDT contract
          const usdtContract = new Contract(USDTAddress, USDTABI, signer);
          if (!usdtContract) {
            console.error("USDT contract initialization failed");
          } else {
            console.log("USDT Contract initialized:", usdtContract);
          }
          setTokenContract(usdtContract);
          console.log("TOKENContract:", usdtContract);
        } else {
          console.error("Provider or Signer not initialized");
        }
      } catch (err) {
        console.error("User rejected the connection:", err);
      }
    } else {
      console.error("No Ethereum provider found. Install MetaMask or another wallet.");
    }
  };


//DESCOMENTAR setProvider DESPUES DE RECUPERAR WEB3AUTH
//DESCOMENTAR setProvider DESPUES DE RECUPERAR WEB3AUTH
//DESCOMENTAR setProvider DESPUES DE RECUPERAR WEB3AUTH
const login = async () => {
  // IMP START - Login
  const web3authProvider = await web3auth.connect();
  // IMP END - Login
  // setProvider(web3authProvider);
  
  
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };
  //DESCOMENTAR setProvider DESPUES DE RECUPERAR WEB3AUTH
  //DESCOMENTAR setProvider DESPUES DE RECUPERAR WEB3AUTH
  //DESCOMENTAR setProvider DESPUES DE RECUPERAR WEB3AUTH
  
  
   async function createEscrow(value: number, price: number) {
    // console.log("VALOR value el CREAR Escrow: ", ethers.parseEther(value.toString()));
    // console.log("Address SELLER al CREAR el Escrow: ", seller);
    setIsLoading(true);
    // const message = "Hola, Towerbank pagará el gas por ti";
    // const hash = hashMessage(message);
    // console.log("HASH", hash);
    // const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);
    if (!contract) {
      throw new Error("Contract not found");
    }
    try {
      // const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
      // const addEscrowTokenTx = await contract.addParticipant(address, hash, signature, value, cost, USDTAddress) {
      // const addEscrowTokenTx = await contract.addParticipant( value, cost, USDTAddress {
      // console.log("value", value);
      // console.log("price", price);
      // const valueUsdtBig = convertToBigNumber(value, 6);
      // console.log("valueUsdtBig", valueUsdtBig);
      // const priceEthBig = convertToBigNumber(price, 18);
      // console.log("priceEthBig", priceEthBig);
      // const cost = valueUsdtBig * priceEthBig;
      // console.log("cost", cost);
      // const totalCost = convertFromBigNumber(cost, 18);
      // console.log("totalCost", totalCost);
      const totalCost = value * price;


      // Convertir 'price' de Eth a su unidad más pequeña 
      const pricePerUsdtInEth = BigInt(ethers.parseEther(price.toString()));
      console.log("pricePerUsdtInEth", pricePerUsdtInEth);
      
      // Convertir 'value' de USDT a su unidad más pequeña (asumiendo 6 decimales para USDT)
      const valueInWei = BigInt(ethers.parseUnits(value.toString(), 6));
      console.log("valueInWei", valueInWei);

      // Realizar la multiplicación
      const totalCostInWei = valueInWei * pricePerUsdtInEth;

      console.log("totalCostInWei", totalCostInWei );

      let totalCostAsString = (totalCostInWei / BigInt(Math.pow(10, 6))).toString().slice(-6);

      console.log("totalCostAsString", totalCostAsString);


      // const addEscrowTokenTx = await contract.createEscrowToken(valueUsdtBig, totalCost, USDTAddress, {
      // const addEscrowTokenTx = await contract.createEscrowToken(valueInWei, totalCostInWei, USDTAddress, {
      const addEscrowTokenTx = await contract.createEscrowToken(valueInWei.toString(), totalCostInWei.toString(), USDTAddress, {
          gasLimit: 5000000,
        });
      await addEscrowTokenTx.wait();
      // const receipt = await waitForTransaction(addEscrowTokenTx);
      toast("Se ha creado la oferta USDT exitosamente");
      fetchOffers();
      handleCloseForm ();
      console.log('Transacción confirmada:', addEscrowTokenTx.hash);
    } catch (error) {
      console.error(error);
      // window.alert(error);
      toast.error("No se ha podido crear la oferta USDT");
    }finally{
      setIsLoading(false);
      //NECESARIO HACER DISABLED CONFIRMACION??
    }
  } 


    

    async function createEscrowNativeCoin(value: number, price: number) {
      setIsLoading(true);
      // const message = "Hola, Towerbank pagará el gas por ti";
      // const hash = hashMessage(message);
      // console.log("HASH", hash);
      // const signature = await signMessage(message, provider);
      // console.log("SIGNATURE", signature);
      if (!contract) {
        throw new Error("Contract not found");
      }
      try {
        // const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
        // const addEscrowTokenTx = await contract.addParticipant(address, hash, signature, value, cost, USDTAddress) {
          // const addEscrowTokenTx = await contract.addParticipant( value, cost, USDTAddress {
            
          console.log("value", value);
          console.log("price", price);
          // const valueEthBig = convertToBigNumber(value, 18);
          // console.log("valueEthBig", valueEthBig);
          // const priceUsdtBig = convertToBigNumber(price, 6);
          // console.log("priceUsdtBig", priceUsdtBig);
          // const cost = valueEthBig * valueEthBig;
          // console.log("cost", cost);
          // const totalCost = convertFromBigNumber(cost, 6);
          const totalCost = value * price;
          console.log("totalCost", totalCost);
          
          // let amountFeeSeller = ((valueEthBig * (await getFeeSeller() * 10 ** 18)) /
          // const amountFeeSeller = ((valueEthBig * (await getFeeSeller() * 10 ** 18)) /

          // (100 * 10 ** 6)) / 1000; DECIMALES, 6 USDT
          // const amountFeeSeller = ((valueEthBig * (feeSeller * 10 ** 18)) /
          // (100 * 10 ** 18)) / 1000;
          // console.log("amountFeeSeller", amountFeeSeller);
          // const totalValue = valueEthBig + amountFeeSeller;
          // console.log("totalValue", totalValue);

          // Convertir 'value' de Ether a wei
          // Convertir 'value' de Ether a wei
          const valueInWei = BigInt(ethers.parseEther(value.toString()));

          // Convertir 'price' de USDT a su unidad más pequeña (asumiendo 6 decimales para USDT)
          const pricePerEthInUSDT = BigInt(ethers.parseUnits(price.toString(), 6));

          // Realizar la multiplicación
          const totalCostInWei = valueInWei * pricePerEthInUSDT;

          console.log("totalCostInWei", totalCostInWei.toString());

          let totalCostAsString = (totalCostInWei / BigInt(Math.pow(10, 6))).toString().slice(-6);

          console.log("totalCostInWei", totalCostAsString);
              // Intentar agregar el escrow nativo
      
          const addEscrowNativeTx = await contract.createEscrowNativeCoin(
            valueInWei, // Asumiendo que 'valueInWei' es el valor correcto a pasar
            totalCostInWei, // Asumiendo que 'totalCostAsString' es el valor correcto a pasar
            USDTAddress, // Asegúrate de que 'USDTAddress' es válido
            {
              gasLimit: 5000000,
              value: valueInWei // Asegúrate de que este es el valor correcto a pasar como parte de la transacción
            }
          );
          await addEscrowNativeTx.wait();
          console.log("Hash", addEscrowNativeTx.hash);
          console.log('Transacción confirmada:', addEscrowNativeTx);
          
          console.log('Transacción confirmada:', addEscrowNativeTx.hash);
          // const receipt = await waitForTransaction(addEscrowTokenTx);
          window.alert("Se ha creado el Escrow")
          toast("Se ha creado la oferta ETH exitosamente");
          fetchOffers();
          handleCloseForm();
          // await waitForTransaction(tx);
       
          
      } catch (error) {
        console.error(error);
        // window.alert(error);
        toast.error("No se ha podido crear la oferta ETH");
      }finally{
        setIsLoading(false);
        //NECESARIO CERRAR MODAL CONFIRMACION??
      }
    } 
    async function acceptEscrowToken(_orderId: number, cost: number) {
      setIsLoading(true);
      // const message = "Hola, Towerbank pagará el gas por ti";
      // const hash = hashMessage(message);
      // console.log("HASH", hash);
      // const signature = await signMessage(message, provider);
      // console.log("SIGNATURE", signature);
      if (!contract) {
        throw new Error("Contract not found");
      }
      try {
        // const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
        // const addEscrowTokenTx = await contract.addParticipant(address, hash, signature, value, cost, USDTAddress) {
          // const addEscrowTokenTx = await contract.addParticipant( value, cost, USDTAddress {
          
          console.log("cost", cost);
          console.log("ORDERID", parseInt(_orderId.toString()) );
          // const costEthBig = convertToBigNumber(cost, 18);
          // console.log("costETHBIG", costEthBig);
          // let amountFeeSeller = ((valueEthBig * (await getFeeSeller() * 10 ** 18)) /
          // let feebuyer = parseInt(await getFeeBuyer().toString());
          // const amountFeeBuyer = ((cost * (feebuyer * 10 ** 18)) /
          // // (100 * 10 ** 6)) / 1000; DECIMALES, 6 USDT
          // (100 * 10 ** 18)) / 1000;
          // console.log("amountFeeBuyer", amountFeeBuyer);
          // const totalCost = cost + amountFeeBuyer;
          // console.log("totalCost", totalCost);  

        const acceptEscrowTokenTx = await contract.acceptEscrowToken( parseInt(_orderId.toString()), {
            gasLimit: 5000000,
            value: cost
          });
        await acceptEscrowTokenTx.wait();
        // const receipt = await waitForTransaction(addEscrowTokenTx);
        window.alert("Se ha aceptado la oferta USDT. Se han trasferido los fondos")
        toast("Se ha aceptado la oferta USDT. Se han trasferido los fondos");
        fetchOffers();
        // await waitForTransaction(tx);
        console.log("Hash", acceptEscrowTokenTx.hash);
        console.log('Transacción ACCEPT confirmada:', acceptEscrowTokenTx);
        
        console.log('Transacción ACCEPT confirmada:', acceptEscrowTokenTx.hash);

      } catch (error) {
        console.error(error);
        // window.alert(error);
        toast.error("No se ha podido aceptar la oferta USDT");
      }finally{
        setIsLoading(false);
        //NECESARIO CERRAR MODAL CONFIRMACION??
      }
    } 
    async function acceptEscrowNativeCoin(_orderId: number) {
      setIsLoading(true);
      // const message = "Hola, Towerbank pagará el gas por ti";
      // const hash = hashMessage(message);
      // console.log("HASH", hash);
      // const signature = await signMessage(message, provider);
      // console.log("SIGNATURE", signature);
      if (!contract) {
        throw new Error("Contract not found");
      }
      try {
        // const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
        // const addEscrowTokenTx = await contract.addParticipant(address, hash, signature, value, cost, USDTAddress) {
          // const addEscrowTokenTx = await contract.addParticipant( value, cost, USDTAddress {
          
        const acceptEscrowNativeTx = await contract.acceptEscrowNativeCoin( _orderId, {
            gasLimit: 5000000
          });
        await acceptEscrowNativeTx.wait();
        // const receipt = await waitForTransaction(addEscrowTokenTx);
        window.alert("Se ha aceptado la oferta ETH. Se han trasferido los fondos")
        toast("Se ha aceptado la oferta ETH. Se han trasferido los fondos");
        fetchOffers();
        // await waitForTransaction(tx);
        console.log("Hash", acceptEscrowNativeTx.hash);
        console.log('Transacción ACCEPT confirmada:', acceptEscrowNativeTx);
        
        console.log('Transacción ACCEPT confirmada:', acceptEscrowNativeTx.hash);
      } catch (error) {
        console.error(error);
        // window.alert(error);
        toast.error("No se ha podido acptar la oferta ETH");
      }finally{
        setIsLoading(false);
        //NECESARIO CERRAR MODAL CONFIRMACION??
      }
    } 
  

    /// ================== Fee Seller ==================
    async function getFeeSeller() {
      try {
        const feeSeller= await contract?.feeSeller();
        console.log("feeSeller",feeSeller); // Imprime la versión obtenida del contrato
        return feeSeller;
      } catch (error) {
        console.error("Error al obtener la feeSeller:", error);
      }
    }
    let sellerfee = parseFloat(getFeeSeller().toString());
    /// ================== Fee Buyer ==================
    async function getFeeBuyer() {
      try {
        const feeBuyer= await contract?.feeBuyer();
        console.log("feeBuyer",feeBuyer); // Imprime la versión obtenida del contrato
        return feeBuyer;
      } catch (error) {
        console.error("Error al obtener la feeBuyer:", error);
      }
    }
    


    /// ================== Version Towerbank ==================
    async function getVersion() {
      try {
        const version = await contract?.version();
        console.log("XXversion",version); // Imprime la versión obtenida del contrato
        return version;
      } catch (error) {
        console.error("Error al obtener la versión:", error);
      }
    }
    
    const version = getVersion();


  /// ================== Añadir Stable Coin ==================
  async function addStableAddress(stableAddress: string) {
    // console.log("VALOR value el CREAR Escrow: ", ethers.parseEther(value.toString()));
    // console.log("Address SELLER al CREAR el Escrow: ", seller);
    setIsLoading(true);
    // const message = "Hola, Towerbank pagará el gas por ti";
    // const hash = hashMessage(message);
    // console.log("HASH", hash);
    // const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);
    if (!contract) {
      throw new Error("Contract not found");
    }
    try {
      // const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
      // const addEscrowTokenTx = await contract.addParticipant(address, hash, signature, value, cost, USDTAddress) {
      // const addEscrowTokenTx = await contract.addParticipant( value, cost, USDTAddress {
      const addStableAddressTx = await contract.addStablesAddresses( stableAddress, {
          gasLimit: 5000000,
        });
      await addStableAddressTx.wait();
      // const receipt = await waitForTransaction(addEscrowTokenTx);
      toast("Se ha añadido la crypto currency exitosamente");
      
      console.log('Transacción addStable confirmada:', addStableAddressTx.hash);
    } catch (error) {
      console.error(error);
      // window.alert(error);
      toast.error("No se ha podido añadir la crypto currency");
    }
   setIsLoading(false);
  }


/// ================== Escrow  Value  ==================
async function getEscrowValue(escrowId: number) {
  try {
    const escrowValue = await contract?.getValue(escrowId);
    console.log("escrowValue",escrowValue); // Imprime la versión obtenida del contrato
  } catch (error) {
    console.error("Error al obtener la el valor de la oferta:", error);
  }
}

  // console.log("EscrowValue",escrowValue);

  /// ================== Escrow  State  ==================
  // Fetch the state of Escrow
  async function getEscrowState(escrowId: number) {
    try {
      const escrowState= await contract?.getState(escrowId);
      console.log(escrowState); 
    } catch (error) {
      console.error("Error al obtener la el estado de la oferta:", error);
    }
  }
 
  // console.log("EscrowState",escrowState);

  /// ================== Get OrderID  ==================
  async function getOrderId() {
    try {
        const orderId = await contract?.orderId();
        console.log("orderId", orderId); 
        setOrderId(orderId);
        return orderId;
    } catch (error) {
        console.error("Error al obtener el numero de oferta:", error);
    }
}



  /// ================== Get scrow 0E  ==================
  // Fetch the state of Escrow
/// ================== Get Last Escrow ==================
// Fetch the state of Escrow
// async function getLastEscrow(escrowId: number) {
//   try {
//       const lastEscrow = await contract?.getEscrow(escrowId);
//       console.log("lastEscrow", lastEscrow); 
//       setLastEscrow(lastEscrow);
//       return lastEscrow;
//   } catch (error) {
//       console.error("Error al obtener el escrow:", error);
//   }
// }

// // Llamada para obtener el último escrow basado en el ID

// const fetchLastEscrow = async () => {
//   if (!contract) {
//     console.error("Contract is not initialized");
//     return;
//   }
//   try {
//     const _orderId = await contract?.orderId();
//     const result: any = await contract?.getLastEscrow(parseInt(_orderId.toString()) - 1);
//     // if (result && result.length === 3) {
//     if (result) {
//       setLastEscrow(result);
//       const seller = result.seller;
//       const type = result.escrowNative;
//       const value = result.value;
//       const cost = result.cost;
//       console.log("Seller:", seller);
//       console.log("Value:", value);
//       console.log("Cost:", cost);
     
//     } else {
//       const merda =  getLastEscrow(parseInt(_orderId.toString())  -1);
//       console.error("No se encontrado datos para la oferta:", orderId);
//       console.log("MERDA SECA", merda);
//     }
//   } catch (error) {
//     console.error("Error al obtener datos de la oferta", error);
//   }
// };
// console.log("EL maldito ORDERID", orderId);
// fetchLastEscrow();
  // console.log("Last Escrow",lastEscrow);
  // if(lastEscrow.data){
  //   // console.log("lastEscrowData",lastEscrow.data.buyer);
  //   // console.log("lastEscrowBuyer",lastEscrow.data.buyer);
  // }
  
  /// ================== Owner del protocolo  ==================
  
async function getowner() {
  try {
    const owner= await contract?.owner();
    console.log("owner", owner); 
    setOwner(owner);
  } catch (error) {
    console.error("Error al obtener el owner del contrato:", error);
  }
}
getowner();

/// ================== Allowance en USDT  ==================

//CUIDADO; SE NECESITA INSTANCIAR USDT
async function getAllowance() {
  try {
    const allowance= await contract?.allowance(address, CONTRACT_ADDRESS);
    console.log("allowance", allowance); 
    setAllowance(allowance);
  } catch (error) {
    console.error("Error al obtener el allowance de oferta:", error);
  }
}
//  getAllowance()
  // if(allowance && allowance.data){
  //   // console.log("ALLOWANCE: ", formatEther(allowance.data));

  // }

  /// ================== Approve el user a Towerbank  ==================
  async function approve() {
    setIsLoading(true);
    // const message = "Hola, Towerbank pagará el gas por ti";
    // const hash = hashMessage(message);
    // console.log("HASH", hash);
    // const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);
    if (!contract) {
      throw new Error("Contract not found");
    }

    // const amountFeeSeller = ((valueEthBig * (await getFeeSeller() * 10 ** 18)) /
    // // (100 * 10 ** 6)) / 1000; DECIMALES, 6 USDT
    // (100 * 10 ** 18)) / 1000;
  
    console.log("approveValue", approveValue);
    const amountApprove = convertToBigNumber(approveValue, 6);
    console.log("amountApprove ", amountApprove);
    try {
      // const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
      // const addEscrowTokenTx = await contract.addParticipant(address, hash, signature, value, cost, USDTAddress) {
      // const addEscrowTokenTx = await contract.addParticipant( value, cost, USDTAddress {
      const approveTx = await tokenContract?.approve (CONTRACT_ADDRESS, amountApprove, {
          gasLimit: 5000000,
        });
      await approveTx.wait();
      // const receipt = await waitForTransaction(addEscrowTokenTx);
      window.alert("Se ha aprobado con éxito")
      toast("Se ha aprobado con éxito");
      // await waitForTransaction(tx);
      console.log("Hash del approve", approveTx.hash);
      console.log('Transacción approve confirmada:', approveTx);

    } catch (error) {
      console.error(error);
      // window.alert(error);
      toast.error("No se ha podido aprobar");
    }
   setIsLoading(false);
  } 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    
    if (type === "radio" && name === "crypto") {
      setDatosModal(prevState => ({
        ...prevState,
        crypto: value as "usdt" | "eth",
        amount: 0, 
        price: 0, 
        maximo: 0,
        minimo: 0,
        conditions: ""
      }));
    } else {
      setDatosModal(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // const handleChange = (e: any) => {
  //   const { name, type, value } = e.target;
  
  //   if (type === "radio" && name === "crypto") {
  //     setDatosModal(prevState => ({
  //       ...prevState,
  //       crypto: value,
  //       amount: 0, // Opcional: limpia la cantidad disponible si cambias de cripto
  //       price: 0, // Opcional: limpia el precio por unidad si cambias de cripto
  //       // payment_mode: "", // Opcional: limpia el modo de pago si cambias de cripto
  //       maximo: 0, // Opcional: limpia el modo de pago si cambias de cripto
  //       minimo: 0, // Opcional: limpia el modo de pago si cambias de cripto 
  //       conditions: "", // Opcional: limpia el modo de pago si cambias de cripto
  //     }));
  //   } else {
  //     setDatosModal(prevState => ({
  //       ...prevState,
  //       [name]: value
  //     }));
  //   }
  // };
  
  
  
  const handleSubmitModal = (e: any) => {
    e.preventDefault();
    console.log("DatosModal, linea 541", datosModal);
    // abrirModal(datosModal);
    openModal(datosModal);
  };
  
 
  const openForm = () => {
    setIsFormVisible(true);
  };
  const handleCloseForm = () => {
    setDatosModal({
      crypto:'udst',
      amount: 0,
      price: 0,
      maximo: 0,
      minimo: 0,
      conditions: '',
      // otros campos según sea necesario
    });
    setIsFormVisible(false)
  };

const handleConfirmModal = async () => {
  if(datosModal){
    if (datosModal.crypto === 'eth') {
      await createEscrowNativeCoin(datosModal.amount, datosModal.price);
    } else if (datosModal.crypto === 'usdt') {
      await createEscrow(datosModal.amount, datosModal.price);
    }
    console.log("handleConfirmModal MODAL ANTES", isModalOpen);
    setIsModalOpen(false);
  }
};

const handleCancelModal = () => {
  console.log("handleCancelModal MODAL ANTES", isModalOpen);
  setIsModalOpen(false); // Cierra el modal sin hacer nada
};

const openModal = (data: any) => {
  setDatosModal(data);
  console.log("openModal MODAL ANTES", isModalOpen);
  setIsModalOpen(true);
  console.log("SE DEBE ABRIR EL MODAL");
};

const closeModal = () => {
  console.log("closeModal MODAL ANTES", isModalOpen);
  setIsModalOpen(false);
  console.log("SE DEBE CERRAR EL MODAL");
  // setDatosModal(null);
  };



  useEffect(() => {
    setIsMounted(true);
    // setBalanceOf(balanceOf?.data);
  }, []);

  if (!isMounted) return null;

    const unloggedInView = (
      <div>
      <div>
      {/* <div className={styles.mainContainer}> */}
      <div className="mainContainer">
      <h1>Towerbank</h1>
      <img className="logo" src="/ikigii_logo.png" alt="Logo de Towerbank, intercambio p2p de criptomonedas" />
      <p>El intercambio de USDT - ETH entre particulares</p>
      <p>De onchain a offchain a través de Towerbank</p>
      <div className="textContainer">
        <p>RÁPIDO</p>
        <p>EFICIENTE</p>
        <p>SEGURO</p>
      </div>
      </div>
    </div>
      <button className="bg-[#ca0372] p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-[#ca0372] bg-opacity-50 transition-all disabled:opacity-80 text-xl font-semibold" onClick={login}>
        Login
      </button>
    </div>
    );
  
    const loggedInView = (
      <>

  
        <button className="bg-[#ca0372] p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-[#ca0372] hover:opacity-50  transition-all disabled:opacity-80 text-xl font-semibold " onClick={logout}>
          Log Out
        </button>
        {/* </div> */}
        {/* </div> */}
      </>
    );
    
    const handleSubmit = (e: any) => {
      e.preventDefault();
      addStableAddress(stableAddress);
    }; 
    const handleSubmitApprove = (e: any) => {
      e.preventDefault();
      approve();
    }; 

  return (
    // <div className={inter.className}>
    <div className="main">{loggedIn ? loggedInView : unloggedInView}
      {loggedIn && (
       
        // <link rel="icon" href="/favicon.ico" />
      
  
      // <div className={styles.main}>
      <div className="text-container">
        <div>
          <div className="containerTitle">
            <h1 className="title">Towerbank</h1>
            <img className="logo" src="/ikigii_logo.png" alt="Logo de Towerbank, intercambio p2p de criptomonedas" />

              {/* <p id="textVersion">Version: {versionTowerbank.data}</p> */}
            {/* <p className="description">Peer to Peer USDT Exchange!</p> */}
            <p className="description">Intercambio de USDT-ETH entre particulares</p>
            {address && <p className="show-balance">Dirección del usuario: {truncateEthAddress(address)}</p>}
            <div className="balances-container">
              {ethBalance && <p className="show-balance">Balance de UDSDT: {balanceOf.toString()}</p>}
              {ethBalance && <p className="show-balance">Balance de ETH: {ethBalance}</p>}
            </div>
          </div>

          <div className="containerCrear">
            
              
              {/* <div className={styles.containerCompletar}> */}
              <h1>AQUI HABIA CREACION Y RELEASE</h1>
              <div>
              {/* {orderId && <p>Order: {parseInt(orderId.data)}</p>} */}
              </div>
            {/* </div>  */}
          </div>
          <h1>AQUI HABIA APPROVE</h1>
          <div className="styles.containerData">
                    
            {/* <h1 className={styles.title}>Towerbank</h1> */}
            
              {/* <div className={styles.containerLastEscrow}>
                  <div className={styles.lastEscrowTitle}>
                    <h3>Ultimo Escrow listado</h3>
                  </div>
                  <div className={styles.lastEscrowData}>
                    {<p>Dueño del Escrow (Comprador): {lastEscrow?.buyer}</p>}
                    {lastEscrow && <p>Dirección del Vendedor: {lastEscrow?.seller}</p>}
                    {lastEscrow && <p>Valor: {formatEther(lastEscrow?.value)}</p>}
                    {lastEscrow && <p>Estado: {parseInt(lastEscrow?.status)}</p>}
                    {orderId && <p>Numero de Escrow: {parseInt(orderId.toString()) - 1}</p>}
                  </div>
              </div> */}
              <div>
                <div className="app-offers-container">      
                  <div className="app-offers-eth">
                  <h2>Ofertas en ETH</h2>
                  <div className="app-offers-map">
                    {nativeOffers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} acceptEscrowToken={acceptEscrowToken} acceptEscrowNativeCoin={acceptEscrowNativeCoin} />
                    ))}
                    </div>
                  </div>     
                </div>
                
                <div className="app-offers-container">  
                <div className="app-offers-token">
                  <h2>Ofertas en USDT</h2>
                  <div className="app-offers-map">
                  {usdtOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} acceptEscrowToken={acceptEscrowToken} acceptEscrowNativeCoin={acceptEscrowNativeCoin}/>
                  ))}
                  </div>
                  </div>     
                </div>
            </div>
            <div className="offersContainer">            
            {!isFormVisible ? (
            <button
              className="publish-offer-button"
              onClick={openForm}
            >
              PUBLICAR OFERTA
            </button>
          ) : (
            isFormVisible && (
              <FormularioOferta
                datosModal={datosModal}
                handleSubmitModal={handleSubmitModal}
                handleChange={handleChange}
                onCloseForm={handleCloseForm}
                ethBalance={ethBalance}
                balanceOf={balanceOf}
              />
            )
          )}
                    {/* Modal */}
          {isModalOpen && (
            <div className="modal-container">
              <div>
                <ModalResumen
                  onCloseModal={closeModal}
                  datosModal={datosModal}
                  onConfirm={handleConfirmModal}
                />
              </div>
            </div>
              )}
                  </div>
              <div className={styles.description}>
                {/*<p>Valor del Escrow: {parseInt(escrowValue.data)}</p>*/}
                {/*<p>//Estado del Escrow: {parseInt(escrowState.data)}*/}
                {allowance && <p>Allowance: {formatEther((allowance))}</p>}
                {/*{lastEscrow && lastEscrow.data && <p>EscrowBuy: {lastEscrow.data.buyer}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowSel: {lastEscrow.data.seller}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowVal: {formatEther(lastEscrow.data.value)}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowSfee: {formatEther(lastEscrow.data.sellerfee)}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowBfee: {formatEther(lastEscrow.data.buyerfee)}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowSta: {lastEscrow.data.status}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowCurr: {lastEscrow.data.currency}</p>} /*}
                  {/* {owner.data && <p>Owner: {owner.data}</p>} */}
                  </div>  
              {/* {renderTabs()} */}
              {/* Display additional withdraw button if connected wallet is owner */}
              {address && address.toLowerCase() === owner?.toLowerCase() ? (
              <div>
                {isLoading ? (
                  <button className="button">Loading...</button>
                ) : (<div>
                <div> 
                  <div className="containerRefunds">
                    <p>Devolver escrow al dueño (Solo Owner)</p> 
                  <div className={styles.containerEscrowOwner}>
                      <label htmlFor="price">Número de Escrow USDT a devolver</label>
                      <input type="number" placeholder="Número Escrow USDT" min="0"
                      value={refundNumber} onChange={(e) => setRefundNumber(parseInt(e.target.value))}></input>
                      <div className={styles.divRelease}>
                      {/* <button onClick={refundEscrow}>Devolver USDT</button> */}
                      </div>
                  </div>
                  <div className={styles.containerEscrowOwner}>
                    {/* <label htmlFor="price">Número de Escrow ETH a devolver</label> */}
                    <label htmlFor="price">Número de Escrow ETH a devolver</label>
                    {/* <input type="number" placeholder="Número Escrow ETH" min="0" */}
                    <input type="number" placeholder="Número Escrow ETH" min="0"
                    value={refundNumberNativeC} onChange={(e) => setRefundNumberNativeC(parseInt(e.target.value))}></input>
                    <div className={styles.divRelease}>
                    {/* <button onClick={refundEscrowNativeCoin}>Devolver ETH</button> */}
                    {/* <button onClick={refundEscrowNativeCoin}>Devolver ETH</button> */}
                    </div>
                  </div>
                </div>
                <div className={styles.containerReleases}>
                  <div>
                    <p>Liberar escrow al vendedor (Solo Owner)</p>
               
                  </div>
                </div>
                </div>
                <div className={styles.containerWithdraw}>
                <form className="approveAddStable" onSubmit={handleSubmit}>
                      <input type="text" placeholder="Direccion EstableCoin"
                      value={stableAddress} onChange={(e) => setStableAddress(e.target.value)} />
                      <button type="submit">Añadir StableCoin</button>
                    </form>
                  {/* <button className={styles.withdrawButton} onClick={withdrawFees}>
                    Retirar Fees USDT
                  </button>
                  <button className={styles.withdrawButton} onClick={withdrawFeesNativeCoin}>
                 
                    Retirar Fees ETH
                  </button> */}
                </div> 
                  
                  </div>
                )}
              </div>
              ) : (
                ""
              )}
            </div>  
        </div>
        <div>
          {/* <img className={styles.image} src="" /> */}
        </div>
      </div>
        )}
        {/* <p className="mt-4">ProductId: {actualProductId}</p>
    <p className="mt-4">ParticipantId: {actualParticipantId}</p> */}
      {!loggedIn && (
        // <div  className='p-96 flex-col rounded-md m-auto place-content-center bg-[#292d67]' >

        // </div>
      <div>
        <h1>CONECTATE A LA APLICACION</h1>
        {owner && <p className={styles.description}>Address del owner{owner}</p>}
        {orderId && <p className={styles.description}>Address del owner{orderId}</p>}
        {balanceOf && <p className={styles.description}>Balance{balanceOf}</p>}
        {isMounted && <p className={styles.description}>Contract{isMounted}</p>}
        {<p className={styles.description}>Allowance{allowance?.toString()}</p>}
        {<p className={styles.description}>LastEscrow{lastEscrow}</p>}
        {/* {version && <p className={styles.description}>`version: ${version}`</p>} */}
        {address ? (
          <p>Connected Address: {address}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
      )}
      </div>
  
   
  );
}

