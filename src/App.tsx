import { USDTABI } from "./assets/abis/UsdtABI";
import { CONTRACT_ADDRESS } from "./assets/constants";
import { USDTAddress } from "./assets/constants";
import { TowerbankABI } from "./assets/abis/TowerbankABI";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
// import { formatEther, parseUnits } from "viem/utils";
// import {useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract, useReadContract } from "wagmi";

// import { readContract, writeContract, waitForTransactionReceipt, waitForTransaction} from "wagmi/actions";
import styles from "../styles/Home.module.css";
import ModalResumen from './components/modalResumen'; 
import FormularioAnuncio from './components/formularioAnuncio'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uiConsole } from './utils/SignMessageFunction';



import Web3 from "web3";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, UserInfo, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Contract, ethers, hashMessage, JsonRpcProvider, Wallet } from 'ethers';

import { addItemToLocalStorage, initializeExistingPrefixes, findItemsByInitialNumbers }from './utils/StorageFuntions';
// import truncateEthAddress from 'truncate-eth-address';
import "./App.css";

// import { waitForTransactionReceipt } from 'wagmi/actions';
// import { config } from './main';
// import { Client, createClient, Transport } from 'viem';

import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import 'react-toastify/dist/ReactToastify.css';

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
  const [value, setValue] = useState("");
  // const [releaseNum, setReleaseNum] = useState(0);
  const [refundNumber, setRefundNumber] = useState(0);
  const [refundNumberNativeC, setRefundNumberNativeC] = useState(0);
  const [releaseNumber, setReleaseNumber] = useState(0);
  const [releaseNumberNativeC, setReleaseNumberNativeC] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosModal, setDatosModal] = useState({
    crypto: "usdt" || "eth",
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
  const [balanceOf, setBalanceOf] = useState("");
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  // const [feeBuyer, setFeeBuyer] = useState<number>(0);
  
  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        // Verificar si el web3auth ya está conectado
        if (!web3auth.connected && !web3auth.provider) {
          await web3auth.initModal();
          setProvider(web3auth.provider);
        }
        // Verificar si provider está inicializado
        if (web3auth.provider) {
          setProvider(web3auth.provider);
          const user: Partial<UserInfo> = await web3auth.getUserInfo();
          // console.log("USER", user);
          setUser(user);

          const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
            web3auth.provider
          );
          // console.log("w3aProvider", w3aProvider);

          const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
          setSigner(w3aSigner);
          // console.log("w3aSigner", w3aSigner);

          const web3 = new Web3(web3auth.provider as any);

          let initAddress: any = await web3.eth.getAccounts();
          initAddress = initAddress[0];

          // console.log("initAddress", initAddress);
          setAddress(initAddress);

          if (web3auth.connected) {
            setLoggedIn(true);
          }

          const provider: JsonRpcProvider = new JsonRpcProvider(
            process.env.REACT_APP_SEPOLIA_RPC_URL
          );

          const signer: ethers.Wallet = new Wallet(
            process.env.REACT_APP_WALLET_PRIVATE_KEY || "",
            provider
          );
          
          
          
          const initContract = new Contract(CONTRACT_ADDRESS, TowerbankABI, signer);
          setContract(initContract);
          // console.log("Contract", initContract);

          // if (productId > 0 || provenanceData) {
          //   console.log("PRUEBA");
          //   fetchProductData();
          //   console.log("product", productData);
          //   fetchProvenanceData();
          //   console.log("PROVENANCE", provenanceData);
          // }

          // console.log("Provider", web3auth.provider);
          setIsLoading(false);
        } else {
          throw new Error("Provider not initialized");
        }

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

      } catch (error) {
        console.error(error);
      }
    };

    init();
  // }, [productId]);
  }, []);

  const login = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    // IMP END - Login
    setProvider(web3authProvider);


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

   async function _createEscrow (
    provider: any,
    contract: any,
    address: string,
    name: string,
    pass: string,
    participantType: string,
    participantAddress: string,
    setIsParticipantModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setParticipantData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setPass: React.Dispatch<React.SetStateAction<string>>,
    setParticipantType: React.Dispatch<React.SetStateAction<string>>,
    setParticipantAddress: React.Dispatch<React.SetStateAction<string>>,
  ) => {
          try {
            setIsLoading(true);
            const message = "Hola, TraZableDLT pagará el gas por ti";
            const hash = hashMessage(message);
            // console.log("HASH", hash);
            const signature = await signMessage(message, provider);
            // console.log("SIGNATURE", signature);
      
            if (!contract) {
              throw new Error("Contract not found");
            }
      
            const addParticipantID = await contract.participant_id(); // Asegúrate de que este método existe y devuelve el último productId
            const addParticipantTx = await contract.addParticipant(address, hash, signature, name, pass, participantType, participantAddress, {
              gasLimit: 5000000,
            });
            await addParticipantTx.wait();
      
            if(addParticipantTx){
  
                let participant = new Participant(
                    name,
                    participantType,
                    participantAddress,
                    addParticipantID.toString()
                  )
                  
                  addItemToLocalStorage(participant, "participant");
                  // console.log("participantId.toString():", participantId.toString());
                  // console.log("PARTICIPANT:", participant);
                  // console.log("addParticipantID - 1:", (parseInt(addParticipantID) - 1).toString());
                  setParticipantData(await contract.getParticipant(addParticipantID));
                  // setParticipantData(participant);
              }
                  
                  toast("Participant added successfully");
                  setIsParticipantModalOpen(true);
              } catch (error) {
                  console.error(error);
                  toast.error('Error while adding participant. Try again.')
          } finally {
            setIsLoading(false);
          }
          // console.log("ParticipantAddress", participantAddress);
          // console.log("Adress", address);
          setName('');
          setPass('');
          setParticipantAddress('');
          setParticipantType('');
          setIsLoading(true)
        };
  
   async function createEscrow() {
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
      const addEscrowTokenTx = await contract.createEscrowToken( value, value, USDTAddress, {
          gasLimit: 5000000,
        });
      await addEscrowTokenTx.wait();
      // const receipt = await waitForTransaction(addEscrowTokenTx);
      toast("Se ha creado la oferta USDT exitosamente");
      
      console.log('Transacción confirmada:', addEscrowTokenTx.hash);
    } catch (error) {
      console.error(error);
      // window.alert(error);
      toast.error("No se ha podido crear la oferta USDT");
    }
   setIsLoading(false);
  } 


    /// ================== Devolver Escrow   ==================
    // async function refundEscrow() {
    //  setIsLoading(true);
    //   try {
    //     const tx = await writeContract({
    //       address: CONTRACT_ADDRESS,
    //       abi: TowerbankABI,
    //       functionName: 'refundBuyer',
    //       args: [refundNumber],      
    //   });
    
    //     // Espera a que la transacción se confirme
    //     const receipt = await waitForTransaction(tx);
    //     window.alert("Se ha devuelto el Escrow")
    //     console.log('Transacción confirmada:', receipt);
    //   } catch (error) {
    //     console.error('Error en la devolución del escrow:', error);
    //     window.alert(error);
    //   }
    //   setIsLoading(false);
    // }

    

    // let _amountFeeSeller = ((_value *
    //         (400 * 10 ** 6)) /
    //         (100 * 10 ** 6)) / 1000;
