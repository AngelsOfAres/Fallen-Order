import React, { useState } from 'react'
import { FullGlowButton } from '../Buttons'
import { Box, Center, Image, Progress, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useColorMode } from '@chakra-ui/react'
import NfdLookup from '../NfdLookup'
import { algodClient } from 'lib/algodClient'
import styles2 from '../../styles/glow.module.css'
import Footer from '../Footer';
import { rateLimiter } from 'lib/ratelimiter'

interface Transaction {
    id: string;
    amount: number;
  }

interface TransactionListProps {
    transactions: Transaction[];
  }


const TransactionList: React.FC<TransactionListProps>  = ({ transactions }) => {
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const lightColor = useColorModeValue('orange.300','cyan.300')
    const mediumColor = useColorModeValue('orange.500','cyan.500')
    const removeExtraLineBreaks = (text: any) => {
        return text.replace(/\n{2,}/g, '\n')
      };
    const handleNote = (note: any) => {
    if (!note || typeof note !== 'string') {
        return '-';
    }
    const cleanedNote = atob(note);
    return cleanedNote;
    };
    function removeTrailingZeros(number: any) {
        let numberString = number.toString();
        
        if (numberString.includes('.')) {
            numberString = numberString.replace(/\.?0*$/, '');
            return parseFloat(numberString);
        } else {
            return parseInt(numberString, 10);
        }
    }
    function formatNumberAbbreviated(number: any) {
        const symbols = ["", "K", "M", "B", "T"];
        let symbolIndex = 0;
        if (number < 1 || number >= 1e12) {
            return number.toString();
        }
        while (number >= 1000) {
            number /= 1000;
            symbolIndex++;
        }
        const formattedNumber = parseFloat(number.toFixed(3)).toString()
        return formattedNumber + symbols[symbolIndex];
        }
      
  return (
    <Center my='12px'>
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign="center" textColor={lightColor}>Txn ID</Th>
            <Th textAlign="center" textColor={lightColor}>ASA</Th>
            <Th textAlign="center" textColor={lightColor}>Amount</Th>
            <Th textAlign="center" textColor={lightColor}>Note</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction: any, index: any) => (
            <Tr key={index}>
              <Td textAlign="center"  textColor={mediumColor}>
                <a
                  href={`https://algoexplorer.io/tx/${transaction.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {transaction.id.substring(0, 5) + "..." + transaction.id.substring(transaction.id.length - 5)}
                </a>
              </Td>
              <Td textAlign="center" textColor={xLightColor}>
                  {transaction['payment-transaction'] ? (
                    <Center>
                      <Image boxSize={4} src="algologo.png" alt='Algorand Logo'/>
                    </Center>
                  ) : (
                    <a
                    href={`https://algoexplorer.io/asset/${transaction['asset-transfer-transaction']['asset-id']}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {transaction['name']}
                    </a>
                  )}
                </Td>
              <Td textAlign="center" textColor={xLightColor}>{transaction['payment-transaction']
                    ? formatNumberAbbreviated(removeTrailingZeros((transaction['payment-transaction']['amount']/1000000).toFixed(3)))
                    : formatNumberAbbreviated(removeTrailingZeros(transaction['asset-transfer-transaction']['amount']))
                }</Td>
              <Td textAlign="center" textColor={xLightColor}>
                <Text whiteSpace="pre-wrap">{removeExtraLineBreaks(handleNote(transaction.note))}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      </TableContainer>
    </Center>
  );
};