/// ================== Create Escrow Native Coin ==================
  //  const seller = '0xC7873b6EE9D6EF0ac02d5d1Cef98ABEea01E29e2';
  //  const value = 100000000;
    // Function  to create  Escrows
    async function createEscrowNativeCoin() {
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
        const addEscrowNativeTx = await contract.createEscrowNativeCoin(value, value, USDTAddress, {
            gasLimit: 5000000,
          });
        await addEscrowNativeTx.wait();
        // const receipt = await waitForTransaction(addEscrowTokenTx);
        toast("Se ha creado la oferta ETH exitosamente");
        
        console.log('Transacción confirmada:', addEscrowNativeTx.hash);
      } catch (error) {
        console.error(error);
        // window.alert(error);
        toast.error("No se ha podido crear la oferta ETH");
      }
     setIsLoading(false);
    } 
      // console.log("FEE y VALUE: ", (parseInt(fee) + 33) *2, value);
      setIsLoading(true);
      // let amountFeeBuyer = ((value * (feeBuyer * 10 ** 6)) DECIMALES, 6 USDT
      let amountFeeBuyer = ((parseFloat(value) * (fee * 10 ** 18)) /
            // (100 * 10 ** 6)) / 1000; DECIMALES, 6 USDT
            (100 * 10 ** 18)) / 1000;
      try {
        const tx = await writeContract({
        // const tx = await useContractWrite({
          address: CONTRACT_ADDRESS,
          abi: TowerbankABI,
          functionName: "createEscrowNativeCoin",
          // args: [0, seller, BigInt(value), USDTAddress],
          args: [seller, ethers.parseEther(value.toString())],
          value: ethers.parseEther((value + amountFeeBuyer).toString()),
        });
        await waitForTransaction(tx);
        window.alert("Se ha creado el Escrow")
        console.log("Hash", tx.hash);
        console.log('Transacción confirmada:', tx);
      } catch (error) {
        console.error(error);
        window.alert(error);
      }
     setIsLoading(false);
    } 

    
        // /// ================== Devolver Escrow Native Coin  ==================
        // async function refundEscrowNativeCoin() {
        //  setIsLoading(true);
        //   try {
        //     const tx = await writeContract({
        //       address: CONTRACT_ADDRESS,
        //       abi: TowerbankABI,
        //       functionName: 'refundBuyerNativeCoin',
        //       args: [refundNumberNativeC],      
        //   });
        
        //     // Espera a que la transacción se confirme
        //     await waitForTransaction(tx);
        //     window.alert(`Se ha devuelto el Escrow con este hash: ${tx.hash}`);
        //     console.log('Devolución confirmada:', tx.hash);
        //   } catch (error) {
        //     console.error('Error en la devolución del escrow:', error);
        //     window.alert(error);
        //   }
        //  setIsLoading(false);
        // }
        /// ================== Withdraw fees ==================
        
        
        // async function withdrawFees() {
        //  setIsLoading(true);
        //   try {
        //     const tx = await writeContract({
        //       address: CONTRACT_ADDRESS,
        //       abi: TowerbankABI,
        //       functionName: 'withdrawFees',
        //       args: [USDTAddress], //Recoge las Fees guardadas correpondientes a USDT 
        //   });
        
        //     // Espera a que la transacción se confirme
        //     await waitForTransaction(tx);
        //     window.alert(`Se ha devuelto el Escrow con este hash: ${tx.hash}`);
        //     console.log('Devolución confirmada:', tx.hash);
        //   } catch (error) {
        //     console.error('Error en la devolución del escrow:', error);
        //     window.alert(error);
        //   }
        //  setIsLoading(false);
        // }
        /// ================== Withdraw fees Native Coin ==================
        // async function withdrawFeesNativeCoin() {
        //  setIsLoading(true);
        //   try {
        //     const tx = await writeContract({
        //       address: CONTRACT_ADDRESS,
        //       abi: TowerbankABI,
        //       functionName: 'withdrawFeesNativeCoin',    
        //   });
        
        //     // Espera a que la transacción se confirme
        //     await waitForTransaction(tx);
        //     window.alert(`Se ha devuelto el Escrow con este hash: ${tx.hash}`);
        //     console.log('Devolución confirmada:', tx.hash);
        //   } catch (error) {
        //     console.error('Error en la devolución del escrow:', error);
        //     window.alert(error);
        //   }
        //  setIsLoading(false);
        // }
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
    let fee = parseFloat(getFeeBuyer().toString());
    
// setVersion(versionTowerbank.data);
// console.log("FEE BUYER: ", parseInt(fee));
// console.log("FeeBuyer:", parseInt(feeBuyer.data));

    /// ================== Version Towerbank ==================
    async function getVersion() {
      try {
        const version = await contract?.version();
        console.log("version",version); // Imprime la versión obtenida del contrato
      } catch (error) {
        console.error("Error al obtener la versión:", error);
      }
    }
    console.log("version",getVersion()); // Imprime la versión obtenida del contrato
    
// setVersion(versionTowerbank.data);
// console.log("Version:", versionTowerbank.data);


  /// ================== Añadir Stable Coin ==================
  //  async function addStableAddress(stableAddress: string) {
  //  setIsLoading(true);
  //   try {
  //     const tx = await writeContract({
  //       address: CONTRACT_ADDRESS,
  //       abi: TowerbankABI,
  //       functionName: "addStablesAddresses",
  //       args: [USDTAddress],
  //     });

  //     await waitForTransaction(tx);
  //     window.alert("Se ha añadido correctamente a la lista de addresses")

  //   } catch (error) {
  //     console.error(error);
  //     window.alert(error);
  //   }
  //  setIsLoading(false);
  // } 
 
  
 
  // Fetch the balance of the DAO
  // const daoBalance = useBalance({
  //   address: CryptoDevsDAOAddress,
  // });

/// ================== User Balance ==================
  // const userBalance = useReadContract({
  //   abi: USDTABI,
  //   address: USDTAddress,
  //   functionName: "balanceOf",
  //   args: [address]
  // });
 