async function fetchTxns(wallet1: any, wallet2: any, limit: number = 1000, nextToken?: string): Promise<{ transactions: Transaction[], nextToken?: string }> {
    const transactionsUrl = `https://mainnet-idx.algonode.cloud/v2/accounts/${wallet1}/transactions?limit=${limit}&next=${nextToken || ''}`;
  
    try {
      const response = await fetch(transactionsUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      const transactionsFromWallet1ToWallet2 = data['transactions'].filter((transaction: any) => {
        const assetTransfer = transaction['asset-transfer-transaction'] || transaction['payment-transaction'];
        if (!assetTransfer) {
          return false;
        }
        const sender = transaction['sender']
        const receiver = assetTransfer['receiver']
        const matchCondition =
          (sender === wallet1 && receiver === wallet2) ||
          (sender === wallet2 && receiver === wallet1);
        return matchCondition;
      });
  
      const result: { transactions: Transaction[], nextToken?: string } = {
        transactions: transactionsFromWallet1ToWallet2,
      };
  
      if (data['next-token']) {
        result.nextToken = data['next-token'];
      }
      return result;
    } catch (error) {
      console.error('Error fetching and filtering transactions:', error);
      throw error;
    }
  }
  

const WalletTransactionSearch = () => {
  const [wallet1, setWallet1] = useState('');
  const [wallet2, setWallet2] = useState('');
  const [fetchedTransactions, setFetchedTransactions] = useState<Transaction[]>([]);
  const [decimalsMap, setDecimalsMap] = useState({})
  const [loading, setLoading] = useState(false)
  const { colorMode } = useColorMode();
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  
  const baseColorDash = colorMode === "light" ? 'orange-500' : 'cyan-500'
  const borderColor = colorMode === "light" ? 'border-orange-500' : 'border-cyan-400'
  const bgColor = colorMode === "light" ? 'bg-orange-100' : 'bg-cyan-50'
  const focusBorderColor = colorMode === "light" ? 'focus:border-orange-500' : 'focus:border-cyan-400'
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  

  async function fetchNameDecimals(transactions: any) {
    const newDecimalsMap: { [key: string]: any } = {};
  
    for (const transaction of transactions) {
      let assetId: any
  
      if (transaction['asset-transfer-transaction']) {
        assetId = transaction['asset-transfer-transaction']['asset-id'];
  
      try {
        const assetInfo = await rateLimiter(
          () => algodClient.getAssetByID(assetId).do()
        );
        const decimals = assetInfo.params.decimals
        transaction['asset-transfer-transaction']['amount'] = transaction['asset-transfer-transaction']['amount']/(10**decimals)
        transaction['name'] = assetInfo.params.name
      } catch (error) {
        console.error('Error fetching asset info:', error);
      }
    }
    }
  
    setDecimalsMap(newDecimalsMap);
  }
  
  const handleSearch = async () => {
    try {
    setLoading(true)
      const transactionLimit = 10000
      let nextToken: string | undefined;
      const allTransactions: Transaction[] = [];
  
      while (allTransactions.length < transactionLimit) {
        try {
          const { transactions, nextToken: newNextToken } = await fetchTxns(wallet1, wallet2, transactionLimit - allTransactions.length, nextToken);
          allTransactions.push(...transactions);
    
          if (!newNextToken) {
            break;
          }
    
          nextToken = newNextToken;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false)
            return
          }
      }
      fetchNameDecimals(allTransactions)
      setFetchedTransactions(allTransactions)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  return (
    <div className='mt-6'>
    <Text my='20px' className={`${gradientText} responsive-font`}>Wallet-2-Wallet Search</Text>
      <div className="flex flex-col items-center justify-center">
      <NfdLookup
        className={`text-black relative w-80 my-2 cursor-default rounded-md border ${borderColor} ${bgColor} text-center shadow-sm ${focusBorderColor} focus:outline-none focus:ring-1 sm:text-sm`}
        value={wallet1}
        onChange={(value) => setWallet1(value)}
        placeholder={"Enter Address/NFD 1"}
        ariaDescribedby="lookup-description"
        />
        <NfdLookup
        className={`text-black relative w-80 my-2 cursor-default rounded-md border ${borderColor} ${bgColor} text-center shadow-sm ${focusBorderColor} focus:outline-none focus:ring-1 sm:text-sm`}
        value={wallet2}
        onChange={(value) => setWallet2(value)}
        placeholder={"Enter Address/NFD 2"}
        ariaDescribedby="lookup-description"
        />
        {loading ?
        <>
          <Text textColor={xLightColor} align={'center'} className='pt-4 text-sm'>Please wait while transactions load.<br/>This may take a while if wallets have high volume.</Text>
          <Box w='250px' my='24px'>
              <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
          </Box>
        </>
        : 
        <Center m={4}><FullGlowButton fontsize='16px' text='Search' onClick={handleSearch} isLoading={loading} /></Center>
        }
      </div>
      {fetchedTransactions.length > 0? 
      <>
      <Text textColor={xLightColor} align={'center'} className='py-4 text-lg'>Total Txns: <strong className='text-lg'>{fetchedTransactions.length}</strong></Text>
        <Box className={`w-fit mx-auto px-3 border border-${baseColorDash} rounded-xl`} style={{ maxWidth: '90%' }}>
            <TransactionList transactions={fetchedTransactions} />
        </Box>
      </> : null}
    <Footer />
    </div>
  );
};

export default WalletTransactionSearch;