// // console.log("UserBalance: ", userBalance.data);
// if (userBalance.data != null){
//   // console.log("UserBalance: ", ethers.formatEther(userBalance.data));
// }

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
  // Fetch the state of Escrow
  async function getOrderId() {
    try {
      const orderId= await contract?.orderId();
      console.log("orderId", orderId); 
      return orderId;
    } catch (error) {
      console.error("Error al obtener el numero de oferta:", error);
    }
  }
  let newEscrow= parseInt(getOrderId().toString());
  // orderId?console.log("ORDERID", orderId) && console.log("ORDERID", parseInt(orderId.data)): console.log("ORDERID", "NO HAY");
  // newEscrow? console.log("NewEscrow", newEscrow): console.log("NewEscrow", "NO HAY");
  

  /// ================== Get scrow 0E  ==================
  // Fetch the state of Escrow
  async function getLastEscrow(escrowId: number) {
    try {
      const lastEscrow = await contract?.getEscrow(newEscrow - 1);
      console.log("lastEscrow", lastEscrow); 
      return lastEscrow;
    } catch (error) {
      console.error("Error al obtener el escrow:", error);
    }
  }
  // if(lastEscrow.data){
  //   // console.log("lastEscrowData",lastEscrow.data.buyer);
  //   // console.log("lastEscrowBuyer",lastEscrow.data.buyer);
  // }
  
  /// ================== Owner del protocolo  ==================
  // const owner = useReadContract({
    
  //   abi: TowerbankABI,
  //   address: CONTRACT_ADDRESS,
  //   functionName: "owner",
  // });
  // console.log("OWNER",owner.data);

/// ================== Allowance en USDT  ==================

//CUIDADO; SE NECESITA INSTANCIAR USDT
async function getAllowance() {
  try {
    const allowance= await contract?.allowance(address, CONTRACT_ADDRESS);
    console.log("allowance", allowance); 
    return allowance;
  } catch (error) {
    console.error("Error al obtener el allowance de oferta:", error);
  }
}
 
  // if(allowance && allowance.data){
  //   // console.log("ALLOWANCE: ", formatEther(allowance.data));

  // }

  /// ================== Approve el user a Towerbank  ==================

  // Approve Necesita introducir numero con 6 decimales
    // async function approve() {
    //  setIsLoading(true);
    //   try {
    //     const tx = await writeContract({
    //       address: USDTAddress,
    //       abi: USDTABI,
    //       functionName: 'approve',
    //       args: [CONTRACT_ADDRESS, ethers.parseEther(approveValue.toString())],     
    //   });
    //     // Espera a que la transacción se confirme
    //     const receipt = await waitForTransaction(tx);//funciona bien, no lo uso ahora
    //     await waitForTransaction(tx);
    //     window.alert("Se ha realizado el approve")
    //     console.log('Transacción confirmada:', tx.hash);
    //     // console.log('Receipt :', receipt);
    //   } catch (error) {
    //     console.error('Error en el approve:', error);
    //     window.alert(error);
    //   }
    //  setIsLoading(false);
    // }


  const handleChange = (e: any) => {
    const { name, type, value } = e.target;
  
    if (type === "radio" && name === "crypto") {
      setDatosModal(prevState => ({
        ...prevState,
        crypto: value,
        amount: 0, // Opcional: limpia la cantidad disponible si cambias de cripto
        price: 0, // Opcional: limpia el precio por unidad si cambias de cripto
        // payment_mode: "", // Opcional: limpia el modo de pago si cambias de cripto
        maximo: 0, // Opcional: limpia el modo de pago si cambias de cripto
        minimo: 0, // Opcional: limpia el modo de pago si cambias de cripto 
        conditions: "", // Opcional: limpia el modo de pago si cambias de cripto
      }));
    } else {
      setDatosModal(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  
  
  const handleSubmitModal = (e: any) => {
    e.preventDefault();
    console.log("DatosModal, linea 541", datosModal);
    abrirModal(datosModal);
  };
  
  const abrirModal = (datos: any) => {
    console.log(datos); // Ahora deberías ver los datos actualizados
    // setDatosModal(datos);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  // {isModalOpen && (
  //   <ModalResumen
  //     onCloseModal={() => setIsModalOpen(false)}
  //     // cripto={datosModal.usdtSeleccionado? "USDT" : "ETH"}
  //     crypto={datosModal.crypto? "USDT" : "ETH"}
  //     amount={datosModal.amount}
  //     price={datosModal.price}
  //     // payment_mode={datosModal.payment_mode}
  //   />
  // )}
  
  // // Function to fetch a proposal by it's ID
  // async function fetchProposalById(id) {
  //   try {
  //     const proposal = await readContract({
  //       address: CryptoDevsDAOAddress,
  //       abi: CryptoDevsDAOABI,
  //       functionName: "proposals",
  //       args: [id],
  //     });

  //     const [nftTokenId, deadline, yayVotes, nayVotes, executed] = proposal;

  //     const parsedProposal = {
  //       proposalId: id,
  //       nftTokenId: nftTokenId.toString(),
  //       deadline: new Date(parseInt(deadline.toString()) * 1000),
  //       yayVotes: yayVotes.toString(),
  //       nayVotes: nayVotes.toString(),
  //       executed: Boolean(executed),
  //     };

  //     return parsedProposal;
  //   } catch (error) {
  //     console.error(error);
  //     window.alert(error);
  //   }
  // }

  // // Function to fetch all proposals in the DAO
  // async function fetchAllProposals() {
  //   try {
  //     const proposals = [];

  //     for (let i = 0; i < numOfProposalsInDAO.data; i++) {
  //       const proposal = await fetchProposalById(i);
  //       proposals.push(proposal);
  //     }

  //     setProposals(proposals);
  //     return proposals;
  //   } catch (error) {
  //     console.error(error);
  //     window.alert(error);
  //   }
  // }

  
  
  const { writeContractAsync } = useWriteContract();

  const crearAnuncio = async (datosModal: any) => {
    // Asegrarse de que amount y price sean números decimales
    let amountDecimal = parseFloat(datosModal.amount);
    let priceDecimal = parseFloat(datosModal.price);

    // Verificar que ambos valores sean válidos
    if (isNaN(amountDecimal) || isNaN(priceDecimal)) {
      throw new Error('Amount or price is not a valid number.');
    }
    // Calcula el total multiplicando amount por price
    const totalDecimal = amountDecimal * priceDecimal;  

    // Determinar el factor de decimales basado en la criptomoneda
    let decimalsFactor = 1; // Valor predeterminado
    
   setIsLoading(true);
    try {
    if (datosModal.crypto === 'eth') {
      decimalsFactor = Math.pow(10, 18); // Factor para ETH
      const value = Math.round(amountDecimal * decimalsFactor);
      // Aplicar el factor de decimales al total
      const cost = Math.round(totalDecimal * decimalsFactor);
        const txHash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: TowerbankABI,
          functionName: 'createEscrowNativeCoin',
          args: [ value, cost, USDTAddress],
          value: value.toString(), // Enviar Ether directamente      
        });
        // Espera a que la transacción se confirme
        const receipt = await waitForTransactionReceipt({
          confirmations: 1,
          hash: txHash,
        })
        console.log('Transacción confirmada:', receipt);
      } else if (datosModal.crypto === 'usdt') {
        decimalsFactor = Math.pow(10, 6); // Factor para USDT
        const value = Math.round(amountDecimal * decimalsFactor);
        // Aplicar el factor de decimales al total
        const cost = Math.round(totalDecimal * decimalsFactor);
        const txHash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: TowerbankABI,
          functionName: 'createEscrowToken',
          args: [ value, cost, USDTAddress ],      
        });
        // Espera a que la transacción se confirme
        const receipt = await waitForTransactionReceipt({
          confirmations: 1,
          hash: txHash,
        })
        console.log('Transacción confirmada:', receipt);
      }
        
        window.alert("Se ha creado la oferta")
        // toast('Participant added successfully')
      } catch (error) {
      toast.error('Error while adding participant. Try again.')
      console.error('Error en la creación de la oferta:', error);
      window.alert(error);
    }
   setIsLoading(false);
    console.log("Creando oferta con datos:", datosModal);
    // cerrarModal(); 
    // Ejemplo: enviar los datos a una API o realizar otra acción
  };
  // Render the contents of the appropriate tab based on `selectedTab`
  useEffect(() => {
  // Verificar si el estado de `isMounted` se está configurando correctamente
  setIsMounted(true);
  console.log("Component mounted:", isMounted);
  setBalanceOf(userBalance?.data);
}, []);
  
  function renderTabs() {
    if (selectedTab === "Anuncio USDT") {
      return renderCreateUsdtOffer();
    // } else if (selectedTab === "Anuncio ETH") {
    } else if (selectedTab === "Anuncio ETH") {
      // return renderCreateEthOffer();
      return renderCreateEthOffer();
    }
    return null;
  }

  // Renders the 'Create Proposal' tab content
  function renderCreateUsdtOffer(){
    console.log("Rendering Create USDT Offer");
    console.log("loading:", isLoading);
    console.log("address:", address);
    if (isLoading) {
      return (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );
    } else if (!address) {

      return (
        <div className={styles.description}>
          No estas conectado,  <br />
          <b>por favor conéctate</b>
        </div>
      );
    } else {
        return (
            <><FormularioAnuncio
            datosModal={datosModal}
            handleSubmitModal = {handleSubmitModal}
            // crearAnuncio={crearAnuncio} 
            handleChange={handleChange}
            />
            <div className={styles.description}>
            <form onSubmit={handleSubmitModal}>
              <div className={styles.container}>
                <input type="radio" id="usdt" name="crypto" value="usdt" checked={datosModal.crypto === "usdt"}  onChange={handleChange}></input>
                <label htmlFor="usdt">USDT</label><br></br>
                {/*         <input type="radio" id="eth" name="crypto" value="eth" checked={datosModal.eth} onChange={handleChange}></input> */}
                <input type="radio" id="eth" name="crypto" value="eth" checked={datosModal.crypto === "eth"}  onChange={handleChange}></input>
                {/*         <label for="eth">ETH</label> */}
                <label htmlFor="eth">ETH</label>
              </div>
              

              
              {/* <button className={styles.button2} onClick={renderCreateUsdtOffer}>
       Create
      </button>  */}
              <button type="submit">Crear Oferta USDT</button>
              {/* necesario agregar esto al final de la funcion que crea la Oferta
   console.log("Creando oferta con:", formularioDatos);
 cerrarModal();  */}
            </form>
            {/* <FormularioAnuncio handleSubmitModal = {handleSubmitModal}/> */}
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
              {isModalOpen && (
                <ModalResumen
                  onCloseModal={() => setIsModalOpen(false)}
                  datosModal={datosModal}
                  crearAnuncio={crearAnuncio} />
              )}
            </div>
          </div></>
      );
    }
  }

  // Renders the 'View Proposals' tab content
  // function renderCreateEthOffer() {
  function renderCreateEthOffer() {
    if (isLoading) {
      return (
        <div className={styles.description}>
          Loading... Esperando por la transacción...
        </div>
      );
    } else if (proposals.length === 0) {
      return (
        <div className={styles.description}>No se han generados</div>
      );
    } else {
      return (
        <div>
          {/* {proposals.map((p, index) => (
            <div key={index} className={styles.card}>
              <p>Deadline: {p.deadline.toLocaleString()}</p>
          
              <p>Executed?: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  
                
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className={styles.flex}>
                 
                  
                </div>
              ) : (
                <div className={styles.description}>Anuncio terminado</div>
              )}
            </div>
          ))} */}
        </div>
      );
    }
  }

  



  // Piece of code that runs everytime the value of `selectedTab` changes
  // Used to re-fetch all proposals in the DAO when user switches
  // to the 'View Proposals' tab
  useEffect(() => {
    if (selectedTab === "View Proposals") {
      // fetchAllProposals();
    }
  }, [selectedTab]);

  useEffect(() => {
    setIsMounted(true);
    setBalanceOf(userBalance?.data);
  }, []);

  if (!isMounted) return null;

  if (!web3auth.connected)
    return (
      <div>
        <ConnectButton className={styles.connectButton} />
        <div className={styles.mainContainer}>
        <h1>Towerbank</h1>
        <p>El intercambio de USDT - USD entre particulares</p>
        <p>De onchain a offchain a través de Towerbank</p>
        <div className={styles.textContainer}>
          <p>RÁPIDO</p>
          <p>EFICIENTE</p>
          <p>SEGURO</p>
        </div>
        </div>
      </div>
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
    <div>
      
        <title>Towerbank</title>
        <meta name="description" content="Towerbank" />
        <link rel="icon" href="/favicon.ico" />
      
      {/* Your CryptoDevs NFT Balance: {nftBalanceOfUser.data.toString()} */}
      {/* {formatEther(daoBalance.data.value).toString()} ETH */}
      <div className={styles.main}>
        <div>
          <div className={styles.containerTitle}>
            <h1 className={styles.title}>Towerbank</h1>
            <img className={styles.logo} src="/tron_pay_logo.png" alt="Logo de Towerbank, intercambio p2p de criptomonedas" />

              <p id="textVersion">Version: {versionTowerbank.data}</p>
            <p className={styles.description}>Peer to Peer USDT Exchange!</p>
            <p className={styles.description}>Intercambio de USDT peer to peer </p>
          </div>

          <div className={styles.containerCrear}>
            {/* <div> */}

              {/* <div className={styles.inputs}>
                <div>
                  <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Valor del Scrow(en ETH)</label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
                  focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.001"
                  value={value} onChange={(e) => setValue((e.target.value))}></input>
                </div>
                <div>
                  <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Address del seller</label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
                  focus:outline-none focus:shadow-outline" type="text" placeholder="Address del seller" 
                  value={seller} onChange={(e) => setSeller((e.target.value))}></input>
                </div>
              <button onClick={createEscrow}>Crear Escrow</button>
              </div> */}
              <div className={styles.inputs}>
                <div className={styles.containerEscrow}>
                  {/* <label  htmlFor="price">Valor del Scrow(6 decimales)</label> */}
                  <label  htmlFor="price">Valor del Scrow(18 decimales)</label>
                  <input  type="number" placeholder="Min 0.01 ETH" step="0.001" min="0"
                  value={value} onChange={(e) => setValue((e.target.value))}></input>
                </div>
                <div className={styles.containerEscrow}>
                  <label  htmlFor="price">Address del seller</label>
                  <input  type="text" placeholder="Address" 
                  value={seller} onChange={(e) => setSeller((e.target.value))}></input>
                </div>
                <div className={styles.buttons}>
                <button onClick={createEscrow}>Crear Scrow USDT</button> 
                {/* <button onClick={createEscrowNativeCoin}>Crear Escrow ETH</button> */}
                <button onClick={createEscrowNativeCoin}>Crear Scrow ETH</button>
                </div>
              </div>
              {/* <div className={styles.containerCompletar}> */}
              <div className={styles.inputs}>
                {/* {hash && <div>Transaction Hash: {hash}</div>} */}
                {/* {isConfirming && <div>Waiting for confirmation...</div>}  */}
                {/* {isConfirmed && <div>Transaction confirmed.</div>}  */}
                <div className={styles.containerEscrow}>
                  <label  htmlFor="price">Número de Escrow USDT a completar</label>
                  <input  type="number" placeholder="USDT a completar" min="0"
                  value={releaseNumber} onChange={(e) => setReleaseNumber(parseInt(e.target.value))}></input>
                </div>
                  <div className={styles.containerEscrow}>
                    {/* <label htmlFor="price">Número de Escrow ETH a completar</label> */}
                    <label htmlFor="price">Número de Escrow ETH a completar</label>
                    {/* <input  type="number" placeholder="ETH a devolver" min="0" */}
                    <input  type="number" placeholder="ETH a devolver" min="0"
                    value={releaseNumberNativeC} onChange={(e) => setReleaseNumberNativeC(parseInt(e.target.value))}></input>
                  </div>
                  <div className={styles.buttons}>
                    <button onClick={releaseEscrow}>Release Escrow USDT</button>
                    {/* <button onClick={releaseEscrowNativeCoin}>Release Escrow ETH</button> */}
                    <button onClick={releaseEscrowNativeCoin}>Release Escrow ETH</button>
                  </div>
              </div>
              <div>
              {/* {orderId && <p>Order: {parseInt(orderId.data)}</p>} */}
              </div>
            {/* </div>  */}
          </div>
          
                      <div className={styles.containerApprove}>
                    <form className={styles.approve_addStable} onSubmit={handleSubmitApprove}>
                      <input type="number" placeholder="Valor a aprobar" 
                      value={approveValue} min={0} step="0.001" onChange={(e) => setApproveValue(parseInt(e.target.value))} />
                      <button type="submit">Approve</button>
                    </form> 
                    <div>
                    {userBalance.data && <p id="userBalance">USDT user balance: {formatEther(userBalance.data)}</p>}
                      </div>  
              </div>
          <div className={styles.containerData}>
                    
            {/* <h1 className={styles.title}>Towerbank</h1> */}
            
              <div className={styles.containerLastEscrow}>
                  <div className={styles.lastEscrowTitle}>
                    <h3>Ultimo Escrow listado</h3>
                  </div>
                  <div className={styles.lastEscrowData}>
                    {lastEscrow && lastEscrow.data && <p>Dueño del Escrow (Comprador): {lastEscrow.data.buyer}</p>}
                    {lastEscrow && lastEscrow.data && <p>Dirección del Vendedor: {lastEscrow.data.seller}</p>}
                    {lastEscrow && lastEscrow.data && <p>Valor: {formatEther(lastEscrow.data.value)}</p>}
                    {lastEscrow && lastEscrow.data && <p>Estado: {parseInt(lastEscrow.data.status)}</p>}
                    {orderId && orderId.data && <p>Numero de Escrow: {parseInt(orderId.data) - 1}</p>}
                  </div>
              </div>

              <div className={styles.description}>
                {/*<p>Valor del Escrow: {parseInt(escrowValue.data)}</p>*/}
                {/*<p>//Estado del Escrow: {parseInt(escrowState.data)}*/}
                {allowance && allowance.data && <p>Allowance: {formatEther((allowance.data))}</p>}
                {/*{lastEscrow && lastEscrow.data && <p>EscrowBuy: {lastEscrow.data.buyer}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowSel: {lastEscrow.data.seller}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowVal: {formatEther(lastEscrow.data.value)}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowSfee: {formatEther(lastEscrow.data.sellerfee)}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowBfee: {formatEther(lastEscrow.data.buyerfee)}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowSta: {lastEscrow.data.status}</p>}
                {lastEscrow && lastEscrow.data && <p>EscrowCurr: {lastEscrow.data.currency}</p>} /*}
                  {/* {owner.data && <p>Owner: {owner.data}</p>} */}
                  </div>  
              {renderTabs()}
              {/* Display additional withdraw button if connected wallet is owner */}
              {address && address.toLowerCase() === owner?.data?.toLowerCase() ? (
              <div>
                {isLoading ? (
                  <button className={styles.button}>Loading...</button>
                ) : (<div>
                <div> 
                  <div className={styles.containerRefunds}>
                    <p>Devolver escrow al dueño (Solo Owner)</p> 
                  <div className={styles.containerEscrowOwner}>
                      <label htmlFor="price">Número de Escrow USDT a devolver</label>
                      <input type="number" placeholder="Número Escrow USDT" min="0"
                      value={refundNumber} onChange={(e) => setRefundNumber(parseInt(e.target.value))}></input>
                      <div className={styles.divRelease}>
                      <button onClick={refundEscrow}>Devolver USDT</button>
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
                    <button onClick={refundEscrowNativeCoin}>Devolver ETH</button>
                    </div>
                  </div>
                </div>
                <div className={styles.containerReleases}>
                    <p>Liberar escrow al vendedor (Solo Owner)</p>
                  <div className={styles.containerEscrowOwner}>
                    <label htmlFor="price">Número de Escrow USDT a liberar</label>
                    {/* <input type="number" placeholder="Número Escrow ETH" min="0"  */}
                    <input type="number" placeholder="Número Escrow ETH" min="0" 
                    value={releaseNumber} onChange={(e) => setReleaseNumber(parseInt(e.target.value))}></input>
                    <div className={styles.divRelease}>
                    <button onClick={releaseEscrowOwner}>Liberar USDT</button>
                    </div>
                  </div>
                  <div className={styles.containerEscrowOwner}>
                    {/* <label htmlFor="price">Número de Escrow ETH a liberar</label> */}
                    <label htmlFor="price">Número de Escrow ETH a liberar</label>
                    {/* <input type="number" placeholder="Número Escrow ETH" min="0" */}
                    <input type="number" placeholder="Número Escrow ETH" min="0"
                    value={releaseNumberNativeC} onChange={(e) => setReleaseNumberNativeC(parseInt(e.target.value))}></input>
                    <div className={styles.divRelease}>
                    {/* <button onClick={releaseEscrowNativeCoinOwner}>Liberar ETH</button> */}
                    <button onClick={releaseEscrowNativeCoinOwner}>Liberar ETH</button>
                    </div>
                  </div>
                </div>
                </div>
                <div className={styles.containerWithdraw}>
                <form className={styles.approve_addStable} onSubmit={handleSubmit}>
                      <input type="text" placeholder="Direccion EstableCoin"
                      value={stableAddress} onChange={(e) => setStableAddress(e.target.value)} />
                      <button type="submit">Añadir StableCoin</button>
                    </form>
                  <button className={styles.withdrawButton} onClick={withdrawFees}>
                    Retirar Fees USDT
                  </button>
                  <button className={styles.withdrawButton} onClick={withdrawFeesNativeCoin}>
                    {/* Retirar Fees ETH */}
                    Retirar Fees ETH
                  </button>
                </div>
                  
                  <div className={styles.flex}>
                    <button
                      className={styles.button}
                      onClick={() => setSelectedTab("Anuncio USDT")}
                    >
                      Crear anuncio 
                    </button>
                    {/* <button
                      className={styles.button}
                      onClick={() => setSelectedTab("Anuncio ETH")}
                    >
                      Crear anuncio ETH
                    </button> */}
                  </div>
                  {renderTabs()}
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
    </div>
  );
}